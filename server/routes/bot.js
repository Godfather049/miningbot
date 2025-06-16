const User = require('../models/User');
const MiningService = require('../services/miningService');

module.exports = (bot) => {
  // Kullanıcı kaydı middleware
  bot.use(async (ctx, next) => {
    if (!ctx.from) return next();
    
    let user = await User.findOne({ telegramId: ctx.from.id });
    if (!user) {
      user = new User({ telegramId: ctx.from.id });
      await user.save();
    }
    
    ctx.state.user = user;
    next();
  });

  // /start komutu
  bot.command('start', (ctx) => {
    const webAppUrl = `${process.env.WEB_APP_URL}?startapp=${ctx.state.user.telegramId}`;
    ctx.reply('CB Madencilik Botuna Hoş Geldiniz!', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Madencilik Paneli', web_app: { url: webAppUrl } }]
        ]
      }
    });
  });

  // Referans komutu
  bot.command('ref', (ctx) => {
    const refLink = `https://t.me/${ctx.botInfo.username}?startapp=ref_${ctx.state.user.referralCode}`;
    ctx.reply(`Referans bağlantınız: ${refLink}\n\nHer aktif kullanıcı başına 10 CB kazanın!`);
  });

  // Özel komutlar
  bot.action('premium_mining', async (ctx) => {
    try {
      await MiningService.processPremiumMining(ctx.from.id);
      ctx.reply('Premium madencilik başladı! 8 saat sonra 90 CB kazanacaksınız.');
    } catch (error) {
      ctx.reply(`Hata: ${error.message}`);
    }
  });
};
