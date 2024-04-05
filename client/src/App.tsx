import React, { useEffect, useState } from 'react'

import ChartHistory from './ChartHistory'

import './App.css'

const API = 'http://localhost:8080'
const DEFAULT_INTERVAL = 60000
const SYMBOLS = ['bitcoin', 'ethereum', 'dogecoin']

interface DataState {
  latest: number;
  average: number;
  history: string[];
  count: number;
  symbol: string;
}

// interface DataState {}

function App() {
  const [minutes, setMinutes] = useState<number>(60)
  const [symbol, setSymbol] = useState<string>('bitcoin')
  const [symbolInput, setSymbolInput] = useState<string>('bitcoin')
  const [data, setData] = useState<DataState[]>([
    {
      latest: 0,
      average: 0,
      history: [],
      count: 0,
      symbol: 'bitcoin',
    },
  ])

  useEffect(() => {
    fetchPrices()
    setInterval(() => fetchPrices(minutes), DEFAULT_INTERVAL)
  }, [])

  const fetchPrices = async (minutes: number = 60) => {
    try {
      const dataArray: DataState[] = await Promise.all(
        SYMBOLS.map(async (symbol) => {
          const response = await fetch(`${API}/price/${symbol}?minutes=${minutes}`)
          const data: DataState = await response.json()
          return { ...data, symbol }
        })
      )
      setData(dataArray)
    } catch (error) {
      console.error(error)
    }
  }

  // return false
  const onMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinutes(+e.target.value || 0)
  }

  const onSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbolInput(e.target.value || '')
  }

  const onNavigateSymbol = (symbol: string) => {
    setSymbol(symbol)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (SYMBOLS.includes(symbolInput)) {
      fetchPrices(minutes)
      setSymbol(symbolInput)
    }
    
  }

  const perSymbol = data.filter(item => item.symbol === symbol)

  return (
    <div className="App">
      <div>
        <div className="container mx-auto px-4 py-8 md:px-10 lg:px-20">
          <h1 className="text-3xl font-bold text-center mb-8">Crypto EUR</h1>
          <div className="mb-2 flex items-center">
            <span>Request symbol and number of minutes:</span>
            <div className="ml-2">
              <form onSubmit={handleSubmit}>
                <input className="mr-2" style={{width:100}} type="text" value={symbolInput} onChange={onSymbolChange} />
                <input style={{width:50}} type="text" value={minutes} onChange={onMinuteChange} />
                <button className="ml-2" type="submit">GO</button>
              </form>
              
            </div>
          </div>
          <div className="flex flex-wrap justify-between">
            <div
              className="w-1/3 font-bold text-white bg-orange-400 p-4 cursor-pointer text-center"
              onClick={() => onNavigateSymbol('bitcoin')}
            >Bitcoin BTC</div>
            <div
              className="w-1/3 font-bold text-white bg-slate-400 p-4 cursor-pointer text-center"
              onClick={() => onNavigateSymbol('ethereum')}
            >Ethereum ETH</div>
            <div
              className="w-1/3 font-bold text-white bg-yellow-400 p-4 cursor-pointer text-center"
              onClick={() => onNavigateSymbol('dogecoin')}
            >Dogecoin DOGE</div>
          </div>

          <h1 className="font-bold text-3xl mt-4">{perSymbol[0].symbol.toUpperCase()}</h1>
          <div className="flex flex-wrap justify-between mt-4">
            <div className="w-full sm:w-1/2">
              <div className="flex flex-col">
                <div className="flex-1 bg-gray-200 p-4">
                  <h2 className="text-xl font-bold mb-4">Latest</h2>
                  <p className="text-2xl font-bold">€{perSymbol[0].latest}</p>
                </div>
                <div className="flex-1 bg-gray-300 p-4">
                  <h2 className="text-xl font-bold mb-4">Average</h2>
                  <p className="text-2xl font-bold">€{perSymbol[0].average}</p>
                </div>
                <div className="flex-1 bg-gray-400 p-4">
                  <h2 className="text-xl font-bold mb-4">Count</h2>
                  <p className="text-2xl font-bold">{perSymbol[0].count}</p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2">
              <ChartHistory history={perSymbol[0].history} />
            </div>
          </div>
          
        </div>
      </div>
      
    </div>
  )
}

export default App
