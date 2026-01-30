const prisma = require('../utils/prisma');
const renderClassic = require('../templates/classic');
const { generatePdf } = require('../services/pdf.service');

const getTemplateRenderer = (templateName) => {
    // Logic to switch templates in future. For now, always Classic.
    // if (templateName === 'modern') return renderModern;
    return renderClassic;
};

const exportMasterPdf = async (req, res) => {
    const userId = req.user.userId;
    const { template, content } = req.body;

    try {
        let data = content;

        if (!data) {
            const resume = await prisma.resume.findUnique({
                where: { userId },
                include: {
                    versions: {
                        where: { isMaster: true },
                        take: 1
                    }
                }
            });

            if (!resume || resume.versions.length === 0) {
                return res.status(404).json({ error: 'Resume not found' });
            }
            data = resume.versions[0].content;
        }

        const renderer = getTemplateRenderer(template);
        const html = renderer(data);
        const pdfBuffer = await generatePdf(html);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
        res.send(pdfBuffer);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
};

const exportLockedPdf = async (req, res) => {
    const userId = req.user.userId;
    const { profileName } = req.params;
    const { template } = req.body;

    try {
        const lockedProfile = await prisma.lockedProfile.findFirst({
            where: { userId, name: profileName },
            include: {
                versions: {
                    where: { isMaster: true },
                    take: 1
                }
            }
        });

        if (!lockedProfile || lockedProfile.versions.length === 0) {
            return res.status(404).json({ error: 'Locked profile not found' });
        }

        const data = lockedProfile.versions[0].content;
        const renderer = getTemplateRenderer(template);
        const html = renderer(data);
        const pdfBuffer = await generatePdf(html);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${profileName}-resume.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
};

module.exports = { exportMasterPdf, exportLockedPdf };
