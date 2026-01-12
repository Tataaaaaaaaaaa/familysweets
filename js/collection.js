document.addEventListener('DOMContentLoaded', function () {
    bindButtonEvents();

    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', function () {
        const selectedOption = sortSelect.value;
        applyFilters(selectedOption);
    });

    document.querySelectorAll('input[name="category[]"]').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            applyFilters();
        });
    });

    document.querySelectorAll('input[name="flavor[]"]').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            applyFilters();
        });
    });

    document.querySelectorAll('.size-checkbox').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            applyFilters();
        });
    });

    const priceSelect = document.getElementById('priceSelect');
    priceSelect.addEventListener('change', function () {
        applyFilters();
    });

    function applyFilters(sortOption = '') {
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category[]"]:checked')).map(checkbox => checkbox.value);
        const selectedFlavors = Array.from(document.querySelectorAll('input[name="flavor[]"]:checked')).map(checkbox => checkbox.value);
        const selectedSizes = Array.from(document.querySelectorAll('.size-checkbox:checked')).map(checkbox => checkbox.value);
        const selectedPrice = priceSelect.value;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'php/filter_cakes.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        const params = `categories=${encodeURIComponent(selectedCategories.join(','))}&flavors=${encodeURIComponent(selectedFlavors.join(','))}&sizes=${encodeURIComponent(selectedSizes.join(','))}&price=${encodeURIComponent(selectedPrice)}&sort=${encodeURIComponent(sortOption)}`;
        
        xhr.onload = function () {
            if (xhr.status === 200) {
                document.getElementById('cake-collection').innerHTML = xhr.responseText;
                bindButtonEvents(); 
            } else {
                console.error('Error fetching cakes');
            }
        };

        xhr.send(params);
    }

    function bindButtonEvents() {
        document.querySelectorAll('.favorite-btn').forEach(function (button) {
            button.addEventListener('click', function (event) {
                event.stopPropagation();
                const cakeId = this.getAttribute('data-cake-id');
                const userId = this.getAttribute('data-user-id');

                if (!userId) {
                    window.location.href = 'login.php';
                    return;
                }

                this.classList.toggle('favorited');

                fetch('php/toggle_favorite.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cake_id: cakeId, user_id: userId })
                })
                .then(response => response.json())
                .then(data => {
                    if (!data.success) {
                        this.classList.toggle('favorited');
                        console.error('Error:', data.error);
                    }
                })
                .catch(error => {
                    this.classList.toggle('favorited');
                    console.error('Error:', error);
                });
            });
        });

       
    }
});

function redirectToProduct(cakeId) {
    document.getElementById('cake_id_input').value = cakeId;

    document.getElementById('redirect-form').submit();
}























document.querySelectorAll('.cart-btn').forEach(function (button) {
    button.addEventListener('click', function (event) {
        event.stopPropagation();
        
        const cakeId = this.getAttribute('data-cake-id');
        const userId = this.getAttribute('data-user-id');

        const modal = new bootstrap.Modal(document.getElementById('cartModal'));
        modal.show();

        document.getElementById('cakeId').value = cakeId;
        document.getElementById('userId').value = userId;

        fetch(`php/fetch_cake_sizes.php?cake_id=${cakeId}`)
            .then(response => response.json())
            .then(data => {
                const sizeDropdown = document.getElementById('cakeSize');
                sizeDropdown.innerHTML = ''; 

                if (data.small) sizeDropdown.innerHTML += `<option value="small">6 inches</option>`;
                if (data.medium) sizeDropdown.innerHTML += `<option value="medium">7 inches</option>`;
                if (data.large) sizeDropdown.innerHTML += `<option value="large">8 inches</option>`;
            })
            .catch(error => console.error('Error fetching sizes:', error));
    });
});






















document.getElementById('addToCartForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const cakeId = document.getElementById('cakeId').value;
    const userId = document.getElementById('userId').value;
    const cakeSize = document.getElementById('cakeSize').value;
    const cakeQuantity = document.getElementById('cakeQuantity').value;

    if (!cakeSize) {
        alert("Please select a size before adding to the cart.");
        return; 
    }

    fetch('php/add_to_cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cake_id: cakeId,
            user_id: userId,
            cake_size: cakeSize,
            cake_quantity: cakeQuantity
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
            modal.hide();
            alert('Item added to cart successfully!');
        } else {
            console.error('Error adding to cart:', data.error);
        }
    })
    .catch(error => console.error('Error:', error));
});
