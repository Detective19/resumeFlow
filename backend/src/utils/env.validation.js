const validateEnv = () => {
    const required = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.error('❌ CRITICAL ERROR: Missing environment variables:', missing.join(', '));
        process.exit(1);
    }
};

module.exports = validateEnv;

