const { UAParser } = require('ua-parser-js');
const prisma = require('../utils/prisma');

const analyticsMiddleware = (req, res, next) => {
    // Only track successful views
    res.on('finish', async () => {
        if (res.statusCode === 200 || res.statusCode === 304) {
            try {
                const { username, version, profileName } = req.params;

                // Extract Metadata from Request (Body preferred, Query fallback for GET)
                // We support both to allow future migration to POST-based tracking
                // while keeping current GET routes functional (if params provided).
                const data = { ...req.query, ...req.body };
                const { country, city } = data;

                // 1. Device Detection (Source of Truth: User-Agent)
                const userAgent = req.headers['user-agent'];
                const parser = new UAParser(userAgent);
                const result = parser.getResult();

                let deviceType = result.device.type;

                // Fallback: Smart OS detection for mobile
                if (!deviceType && result.os.name && (['iOS', 'Android'].includes(result.os.name))) {
                    deviceType = 'mobile';
                }

                // Default to Desktop
                deviceType = deviceType || 'desktop';

                // Capitalize
                const normalizedDevice = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
                const browserName = result.browser.name || 'Unknown';
                const referrer = req.headers['referer'] || 'Direct';

                // 2. Determine Resume Type
                let resumeType = 'master';
                if (req.originalUrl.includes('/v/')) {
                    resumeType = 'locked';
                }

                // 3. Persist Event (Append Only)
                await prisma.analyticsEvent.create({
                    data: {
                        username,
                        resumeType,
                        profileName: profileName || null,
                        versionNumber: version ? parseInt(version) : null,
                        country: country || 'Unknown',
                        city: city || 'Unknown',
                        device: normalizedDevice,
                        browser: browserName,
                        referrer,
                        userAgent: userAgent || 'Unknown'
                    }
                });

            } catch (error) {
                // Silently fail to avoid blocking the user response
                // But log it for monitoring
                console.error('Analytics Persistence Error:', error.message);
            }
        }
    });
    next();
};

module.exports = analyticsMiddleware;
