import React from 'react';

const Shop = () => {
  const boostOptions = [
    { id: 1, percent: 0.5, price: 0.1, icon: '⚡' },
    { id: 2, percent: 1, price: 1.5, icon: '🚀' },
    { id: 3, percent: 5, price: 2.0, icon: '🔥' },
    { id: 4, percent: 10, price: 3.0, icon: '💎' },
    { id: 5, percent: 20, price: 4.0, icon: '🌟' },
    { id: 6, percent: 35, price: 5.0, icon: '👑' },
  ];

  const purchaseBoost = (boost) => {
    // TON ödeme işlemi burada başlatılacak
    alert(`${boost.percent}% kazanç artışı için ${boost.price} TON ödeme başlatılıyor...`);
    // TonService.sendTON(...)
  };

  return (
    <div className="shop-page">
      <h2><span>🛒</span> CB Artış Mağazası</h2>
      
      <div className="boost-grid">
        {boostOptions.map(boost => (
          <div key={boost.id} className="boost-card">
            <div className="boost-icon">{boost.icon}</div>
            <h3>{boost.percent}% Kazanç Artışı</h3>
            <p>{boost.price} TON</p>
            <button onClick={() => purchaseBoost(boost)}>Satın Al</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
