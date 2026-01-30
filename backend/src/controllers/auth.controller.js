const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash: hashedPassword,
            },
        });

        const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET);
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        if (error.code === 'P2002') {
            res.status(400).json({ error: 'Username or email already exists' });
        } else {
            res.status(500).json({ error: 'Failed to create user' });
        }
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        // Email doesn't exist in database
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Email exists, check password
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Wrong password' });
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET);
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

const me = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, username: true, email: true }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

module.exports = { signup, login, me };
