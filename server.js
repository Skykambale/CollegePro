const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const app = express()

// Middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

// Connect to MongoDB
mongoose
    .connect("mongodb+srv://anuppokharna51:anup51@cluster0.6bfr0.mongodb.net/contactDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err)
    })

// Define the stock schema
const stockSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
})

// Create the model
const Stock = mongoose.model("Stock", stockSchema)

// API routes
// Get all stocks
app.get("/api/watchlist", async (req, res) => {
    try {
        const stocks = await Stock.find()
        res.json(stocks)
    } catch (error) {
        console.error("Error fetching stocks:", error)
        res.status(500).json({ error: "Server error" })
    }
})

// Add a stock
app.post("/api/watchlist", async (req, res) => {
    try {
        const { symbol, name, type } = req.body

        // Check if stock already exists
        const existingStock = await Stock.findOne({ symbol })
        if (existingStock) {
            return res.status(400).json({ error: "Stock already in watchlist" })
        }

        // Create new stock
        const stock = new Stock({
            symbol,
            name,
            type,
        })

        await stock.save()
        res.status(201).json(stock)
    } catch (error) {
        console.error("Error adding stock:", error)
        res.status(500).json({ error: "Server error" })
    }
})

// Remove a stock
app.delete("/api/watchlist/:symbol", async (req, res) => {
    try {
        const { symbol } = req.params

        const result = await Stock.deleteOne({ symbol })

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Stock not found" })
        }

        res.json({ message: "Stock removed from watchlist" })
    } catch (error) {
        console.error("Error removing stock:", error)
        res.status(500).json({ error: "Server error" })
    }
})

// Serve the main HTML file for all routes (for SPA behavior)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})