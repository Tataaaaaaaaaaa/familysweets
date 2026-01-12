console.log("cart.js loaded");

function formatCurrency(number) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(number);
}

window.removeCartItem = function (cartId) {
    if (confirm("Are you sure you want to remove this item from your shopping bag?")) {
        fetch('php/remove_cart_item.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'cart_id': cartId
            })
        })
            .then(response => response.text())
            .then(result => {
                if (result === 'success') {
                    location.reload();
                } else {
                    alert("Failed to remove the item. Please try again.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
};

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.product-card').forEach(card => {
        const quantityInput = card.querySelector('.quantity-input');
        quantityInput.addEventListener('input', function () {
            updateItemPrice(card);
            updateSubtotal();
        });
    });

    function updateItemPrice(card) {
        const quantity = parseInt(card.querySelector('.quantity-input').value, 10) || 1;
        const priceElement = card.querySelector('.price');
    
        let unitPrice = 0;
        
        const checkboxInput = card.querySelector('input[type="checkbox"]');
        const cakeType = checkboxInput ? checkboxInput.getAttribute('data-cake-type') : null;

        if (cakeType === '3D CAKE') {
            const orderCost = parseFloat(priceElement.getAttribute('data-order-cost'));
            unitPrice = orderCost;
        } else {
            const basePrice = parseFloat(priceElement.getAttribute('data-base-price'));
            const smallPrice = parseFloat(priceElement.getAttribute('data-small-price'));
            const mediumPrice = parseFloat(priceElement.getAttribute('data-medium-price'));
            const largePrice = parseFloat(priceElement.getAttribute('data-large-price'));
    
            const sizeDisplay = card.querySelector('.size-display').textContent.trim();
    
            if (sizeDisplay === "6 inch") {
                unitPrice = smallPrice;
            } else if (sizeDisplay === "7 inch") {
                unitPrice = mediumPrice;
            } else if (sizeDisplay === "8 inch") {
                unitPrice = largePrice;
            } else {
                unitPrice = basePrice; 
            }
        }
    
        const totalPrice = unitPrice * quantity;
    
        priceElement.textContent = `₱${totalPrice.toFixed(2)}`;
    }

    function updateSubtotal() {
        let subtotal = 0;

        document.querySelectorAll('.product-card .form-check-input:checked').forEach(checkbox => {
            const productCard = checkbox.closest('.product-card');
            let priceText = productCard.querySelector('.price').textContent.replace('₱', '').trim();

            priceText = priceText.replace(/,/g, '');

            const itemTotal = parseFloat(priceText) || 0;
            subtotal += itemTotal;
        });

        document.getElementById('subtotal').textContent = `Subtotal: ₱${subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
    }

    document.querySelectorAll('.product-card .form-check-input').forEach(checkbox => {
        checkbox.addEventListener('change', updateSubtotal);
    });

    const checkoutButton = document.querySelector('.proceed-to-checkout');
    const invalidCheckoutModal = document.getElementById('invalidCheckoutModal');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function () {
            const selectedItems = document.querySelectorAll('.product-card .form-check-input:checked');

            if (selectedItems.length === 0) {
                // alert('Please select at least one item to checkout.');
                invalidCheckoutModal.style.display = 'block';
                return;
            }

            const data = [];

            selectedItems.forEach(item => {
                const cartId = item.getAttribute('data-cart-id');
                const cakeId = item.getAttribute('data-cake-id');
                const cakeType = item.getAttribute('data-cake-type');
                const quantity = item.closest('.product-card').querySelector('.quantity-input').value;

                const sizeDisplayElement = item.closest('.product-card').querySelector('.size-display');
                let size = null;

                if (cakeType === '3D CAKE') {
                    const sizeDisplayElement = item.closest('.product-card').querySelector('.size-display');

                    if (sizeDisplayElement) {
                        const displayedSize = sizeDisplayElement.textContent.trim();
            
                        size = displayedSize;
                    } else {
                        console.error("Size display element not found for Cart ID:", cartId);
                        size = "any"; 
                    }
                } else {
                    const sizeDisplayElement = item.closest('.product-card').querySelector('.size-display');
                
                    if (sizeDisplayElement) {
                        const displayedSize = sizeDisplayElement.textContent.trim();
                
                        if (displayedSize === "6 inch") {
                            size = "small";
                        } else if (displayedSize === "7 inch") {
                            size = "medium";
                        } else if (displayedSize === "8 inch") {
                            size = "large";
                        } else if (displayedSize === "No Size") {
                            size = "no_size";
                        } else {
                            console.error("Unexpected size detected:", displayedSize);
                        }
                    } else {
                        console.error("Size display element not found for Cart ID:", cartId);
                    }
                }
                
    
                console.log(`Cart ID: ${cartId}, Cake ID: ${cakeId}, Cake Type: ${cakeType}, Size: ${size}, Quantity: ${quantity}`);
    
                if (cartId && cakeId && size && quantity) {
                    data.push({
                        cartId: cartId,
                        cakeId: cakeId,
                        size: size,
                        quantity: quantity
                    });
                }
            });

            if (data.length === 0) {
                alert('Please ensure all items have the necessary details.');
                return;
            }

            const selectedCartIds = Array.from(selectedItems).map(item => item.getAttribute('data-cart-id')).join(', ');

            fetch('php/process_cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'data': JSON.stringify(data),
                    'cart_ids': selectedCartIds 
                })
            })

                .then(response => response.json().catch(() => {
                console.error("Non-JSON response received:", response);
                alert("Error: Server returned an invalid response. Please check the server logs.");
                return { status: 'error', message: 'Non-JSON response' };
            }))
                .then(result => {
                    console.log('Fetch response:', result);
                    if (result.status === 'success') {
                        window.location.href = `php/cart_success.php?order_no=${result.order_no}`;
                    } else {
                        console.error('Error processing checkout:', result.message);
                        alert('Error processing checkout: ' + result.message);
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    alert('An error occurred during the checkout process.');
                });

        });
    } else {
        console.error("Checkout button not found.");
    }
});


function updateCartQuantity(cartId, newQuantity) {
    if (newQuantity < 1) {
        alert('Quantity cannot be less than 1.');
        return;
    }

    const formData = new FormData();
    formData.append('cart_id', cartId);
    formData.append('quantity', newQuantity);

    fetch('php/update_cart_quantity.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Cart updated successfully');
            } else {
                console.error('Failed to update cart:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function invalidCheckoutModalCloseModal() {
    const invalidCheckoutModal = document.getElementById('invalidCheckoutModal');
    if (invalidCheckoutModal) {
      invalidCheckoutModal.style.display = 'none';
    } else {
      console.error('Invalid checkout modal not found.');
    }
}