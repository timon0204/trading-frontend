import React, { useEffect, useRef } from 'react';

const TradingViewWidget = (props) => {
    const widgetRef = useRef(null);

    useEffect(() => {
        const scriptContent = JSON.stringify({
            title: "Currencies",
            title_link: "/markets/currencies/rates-major/",
            width: "100%",
            height: props.height,
            locale: "en",
            showSymbolLogo: true,
            symbolsGroups: [
                {
                    name: "Forex",
                    symbols: [
                        { name: "FX:EURUSD", displayName: "EUR to USD" },
                        { name: "FX:GBPUSD", displayName: "GBP to USD" },
                        { name: "FX:USDJPY", displayName: "USD to JPY" },
                        { name: "FX:USDCHF", displayName: "USD to CHF" },
                        { name: "FX:AUDUSD", displayName: "AUD to USD" },
                        { name: "FX:USDCAD", displayName: "USD to CAD" }
                    ]
                },
                {
                    name: "Idices",
                    symbols: [
                        { name: "BLACKBULL:US30", displayName: "US30" },
                        { name: "BLACKBULL:UK100", displayName: "UK100" },
                        { name: "BLACKBULL:SPX500", displayName: "SPX500" },
                        { name: "BLACKBULL:GER30", displayName: "GER30" },
                    ]
                },
                {
                    name: "Crypto",
                    symbols: [
                        { name: "CRYPTO:BTCUSD", displayName: "BTC to USD" },
                        { name: "CRYPTO:ETHUSD", displayName: "ETH to USD" },
                        { name: "CRYPTO:USDTUSD", displayName: "USDT to USD" },
                    ]
                },
                {
                    name: "Futures",
                    symbols: [
                        { name: "OANDA:XAUUSD", displayName: "Gold" },
                        { name: "OANDA:XAGUSD", displayName: "Silver" },
                        { name: "SKILLING:NATGAS", displayName: "Gas" },
                        { name: "EASYMARKETS:OILUSD", displayName: "Oil" },
                    ]
                },

            ],
            colorTheme: "dark"
        });

        if (widgetRef.current) {
            widgetRef.current.innerHTML = '';
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';
            script.innerHTML = scriptContent;
            widgetRef.current.appendChild(script);
        }

    }, [props.height]);

    return (
        <div className="tradingview-widget-container">
            <div ref={widgetRef} className="tradingview-widget-container__widget"></div>
        </div>
    );
};

export default TradingViewWidget;