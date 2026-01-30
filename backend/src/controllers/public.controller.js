const prisma = require('../utils/prisma');

const getPublicResume = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                resume: {
                    include: {
                        versions: {
                            where: { isMaster: true },
                            take: 1
                        }
                    }
                }
            }
        });

        if (!user || !user.resume || user.resume.versions.length === 0) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        res.json(user.resume.versions[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch resume' });
    }
};

const getPublicResumeVersion = async (req, res) => {
    const { username, version } = req.params;
    const versionNumber = parseInt(version);

    if (isNaN(versionNumber)) {
        return res.status(400).json({ error: 'Invalid version number' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                resume: {
                    include: {
                        versions: {
                            where: { versionNumber },
                            take: 1
                        }
                    }
                }
            }
        });

        if (!user || !user.resume || user.resume.versions.length === 0) {
            return res.status(404).json({ error: 'Resume version not found' });
        }

        res.json(user.resume.versions[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch resume version' });
    }
};

const getPublicLockedProfile = async (req, res) => {
    const { username, profileName } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                lockedProfiles: {
                    where: { name: profileName },
                    include: {
                        versions: {
                            where: { isMaster: true },
                            take: 1
                        }
                    }
                }
            }
        });

        if (!user || user.lockedProfiles.length === 0 || user.lockedProfiles[0].versions.length === 0) {
            return res.status(404).json({ error: 'Locked profile not found' });
        }

        res.json(user.lockedProfiles[0].versions[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch locked profile' });
    }
};

const getPublicLockedProfileVersion = async (req, res) => {
    const { username, profileName, version } = req.params;
    const versionNumber = parseInt(version);

    if (isNaN(versionNumber)) {
        return res.status(400).json({ error: 'Invalid version number' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                lockedProfiles: {
                    where: { name: profileName },
                    include: {
                        versions: {
                            where: { versionNumber },
                            take: 1
                        }
                    }
                }
            }
        });

        if (!user || user.lockedProfiles.length === 0 || user.lockedProfiles[0].versions.length === 0) {
            return res.status(404).json({ error: 'Locked profile version not found' });
        }

        res.json(user.lockedProfiles[0].versions[0]);

    } catch (error) {
        res.status(500).json({ error: 'Unexepcted error' });
    }
}

module.exports = { getPublicResume, getPublicResumeVersion, getPublicLockedProfile, getPublicLockedProfileVersion };
