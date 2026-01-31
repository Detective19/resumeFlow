const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const findChromePath = () => {
    // 1. Try Puppeteer's default resolution
    try {
        const defaultPath = puppeteer.executablePath();
        if (fs.existsSync(defaultPath)) {
            console.log('Using default Puppeteer path:', defaultPath);
            return defaultPath;
        }
    } catch (e) {
        console.warn('Puppeteer default path lookup failed:', e.message);
    }

    // 2. Search in local .cache directory (Project Root)
    const possibleRoots = [
        path.join(process.cwd(), '.cache', 'puppeteer', 'chrome'),
        path.join(__dirname, '..', '..', '.cache', 'puppeteer', 'chrome') // Fallback relative to src/services
    ];

    for (const root of possibleRoots) {
        if (!fs.existsSync(root)) continue;

        // Find the version folder (e.g., linux-123.0.0, mac-123.0.0)
        const versions = fs.readdirSync(root);
        for (const version of versions) {
            const versionPath = path.join(root, version);

            // Look for chrome-linux64 or chrome-mac-arm64 etc.
            const platforms = fs.readdirSync(versionPath);
            for (const platform of platforms) {
                const binaryName = platform.includes('win') ? 'chrome.exe' : 'chrome';
                // Common paths inside the platform folder
                const commonProbes = [
                    path.join(versionPath, platform, binaryName), // Linux simple
                    path.join(versionPath, platform, 'chrome-linux64', binaryName), // Linux nested
                    path.join(versionPath, platform, 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing') // Mac
                ];

                for (const probe of commonProbes) {
                    if (fs.existsSync(probe)) {
                        console.log('Found Chrome binary manually at:', probe);
                        return probe;
                    }
                }
            }
        }
    }

    console.error('Could NOT find Chrome binary. Puppeteer will likely fail.');
    return null;
};

const generatePdf = async (html) => {
    console.log('Starting PDF generation...');
    console.log('Puppeteer Cache Dir (Env):', process.env.PUPPETEER_CACHE_DIR);

    // Manually find executable
    const executablePath = findChromePath();

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            executablePath: executablePath || undefined, // Fallback to auto-detect if null
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--single-process' // Sometimes helps in containerized envs
            ]
        });

        console.log('Browser launched successfully');
        const page = await browser.newPage();

        console.log('Setting content...');
        await page.setContent(html, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        console.log('Generating PDF buffer...');
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        console.log('PDF generated successfully');
        return pdfBuffer;
    } catch (error) {
        console.error('PDF Generation Failed:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

module.exports = { generatePdf };
