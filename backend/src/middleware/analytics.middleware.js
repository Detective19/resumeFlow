const geoip = require('geoip-lite');
const { UAParser } = require('ua-parser-js');
const prisma = require('../utils/prisma');

const analyticsMiddleware = (req, res, next) => {
    res.on('finish', async () => {
        if (res.statusCode === 200 || res.statusCode === 304) {
            try {
                const { username, version, profileName } = req.params;

                // 1. Robust IP Detection
                // req.ip in Express is trustworthy if 'trust proxy' is set correctly in server.js
                // It automatically handles x-forwarded-for parsing
                let ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

                // Handle array/list format from custom headers
                if (Array.isArray(ip)) ip = ip[0];
                if (typeof ip === 'string' && ip.includes(',')) ip = ip.split(',')[0].trim();

                // Clean IPv6 mapped IPv4 addresses (e.g., ::ffff:192.168.1.1 -> 192.168.1.1)
                if (ip && ip.startsWith('::ffff:')) {
                    ip = ip.substring(7);
                }

                // Handle Localhost IPv6
                if (ip === '::1') ip = '127.0.0.1';

                let geo = geoip.lookup(ip);

                // 2. Development Mode Mock (To fix "Local Visit" during local testing)
                // If running locally and IP is local, mock a location to verify UI
                const isLocal = ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.');
                if (!geo && isLocal && process.env.NODE_ENV !== 'production') {
                    console.log('📍 Dev Mode: Mocking location for local IP', ip);
                    geo = { country: 'US', city: 'San Francisco' };
                }

                // 3. Location Extraction with Fallbacks
                // Check Vercel/Cloudflare headers first, then geoip, then default
                const country = req.headers['x-vercel-ip-country'] ||
                    req.headers['cf-ipcountry'] ||
                    req.headers['cloudfront-viewer-country'] ||
                    (geo ? geo.country : 'Unknown');

                const city = req.headers['x-vercel-ip-city'] ||
                    req.headers['cf-ipcity'] ||
                    (geo ? geo.city : 'Unknown');

                if (country === 'Unknown') {
                    // Log raw IP for debugging only if we missed the location
                    console.log('Analytics Location Unknown. IP:', ip, 'Headers:', JSON.stringify(req.headers['x-forwarded-for']));
                }

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
