# Simple MEXC TradingView Bot Example With PENDAX

This repository contains a Node.js application designed to interface with MEXC Exchange using the PENDAX SDK. It is specifically built to handle very simple webhooks from TradingView, process the incoming trading signals, and execute trades on the MEXC Exchange accordingly.

## Features

- Processes TradingView webhook signals.
- Executes trades on MEXC Exchange based on signals.
- Validates incoming trading signals for format and feasibility.

## Getting Started

These instructions will guide you on how to set up and run the application on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm (Node.js package manager)
- A MEXC Exchange account with API access

### Installation

 Clone the repository to your local machine

     git clone https://github.com/grimyfishtank/Simple-MEXC-TradingView-Bot.git

 Navigate to cloned directory

     cd Simple-MEXC-TradingView-Bot
 
 Install the required Node.js packages

     npm install

### Setup ENV File & Run Application
Set up your `.env` file with the required API  keys:

    MEXC_API_KEY=your_mexc_api_key 
    MEXC_API_SECRET=your_mexc_api_secret

**Start The Application**

    node app.js

**Send Webhooks**
Configure TradingView or another service to send webhooks to `http://yourserver:PORT/webhook` with the specified payload format.

## Webhook Usage

To use this application, configure your TradingView account to send webhooks to the endpoint where your server is running.

### Webhook Signal Format

Send a POST request with the following JSON structure:


    {
    "signal": "buy", // or "sell"
    "symbol": "BTC-USDT",
    "quantity": 50   // Percentage of balance to trade (1-100)
    }

Please note that this example script does not abide by MEXC API Market ID's and adds a denominator "-".

The Market BTC-USDT would apply to the "symbol" field and be translated to BTCUSDT in the code for trade post to MEXC.

### Usage Notes

 - Ensure that your account has ample balances of the assets you wish to trade. This bot is specifically created for MEXC spot markets.
 - Ensure that your percentage size for the trade meets minimum and maximum trade requirements for the selected market.
 - Ensure that you format the market revisions for this bot correctly in the signal from TradingView. Remember that BTC-USDT is the symbol for BTCUSDT etc.

## Running Tests
-   Test the application in MEXC's sandbox environment to ensure it's working as expected and make any fixes as needed.
-   Ensure that the incoming webhook signal is correctly parsed and the corresponding trades are executed on the exchange.

## Disclaimer
This application is provided for educational purposes only. Use it at your own risk. The authors are not responsible for any financial losses incurred as a result of using this application.