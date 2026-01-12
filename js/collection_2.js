document.addEventListener('DOMContentLoaded', function () {
    // bindButtonEvents();

    // const sortSelect = document.getElementById('sort-select');
    // sortSelect.addEventListener('change', function () {
    //     const selectedOption = sortSelect.value;
    //     applyFilters(selectedOption);
    // });

    // document.querySelectorAll('input[name="category[]"]').forEach(function (checkbox) {
    //     checkbox.addEventListener('change', function () {
    //         applyFilters();
    //     });
    // });

    // document.querySelectorAll('input[name="flavor[]"]').forEach(function (checkbox) {
    //     checkbox.addEventListener('change', function () {
    //         applyFilters();
    //     });
    // });

    // document.querySelectorAll('.size-checkbox').forEach(function (checkbox) {
    //     checkbox.addEventListener('change', function () {
    //         applyFilters();
    //     });
    // });

    // const priceSelect = document.getElementById('priceSelect');
    // priceSelect.addEventListener('change', function () {
    //     applyFilters();
    // });

    // document.querySelectorAll('input[name="rating[]"]').forEach(function (checkbox) {
    //     checkbox.addEventListener('change', function () {
    //         applyFilters();
    //     });
    // });

    // function applyFilters(sortOption = '') {
    //     const selectedCategories = Array.from(document.querySelectorAll('input[name="category[]"]:checked')).map(checkbox => checkbox.value);
    //     const selectedFlavors = Array.from(document.querySelectorAll('input[name="flavor[]"]:checked')).map(checkbox => checkbox.value);
    //     const selectedSizes = Array.from(document.querySelectorAll('.size-checkbox:checked')).map(checkbox => checkbox.value);
    //     const selectedPrice = document.getElementById('priceSelect').value;
    //     const selectedRatings = Array.from(document.querySelectorAll('input[name="rating[]"]:checked')).map(checkbox => checkbox.value);

    //     document.getElementById('preloader').style.display = 'flex';

    //     const xhr = new XMLHttpRequest();
    //     xhr.open('POST', 'php/filter_cakes.php', true);
    //     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    //     const params = `categories=${encodeURIComponent(selectedCategories.join(','))}&flavors=${encodeURIComponent(selectedFlavors.join(','))}&sizes=${encodeURIComponent(selectedSizes.join(','))}&price=${encodeURIComponent(selectedPrice)}&ratings=${encodeURIComponent(selectedRatings.join(','))}&sort=${encodeURIComponent(sortOption)}`;

    //     xhr.onload = function () {
    //         if (xhr.status === 200) {
    //             document.getElementById('cake-collection').innerHTML = xhr.responseText;
    //             updateCakeCardClass();
    //             applyTwoLinesHeight();
                
    //             preloadImages(xhr.responseText, function () {
    //                 document.getElementById('preloader').style.display = 'none';
    //             });
                
    //         } else {
    //             console.error('Error fetching cakes');
    //         }
    //     };

    //     xhr.send(params);
    // }
    
    bindButtonEvents();

    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', function () {
        const selectedOption = sortSelect.value;
        applyFilters(selectedOption);  // Apply filters with the selected sort option
        updateUrlWithFilters(selectedOption);  // Update the URL to reflect the filters and sort option
    });

    // Filter listeners
    document.querySelectorAll('input[name="category[]"]').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            applyFilters(sortSelect.value);  // Apply filters with the selected sort option
            updateUrlWithFilters(sortSelect.value);  // Update the URL to reflect the filters and sort option
        });
    });

    document.querySelectorAll('input[name="flavor[]"]').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            applyFilters(sortSelect.value);  // Apply filters with the selected sort option
            updateUrlWithFilters(sortSelect.value);  // Update the URL to reflect the filters and sort option
        });
    });

    document.querySelectorAll('.size-checkbox').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            applyFilters(sortSelect.value);  // Apply filters with the selected sort option
            updateUrlWithFilters(sortSelect.value);  // Update the URL to reflect the filters and sort option
        });
    });

    const priceSelect = document.getElementById('priceSelect');
    priceSelect.addEventListener('change', function () {
        applyFilters(sortSelect.value);  // Apply filters with the selected sort option
        updateUrlWithFilters(sortSelect.value);  // Update the URL to reflect the filters and sort option
    });

    document.querySelectorAll('input[name="rating[]"]').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            applyFilters(sortSelect.value);  // Apply filters with the selected sort option
            updateUrlWithFilters(sortSelect.value);  // Update the URL to reflect the filters and sort option
        });
    });

    // Function to apply filters and sorting together
    function applyFilters(sortOption = '') {
        // Get selected filters
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category[]"]:checked')).map(checkbox => checkbox.value);
        const selectedFlavors = Array.from(document.querySelectorAll('input[name="flavor[]"]:checked')).map(checkbox => checkbox.value);
        const selectedSizes = Array.from(document.querySelectorAll('.size-checkbox:checked')).map(checkbox => checkbox.value);
        const selectedPrice = document.getElementById('priceSelect').value;
        const selectedRatings = Array.from(document.querySelectorAll('input[name="rating[]"]:checked')).map(checkbox => checkbox.value);

        // Show preloader while waiting for results
        // document.getElementById('preloader').style.display = 'flex';

        // AJAX request to fetch filtered and sorted data
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'php/filter_cakes.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        // Prepare the parameters, including the sort option and filters
        const params = `categories=${encodeURIComponent(selectedCategories.join(','))}&flavors=${encodeURIComponent(selectedFlavors.join(','))}&sizes=${encodeURIComponent(selectedSizes.join(','))}&price=${encodeURIComponent(selectedPrice)}&ratings=${encodeURIComponent(selectedRatings.join(','))}&sort=${encodeURIComponent(sortOption)}`;

        // Handle the response from the server
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Update the page with the new results
                document.getElementById('cake-collection').innerHTML = xhr.responseText;
                updateCakeCardClass();
                applyTwoLinesHeight();

                // Preload images and hide the preloader
                preloadImages(xhr.responseText, function () {
                    document.getElementById('preloader').style.display = 'none';
                });
                
            } else {
                console.error('Error fetching cakes');
            }
        };

        // Send the AJAX request with the parameters
        xhr.send(params);
    }

    function updateUrlWithFilters(sortOption = '') {
        // Get selected filters
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category[]"]:checked')).map(checkbox => checkbox.value);
        const selectedFlavors = Array.from(document.querySelectorAll('input[name="flavor[]"]:checked')).map(checkbox => checkbox.value);
        const selectedSizes = Array.from(document.querySelectorAll('.size-checkbox:checked')).map(checkbox => checkbox.value);
        const selectedPrice = document.getElementById('priceSelect').value;
        const selectedRatings = Array.from(document.querySelectorAll('input[name="rating[]"]:checked')).map(checkbox => checkbox.value);
    
        // Prepare the URL parameters
        let urlParams = new URLSearchParams(window.location.search);
    
        // Set or remove categories from URL
        if (selectedCategories.length > 0) {
            urlParams.set('categories', selectedCategories.join(','));
        } else {
            urlParams.delete('categories');
        }
    
        // Set or remove flavors from URL
        if (selectedFlavors.length > 0) {
            urlParams.set('flavors', selectedFlavors.join(','));
        } else {
            urlParams.delete('flavors');
        }
    
        // Set or remove sizes from URL
        if (selectedSizes.length > 0) {
            urlParams.set('sizes', selectedSizes.join(','));
        } else {
            urlParams.delete('sizes');
        }
    
        // Set or remove price from URL
        if (selectedPrice) {
            urlParams.set('price', selectedPrice);
        } else {
            urlParams.delete('price');
        }
    
        // Set or remove ratings from URL
        if (selectedRatings.length > 0) {
            urlParams.set('ratings', selectedRatings.join(','));
        } else {
            urlParams.delete('ratings');
        }
    
        // Set or remove sort from URL
        if (sortOption) {
            urlParams.set('sort', sortOption);
        } else {
            urlParams.delete('sort');
        }
    
        // Update the browser's URL without reloading the page
        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
    }

    
    function bindButtonEvents() {
        document.querySelectorAll('.favorite-btn').forEach(function (button) {
            button.addEventListener('click', function (event) {
                event.stopPropagation();
                const cakeId = this.getAttribute('data-cake-id');
                const userId = this.getAttribute('data-user-id');

                if (!userId) {
                    document.getElementById('loginModal').style.display = 'block';
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
    
    function preloadImages(htmlContent, callback) {
        const imgTags = new DOMParser().parseFromString(htmlContent, 'text/html').querySelectorAll('img');
        const imagesToPreload = Array.from(imgTags).map(img => img.src);
        let imagesLoaded = 0;
    
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = function () {
                imagesLoaded++;
                if (imagesLoaded === imagesToPreload.length) {
                    callback(); 
                }
            };
            img.onerror = function () {
                imagesLoaded++;
                if (imagesLoaded === imagesToPreload.length) {
                    callback();
                }
            };
        });
    
        if (imagesToPreload.length === 0) {
            callback();
        }
    }
    
    function applyTwoLinesHeight() {
        var pTags = document.querySelectorAll('.prod-cake-name');
        
        pTags.forEach(function(pTag) {
            var fontSize = window.getComputedStyle(pTag).fontSize;
            var lineHeight = 1.2;
            
            var fontSizeValue = parseFloat(fontSize);
            var twoLinesHeight = fontSizeValue * lineHeight * 2;
    
            var wrapper = pTag.closest('.prod-cake-name-wrapper');
            if (wrapper) {
                wrapper.style.height = twoLinesHeight + 'px';
            }
        });
    }

    function updateCakeCardClass() {
        const containers = document.querySelectorAll('.cake-card-container');
        const sidebar = document.getElementById('sidebar');
        const width = window.innerWidth;

        const isSidebarActive = sidebar.classList.contains('active');

        containers.forEach(container => {
            container.classList.remove('cake-card-4-col', 'cake-card-3-col', 'cake-card-2-col', 'cake-card-1-col');

            if (isSidebarActive) {
                if (width >= 1701) {
                    container.classList.add('cake-card-4-col');
                } else if (width >= 1400 && width <= 1700) {
                    container.classList.add('cake-card-3-col');
                } else if (width >= 407 && width <= 1399) {
                    container.classList.add('cake-card-2-col');
                } else {
                    container.classList.add('cake-card-1-col');
                }
            } else {
                if (width >= 1701) {
                    container.classList.add('cake-card-4-col');
                } else if (width >= 1400 && width <= 1700) {
                    container.classList.add('cake-card-4-col');
                } else if (width >= 1051 && width <= 1399) {
                    container.classList.add('cake-card-3-col');
                } else if (width >= 407 && width <= 1050) {
                    container.classList.add('cake-card-2-col');
                } else {
                    container.classList.add('cake-card-1-col');
                }
            }
        });
    }

    window.addEventListener('load', updateCakeCardClass);
    window.addEventListener('resize', updateCakeCardClass);

    document.getElementById('sidebarCollapse').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
        updateCakeCardClass();
    });
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

        // Check if the user is logged in
        if (!userId || userId.trim() === "") {
            document.getElementById('loginModal').style.display = 'block';
            return;
        }

        // If logged in, show the modal
        const modal = new bootstrap.Modal(document.getElementById('cartModal'));
        modal.show();

        // Set hidden fields for the form
        document.getElementById('cakeId').value = cakeId;
        document.getElementById('userId').value = userId;

        // Fetch cake sizes dynamically
        fetch(`php/fetch_cake_sizes.php?cake_id=${cakeId}`)
        .then(response => response.json())
        .then(data => {
            const sizeDropdown = document.getElementById('cakeSize');
            sizeDropdown.innerHTML = ''; // Clear existing options
    
            if (data.baseprice > 0) {
                // No Size option if cake_no_size is 1
                sizeDropdown.innerHTML += `<option value="no_size">No Size</option>`;
            } else {
                // Add size options based on availability
                if (data.small) sizeDropdown.innerHTML += `<option value="small">6 inches</option>`;
                if (data.medium) sizeDropdown.innerHTML += `<option value="medium">7 inches</option>`;
                if (data.large) sizeDropdown.innerHTML += `<option value="large">8 inches</option>`;
            }
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


        window.redirectToLogin = function () {
            window.location.href = 'login';
        };
    
        window.closeModal = function () {
            document.getElementById('loginModal').style.display = 'none';
        };
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        