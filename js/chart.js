// Initialize chart
function initChart(symbol) {
    const chartElement = document.getElementById("chart")
    chartElement.innerHTML = ""

    // Default data for demonstration
    let seriesData = []

    // Different data patterns based on symbol
    if (symbol === "NIFTY50") {
        seriesData = generateCandleData(22500, 22650, 60, 1)
    } else if (symbol === "NIFTYBANK") {
        seriesData = generateCandleData(48500, 48800, 60, 2)
    } else if (symbol === "NIFTYFINSERVICE") {
        seriesData = generateCandleData(23000, 23200, 60, 3)
    } else if (symbol === "SENSEX") {
        seriesData = generateCandleData(74500, 74700, 60, 4)
    } else if (symbol === "NIFTYMIDSELECT") {
        seriesData = generateCandleData(10900, 11000, 60, 5)
    } else {
        seriesData = generateCandleData(22000, 23000, 60, Math.random())
    }

    const options = {
        series: [
            {
                data: seriesData,
            },
        ],
        chart: {
            type: "candlestick",
            height: "100%",
            background: "#121212",
            foreColor: "#999",
            animations: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            type: "datetime",
            labels: {
                formatter: (val) => new Date(val).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
        },
        yaxis: {
            tooltip: {
                enabled: true,
            },
            labels: {
                formatter: (val) => val.toFixed(2),
            },
            opposite: true,
        },
        grid: {
            borderColor: "#333",
            strokeDashArray: 0,
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: "#26a69a",
                    downward: "#ef5350",
                },
                wick: {
                    useFillColor: true,
                },
            },
        },
        tooltip: {
            theme: "dark",
        },
    }

    const chart = new ApexCharts(chartElement, options)
    chart.render()

    // Update symbol in the header
    document.querySelector(".current-symbol").textContent = symbol

    // Update current price in footer
    const lastCandle = seriesData[seriesData.length - 1]
    document.querySelector(".current-price").textContent = lastCandle.y[3].toFixed(2)
}

// Generate random candle data
function generateCandleData(basePrice, maxPrice, count, seed) {
    const data = []
    const now = new Date()
    now.setHours(9, 30, 0, 0)

    let price = basePrice

    // Use seed to create somewhat predictable but different patterns
    const randomSeed = seed || Math.random()

    for (let i = 0; i < count; i++) {
        const time = new Date(now)
        time.setMinutes(now.getMinutes() + 5 * i)

        const volatility = basePrice * 0.003

        // Generate open, high, low, close values
        const open = price

        // Use the seed to affect the random movement
        const change = volatility * (Math.sin(i * 0.1 + randomSeed * 10) + Math.random() - 0.5)

        const close = Math.max(Math.min(open + change, maxPrice), basePrice * 0.95)
        const high = Math.max(open, close) + volatility * Math.random()
        const low = Math.min(open, close) - volatility * Math.random()

        data.push({
            x: time.getTime(),
            y: [open, high, low, close].map((val) => Number.parseFloat(val.toFixed(2))),
        })

        price = close
    }

    return data
}

