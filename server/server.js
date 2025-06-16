require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { Telegraf } = require('telegraf');
const apiRoutes = require('./routes/api');
const botRoutes = require('./routes/bot');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch(err => console.error('MongoDB bağlantı hatası:', err));

// Middleware
app.use(express.json());
app.use('/api', apiRoutes);

// Telegram Bot başlatma
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
botRoutes(bot);
bot.launch();

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
