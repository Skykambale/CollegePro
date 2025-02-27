// Watchlist functionality
document.addEventListener("DOMContentLoaded", () => {
    const watchlistItems = document.querySelectorAll(".watchlist-item")
    const addStockBtn = document.getElementById("add-stock-btn")
    const addStockModal = document.getElementById("add-stock-modal")
    const closeBtn = document.querySelector(".close")
    const addStockForm = document.getElementById("add-stock-form")

    // Dummy initChart function for demonstration purposes
    // In a real application, this would initialize your chart library
    function initChart(symbol) {
        console.log(`Initializing chart for ${symbol}`)
        // Replace this with your actual chart initialization code
    }

    // Select first watchlist item by default
    if (watchlistItems.length > 0) {
        watchlistItems[0].classList.add("active")
        const symbol = watchlistItems[0].dataset.symbol
        initChart(symbol)
    }

    // Handle watchlist item click
    watchlistItems.forEach((item) => {
        item.addEventListener("click", function () {
            // Remove active class from all items
            watchlistItems.forEach((i) => i.classList.remove("active"))

            // Add active class to clicked item
            this.classList.add("active")

            // Get symbol and initialize chart
            const symbol = this.dataset.symbol
            initChart(symbol)
        })
    })

    // Handle add stock button click
    addStockBtn.addEventListener("click", () => {
        addStockModal.style.display = "block"
    })

    // Handle close button click
    closeBtn.addEventListener("click", () => {
        addStockModal.style.display = "none"
    })

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
        if (event.target === addStockModal) {
            addStockModal.style.display = "none"
        }
    })

    // Handle add stock form submission
    addStockForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        const symbol = document.getElementById("stock-symbol").value
        const name = document.getElementById("stock-name").value
        const type = document.getElementById("stock-type").value

        try {
            // Send data to server
            const response = await fetch("/api/watchlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    symbol,
                    name,
                    type,
                }),
            })

            if (response.ok) {
                const stock = await response.json()

                // Create new watchlist item
                addStockToWatchlist(stock)

                // Reset form and close modal
                addStockForm.reset()
                addStockModal.style.display = "none"
            } else {
                alert("Failed to add stock to watchlist")
            }
        } catch (error) {
            console.error("Error adding stock:", error)
            alert("Failed to add stock to watchlist")
        }
    })

    // Function to add stock to watchlist
    function addStockToWatchlist(stock) {
        // Create new watchlist item element
        const newItem = document.createElement("div")
        newItem.className = "watchlist-item"
        newItem.dataset.symbol = stock.symbol

        // Random change and percent for demonstration
        const isUp = Math.random() > 0.5
        const change = (Math.random() * 10).toFixed(2)
        const percent = (Math.random() * 1).toFixed(2)
        const price = (Math.random() * 10000 + 10000).toFixed(2)

        // Create HTML content
        newItem.innerHTML = `
              <div class="stock-name">${stock.name} <span class="stock-type">${stock.type}</span></div>
              <div class="stock-price-container">
                  <div class="stock-change ${isUp ? "up" : "down"}">${isUp ? "" : "-"}${change}</div>
                  <div class="stock-percent ${isUp ? "up" : "down"}">${isUp ? "" : "-"}${percent}%</div>
                  <div class="stock-price">${price}</div>
              </div>
          `

        // Add click event
        newItem.addEventListener("click", function () {
            // Remove active class from all items
            document.querySelectorAll(".watchlist-item").forEach((i) => i.classList.remove("active"))

            // Add active class to this item
            this.classList.add("active")

            // Get symbol and initialize chart
            const symbol = this.dataset.symbol
            initChart(symbol)
        })

        // Append to watchlist before the add button
        const watchlist = document.querySelector(".watchlist")
        const addButtonContainer = document.querySelector(".add-to-watchlist")
        watchlist.insertBefore(newItem, addButtonContainer)
    }

    // Fetch watchlist data on page load
    async function fetchWatchlist() {
        try {
            const response = await fetch("/api/watchlist")

            if (response.ok) {
                const stocks = await response.json()

                // Clear existing watchlist items
                const watchlist = document.querySelector(".watchlist")
                const addButtonContainer = document.querySelector(".add-to-watchlist")

                // Keep default items for this demo
                // To completely replace with database items, uncomment this:
                /*
                        watchlist.querySelectorAll('.watchlist-item').forEach(item => {
                            item.remove();
                        });
                        */

                // Add stocks from database
                stocks.forEach((stock) => {
                    // Skip if already in watchlist
                    if (!document.querySelector(`.watchlist-item[data-symbol="${stock.symbol}"]`)) {
                        addStockToWatchlist(stock)
                    }
                })
            }
        } catch (error) {
            console.error("Error fetching watchlist:", error)
        }
    }

    // Fetch watchlist on page load
    fetchWatchlist()
})

// Function to remove a stock from watchlist
async function removeStock(symbol) {
    try {
        const response = await fetch(`/api/watchlist/${symbol}`, {
            method: "DELETE",
        })

        if (response.ok) {
            // Remove from DOM
            const item = document.querySelector(`.watchlist-item[data-symbol="${symbol}"]`)
            if (item) {
                // If active, select another item
                if (item.classList.contains("active")) {
                    const nextItem = item.nextElementSibling
                    const prevItem = item.previousElementSibling

                    if (nextItem && !nextItem.classList.contains("add-to-watchlist")) {
                        nextItem.click()
                    } else if (prevItem) {
                        prevItem.click()
                    }
                }

                item.remove()
            }
        } else {
            alert("Failed to remove stock from watchlist")
        }
    } catch (error) {
        console.error("Error removing stock:", error)
        alert("Failed to remove stock from watchlist")
    }
}

