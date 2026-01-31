const puppeteer = require('puppeteer');

const generatePdf = async (html) => {
    console.log('Starting PDF generation...');
    console.log('Puppeteer Cache Dir:', process.env.PUPPETEER_CACHE_DIR);

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // Critical for containerized environments
                '--disable-gpu'
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
