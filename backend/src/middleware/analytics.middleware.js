const geoip = require('geoip-lite');
const { UAParser } = require('ua-parser-js');
const prisma = require('../utils/prisma');

const analyticsMiddleware = (req, res, next) => {
    res.on('finish', async () => {
        if (res.statusCode === 200) {
            try {
                const { username, version, profileName } = req.params;
                let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

                // Handle multiple IPs in x-forwarded-for (e.g. "client, proxy")
                if (Array.isArray(ip)) {
                    ip = ip[0];
                } else if (typeof ip === 'string' && ip.includes(',')) {
                    ip = ip.split(',')[0].trim();
                }

                // Handle IPv6 localhost
                if (ip === '::1') ip = '127.0.0.1';

                const geo = geoip.lookup(ip);
                const country = geo ? geo.country : 'Unknown';
                const city = geo ? geo.city : 'Unknown';

                const userAgent = req.headers['user-agent'];
                const parser = new UAParser(userAgent);
                const result = parser.getResult();

                // Enhanced Device Detection
                let deviceType = result.device.type;

                // Fallback: If device type is undefined but OS is clearly mobile
                if (!deviceType && result.os.name && (['iOS', 'Android'].includes(result.os.name))) {
                    deviceType = 'mobile';
                }

                // Default to Desktop
                deviceType = deviceType || 'desktop';

                const browserName = result.browser.name || 'Unknown';
                const referrer = req.headers['referer'] || 'Direct';

                // Capitalize device type
                const normalizedDevice = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);

                // Determine Type
                let resumeType = 'master';
                if (req.originalUrl.includes('/v/')) {
                    resumeType = 'locked';
                }

                await prisma.analyticsEvent.create({
                    data: {
                        username,
                        resumeType,
                        profileName: profileName || null,
                        versionNumber: version ? parseInt(version) : null,
                        country,
                        city,
                        device: normalizedDevice,
                        browser: browserName,
                        referrer,
                        userAgent
                    }
                });
            } catch (error) {
                console.error('Analytics missing:', error);
            }
        }
    });
    next();
};

module.exports = analyticsMiddleware;
