const prisma = require('../utils/prisma');
const { UAParser } = require('ua-parser-js');

const getSummary = async (req, res) => {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    try {
        const totalViews = await prisma.analyticsEvent.count({
            where: { username: user.username }
        });

        const countriesCount = await prisma.analyticsEvent.groupBy({
            by: ['country'],
            where: { username: user.username },
            _count: { _all: true }
        }).then(res => res.length);

        const deviceCounts = await prisma.analyticsEvent.groupBy({
            by: ['device'],
            where: { username: user.username },
            _count: { _all: true }
        });

        // Helper to normalize device names (null/undefined -> 'Desktop')
        const getDeviceName = (d) => d || 'Desktop';

        const desktopViews = deviceCounts.reduce((acc, curr) => {
            if (getDeviceName(curr.device) === 'Desktop') return acc + curr._count._all;
            return acc;
        }, 0);

        const mobileViews = deviceCounts.reduce((acc, curr) => {
            const name = getDeviceName(curr.device);
            if (name === 'Mobile' || name === 'Tablet') return acc + curr._count._all;
            return acc;
        }, 0);

        res.json({
            totalViews,
            countriesCount,
            desktopViews,
            mobileViews
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
};

const getTimeline = async (req, res) => {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const views = await prisma.analyticsEvent.findMany({
            where: {
                username: user.username,
                viewedAt: { gte: sevenDaysAgo }
            },
            select: { viewedAt: true }
        });

        const timeline = {};
        // Initialize last 7 days with 0
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            timeline[dateStr] = 0;
        }

        views.forEach(v => {
            const date = v.viewedAt.toISOString().split('T')[0];
            if (timeline[date] !== undefined) {
                timeline[date]++;
            }
        });

        const result = Object.entries(timeline).map(([date, count]) => {
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
            return { date: dayName, count };
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch timeline' });
    }
};

const getDetailedData = async (req, res) => {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    try {
        // Top Countries
        const countryStats = await prisma.analyticsEvent.groupBy({
            by: ['country'],
            where: { username: user.username },
            _count: { _all: true },
            orderBy: { _count: { country: 'desc' } },
            take: 5
        });

        const totalViews = await prisma.analyticsEvent.count({ where: { username: user.username } });
        const countries = countryStats.map(c => ({
            name: c.country,
            count: c._count._all,
            percentage: totalViews > 0 ? Math.round((c._count._all / totalViews) * 100) : 0
        }));

        // Device Distribution
        const deviceStats = await prisma.analyticsEvent.groupBy({
            by: ['device'],
            where: { username: user.username },
            _count: { _all: true }
        });

        // Aggregate stats to handle nulls/duplicates
        const aggregatedDevices = deviceStats.reduce((acc, curr) => {
            const name = curr.device || 'Desktop';
            if (!acc[name]) {
                acc[name] = 0;
            }
            acc[name] += curr._count._all;
            return acc;
        }, {});

        const devices = Object.entries(aggregatedDevices).map(([name, count]) => ({
            name,
            count,
            percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0
        }));

        // Recent Views
        const recent = await prisma.analyticsEvent.findMany({
            where: { username: user.username },
            orderBy: { viewedAt: 'desc' },
            take: 10
        });

        res.json({ countries, devices, recent });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch detailed analytics' });
    }
};

const { UAParser } = require('ua-parser-js');

const trackView = async (req, res) => {
    try {
        const { username, version, profileName, userAgent, platform, screenWidth } = req.body;

        // Validations
        if (!username) return res.status(400).json({ error: 'Username required' });

        // Resolve Profile Type & Name
        let resumeType = 'master';
        let targetProfileName = null;

        // Logic to determine resume type based on input
        if (profileName) {
            resumeType = 'locked';
            targetProfileName = profileName;
        }

        // 1. Device Detection using provided User Agent
        const parser = new UAParser(userAgent || req.headers['user-agent']);
        const result = parser.getResult();

        let deviceType = result.device.type;

        // Smart Fallback for Mobile vs Desktop
        if (!deviceType) {
            // Check platform hint from client if available
            if (platform && (platform.includes('iPhone') || platform.includes('Android'))) {
                deviceType = 'mobile';
            } else if (screenWidth && screenWidth < 768) {
                deviceType = 'mobile'; // Screen width hint
            } else if (result.os.name && ['iOS', 'Android'].includes(result.os.name)) {
                deviceType = 'mobile'; // OS hint
            } else {
                deviceType = 'desktop'; // Default
            }
        }

        const normalizedDevice = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
        const browserName = result.browser.name || 'Unknown';

        // 2. Location Detection (Vercel Headers)
        const country = req.headers['x-vercel-ip-country'] || 'Unknown';
        const city = req.headers['x-vercel-ip-city'] || 'Unknown';

        // 3. Referrer
        const referrer = req.headers['referer'] || 'Direct';

        // 4. Save to Database
        await prisma.analyticsEvent.create({
            data: {
                username,
                resumeType,
                profileName: targetProfileName,
                versionNumber: version ? parseInt(version) : null,
                country,
                city,
                device: normalizedDevice,
                browser: browserName,
                referrer,
                userAgent: userAgent || req.headers['user-agent']
            }
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Analytics Error:', error);
        // Don't block the client even if analytics fails
        res.status(200).json({ success: false, error: 'Analytics failed' });
    }
};

module.exports = { getSummary, getTimeline, getDetailedData, trackView };
