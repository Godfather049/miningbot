from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Updater, CommandHandler, CallbackContext, CallbackQueryHandler
import os
import time
from threading import Timer

# Telegram Bot API Token
TOKEN = "7336956953:AAE_jU8Qd2CNhe9hfSDTzG9zp17FXBFY0Ys"  # Sizin bot tokenınız
ADMIN_WALLET = "UQB7Qq8821NNJJ5JGp4GbnV66sLWxEDFCtpUUYOaBbW2RpIL"
CBANK_TOKEN = "EQARYZBkWrdBMLFROALHaUHVm1ng7CnY2DH-9YirsL-nIzu2"

# Kullanıcı veritabanı (Gerçek projede PostgreSQL/MongoDB kullanın)
users_db = {}

def start(update: Update, context: CallbackContext):
    user_id = update.effective_user.id
    if user_id not in users_db:
        users_db[user_id] = {
            "cb": 0,
            "mining": False,
            "mining_end": 0,
            "wallet": "",
            "clan": "",
            "spins": 1  # Günde 1 bedava spin
        }
    
    # Ana Menü Butonları
    keyboard = [
        [InlineKeyboardButton("⏳ Madencilik Başlat", callback_data="start_mining")],
        [InlineKeyboardButton("🏆 Liderlik (Top 100)", callback_data="leaderboard")],
        [InlineKeyboardButton("🛍 Mağaza (%0.5-35 Kazanç)", callback_data="shop")],
        [InlineKeyboardButton("👥 Klan Oluştur/Ara", callback_data="clan")],
        [
            InlineKeyboardButton("🏠 Ana Sayfa", callback_data="home"),
            InlineKeyboardButton("🎡 Spin (1 Ücretsiz)", callback_data="spin"),
            InlineKeyboardButton("📤 Yönlendirme", callback_data="referral")
        ],
        [InlineKeyboardButton("💰 Cüzdan (TON/CBANK)", callback_data="wallet")],
        [InlineKeyboardButton("✅ Görevler (10CB Ödül)", callback_data="tasks")]
    ]
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    # Madencilik durumu kontrolü
    mining_status = "⛏ **Aktif** (Kalan: {})".format(calculate_remaining_time(user_id)) if users_db[user_id]['mining'] else "❌ **Pasif**"
    
    update.message.reply_text(
        f"🏦 **CBANK Mining Bot**\n\n"
        f"{mining_status}\n"
        f"💰 **Bakiye:** {users_db[user_id]['cb']} CB\n"
        f"🎡 **Spin Hakkı:** {users_db[user_id]['spins']}\n",
        reply_markup=reply_markup
    )

def calculate_remaining_time(user_id):
    if users_db[user_id]['mining']:
        remaining = users_db[user_id]['mining_end'] - time.time()
        return f"{int(remaining//3600)}:{int((remaining%3600)//60):02d}"
    return "00:00"

# Madencilik Başlatma Fonksiyonu
def start_mining(update: Update, context: CallbackContext):
    query = update.callback_query
    user_id = query.from_user.id
    
    if not users_db[user_id]['mining']:
        users_db[user_id]['mining'] = True
        users_db[user_id]['mining_end'] = time.time() + 8 * 3600  # 8 saatlik geri sayım
        
        # Geri sayım tamamlandığında 90 CB ekle
        Timer(8 * 3600, lambda: end_mining(user_id)).start()
        
        query.answer("⛏ Madencilik başladı! 8 saat sonra 90 CB kazanacaksınız.")
    else:
        query.answer("❌ Zaten madencilik yapıyorsunuz.")

def end_mining(user_id):
    users_db[user_id]['mining'] = False
    users_db[user_id]['cb'] += 90  # 90 CB ödülü

# Diğer fonksiyonlar (shop, clan, wallet vb.) buraya eklenecek

def main():
    updater = Updater(TOKEN)
    dp = updater.dispatcher
    
    # Komutlar
    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CallbackQueryHandler(start_mining, pattern="^start_mining$"))
    
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
