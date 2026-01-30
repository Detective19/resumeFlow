const prisma = require('../utils/prisma');

const createProfile = async (req, res) => {
    const userId = req.user.userId;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Profile name is required' });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Fetch latest master ResumeVersion
            const userResume = await tx.resume.findUnique({
                where: { userId },
                include: {
                    versions: {
                        where: { isMaster: true },
                        take: 1
                    }
                }
            });

            if (!userResume || userResume.versions.length === 0) {
                throw new Error('No master resume found to lock');
            }

            const masterContent = userResume.versions[0].content;

            // 2. Create LockedProfile
            const lockedProfile = await tx.lockedProfile.create({
                data: {
                    userId,
                    name,
                }
            });

            // 3. Create LockedProfileVersion v1
            const version = await tx.lockedProfileVersion.create({
                data: {
                    lockedProfileId: lockedProfile.id,
                    versionNumber: 1,
                    content: masterContent,
                    isMaster: true
                }
            });

            return { lockedProfile, version };
        });

        res.json(result);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Profile name already exists' });
        }
        if (error.message === 'No master resume found to lock') {
            return res.status(400).json({ error: error.message });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to create locked profile' });
    }
};

const createVersion = async (req, res) => {
    const userId = req.user.userId;
    const { profileName } = req.params;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Fetch Locked Profile
            const lockedProfile = await tx.lockedProfile.findFirst({
                where: { userId, name: profileName }
            });

            if (!lockedProfile) {
                throw new Error('Locked profile not found');
            }

            // 2. Fetch latest master ResumeVersion (Fresh Snapshot)
            const userResume = await tx.resume.findUnique({
                where: { userId },
                include: {
                    versions: {
                        where: { isMaster: true },
                        take: 1
                    }
                }
            });

            if (!userResume || userResume.versions.length === 0) {
                throw new Error('No master resume found to snapshot');
            }

            const masterContent = userResume.versions[0].content;

            // 3. Determine next version number
            const lastVersion = await tx.lockedProfileVersion.findFirst({
                where: { lockedProfileId: lockedProfile.id },
                orderBy: { versionNumber: 'desc' }
            });

            const nextVersionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

            // 4. Mark previous versions isMaster = false
            if (lastVersion) {
                await tx.lockedProfileVersion.updateMany({
                    where: { lockedProfileId: lockedProfile.id, isMaster: true },
                    data: { isMaster: false }
                });
            }

            // 5. Create new LockedProfileVersion
            const newVersion = await tx.lockedProfileVersion.create({
                data: {
                    lockedProfileId: lockedProfile.id,
                    versionNumber: nextVersionNumber,
                    content: masterContent,
                    isMaster: true
                }
            });

            return newVersion;
        });

        res.json(result);

    } catch (error) {
        if (error.message === 'Locked profile not found' || error.message === 'No master resume found to snapshot') {
            return res.status(404).json({ error: error.message });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to create new version' });
    }
};

const getProfiles = async (req, res) => {
    const userId = req.user.userId;
    try {
        const profiles = await prisma.lockedProfile.findMany({
            where: { userId },
            include: {
                versions: {
                    orderBy: { versionNumber: 'desc' },
                    take: 1
                }
            }
        });
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profiles' });
    }
};

const getProfileVersions = async (req, res) => {
    const userId = req.user.userId;
    const { profileName } = req.params;

    try {
        const profile = await prisma.lockedProfile.findFirst({
            where: { userId, name: profileName },
            include: {
                versions: {
                    orderBy: { versionNumber: 'desc' },
                    select: {
                        id: true,
                        versionNumber: true,
                        isMaster: true,
                        createdAt: true
                    }
                }
            }
        });

        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.json(profile.versions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch versions' });
    }
};

module.exports = { createProfile, createVersion, getProfiles, getProfileVersions };
