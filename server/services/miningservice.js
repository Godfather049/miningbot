const User = require('../models/User');

class MiningService {
  static async startMining(userId) {
    const user = await User.findOne({ telegramId: userId });
    
    if (user.miningEnd && new Date(user.miningEnd) > new Date()) {
      throw new Error('Mining already active');
    }
    
    const miningEnd = new Date(Date.now() + 8 * 60 * 60 * 1000);
    user.miningEnd = miningEnd;
    await user.save();
    
    return miningEnd;
  }

  static async completeMining(userId) {
    const user = await User.findOne({ telegramId: userId });
    if (!user.miningEnd || new Date(user.miningEnd) > new Date()) {
      return false;
    }
    
    user.balance += 90;
    user.miningEnd = null;
    await user.save();
    
    return true;
  }

  static async processPremiumMining(userId) {
    const user = await User.findOne({ telegramId: userId });
    if (user.tonBalance < 1.5) {
      throw new Error('Insufficient TON balance');
    }
    
    user.tonBalance -= 1.5;
    await user.save();
    
    return this.startMining(userId);
  }
}

module.exports = MiningService;
