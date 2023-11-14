const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: { type: String, required: true, default: null },
    phone: { type: String, default: null, unique: true },
    email: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple documents to have no email (null or undefined) values, while still enforcing a unique constraint on existing email values.
        validate: {
            validator: function (value) {
                // Check if the value is a valid email format (if provided)
                return !value || /\S+@\S+\.\S+/.test(value);
            },
            message: 'Invalid email address.',
        },
    },
    password: {
        type: String,
        required: true,
    },
    token: { type: String, required: true },
    verified: { type: Boolean, default: false },
});

module.exports = model('User', userSchema);
