const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json({ error: errorMessage, code: 'VALIDATION_ERROR' });
    }
    next();
};

const authSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const resumeSchema = Joi.object({
    content: Joi.object({
        personal: Joi.object({
            name: Joi.string().min(1).max(100).required().messages({ 'string.empty': 'Name is required' }),
            email: Joi.string().email().required().messages({ 'string.empty': 'Email is required', 'string.email': 'Invalid email' }),
            phone: Joi.string().max(20).allow(''),
            location: Joi.string().max(100).allow(''),
            summary: Joi.string().max(500).allow(''),
        }).required(),
        experience: Joi.array().items(
            Joi.object({
                id: Joi.string(),
                company: Joi.string().max(100).required().messages({ 'string.empty': 'Company is required' }),
                role: Joi.string().max(100).required().messages({ 'string.empty': 'Role is required' }),
                start: Joi.string().max(20).required(),
                end: Joi.string().max(20).allow(''),
                bullets: Joi.array().items(Joi.string().max(200)).max(10),
            })
        ).max(20),
        education: Joi.array().items(
            Joi.object({
                id: Joi.string(),
                institution: Joi.string().max(100).required(),
                degree: Joi.string().max(100).allow(''),
                start: Joi.string().max(20).allow(''),
                end: Joi.string().max(20).allow(''),
            })
        ).max(10),
        projects: Joi.array().items(
            Joi.object({
                id: Joi.string(),
                name: Joi.string().max(100).required().messages({ 'string.empty': 'Project name is required' }),
                role: Joi.string().max(100).allow(''),
                start: Joi.string().max(20).allow(''),
                end: Joi.string().max(20).allow(''),
                bullets: Joi.array().items(Joi.string().max(500)).max(10),
            })
        ).max(10),
        skills: Joi.array().items(Joi.string()).min(1).max(50).messages({ 'array.min': 'At least one skill is required' }),
    }).required(),
});

module.exports = { validate, authSchema, loginSchema, resumeSchema };
