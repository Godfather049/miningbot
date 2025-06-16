const express = require('express');
const router = express.Router();
const MiningService = require('../services/miningService');
const User = require('../models/User');

// Kullanıcı verilerini getir
router.get('/user/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Madencilik başlat
router.post('/mining/start', async (req, res) => {
  try {
    const miningEnd = await MiningService.startMining(req.body.userId);
    res.json({ success: true, miningEnd });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Premium madencilik başlat
router.post('/mining/premium', async (req, res) => {
  try {
    const miningEnd = await MiningService.processPremiumMining(req.body.userId);
    res.json({ success: true, miningEnd });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Referans link tıklama
router.post('/ref/click', async (req, res) => {
  const { userId, refLink } = req.body;
  const validRefs = [
    'https://t.me/blum/app?startapp=ref_M96qo1sLIr',
    'https://t.me/boinker_bot/boinkapp?startapp=boink1463264622',
    'https://t.me/cbankmining',
    'https://t.me/blumcrypto_memepad',
    'https://t.me/theYescoin_bot/Yescoin?startapp=GtNgBb'
  ];

  try {
    if (!validRefs.includes(refLink)) {
      return res.status(400).json({ error: 'Invalid referral link' });
    }

    await User.updateOne(
      { telegramId: userId },
      { $inc: { balance: 10 }, $addToSet: { clickedRefs: refLink } }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
