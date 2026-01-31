const prisma = require('../utils/prisma');

const createVersion = async (req, res) => {
    const userId = req.user.userId;
    const { content } = req.body;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Find or create the User's Resume
            let resume = await tx.resume.findUnique({
                where: { userId },
            });

            if (!resume) {
                resume = await tx.resume.create({
                    data: { userId },
                });
            }

            // 2. Determine the next version number
            const lastVersion = await tx.resumeVersion.findFirst({
                where: { resumeId: resume.id },
                orderBy: { versionNumber: 'desc' },
            });

            const nextVersionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

            // 3. Mark previous versions isMaster = false (only if there was a previous version)
            if (lastVersion) {
                await tx.resumeVersion.updateMany({
                    where: { resumeId: resume.id, isMaster: true },
                    data: { isMaster: false },
                });
            }

            // 4. Create new ResumeVersion with isMaster = true
            const newVersion = await tx.resumeVersion.create({
                data: {
                    resumeId: resume.id,
                    versionNumber: nextVersionNumber,
                    content,
                    isMaster: true,
                },
            });

            return newVersion;
        }, {
            maxWait: 10000, // Wait max 10s for a connection
            timeout: 50000  // Allow 50s for the transaction to run
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create resume version' });
    }
};

const getVersions = async (req, res) => {
    const userId = req.user.userId;

    try {
        const resume = await prisma.resume.findUnique({
            where: { userId },
            include: {
                versions: {
                    where: { isArchived: false }, // HIDE ARCHIVED VERSIONS
                    select: {
                        id: true,
                        versionNumber: true,
                        isMaster: true,
                        createdAt: true,
                    },
                    orderBy: { versionNumber: 'desc' },
                },
            },
        });

        if (!resume) {
            return res.json([]);
        }

        res.json(resume.versions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to ensure resume versions' });
    }
};

const archiveVersion = async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;

    try {
        // Verify ownership and existence
        const version = await prisma.resumeVersion.findUnique({
            where: { id },
            include: { resume: true }
        });

        if (!version || version.resume.userId !== userId) {
            return res.status(403).json({ error: 'Not authorized or version not found' });
        }

        if (version.isMaster) {
            return res.status(400).json({ error: 'Cannot archive the MASTER version. Create a new version first.' });
        }

        await prisma.resumeVersion.update({
            where: { id },
            data: { isArchived: true }
        });

        res.json({ message: 'Version archived successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to archive version' });
    }
}

/**
 * Set a past version as live by creating a NEW version with the same content
 * CRITICAL: This does NOT modify the selected version (immutability)
 * Instead, it creates a brand new version using the old version's content
 */
const setVersionLive = async (req, res) => {
    const userId = req.user.userId;
    const versionId = req.params.versionId; // CUID string, not an integer!

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Fetch the selected version and verify ownership
            const selectedVersion = await tx.resumeVersion.findUnique({
                where: { id: versionId },
                include: { resume: true }
            });

            if (!selectedVersion) {
                throw new Error('VERSION_NOT_FOUND');
            }

            if (selectedVersion.resume.userId !== userId) {
                throw new Error('UNAUTHORIZED');
            }

            // 2. Check if this version is already the live version
            if (selectedVersion.isMaster) {
                throw new Error('ALREADY_LIVE');
            }

            // 3. Get the highest version number to create the next one
            const lastVersion = await tx.resumeVersion.findFirst({
                where: { resumeId: selectedVersion.resumeId },
                orderBy: { versionNumber: 'desc' },
            });

            if (!lastVersion) {
                throw new Error('NO_VERSIONS_FOUND');
            }

            const nextVersionNumber = lastVersion.versionNumber + 1;
            console.log(`Setting version ${selectedVersion.versionNumber} as live. Creating new version ${nextVersionNumber}`);

            // 4. Mark all previous master versions as not master
            await tx.resumeVersion.updateMany({
                where: {
                    resumeId: selectedVersion.resumeId,
                    isMaster: true
                },
                data: { isMaster: false },
            });

            // 5. Create a NEW version with the same content as the selected version
            // This is the key: we're NOT modifying the old version, we're creating a new one
            const newLiveVersion = await tx.resumeVersion.create({
                data: {
                    resumeId: selectedVersion.resumeId,
                    versionNumber: nextVersionNumber,
                    content: selectedVersion.content, // Copy content from selected version
                    isMaster: true, // Mark as the new live version
                    isArchived: false
                },
            });

            console.log(`Successfully created new live version ${nextVersionNumber}`);
            return newLiveVersion;
        }, {
            maxWait: 10000,
            timeout: 50000
        });

        res.json(result);

    } catch (error) {
        console.error('Error in setVersionLive:', error.message, error.stack);

        if (error.message === 'VERSION_NOT_FOUND') {
            return res.status(404).json({ error: 'Version not found' });
        }
        if (error.message === 'UNAUTHORIZED') {
            return res.status(403).json({ error: 'Not authorized to access this version' });
        }
        if (error.message === 'ALREADY_LIVE') {
            return res.status(400).json({ error: 'This version is already live' });
        }
        if (error.message === 'NO_VERSIONS_FOUND') {
            return res.status(404).json({ error: 'No versions found for this resume' });
        }

        res.status(500).json({ error: 'Failed to set version live', details: error.message });
    }
};

module.exports = { createVersion, getVersions, archiveVersion, setVersionLive };
