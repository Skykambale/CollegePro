document.addEventListener('DOMContentLoaded', function() {
    const addStockBtn = document.getElementById('add-stock-btn');
    const addStockModal = document.getElementById('add-stock-modal');
    const closeModal = document.querySelector('.modal .close');
    const addStockForm = document.getElementById('add-stock-form');

    // Open modal
    addStockBtn.addEventListener('click', function() {
        addStockModal.style.display = 'block';
    });

    // Close modal
    closeModal.addEventListener('click', function() {
        addStockModal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target == addStockModal) {
            addStockModal.style.display = 'none';
        }
    });

    // Handle form submission
    addStockForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const symbol = document.getElementById('stock-symbol').value;
        const name = document.getElementById('stock-name').value;
        const type = document.getElementById('stock-type').value;

        try {
            const response = await fetch('/api/watchlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ symbol, name, type })
            });

            if (response.ok) {
                const stock = await response.json();

                // Add new stock to watchlist
                const watchlist = document.querySelector('.watchlist');
                const newStockItem = document.createElement('div');
                newStockItem.classList.add('watchlist-item');
                newStockItem.setAttribute('data-symbol', stock.symbol);
                newStockItem.innerHTML = `
                    <div class="stock-name">${stock.name} <span class="stock-type">${stock.type}</span></div>
                    <div class="stock-price-container">
                        <div class="stock-change">0.00</div>
                        <div class="stock-percent">0.00%</div>
                        <div class="stock-price">0.00</div>
                    </div>
                `;
                watchlist.insertBefore(newStockItem, watchlist.querySelector('.add-to-watchlist'));

                // Close modal and reset form
                addStockModal.style.display = 'none';
                addStockForm.reset();
            } else {
                const error = await response.json();
                alert(error.error);
            }
        } catch (error) {
            console.error('Error adding stock:', error);
            alert('Failed to add stock');
        }
    });
});