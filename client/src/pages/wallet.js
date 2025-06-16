import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Wallet = ({ userId }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [tonBalance, setTonBalance] = useState(0);
  const [cbankBalance, setCbankBalance] = useState(0);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        setTonBalance(response.data.tonBalance);
        setCbankBalance(response.data.balance);
        setWalletConnected(!!response.data.walletAddress);
      } catch (error) {
        console.error('Cüzdan verileri alınamadı:', error);
      }
    };

    fetchWalletData();
  }, [userId]);

  const connectWallet = () => {
    // Cüzdan bağlama işlemleri burada
    alert('TON Wallet bağlanıyor...');
    // Başarılı olursa:
    setWalletConnected(true);
  };

  const buyTON = () => {
    window.open('https://buy.ton.org/', '_blank');
  };

  const buyCBANK = () => {
    window.open('https://t.me/blumcrypto_memepad', '_blank');
  };

  return (
    <div className="wallet-page">
      <h2>💰 Cüzdan Yönetimi</h2>
      
      {!walletConnected ? (
        <div className="connect-wallet-section">
          <button className="connect-button" onClick={connectWallet}>
            TON Wallet Bağla
          </button>
          <p>Cüzdanınızı bağlayarak işlem yapabilirsiniz</p>
        </div>
      ) : (
        <div className="wallet-balances">
          <div className="balance-card">
            <h3>TON Bakiyesi</h3>
            <p>{tonBalance} TON</p>
            <button onClick={buyTON}>TON Satın Al</button>
          </div>
          
          <div className="balance-card">
            <h3>CBANK Bakiyesi</h3>
            <p>{cbankBalance} CB</p>
            <button onClick={buyCBANK}>CBANK Satın Al</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
