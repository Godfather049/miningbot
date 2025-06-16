import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MiningButton = ({ userId }) => {
  const [miningActive, setMiningActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        const user = response.data;
        setBalance(user.balance);
        
        if (user.miningEnd) {
          const endTime = new Date(user.miningEnd);
          if (endTime > new Date()) {
            setMiningActive(true);
            startTimer(endTime);
          } else {
            // Madencilik süresi dolmuşsa tamamla
            completeMining();
          }
        }
      } catch (error) {
        console.error('Kullanıcı verisi alınamadı:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const startTimer = (endTime) => {
    const timer = setInterval(() => {
      const secondsLeft = Math.max(0, Math.floor((endTime - new Date()) / 1000));
      setTimeLeft(secondsLeft);
      
      if (secondsLeft === 0) {
        clearInterval(timer);
        setMiningActive(false);
        completeMining();
      }
    }, 1000);
  };

  const startMining = async () => {
    try {
      const response = await axios.post('/api/mining/start', { userId });
      setMiningActive(true);
      startTimer(new Date(response.data.miningEnd));
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  const completeMining = async () => {
    try {
      await axios.post('/api/mining/complete', { userId });
      setBalance(prev => prev + 90);
      alert('Madencilik tamamlandı! 90 CB kazandınız.');
    } catch (error) {
      console.error('Madencilik tamamlanamadı:', error);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mining-container">
      <div className="balance-display">Bakiye: {balance} CB</div>
      
      <button 
        className={`mining-button ${miningActive ? 'active' : ''}`}
        onClick={startMining}
        disabled={miningActive}
      >
        <div className="cb-logo">
          <img src="/cb-logo.png" alt="CB Logo" />
        </div>
        {miningActive ? (
          <div className="countdown-timer">{formatTime(timeLeft)}</div>
        ) : (
          <span>Madenciliği Başlat</span>
        )}
      </button>
      
      <button 
        className="premium-mining-button"
        onClick={() => axios.post('/api/mining/premium', { userId })}
      >
        Premium Madencilik (1.5 TON)
      </button>
    </div>
  );
};

export default MiningButton;
