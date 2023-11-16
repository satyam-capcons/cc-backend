const { model, Schema } = require('mongoose');

const verificationSchema = new Schema({
    id: { type: String, required: true },
    code: { type: String, required: true, maxLength: 6 },
    expireAt: { type: Date, default: Date.now, index: { expires: '24h' } }, // Set to expire in 24 hours
});

module.exports = model('VerificationCode', verificationSchema);
