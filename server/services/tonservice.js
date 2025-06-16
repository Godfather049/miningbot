const TonWeb = require('tonweb');
const tonweb = new TonWeb(new TonWeb.HttpProvider(process.env.TON_RPC_URL));

class TonService {
  static async sendTON(fromPrivateKey, toAddress, amount) {
    const wallet = tonweb.wallet.create({ publicKey: TonWeb.utils.hexToBytes(fromPrivateKey) });
    const seqno = await wallet.methods.seqno().call();
    
    const transfer = wallet.methods.transfer({
      secretKey: TonWeb.utils.hexToBytes(fromPrivateKey),
      toAddress: new TonWeb.utils.Address(toAddress),
      amount: TonWeb.utils.toNano(amount),
      seqno: seqno,
      payload: 'CB Mining Payment'
    });

    return transfer.send();
  }

  static async checkTransaction(receiver, amount) {
    try {
      const response = await axios.get(`https://tonapi.io/v1/blockchain/getTransactions?account=${receiver}`);
      const transactions = response.data.transactions;
      
      return transactions.some(tx => 
        tx.out_msgs.some(msg => 
          msg.destination === process.env.ADMIN_WALLET && 
          parseFloat(msg.value) >= TonWeb.utils.toNano(amount)
        )
      );
    } catch (error) {
      console.error('TON transaction check error:', error);
      return false;
    }
  }
}

module.exports = TonService;
