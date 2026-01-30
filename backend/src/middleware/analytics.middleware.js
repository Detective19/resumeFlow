const geoip = require('geoip-lite');
const { UAParser } = require('ua-parser-js');
const prisma = require('../utils/prisma');

const analyticsMiddleware = (req, res, next) => {
    res.on('finish', async () => {
        if (res.statusCode === 200) {
            try {
                const { username, version, profileName } = req.params;
                const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
                const geo = geoip.lookup(ip === '::1' ? '127.0.0.1' : ip);
                const country = geo ? geo.country : 'Unknown';
                const city = geo ? geo.city : 'Unknown';

                const userAgent = req.headers['user-agent'];
                const parser = new UAParser(userAgent);
                const deviceType = parser.getDevice().type || 'Desktop'; // type is undefined for desktop usually
                const browserName = parser.getBrowser().name || 'Unknown';
                const referrer = req.headers['referer'] || 'Direct';

                // Capitalize device type if it's "mobile" or "tablet"
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
