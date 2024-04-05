import express, { Request, Response } from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser  from 'body-parser'

dotenv.config()

const app = express()

app.use(cors())
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080
const COINGECKO_API = process.env.COINGECKO_API
const DEFAULT_INTERVAL = 60000

// let historyStore = <string>[]

interface InitialPrice {
  price: number;
  timestamp: number;
}

interface PriceHistory {
  [symbol: string]: InitialPrice[]
}

let priceHistory: PriceHistory = {}

const fetchPrices = async () => {
  try {
    const symbols = ['bitcoin', 'ethereum', 'dogecoin'];
    for (const symbol of symbols) {
      const response = await axios.get(`${COINGECKO_API}?ids=${symbol}&vs_currencies=EUR`)
      const data = await response.data
      // const price = data[id].eur
      if (!priceHistory[symbol]) {
        priceHistory[symbol] = [];
      }
      priceHistory[symbol].push({
        price: data[symbol].eur,
        timestamp: Date.now()
      });
    }
  } catch (error: any) {
      console.error('Error:', error.message);
  }
}

// initial fetch prices
fetchPrices()

// fetch prices every 60 seconds
setInterval(fetchPrices, DEFAULT_INTERVAL);

app.get('/price/:symbol', (req: Request, res: Response) => {
  const { symbol } = req.params;
  const { minutes = 60 } = req.query;
  const timestampThreshold = Date.now() - +minutes * 60 * 1000;

  if (!priceHistory[symbol]) {
    return res.status(404).json({ error: 'Something went wrong.' });
  }

  const filteredHistory = priceHistory[symbol].filter(item => item.timestamp >= timestampThreshold)
  const latest = filteredHistory[filteredHistory.length - 1]
  const count = filteredHistory.length
  let sum = 0
  for (const entry of filteredHistory) {
    sum += entry.price
  }
  const average = count > 0 ? sum / count : null

  res.json({ latest: latest.price, average, history: filteredHistory, count })
});


app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`)
})