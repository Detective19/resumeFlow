const prisma = require('../utils/prisma');

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

module.exports = { getSummary, getTimeline, getDetailedData };
