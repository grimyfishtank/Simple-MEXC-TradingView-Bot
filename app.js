const express = require('express');
const { createExchange } = require('@compendiumfi/pendax');
require('dotenv').config();

// This Code Needs Further Review And Testing. Please Use With Caution

const app = express();
app.use(express.json());

// Initialize the MEXC exchange object using PENDAX SDK
const mexcClient = createExchange({
    exchange: "mexc",
    authenticate: true,
    key: process.env.MEXC_API_KEY,
    secret: process.env.MEXC_API_SECRET
    // Add other necessary authentication details
});

app.post('/webhook', async (req, res) => {
    const { signal, symbol, quantity } = req.body;

    try {
        const result = await processTradeSignal(signal, symbol, quantity);
        res.status(200).send(result);
    } catch (error) {
        console.error(`Error processing trade signal: ${error.message}`);
        res.status(500).send({ message: error.message });
    }
});

async function processTradeSignal(signal, symbol, quantity) {
    try {
        // Validate and format the input
        if (!['buy', 'sell'].includes(signal.toLowerCase())) {
            throw new Error("Invalid signal. Signal must be 'buy' or 'sell'.");
        }
        if (isNaN(quantity) || quantity < 1 || quantity > 100) {
            throw new Error("Invalid quantity. Quantity must be an integer between 1 and 100.");
        }

        const accountInfo = await mexcClient.getSpotAccountInfo();
        const tradeSize = calculateTradeSize(accountInfo, symbol, signal.toUpperCase(), quantity);

        await mexcClient.newOrderSpot({
            symbol: symbol.replace('-', ''),
            side: signal.toUpperCase(),
            type: 'market',
            quantity: tradeSize
        });

        return `Order placed: ${signal.toUpperCase()} ${tradeSize} in market ${symbol.replace('-', '')}`;
    } catch (error) {
        throw error;
    }
}

function calculateTradeSize(accountInfo, symbol, side, quantityPct) {
    // Split the symbol at '-' to get base and quote assets
    const [baseAsset, quoteAsset] = symbol.split('-');

    let asset;
    if (side === 'BUY') {
        // For BUY orders, use the quote currency (e.g., USDT in MANGO-USDT)
        asset = quoteAsset;
    } else {
        // For SELL orders, use the base currency (e.g., MANGO in MANGO-USDT)
        asset = baseAsset;
    }

    const balance = accountInfo.balances.find(b => b.asset === asset);

    if (!balance || parseFloat(balance.free) <= 0) {
        throw new Error(`Insufficient ${asset} balance`);
    }

    // Calculate the trade size as a percentage of the available balance
    const size = (parseFloat(balance.free) * quantityPct) / 100;
    return size.toFixed(8); // Assuming 8 decimal places, adjust as needed for MEXC
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
