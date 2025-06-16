const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  walletAddress: String,
  balance: { type: Number, default: 0 },
  tonBalance: { type: Number, default: 0 },
  miningEnd: Date,
  clickedRefs: [String],
  referralCode: String,
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

// Referans kodu otomatik oluşturma
userSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
