import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

interface PriceEntry {
  timestamp: number;
  price: number;
}

interface PriceHistory {
  [symbol: string]: PriceEntry[];
}

let priceHistory: PriceHistory = {};

// Fetch prices of cryptocurrencies every 60 seconds
const fetchPrices = async () => {
  try {
    const ids = ['bitcoin', 'ethereum', 'dogecoin'];
    for (const id of ids) {
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=eur`);
      const data = await response.data;
      const price = data[id].eur;
      if (!priceHistory[id]) {
        priceHistory[id] = [];
      }
      priceHistory[id].push({ timestamp: Date.now(), price });
    }
  } catch (error) {
    console.error('Error fetching prices:', error);
  }
};

// Fetch prices initially
fetchPrices();

// Fetch prices every 60 seconds
setInterval(fetchPrices, 60 * 1000);

// Endpoint to get information about a symbol
app.get('/price/:symbol', (req: Request, res: Response) => {
  const { symbol } = req.params;
  const { minutes = 60 } = req.query;
  const timestampThreshold = Date.now() - Number(minutes) * 60 * 1000;

  if (!priceHistory[symbol]) {
    return res.status(404).json({ error: 'Symbol not found' });
  }

  const filteredHistory = priceHistory[symbol].filter(entry => entry.timestamp >= timestampThreshold);
  const latest = filteredHistory[filteredHistory.length - 1];
  const count = filteredHistory.length;
  let sum = 0;
  for (const entry of filteredHistory) {
    sum += entry.price;
  }
  const average = count > 0 ? sum / count : null;

  res.json({ latest, average, history: filteredHistory, count });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});