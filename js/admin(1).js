document.addEventListener('DOMContentLoaded', function () {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    function toggleSidebar() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
    
    function handleResize() {
        if (window.innerWidth >= 768) {
            overlay.classList.remove('active');
            sidebar.classList.remove('active');
        }
    }
    
    window.addEventListener('resize', handleResize);

    handleResize();

    sidebarToggle.addEventListener('click', function (event) {
        event.stopPropagation(); 
        toggleSidebar();
    });
    

    overlay.addEventListener('click', function () {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    document.addEventListener('click', function (event) {
        if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && event.target !== sidebarToggle) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
    });
});



document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();


        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });


        const targetId = this.innerText.toLowerCase().replace(' ', '-');
        document.getElementById(targetId).style.display = 'block';
    });
});





















document.addEventListener('DOMContentLoaded', function () {
    const timePeriodDropdown = document.getElementById('time_period_dropdown');

    function updateData() {
        const timePeriod = timePeriodDropdown.value;

        fetch(`php/fetch_orders_data.php?time_period=${timePeriod}`)
            .then(response => response.json())
            .then(data => {
                // console.log('Fetched Data:', data);

                const cakeTypes = data.cake_types || {};
                // console.log('Cake Types:', cakeTypes);


                const preMadeCount = parseInt(cakeTypes['PRE-MADE CAKE'], 10) || 0;
                const threeDCakeCount = parseInt(cakeTypes['3D CAKE'], 10) || 0;
                const totalCount = preMadeCount + threeDCakeCount;

                // console.log('PRE-MADE CAKE Count:', preMadeCount);
                // console.log('3D CAKE Count:', threeDCakeCount);
                // console.log('Calculated Total Count:', totalCount);


                const preMadePercentage = totalCount > 0 ? (preMadeCount / totalCount * 100).toFixed(2) : 0;
                const threeDCakePercentage = totalCount > 0 ? (threeDCakeCount / totalCount * 100).toFixed(2) : 0;

                // console.log(`PRE-MADE CAKE Percentage: ${preMadePercentage}%`);
                // console.log(`3D CAKE Percentage: ${threeDCakePercentage}%`);


                document.querySelector('.pie-chart-container').style.setProperty('--percentage1', `${preMadePercentage}%`);
                document.querySelector('.pie-chart-container').style.setProperty('--percentage2', `${threeDCakePercentage}%`);


                document.querySelector('#total-orders').textContent = data.total_orders || 0;
                document.querySelector('#pending-orders').textContent = data.pending_orders || 0;
                document.querySelector('#completed-orders').textContent = data.completed_orders || 0;
                document.querySelector('#total-transaction').textContent = `₱${parseFloat(data.total_transaction || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }


    updateData();


    timePeriodDropdown.addEventListener('change', updateData);
});







document.addEventListener('DOMContentLoaded', function () {
    fetchOrders(); // Fetch orders on page load
    fetchRecentOrders(); // Fetch recent orders on page load

    // Set interval to refresh recent orders every 10 seconds (10000 ms)
    setInterval(fetchRecentOrders, 10000);

function fetchOrders() {
    fetch('php/fetch_pickup_orders.php')
        .then(response => response.json())
        .then(orders => {
            const ordersList = document.getElementById('pickup-orders');
            if (!ordersList) {
                console.error('Element with id "pickup-orders" not found.');
                return;
            }

            // Clear the current list
            ordersList.innerHTML = '';

            // Check if the fetched orders is an array
            if (!Array.isArray(orders)) {
                console.error('Expected orders to be an array:', orders);
                return;
            }

            orders.forEach(order => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item');

                // Format the date and time based on the delivery method
                let formattedDate;
                if (order.order_delivery_method === 'pickup') {
                    formattedDate = `${order.order_pickup_date} | ${order.order_pickup_time}`;
                } else {
                    formattedDate = `${order.order_delivery_chosen_date} | ${order.order_delivery_chosen_time}`;
                }

                // Now, just use the processed cake name from the server response
                const cakeName = order.cake_names || 'Unnamed Cake';

                // Set up the list item with order details
                listItem.innerHTML = `
                    <div class="d-flex flex-column w-100">
                        <div class="d-flex justify-content-between align-items-center">
                            <span style="font-weight: bold">${cakeName}</span>
                            <span class="badge ${getStatusClass(order.order_status)}">${order.order_status}</span>
                        </div>
                        <small class="mt-2">${formattedDate}</small>
                    </div>
                    <hr>
                `;

                // Add click event to open modal
                listItem.addEventListener('click', function () {
                    showEditOrderModal(order);
                });

                ordersList.appendChild(listItem);
            });

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}






    function fetchRecentOrders() {
        fetch('php/fetch_recent_orders.php')
            .then(response => response.json())
            .then(orders => {
                const ordersList = document.getElementById('recent-orders-list');
                ordersList.innerHTML = '';

                orders.forEach(order => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';

                    listItem.innerHTML = `
                        <div class="d-flex align-items-center">
                            <img src="${order.cake_image}" alt="Cake Image" class="img-thumbnail me-3" style="width: 80px; height: 80px; object-fit: cover;">
                            <div class="d-flex flex-column w-100">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span style="font-weight: bold">${order.cake_name}</span>
                                    <span class="badge ${getStatusClass(order.order_status)}">${order.order_status}</span>
                                </div>
                                <small class="mt-2">${new Date(order.order_orderdatetime).toLocaleDateString()}</small>
                            </div>
                        </div>
                        <hr>
                    `;

                    ordersList.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Error fetching recent orders:', error);
            });
    }

    function getStatusClass(status) {
        const statusClasses = {
            'PENDING': 'bg-warning text-dark',
            'PREPARING': 'bg-info text-dark',
            'FOR PICK-UP': 'bg-primary text-white',
            'SHIPPED': 'bg-secondary text-white',
            'COMPLETED': 'bg-success text-white',
            'CANCELLED': 'bg-danger text-white'
        };

        return statusClasses[status] || 'bg-danger'; // Default to bg-danger if status not recognized
    }

    function showEditOrderModal(order) {
        currentOrderNo = order.order_no;

        document.getElementById('modalOrderNo').textContent = order.order_no;
        document.getElementById('modalCustomerName').textContent = `${order.user_fname} ${order.user_lname}`;

        // Defensive check for order_user_contact
        const contactInfo = order.order_user_contact || ''; // Fallback to empty string if undefined
        const [email, phone] = contactInfo.split(', ').map(item => item.trim());

        document.getElementById('modalCustomerEmail').textContent = email || 'N/A'; // Add customer email
        document.getElementById('modalCustomerPhone').textContent = phone || 'N/A'; // Add customer phone

        const statusSelect = document.getElementById('modalOrderStatus');

        const statusOptions = [
            { value: 'PENDING', text: 'Pending' },
            { value: 'PREPARING', text: 'Preparing' },
            { value: 'SHIPPED', text: 'Shipped' },
            { value: 'COMPLETED', text: 'Completed' },
            { value: 'CANCELLED', text: 'Cancelled' },
            { value: 'FOR PICK-UP', text: 'For Pick-up' }
        ];

        statusSelect.innerHTML = '';

        statusOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            statusSelect.appendChild(optionElement);
        });

        statusSelect.value = order.order_status;
        
        const modalOrderInfo = document.getElementById('modalOrderInfo');
        let orderInfoHTML = '';
        
        const orderInfoParts = order.order_info ? order.order_info.split(', ') : [];
        
        orderInfoParts.forEach((part) => {
            if (part.includes('Image')) {
                const imagePattern = /(ToppingImage-|SuggestionImage-)(\S+\.(jpg|png))/gi;
                const imageMatches = [...part.matchAll(imagePattern)];
        
                imageMatches.forEach((match) => {
                    const imageName = match[0];
                    let imagePath = '';
        
                    if (match[1] === 'ToppingImage-') {
                        imagePath = 'php/uploads/ToppingImage/' + match[0];
                    } else if (match[1] === 'SuggestionImage-') {
                        imagePath = 'php/uploads/SuggestionImage/' + match[0];
                    }
        
                    orderInfoHTML += `<br><a href="#" class="image-link" data-image-path="${imagePath}" data-image-name="${imageName}">Image: ${imageName}</a>`;
                });
            } else {
                orderInfoHTML += `<br>${part}`;
            }
        });
        
        modalOrderInfo.innerHTML = orderInfoHTML;
        
        document.querySelectorAll('.image-link').forEach((link) => {
            link.addEventListener('click', function (event) {
                event.preventDefault();
        
                const imagePath = this.getAttribute('data-image-path');
                const imageName = this.getAttribute('data-image-name');
        
                const imageModal = document.getElementById('imageModal');
                const modalImage = document.getElementById('modalImage');
                const modalDownloadButton = document.getElementById('modalDownloadButton');
        
                modalImage.src = imagePath;
                modalDownloadButton.href = imagePath;
                modalDownloadButton.download = imageName;
        
                const bootstrapImageModal = new bootstrap.Modal(imageModal);
                bootstrapImageModal.show();
            });
        });


        document.getElementById('modalOrderTotal').textContent = `₱${parseFloat(order.order_cost).toFixed(2)}`;
        document.getElementById('modalDeliveryMethod').textContent = order.order_delivery_method;

        const completionDateElement = document.getElementById('modalCompletionDate');
        const modalCourierRow = document.getElementById('modalCourierRow');
        const modalOrderAddress = document.getElementById('modalOrderAddress');

        if (order.order_delivery_method === 'pickup') {
            // Pickup details
            modalCourierRow.style.display = 'none';
            completionDateElement.textContent = `${order.order_pickup_date} ${order.order_pickup_time || 'Time Not Available'}`;
            modalOrderAddress.textContent = order.order_pickup_address;
        } else {
            // Delivery details
            modalCourierRow.style.display = 'block';
            document.getElementById('modalCourier').textContent = order.order_courier || 'N/A';
            completionDateElement.textContent = `${order.order_delivery_chosen_date} ${order.order_delivery_chosen_time || 'Time Not Available'}`;
            modalOrderAddress.textContent = order.order_address;
        }

        document.getElementById('modalOrderNotes').value = order.order_notes || '';
        
        // Load the image if cake_type is 3D Cake
        const modalOrderImage = document.getElementById('modalOrderImage');
        if (order.cake_type === '3D CAKE') {
            const imagePath = `php/uploads/3DCustom/${order.order_no}.jpg`;
            modalOrderImage.src = imagePath;
            modalOrderImage.style.display = 'block';
            modalOrderImageText.style.display = 'block';// Show the image if cake type is 3D Cake
        } else {
            modalOrderImage.style.display = 'none'; 
            modalOrderImageText.style.display = 'none';// Hide the image if it's not 3D Cake
        }

        const orderDetailsModal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
        orderDetailsModal.show();
        
    }


    document.getElementById('saveOrderStatusBtn').addEventListener('click', function () {
        const newStatus = document.getElementById('modalOrderStatus').value;
        const newNotes = document.getElementById('modalOrderNotes').value;
        const currentDateTime = new Date().toISOString();

        if (!currentOrderNo) {
            console.error('No order selected to update.');
            return;
        }

        const formData = new FormData();
        formData.append('order_no', currentOrderNo);
        formData.append('order_status', newStatus);
        formData.append('order_notes', newNotes);

        if (newStatus === 'COMPLETED') {
            formData.append('order_completed_datetime', currentDateTime);
        }

        fetch('php/update_order_status.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const orderDetailsModal = bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal'));
                    orderDetailsModal.hide();

                    const orderUpdatedModalElement = document.getElementById('orderUpdatedModal');
                    if (orderUpdatedModalElement) {
                        const orderUpdatedModal = new bootstrap.Modal(orderUpdatedModalElement);
                        orderUpdatedModal.show();
                    } else {
                        console.error('Order Updated modal not found in the DOM.');
                    }

                    fetchOrders(); // Refresh the list after updating the order status
                } else if (data.error === 'No changes were made.') {
                    const noChangesModalElement = document.getElementById('noChangesModal');
                    if (noChangesModalElement) {
                        const noChangesModal = new bootstrap.Modal(noChangesModalElement);
                        noChangesModal.show();
                    } else {
                        console.error('No Changes modal not found in the DOM.');
                    }
                } else {
                    console.error('Failed to update order:', data.error);
                }
            })
            .catch(error => {
                console.error('Error updating order:', error);
            });
    });
});




document.addEventListener('DOMContentLoaded', function () {
    fetch('php/fetch_top_selling_cakes.php')
        .then(response => response.json())
        .then(cakes => {
            // console.log('Fetched Cakes:', cakes);

            const tableBody = document.getElementById('top-selling-cakes');
            if (!tableBody) {
                console.error('Element with id "top-selling-cakes" not found.');
                return;
            }


            tableBody.innerHTML = '';

            cakes.forEach(cake => {
                // console.log('Processing Cake:', cake);


                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cake.cake_name}</td>
                    <td>${getCakePrice(cake)}</td>
                    <td class="${cake.cake_availability === 'ACTIVE' ? 'text-success' : 'text-danger'}">${cake.cake_availability}</td>
                    <td>${cake.cake_sold}</td>
                    <td>₱${parseFloat(cake.cake_earning).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                `;


                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

function getCakePrice(cake) {
    let priceRange = '';

    const formatPrice = (price) => 
        price ? `₱${parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';

    if (cake.cake_price_large > 0) {
        if (cake.cake_price_medium > 0) {
            if (cake.cake_price_small > 0) {
                priceRange = `${formatPrice(cake.cake_price_small)} - ${formatPrice(cake.cake_price_large)}`;
            } else {
                priceRange = `${formatPrice(cake.cake_price_medium)} - ${formatPrice(cake.cake_price_large)}`;
            }
        } else {
            if (cake.cake_price_small > 0) {
                priceRange = `${formatPrice(cake.cake_price_small)} - ${formatPrice(cake.cake_price_large)}`;
            } else {
                priceRange = formatPrice(cake.cake_price_large);
            }
        }
    } else {
        if (cake.cake_price_medium > 0) {
            if (cake.cake_price_small > 0) {
                priceRange = `${formatPrice(cake.cake_price_small)} - ${formatPrice(cake.cake_price_medium)}`;
            } else {
                priceRange = formatPrice(cake.cake_price_medium);
            }
        } else {
            if (cake.cake_price_small > 0) {
                priceRange = formatPrice(cake.cake_price_small);
            } else {
                priceRange = formatPrice(cake.cake_baseprice);
            }
        }
    }

    return priceRange;
}

































document.addEventListener('DOMContentLoaded', function () {
    fetchProducts(); // Load all products on initial page load

    // Add event listener for search input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim();
        fetchProducts(searchTerm); // Fetch products based on search term
    });

    // Clean up backdrop on modal show
    const editProductModalElement = document.getElementById('editProductModal');
    const deleteProductModalElement = document.getElementById('deleteProductModal');

    editProductModalElement.addEventListener('show.bs.modal', function () {
        removeBackdrops();
    });

    deleteProductModalElement.addEventListener('show.bs.modal', function () {
        removeBackdrops();
    });

    editProductModalElement.addEventListener('hidden.bs.modal', function () {
        removeBackdrops();
    });

    deleteProductModalElement.addEventListener('hidden.bs.modal', function () {
        removeBackdrops();
    });
});

function removeBackdrops() {
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
}

function fetchProducts(searchTerm = '') {
    // Create the URL with the search term as a query parameter
    const url = `php/fetch_products.php?search=${encodeURIComponent(searchTerm)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(products => {
            const productGrid = document.getElementById('product-grid');
            if (!productGrid) {
                console.error('Element with id "product-grid" not found.');
                return;
            }

            productGrid.innerHTML = ''; // Clear the existing product grid
            products.forEach(product => createProductCard(product, productGrid));
            attachEventListeners(); // Re-attach event listeners to new cards
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}



function createProductCard(product, productGrid) {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
        <img src="${product.cake_image}" alt="${product.cake_name}">
        <div class="product-info">
            <p class="product-name">${product.cake_name}</p>
            <p class="product-price">₱${parseFloat(product.cake_baseprice).toFixed(2)}</p>
        </div>
        <div class="product-actions">
            <button class="edit-button" data-cake-id="${product.cake_id}"><i class="bi bi-pencil-fill"></i></button>
            <button class="delete-button" data-id="${product.cake_id}"><i class="bi bi-trash3-fill"></i></button>
        </div>
    `;
    productGrid.appendChild(card);
}

function attachEventListeners() {
    const productGrid = document.getElementById('product-grid');
    productGrid.addEventListener('click', function (event) {
        const editButton = event.target.closest('.edit-button');
        if (editButton) {
            const cakeId = editButton.getAttribute('data-cake-id');
            fetchProductDetails(cakeId);
        }

        const deleteButton = event.target.closest('.delete-button');
        if (deleteButton) {
            const productId = deleteButton.getAttribute('data-id');
            showDeleteConfirmationModal(productId);
        }
    });
}

function fetchProductDetails(cakeId) {
    fetch(`php/fetch_edit_product.php?id=${cakeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(product => populateEditForm(product))
        .catch(error => {
            console.error('Error fetching product data:', error);
        });
}

function populateEditForm(product) {
    // Populate form fields with product details
    document.getElementById('productId').value = product.cake_id;
    document.getElementById('productName').value = product.cake_name;
    document.getElementById('description').value = product.cake_details;
    document.getElementById('flavor').value = product.cake_flavor;
    document.getElementById('stockQuantity').value = product.cake_stock;
    document.getElementById('cakeAvailability').value = product.cake_availability;

    // Set size checkboxes
    document.getElementById('sizeSmall').checked = product.sizes.includes('Small');
    document.getElementById('sizeMedium').checked = product.sizes.includes('Medium');
    document.getElementById('sizeLarge').checked = product.sizes.includes('Large');

    // Populate cost inputs
    document.getElementById('costSmall').value = product.cake_price_small || '';
    document.getElementById('costMedium').value = product.cake_price_medium || '';
    document.getElementById('costLarge').value = product.cake_price_large || '';

    // Populate categories dropdown
    const categoryDropdown = document.getElementById('categoryDropdown');
    categoryDropdown.innerHTML = '<option selected disabled>Choose...</option>'; // Clear current options
    product.categories.forEach(category => {
        if (category) {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryDropdown.appendChild(option);
        }
    });
    categoryDropdown.value = product.cake_category; // Set current category

    updateCostInputs(); // Update cost inputs based on sizes

    // Show the edit product modal
    const orderDetailsModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    orderDetailsModal.show();
}

function updateCostInputs() {
    // Show or hide cost input fields based on size checkbox selections
    const isSmallChecked = document.getElementById('sizeSmall').checked;
    const isMediumChecked = document.getElementById('sizeMedium').checked;
    const isLargeChecked = document.getElementById('sizeLarge').checked;

    document.getElementById('costSmallContainer').style.display = isSmallChecked ? 'block' : 'none';
    document.getElementById('costMediumContainer').style.display = isMediumChecked ? 'block' : 'none';
    document.getElementById('costLargeContainer').style.display = isLargeChecked ? 'block' : 'none';
}

// Add change event listeners to size checkboxes
document.querySelectorAll('#sizeSmall, #sizeMedium, #sizeLarge').forEach(checkbox => {
    checkbox.addEventListener('change', updateCostInputs);
});

document.getElementById('confirmEdit').addEventListener('click', confirmEdit);

function confirmEdit() {
    const form = document.getElementById('editProductForm');
    const formData = new FormData(form);

    // Log FormData contents for debugging (you can remove this in production)
    console.log('Form Data:', Array.from(formData.entries()));

    // Get the cake_id from the productId input
    const cakeId = document.getElementById('productId').value;
    if (!cakeId) {
        console.error('Error: No cake_id provided');
        alert('Error: No product ID provided');
        return; // Prevent further execution if cakeId is missing
    }

    // Set the cake_id in the formData
    formData.set('cake_id', cakeId);

    // Get category from the text input or dropdown
    const categoryText = document.getElementById('categoryText').value.trim();
    const categoryValue = categoryText || document.getElementById('categoryDropdown').value;
    formData.set('cake_category', categoryValue);

    // Handle sizes and costs
    formData.set('cake_price_small', document.getElementById('sizeSmall').checked ? document.getElementById('costSmall').value : null);
    formData.set('cake_price_medium', document.getElementById('sizeMedium').checked ? document.getElementById('costMedium').value : null);
    formData.set('cake_price_large', document.getElementById('sizeLarge').checked ? document.getElementById('costLarge').value : null);

    // Handle other form fields
    formData.set('cake_name', document.getElementById('productName').value);
    formData.set('cake_details', document.getElementById('description').value);
    formData.set('cake_flavor', document.getElementById('flavor').value);
    formData.set('cake_stock', document.getElementById('stockQuantity').value);
    formData.set('cake_availability', document.getElementById('cakeAvailability').value);

    // Handle the photo upload if a file is selected
    const photoInput = document.getElementById('photo');
    if (photoInput.files.length > 0) {
        formData.set('cake_image', photoInput.files[0]);
    }

    // Fetch to update the product
    fetch('php/update_product.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            // Check if response is ok
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log the response for debugging
            if (data.success) {
                console.log('Product updated successfully!');
                // Close the modal and refresh the product list
                const editProductModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
                if (editProductModal) editProductModal.hide();
                fetchProducts(); // Refresh the product list
            } else {
                console.error('Error updating product:', data.message || data.error);
                alert('Error updating product: ' + (data.message || data.error)); // Display an alert with the error
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('An error occurred: ' + error.message); // Display an alert with the error message
        });
}












function showDeleteConfirmationModal(productId) {
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteProductModal'));

    // Set the confirm button to trigger deletion
    document.getElementById('confirmDeleteButton').onclick = function () {
        deleteProduct(productId);
        deleteModal.hide(); // Hide the modal after confirmation
    };

    deleteModal.show(); // Show the delete confirmation modal
}

function deleteProduct(productId) {
    fetch(`php/delete_product.php?id=${productId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                document.querySelector(`[data-id="${productId}"]`).closest('.product-card').remove();
                alert('Product deleted successfully!');
            } else {
                alert('Failed to delete product.');
            }
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            alert('Error deleting product: ' + error.message);
        });
}





























document.addEventListener('DOMContentLoaded', function () {
    // Add event listener for the Add Product button
    document.querySelector('.add-button').addEventListener('click', function () {
        const addProductModal = new bootstrap.Modal(document.getElementById('addProductModal'));

        // Fetch categories and populate the dropdown
        fetch('php/get_categories.php')
            .then(response => response.json())
            .then(categories => {
                const categoryDropdown = document.getElementById('addCategoryDropdown');
                categoryDropdown.innerHTML = '<option value="" selected disabled>Choose...</option>'; // Clear existing options
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category; // Ensure this corresponds to your database values
                    option.textContent = category;
                    categoryDropdown.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });

        addProductModal.show();
    });

    // Show/hide cost input fields based on checked checkboxes
    document.getElementById('addSizeSmall').addEventListener('change', function () {
        document.getElementById('addCostSmallContainer').style.display = this.checked ? 'block' : 'none';
    });

    document.getElementById('addSizeMedium').addEventListener('change', function () {
        document.getElementById('addCostMediumContainer').style.display = this.checked ? 'block' : 'none';
    });

    document.getElementById('addSizeLarge').addEventListener('change', function () {
        document.getElementById('addCostLargeContainer').style.display = this.checked ? 'block' : 'none';
    });

    // Confirm Add Product action
    document.getElementById('confirmAdd').addEventListener('click', function () {
        const addProductForm = document.getElementById('addProductForm');
        const formData = new FormData(addProductForm);

        // Collect size inputs
        const sizes = [];
        if (document.getElementById('addSizeSmall').checked) {
            sizes.push('Small');
        }
        if (document.getElementById('addSizeMedium').checked) {
            sizes.push('Medium');
        }
        if (document.getElementById('addSizeLarge').checked) {
            sizes.push('Large');
        }

        // Append sizes to FormData
        formData.append('sizes', JSON.stringify(sizes));

        // Handle file input
        const addPhotoInput = document.getElementById('addPhoto');
        if (addPhotoInput.files.length > 0) {
            formData.append('cake_photo', addPhotoInput.files[0]); // Append file to form data
        }

        // Fetch request to send data to the server
        fetch('php/add_product.php', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                // Log the raw response text for debugging
                return response.text().then(text => {
                    console.log('Raw response:', text); // Log the raw response here
                    // Attempt to parse JSON only if the response is valid
                    try {
                        return JSON.parse(text);
                    } catch (e) {
                        throw new Error('Invalid JSON response');
                    }
                });
            })
            .then(result => {
                if (result.success) {
                    alert('Product added successfully!');
                    const addProductModal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
                    addProductModal.hide();
                    addProductForm.reset(); // Reset form fields
                    // Hide cost containers when modal is reset
                    document.getElementById('addCostSmallContainer').style.display = 'none';
                    document.getElementById('addCostMediumContainer').style.display = 'none';
                    document.getElementById('addCostLargeContainer').style.display = 'none';
                } else {
                    alert(result.error || 'Failed to add product.'); // Use result.error for clearer messaging
                }
            })
            .catch(error => {
                // Log detailed error information
                console.error('Error adding product:', error);
                alert('An error occurred while adding the product: ' + error.message);
            });
    });
});

















document.addEventListener('DOMContentLoaded', function () {
    const statusBadgeClass = {
        'PENDING': 'bg-warning text-dark',
        'PREPARING': 'bg-info text-dark',
        'FOR PICK-UP': 'bg-primary text-white',
        'SHIPPED': 'bg-secondary text-white',
        'COMPLETED': 'bg-success text-white',
        'CANCELLED': 'bg-danger text-white'
    };

    let currentOrderNo = null;
    let orderDataTable = null;
    
    const statusFilter = document.getElementById('statusFilter');
    const statusFilter2 = document.getElementById('statusFilter_2');
    
    function syncSelect(event) {
        const source = event.target;
        const target = source === statusFilter ? statusFilter2 : statusFilter;
        target.value = source.value;
        triggerFilter();  
    }
    
    function triggerFilter() {
        const selectedStatus = statusFilter.value;
        fetchOrders(selectedStatus);
    }
    
    statusFilter.addEventListener('change', syncSelect);
    statusFilter2.addEventListener('change', syncSelect);

    let isFiltering = false;

    function fetchOrders(statusFilter = '') {
        const url = `php/fetch_orders_with_details.php`;

        fetch(url)
            .then(response => response.json())
            .then(orders => {
                orders.sort((a, b) => Number(b.order_id) - Number(a.order_id));

                const orderTableBody = document.querySelector('#orderTable tbody');
                if (!orderTableBody) {
                    console.error('Element with id "orderTable" and <tbody> not found.');
                    return;
                }

                orders.forEach(order => {
                    const statusClass = statusBadgeClass[order.order_status] || 'bg-secondary text-white';
                    const orderCost = order.order_discounted_cost && parseFloat(order.order_discounted_cost) > 0
                        ? order.order_discounted_cost
                        : order.order_cost;

                    let completionDate = order.final_date || 'Date Not Available';

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><span class="badge ${statusClass}">${order.order_status}</span></td>
                        <td>${order.order_no}</td>
                        <td>${order.user_fname} ${order.user_lname}</td>
                        <td>${order.order_info}</td>
                        <td>₱${parseFloat(orderCost).toFixed(2)}</td>
                        <td>${completionDate}</td>
                        <td>${order.order_notes || '-'}</td>
                    `;

                    row.setAttribute('data-order-no', order.order_no);

                    row.addEventListener('click', function () {
                        showEditOrderModal(order);
                    });

                    orderTableBody.appendChild(row);
                });
                
                if ($.fn.dataTable.isDataTable('#orderTable')) {
                    orderDataTable.destroy();
                }
                
                $.fn.dataTable.ext.search.length = 0;
                

                $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
                    
                    isFiltering = true;
                    
                    const currentStatus = statusFilter;

                    if (currentStatus && currentStatus !== "") {
                        const status = data[0].trim().toUpperCase(); 
                        if (status !== currentStatus) {
                            isFiltering = false;
                            return false; 
                        }
                    }

                    isFiltering = false;
                    return true;
                });
                
                orderDataTable = $('#orderTable').DataTable({
                    "paging": true,
                    "pagingType": "full_numbers",
                    "searching": true,
                    "ordering": false,
                    "info": false,
                    "lengthChange": false,
                    "pageLength": 15,
                    "dom": '<"top"p>rt<"bottom"fl>',
                    "language": {
                        "search": "",
                        "paginate": {
                            "previous": "Previous",
                            "next": "Next",
                        }
                    },
                    "initComplete": function () {
                        var pagination = $(this).closest('.dataTables_wrapper').find('.dataTables_paginate');
                        $('#orderTablePagination').html(pagination);
                        
                        var orderTableSearchContainer = $(this).closest('.dataTables_wrapper').find('.dataTables_filter');
                        $('#orderTableSearch').html(orderTableSearchContainer);
                        
                        var orderTableSearchInput = orderTableSearchContainer.find('input');
                        orderTableSearchInput.attr('placeholder', 'Search');
                    }
                });

                // orderDataTable.draw();
                
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function showEditOrderModal(order) {
        currentOrderNo = order.order_no;

        document.getElementById('modalOrderNo').textContent = order.order_no;
        document.getElementById('modalCustomerName').textContent = `${order.user_fname} ${order.user_lname}`;

        // Defensive check for order_user_contact
        const contactInfo = order.order_user_contact || ''; // Fallback to empty string if undefined
        const [email, phone] = contactInfo.split(', ').map(item => item.trim());

        document.getElementById('modalCustomerEmail').textContent = email || 'N/A'; // Add customer email
        document.getElementById('modalCustomerPhone').textContent = phone || 'N/A'; // Add customer phone

        const statusSelect = document.getElementById('modalOrderStatus');

        const statusOptions = [
            { value: 'PENDING', text: 'Pending' },
            { value: 'PREPARING', text: 'Preparing' },
            { value: 'SHIPPED', text: 'Shipped' },
            { value: 'COMPLETED', text: 'Completed' },
            { value: 'CANCELLED', text: 'Cancelled' },
            { value: 'FOR PICK-UP', text: 'For Pick-up' }
        ];

        statusSelect.innerHTML = '';

        statusOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            statusSelect.appendChild(optionElement);
        });

        statusSelect.value = order.order_status;
        const modalOrderInfo = document.getElementById('modalOrderInfo');
        let orderInfoHTML = '';
        
        const orderInfoParts = order.order_info ? order.order_info.split(', ') : [];
        
        orderInfoParts.forEach((part) => {
            if (part.includes('Image')) {
                const imagePattern = /(ToppingImage-|SuggestionImage-)(\S+\.(jpg|png))/gi;
                const imageMatches = [...part.matchAll(imagePattern)];
        
                imageMatches.forEach((match) => {
                    const imageName = match[0];
                    let imagePath = '';
        
                    if (match[1] === 'ToppingImage-') {
                        imagePath = 'php/uploads/ToppingImage/' + match[0];
                    } else if (match[1] === 'SuggestionImage-') {
                        imagePath = 'php/uploads/SuggestionImage/' + match[0];
                    }
        
                    orderInfoHTML += `<br><a href="#" class="image-link" data-image-path="${imagePath}" data-image-name="${imageName}">Image: ${imageName}</a>`;
                });
            } else {
                orderInfoHTML += `<br>${part}`;
            }
        });
        
        modalOrderInfo.innerHTML = orderInfoHTML;
        
        document.querySelectorAll('.image-link').forEach((link) => {
            link.addEventListener('click', function (event) {
                event.preventDefault();
        
                const imagePath = this.getAttribute('data-image-path');
                const imageName = this.getAttribute('data-image-name');
        
                const imageModal = document.getElementById('imageModal');
                const modalImage = document.getElementById('modalImage');
                const modalDownloadButton = document.getElementById('modalDownloadButton');
        
                modalImage.src = imagePath;
                modalDownloadButton.href = imagePath;
                modalDownloadButton.download = imageName;
        
                const bootstrapImageModal = new bootstrap.Modal(imageModal);
                bootstrapImageModal.show();
            });
        });
        
        document.getElementById('modalOrderTotal').textContent = `₱${parseFloat(order.order_cost).toFixed(2)}`;
        document.getElementById('modalDeliveryMethod').textContent = order.order_delivery_method;

        const completionDateElement = document.getElementById('modalCompletionDate');
        const modalCourierRow = document.getElementById('modalCourierRow');
        const modalOrderAddress = document.getElementById('modalOrderAddress');

        if (order.order_delivery_method === 'pickup') {
            // Pickup details
            modalCourierRow.style.display = 'none';
            completionDateElement.textContent = `${order.order_pickup_date} ${order.order_pickup_time || 'Time Not Available'}`;
            modalOrderAddress.textContent = order.order_pickup_address;
        } else {
            // Delivery details
            modalCourierRow.style.display = 'block';
            document.getElementById('modalCourier').textContent = order.order_courier || 'N/A';
            completionDateElement.textContent = `${order.order_delivery_chosen_date} ${order.order_delivery_chosen_time || 'Time Not Available'}`;
            modalOrderAddress.textContent = order.order_address;
        }

        document.getElementById('modalOrderNotes').value = order.order_notes || '';
        
        // Load the image if cake_type is 3D Cake
        const modalOrderImage = document.getElementById('modalOrderImage');
        if (order.cake_type === '3D CAKE') {
            const imagePath = `php/uploads/3DCustom/${order.order_no}.jpg`;
            modalOrderImage.src = imagePath;
            modalOrderImage.style.display = 'block';
            modalOrderImageText.style.display = 'block';// Show the image if cake type is 3D Cake
        } else {
            modalOrderImage.style.display = 'none'; 
            modalOrderImageText.style.display = 'none';// Hide the image if it's not 3D Cake
        }

        const orderDetailsModal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
        orderDetailsModal.show();
    }

    document.getElementById('saveOrderStatusBtn').addEventListener('click', function () {
        const newStatus = document.getElementById('modalOrderStatus').value;
        const newNotes = document.getElementById('modalOrderNotes').value;
        const currentDateTime = new Date().toISOString();

        if (!currentOrderNo) {
            console.error('No order selected to update.');
            return;
        }

        const formData = new FormData();
        formData.append('order_no', currentOrderNo);
        formData.append('order_status', newStatus);
        formData.append('order_notes', newNotes);

        if (newStatus === 'COMPLETED') {
            formData.append('order_completed_datetime', currentDateTime);
        }

        fetch('php/update_order_status.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const orderDetailsModal = bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal'));
                    orderDetailsModal.hide();

                    const orderUpdatedModalElement = document.getElementById('orderUpdatedModal');
                    if (orderUpdatedModalElement) {
                        const orderUpdatedModal = new bootstrap.Modal(orderUpdatedModalElement);
                        orderUpdatedModal.show();
                    } else {
                        console.error('Order Updated modal not found in the DOM.');
                    }

                    fetchOrders();
                } else if (data.error === 'No changes were made.') {
                    const noChangesModalElement = document.getElementById('noChangesModal');
                    if (noChangesModalElement) {
                        const noChangesModal = new bootstrap.Modal(noChangesModalElement);
                        noChangesModal.show();
                    } else {
                        console.error('No Changes modal not found in the DOM.');
                    }
                } else {
                    console.error('Failed to update order:', data.error);
                }
            })
            .catch(error => {
                console.error('Error updating order:', error);
            });
    });


    fetchOrders();
});










































































document.getElementById('showPaymentProofBtn').addEventListener('click', function () {
    const orderNo = document.getElementById('modalOrderNo').textContent;

    fetch(`php/fetch_payment_proof.php?order_no=${orderNo}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const proofModal = new bootstrap.Modal(document.getElementById('paymentProofModal'), {
                    backdrop: 'static',
                    keyboard: false
                });
                document.getElementById('paymentProofImage').src = `php/${data.payment_proof}`;

                proofModal.show();
            } else {
                console.error('No payment proof found for this order.');
            }
        })
        .catch(error => {
            console.error('Error fetching payment proof:', error);
        });
});


// document.getElementById('showProofBtn').addEventListener('click', function() {
//     const orderId = document.getElementById('invoice-order-no').textContent; // Fetch the order_no and trim whitespace



//         fetch(`php/fetch_payment_proof.php?order_id=${encodeURIComponent(orderId)}`)
//             .then(response => response.json())
//             .then(data => {
//                 if (data.success) {
//                     // Open a modal or display the proof image in a lightbox
//                     const proofImage = data.payment_proof; // URL or path to the proof image
//                     const proofModalContent = `
//                         <div class="modal fade" id="paymentProofModal" tabindex="-1" aria-labelledby="paymentProofModalLabel" aria-hidden="true">
//                             <div class="modal-dialog">
//                                 <div class="modal-content">
//                                     <div class="modal-header">
//                                         <h5 class="modal-title" id="paymentProofModalLabel">Payment Proof</h5>
//                                         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                                     </div>
//                                     <div class="modal-body text-center">
//                                         <img src="${proofImage}" alt="Payment Proof" class="img-fluid">
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     `;

//                     document.body.insertAdjacentHTML('beforeend', proofModalContent);
//                     new bootstrap.Modal(document.getElementById('paymentProofModal')).show();
//                 } else {
//                     console.error('Error fetching payment proof: ', data.message);
//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching payment proof: ', error);
//             });
// });



document.getElementById('showProofBtn').addEventListener('click', function () {
    const orderNo = document.getElementById('invoice-order-no').textContent.trim();

    fetch(`php/fetch_payment_proof.php?order_no=${encodeURIComponent(orderNo)}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {

                document.getElementById('paymentProofImage').src = `php/${data.payment_proof}`;


                const proofModal = new bootstrap.Modal(document.getElementById('paymentProofModal'), {
                    backdrop: 'static',
                    keyboard: false
                });

                document.getElementById('paymentProofModal').style.zIndex = '1060';

                proofModal.show();
            } else {
                console.error('No payment proof found for this order.');
            }
        })
        .catch(error => {
            console.error('Error fetching payment proof:', error);
        });
});























const statusBadgeClass = {
    'COMPLETED': 'success',
    'CANCELLED': 'danger'
};

const filterButton = document.getElementById('filterButton');
const filterButton2 = document.getElementById('filterButton_2');

let orderDataTableComplete = null;
let isFiltering = false;

function filterOrders(status) {
    
    filterButton.textContent = status;
    filterButton2.textContent = status;
    
    fetch(`php/fetch_orders_complete.php`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(orders => {
            const orderTableComplete = document.getElementById('orderTableComplete').getElementsByTagName('tbody')[0];
            orderTableComplete.innerHTML = "";
            
            orders.forEach(order => {
                const statusClass = statusBadgeClass[order.order_status] || 'secondary';
                const finalPrice = (parseFloat(order.order_discounted_cost) > 0 && !isNaN(order.order_discounted_cost))
                    ? parseFloat(order.order_discounted_cost).toFixed(2)
                    : parseFloat(order.order_cost).toFixed(2);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><span class="badge bg-${statusClass} text-white">${order.order_status}</span></td>
                    <td>${order.order_no}</td>
                    <td>${order.user_fname} ${order.user_lname}</td>
                    <td>${order.order_info}</td>
                    <td>₱${finalPrice}</td>
                    <td>${new Date(order.order_completed_datetime).toLocaleDateString()}</td>
                    <td>${order.order_notes || '-'}</td>
                `;

                row.addEventListener('click', () => {
                    showInvoiceModal(order.order_no);
                });

                orderTableComplete.appendChild(row);
            });
            
            if ($.fn.dataTable.isDataTable('#orderTableComplete')) {
                orderDataTableComplete.destroy();
            }
            
            $.fn.dataTable.ext.search.length = 0;
            
            $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
                    
                isFiltering = true;
                
                const currentStatus = status;
                
                if (currentStatus === "ALL" || currentStatus === "") {
                    return true; 
                }

                const rowStatus = data[0].trim().toUpperCase(); 
                if (rowStatus !== currentStatus) {
                    isFiltering = false;
                    return false;
                }

                isFiltering = false;
                return true;
            });
            
            orderDataTableComplete = $('#orderTableComplete').DataTable({
                "paging": true,
                "pagingType": "full_numbers",
                "searching": true,
                "ordering": false,
                "info": false,
                "lengthChange": false,
                "pageLength": 15,
                "dom": '<"top"p>rt<"bottom"fl>',
                "language": {
                    "search": "",
                    "paginate": {
                        "previous": "Previous",
                        "next": "Next",
                    }
                },
                "initComplete": function () {
                    var pagination = $(this).closest('.dataTables_wrapper').find('.dataTables_paginate');
                    $('#orderTableCompletePagination').html(pagination);
                    
                    var orderTableCompleteSearchContainer = $(this).closest('.dataTables_wrapper').find('.dataTables_filter');
                    $('#orderTableCompleteSearch').html(orderTableCompleteSearchContainer);
                    
                    var orderTableCompleteSearchInput = orderTableCompleteSearchContainer.find('input');
                    orderTableCompleteSearchInput.attr('placeholder', 'Search');
                }
            });

            // orderDataTableComplete.draw();
        })
        .catch(error => console.error('Error fetching data:', error));
}


document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (event) => {
        const status = event.target.textContent;
        filterOrders(status); 
    });
});

filterOrders('ALL');















































































function showInvoiceModal(orderNo) {
    console.log(`Fetching details for order number: ${orderNo}`);

    fetch(`php/fetch_order_details_for_invoice.php?order_no=${orderNo}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (!data.error) {
                const orderNoEl = document.getElementById('invoice-order-no');
                const userInfoEl = document.getElementById('invoice-user-info');
                const userContactNumberEl = document.getElementById('invoice-user-contact-number');
                const userContactEmailEl = document.getElementById('invoice-user-contact-email');
                const invoiceProductsBody = document.getElementById('invoice-products');
                const invoiceAddressEl = document.getElementById('invoice-address');
                const invoiceSubtotalEl = document.getElementById('invoice-subtotal');
                const invoiceDiscountEl = document.getElementById('invoice-discount');
                const invoiceTotalEl = document.getElementById('invoice-total');
                const invoicePaymentMethodEl = document.getElementById('invoice-payment-method');

                orderNoEl.innerText = data.order_no;
                userInfoEl.innerText = data.user_info;

                const userContacts = data.order_user_contact.split(', ');
                userContactEmailEl.innerText = userContacts[0] || "N/A";
                userContactNumberEl.innerText = userContacts[1] || "N/A";

                invoiceAddressEl.innerText =
                    data.order_delivery_method === "pickup" ? data.order_pickup_address : data.order_address;

                invoiceProductsBody.innerHTML = "";
                let subtotal = 0;

                const products = data.order_info.split(', ');

                for (let i = 0; i < products.length; i += 3) {
                    const cakeName = products[i].trim();
                    const cakeSize = products[i + 1].trim();
                    const quantity = parseInt(products[i + 2].trim(), 10);

                    if (isNaN(quantity) || quantity <= 0) {
                        console.error('Invalid quantity for product:', cakeName);
                        continue;
                    }

                    const cakeId = data.cake_ids.split(',')[i / 3].trim();

                    fetch(`php/get_cake_details.php?id=${cakeId}`)
                        .then(response => response.json())
                        .then(cakeData => {
                            if (!cakeData) {
                                console.error('No cake data found for ID:', cakeId);
                                return;
                            }

                            let unitPrice = 0;

                            if (cakeSize.includes("6 inch")) {
                                unitPrice = parseFloat(cakeData.cake_price_small) || 0;
                            } else if (cakeSize.includes("7 inch")) {
                                unitPrice = parseFloat(cakeData.cake_price_medium) || 0;
                            } else if (cakeSize.includes("8 inch")) {
                                unitPrice = parseFloat(cakeData.cake_price_large) || 0;
                            }

                            const totalPrice = unitPrice * quantity;
                            subtotal += totalPrice;

                            const row = `
                                <tr>
                                    <td>${cakeName} (${cakeSize})</td>
                                    <td>${quantity}</td>
                                    <td>₱${unitPrice.toFixed(2)}</td>
                                    <td>₱${totalPrice.toFixed(2)}</td>
                                </tr>
                            `;
                            invoiceProductsBody.insertAdjacentHTML('beforeend', row);

                            invoiceSubtotalEl.innerText = `₱${subtotal.toFixed(2)}`;

                            if (i + 3 >= products.length) {
                                let discount = 0;
                                if (data.order_discounted_cost && parseFloat(data.order_discounted_cost) > 0) {
                                    discount = parseFloat(data.order_cost) - parseFloat(data.order_discounted_cost);
                                } else {
                                    discount = 0;
                                }

                                invoiceDiscountEl.innerText = `₱${discount.toFixed(2)}`;


                                const total = parseFloat(data.order_discounted_cost) || parseFloat(data.order_cost) || 0;
                                invoiceTotalEl.innerText = `₱${total.toFixed(2)}`;
                            }
                        })
                        .catch(err => console.error('Error fetching cake details for ID:', cakeId, 'Error:', err));
                }

                invoicePaymentMethodEl.innerText = data.order_payment_method.toUpperCase();

                const invoiceModal = new bootstrap.Modal(document.getElementById('invoice-invoiceModal'));
                invoiceModal.show();
            } else {
                console.error(data.error);
            }
        })
        .catch(error => console.error('Error fetching order details:', error));
}



function exportInvoice() {
    const invoiceContainer = document.querySelector('.invoice-invoice-container');

    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.width = '600px';
    tempDiv.style.height = 'auto';
    tempDiv.style.overflow = 'hidden';
    tempDiv.style.backgroundColor = '#ffffff';

    const clonedInvoice = invoiceContainer.cloneNode(true);
    tempDiv.appendChild(clonedInvoice);
    document.body.appendChild(tempDiv);

    html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `invoice-${document.getElementById('invoice-order-no').innerText}.png`;
        link.click();
    }).catch(err => {
        console.error('Error exporting invoice:', err);
    }).finally(() => {
        document.body.removeChild(tempDiv);
    });
}



function printInvoice() {
    const modalBody = document.querySelector('#invoice-invoiceModal .modal-body');

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>Print Invoice</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"> <!-- Include Bootstrap CSS -->
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
                .invoice-invoice-container {
                    border: 2px solid #f55f90;
                    padding: 15px;
                    border-radius: 10px;
                    max-width: 100%;
                    margin: 10px auto;
                }

                .invoice-invoice-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .invoice-invoice-header img {
                    width: 120px; /* Reduced logo size */
                }

                .invoice-invoice-title {
                    font-weight: bold;
                    color: #f55f90;
                    font-size: 1.5rem; /* Adjusted title font size */
                }

                .invoice-table-responsive {
                    overflow-x: auto; /* Allows horizontal scrolling */
                    -webkit-overflow-scrolling: touch; /* Enables smooth scrolling on iOS */
                    margin-top: 10px;
                }

                .invoice-invoice-table {
                    width: 100%; /* Ensure table takes full width */
                    border-top: 2px solid #f55f90;
                }

                .invoice-table td,
                .invoice-table th {
                    vertical-align: middle;
                    padding: 8px; /* Adjusted padding in table cells */
                }

                .invoice-table th {
                    background-color: #f5f5f5;
                    text-align: center; /* Center align header text */
                }

                .invoice-total-row {
                    font-weight: bold;
                }

                .invoice-thank-you {
                    margin-top: 20px;
                    color: #f55f90;
                    font-weight: bold;
                    font-size: 1.2rem; /* Adjusted font size */
                    text-align: center; /* Center align thank you message */
                }

                .invoice-footer {
                    text-align: center;
                    margin-top: 10px;
                    font-size: 0.9rem; /* Smaller font size */
                }
            </style>
        </head>
        <body onload="window.print(); window.close();">
            <div class="container">
                ${modalBody.innerHTML} <!-- Print only the modal body -->
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
}


document.getElementById('exportInvoiceButton').addEventListener('click', exportInvoice);
document.getElementById('printInvoiceButton').addEventListener('click', printInvoice);



























document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#reviewsTable tbody');
    const reviewDetailsModal = new bootstrap.Modal(document.getElementById('reviewDetailsModal'));
    const deleteReviewModal = new bootstrap.Modal(document.getElementById('deleteReviewModal'));
    let reviews = [];
    let orderNoToDelete = null;
    
    let selectedStarStatus = "all";
    let reviewsDataTable = null;
    
    const starFilter = document.getElementById('starFilter');
    const starFilter2 = document.getElementById('starFilter2');
    
    function syncStarSelect(event) {
        const source = event.target;
        const target = source === starFilter ? starFilter2 : starFilter;
        target.value = source.value;
        triggerStarFilter();  
    }
    
    function triggerStarFilter() {
        const selectedStarStatus = starFilter.value;
        populateTable(reviews, selectedStarStatus);
    }
    
    starFilter.addEventListener('change', syncStarSelect);
    starFilter2.addEventListener('change', syncStarSelect);

    fetch('php/fetch_reviews.php')
        .then(response => response.json())
        .then(data => {
            reviews = data;
            populateTable(data);
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
        });

    function getInitials(name) {
        const names = name.split(' ');
        return names.length === 1
            ? names[0].charAt(0).toUpperCase()
            : `${names[0].charAt(0).toUpperCase()}${names[names.length - 1].charAt(0).toUpperCase()}`;
    }

    function populateTable(reviews, selectedStarStatus) {
        let tableRows = reviews.length === 0
            ? '<tr><td colspan="6" class="text-center">No reviews found.</td></tr>'
            : reviews.map(review => `
                <tr data-order-no="${review.order_no}" data-star-rating="${review.order_rating}">
                    <td>${review.order_no}</td>
                    <td>${review.cake_names}</td>
                    <td>${getInitials(review.user_name)}</td>
                    <td>
                        <span class="stars">${getStarIcons(review.order_rating)}</span>
                        <p class="review-text">${review.review_review}</p>
                    </td>
                    <td>${new Date(review.review_datetime).toLocaleString()}</td>
                    <td>
                        <div class="d-flex align-items-center" style="gap: 5px">
                            <div class="form-check form-switch" style="margin-top: 0; margin-bottom: 0; vertical-align: middle;">
                                <input 
                                    class="form-check-input toggle-review" 
                                    type="checkbox" 
                                    ${(review.review_show === 1) ? 'checked' : ''}>
                            </div>
                            <i class="fas fa-trash text-danger delete-review" style="vertical-align: middle;"></i>
                        </div>
                    </td>
                </tr>
            `).join('');
    
        tableBody.innerHTML = tableRows;
    
        tableBody.querySelectorAll('tr').forEach(row => {
            row.addEventListener('click', function () {
                const orderNo = this.getAttribute('data-order-no');
                const review = reviews.find(r => r.order_no === orderNo);
        
                if (review) {
                    document.getElementById('modalTransactionId').textContent = review.order_no;
                    document.getElementById('modalProductName').textContent = review.cake_names;
                    document.getElementById('modalUserName').textContent = getInitials(review.user_name);
                    document.getElementById('modalReview').textContent = review.review_review;
                    document.getElementById('modalRating').innerHTML = getStarIcons(review.order_rating);
                    document.getElementById('modalReviewDate').textContent = new Date(review.review_datetime).toLocaleString();
    
                    // Check if review image exists
                    const reviewImage = review.review_images ? `php/${review.review_images}` : '';
                    
                    // Log the image path for debugging
                    console.log("Review Image Path: ", reviewImage);
    
                    // If there's no review image, hide the "View Review Image" button
                    const viewImageButton = document.querySelector('.btn-primary[data-bs-toggle="modal"]');
                    if (!reviewImage) {
                        viewImageButton.style.display = 'none'; // Hide button if no image
                    } else {
                        viewImageButton.style.display = 'inline-block'; // Show button if image exists
                        document.getElementById('modalReviewImage').src = reviewImage; // Set the review image path
                    }
    
                    // Show the modal using Bootstrap Modal API
                    const reviewDetailsModal = new bootstrap.Modal(document.getElementById('reviewDetailsModal'));
                    reviewDetailsModal.show();
                }
            });
        });
    
        // Other event listeners for toggle review and delete review
        document.querySelectorAll('.toggle-review').forEach(toggle => {
            toggle.addEventListener('click', function (event) {
                event.stopPropagation();
                const row = this.closest('tr');
                const orderNo = row.getAttribute('data-order-no');
                const isChecked = this.checked;
    
                fetch('php/update_review_show.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        order_no: orderNo,
                        review_show: isChecked ? 1 : 0
                    })
                })
                .then(response => response.json())
                .then(result => {
                    if (!result.success) {
                        alert('Failed to update review visibility.');
                        this.checked = !isChecked;
                    }
                })
                .catch(error => {
                    console.error('Error toggling review visibility:', error);
                    this.checked = !isChecked;
                });
            });
        });
    
        document.querySelectorAll('.delete-review').forEach(icon => {
            icon.addEventListener('click', function (event) {
                event.stopPropagation();
                const row = this.closest('tr');
                const orderNoToDelete = row.getAttribute('data-order-no');
                deleteReviewModal.show();
            });
        });
        
        if ($.fn.dataTable.isDataTable('#reviewsTable')) {
            reviewsDataTable.destroy();
        }
        
        $.fn.dataTable.ext.search.length = 0;
        
        $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
            
            const row = $(settings.aoData[dataIndex].nTr);
            const rowStarRating = row.data('star-rating');
            
            if (selectedStarStatus === "all" || selectedStarStatus === "" || selectedStarStatus === undefined) {
                return true;
            }
        
            if (rowStarRating != selectedStarStatus) {
                return false; 
            }

            return true;
        });
        
         reviewsDataTable = $('#reviewsTable').DataTable({
            "paging": true,
            "pagingType": "full_numbers",
            "searching": true,
            "ordering": false,
            "info": false,
            "lengthChange": false,
            "pageLength": 15,
            "dom": '<"top"p>rt<"bottom"fl>', 
            "language": {
                "search": "",
                "paginate": {
                    "previous": "Previous",
                    "next": "Next",
                }
            },
            "initComplete": function () {
                var pagination = $(this).closest('.dataTables_wrapper').find('.dataTables_paginate');
                $('#reviewsPagination').html(pagination);
                
                var reviewsTableSearchContainer = $(this).closest('.dataTables_wrapper').find('.dataTables_filter');
                $('#reviewsTableSearch').html(reviewsTableSearchContainer);
                
                var reviewsTableSearchInput = reviewsTableSearchContainer.find('input');
                reviewsTableSearchInput.attr('placeholder', 'Search');
            }
        }); 
    }
    
    
    document.getElementById('confirmDelete').addEventListener('click', function () {
        if (orderNoToDelete) {
            fetch('php/delete_review.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ order_no: orderNoToDelete })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        const rowToDelete = document.querySelector(`tr[data-order-no="${orderNoToDelete}"]`);
                        rowToDelete.remove();
                        deleteReviewModal.hide();
                    } else {
                        alert('Failed to delete the review.');
                    }
                })
                .catch(error => {
                    console.error('Error deleting review:', error);
                });
        }
    });

    function exportReviewsToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape');
        doc.setFontSize(16);
        doc.text("Reviews", 10, 10); 
    
        doc.autoTable({
            startY: 20,
            head: [['Transaction ID', 'Product', 'User', 'Review', 'Rating', 'Date']],
            body: Array.from(tableBody.querySelectorAll('tr')).map(row => {
                const columns = row.querySelectorAll('td');
                const reviewText = columns[3].querySelector('.review-text')?.innerText || '';
                const rating = columns[3].querySelector('.stars') ? columns[3].querySelector('.stars').innerHTML.match(/bi-star-fill/g)?.length || 0 : 0;
                const starRating = convertRatingToAsterisks(rating);
    
                const nameParts = columns[2].innerText.split(' ');
                const initialFname = nameParts[0].charAt(0);
                const maskedLname = nameParts.length > 1 ? maskString(nameParts[1], 1) : '';
    
                return [
                    columns[0].innerText,
                    columns[1].innerText,
                    `${initialFname} ${maskedLname}`,
                    reviewText,
                    starRating,
                    columns[4].innerText
                ];
            })
        });
    
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const timeStr = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
        const fileName = `Reviews-${dateStr}-${timeStr}.pdf`;
        doc.save(fileName);
    }
    
    document.getElementById('exportReviewBtn').addEventListener('click', exportReviewsToPDF);
    document.getElementById('exportReviewBtn_2').addEventListener('click', exportReviewsToPDF);


    function getStarIcons(rating) {
        const fullStars = 'bi bi-star-fill';
        const emptyStars = 'bi bi-star';
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += `<i class="${rating > i ? fullStars : emptyStars}"></i>`;
        }
        return stars;
    }

    function convertRatingToAsterisks(rating) {
        return '*'.repeat(rating) + ' '.repeat(5 - rating);
    }

    function maskString(str, visibleChars) {
        if (str.length <= visibleChars) {
            return str;
        }
        return str.charAt(0) + '*'.repeat(str.length - 1);
    }
});













document.addEventListener('DOMContentLoaded', function () {
    fetchActivePromos();
});

function fetchActivePromos() {
    fetch('php/fetch_active_promos.php')
        .then(response => response.json())
        .then(data => {
            const promoList = document.querySelector('.promo-list');
            promoList.innerHTML = '';

            if (data.length > 0) {
                data.forEach(promo => {
                    const promoItem = document.createElement('div');
                    promoItem.classList.add('mb-2');
                    promoItem.innerHTML = `
                        <p class="mb-1">${promo.promo_name}</p>
                        <small class="text-muted">Expiration Date: ${promo.promo_expiration}</small>
                        <span class="badge bg-success float-end">${promo.promo_status}</span>
                     <hr>`;
                    promoList.appendChild(promoItem);
                });
            } else {
                promoList.innerHTML = '<p class="text-center">No active promos available.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching promos:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {

    fetch('php/fetch_expired_promos.php')
        .then(response => response.json())
        .then(data => {
            let promoList = document.querySelector('.promo-expired-list');
            promoList.innerHTML = '';

            data.forEach(promo => {
                let promoItem = `
                    <div class="mb-2">
                        <p class="mb-1">${promo.promo_name}</p>
                        <small class="text-muted">Expiration Date: ${promo.promo_expiration}</small>
                        <span class="badge bg-danger float-end">Expired</span>
                    </div>
                    <hr>`;
                promoList.insertAdjacentHTML('beforeend', promoItem);
            });
        })
        .catch(error => console.error('Error fetching expired promos:', error));
});







document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('editAdminForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(this);

        fetch('php/update_admin_info.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {

                    const successAdminModal = new bootstrap.Modal(document.getElementById('successAdminModal'));
                    successAdminModal.show();


                    successAdminModal._element.addEventListener('hidden.bs.modal', () => {
                        window.location.reload();
                    });


                    const editAdminModal = bootstrap.Modal.getInstance(document.getElementById('editAdminModal'));
                    if (editAdminModal) {
                        editAdminModal.hide();
                    }
                } else {
                    alert('Failed to update admin information: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error updating admin information:', error);
            });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    let promoTableBody = document.querySelector('#promo-table-body');
    let filterButtons = document.querySelectorAll('.filter-btn');
    let promoStatusUpdateModal = document.getElementById('promoStatusUpdateModal');
    let promoStatusUpdateForm = document.getElementById('promoStatusUpdateForm');
    let promoStatusUpdateModalInstance = new bootstrap.Modal(promoStatusUpdateModal);

    let editPromoSuccessModal = document.getElementById('editPromoSuccessModal');
    let editPromoSuccessModalInstance = new bootstrap.Modal(editPromoSuccessModal);
    
    let promoDataTable = null;
    let currentFilter = 'all';
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            fetchAndDisplayPromos(currentFilter);
        });
    });

    function fetchAndDisplayPromos(filter) {
        fetch(`php/fetch_promos.php`)
            .then(response => response.json())
            .then(data => {
                promoTableBody.innerHTML = '';

                data.forEach(promo => {
                    let isExpired = promo.promo_status.includes('EXPIRED');
                    let badgeClass = '';
                    if (promo.promo_status.includes('PUBLIC')) {
                        badgeClass = isExpired ? 'bg-danger' : 'bg-success';
                    } else if (promo.promo_status.includes('PRIVATE')) {
                        badgeClass = isExpired ? 'bg-danger' : 'bg-secondary';
                    } else {
                        badgeClass = 'bg-light';
                    }

                    let promoRow = `
                        <tr>
                            <td><span class="badge ${badgeClass}">${promo.promo_status}</span></td>
                            <td>${promo.promo_id}</td>
                            <td>${promo.promo_name}</td>
                            <td><a href="#" class="text-decoration-none text-primary">${promo.promo_code}</a></td>
                            <td>${promo.discount_description}</td>
                            <td>₱${promo.promo_minimum_spend}</td>
                            <td>${new Date(promo.promo_expiration).toLocaleDateString()}</td>
                            <td>${promo.cake_names.join(', ')}</td> <!-- Display cake names here -->
                            <td>
                                <a href="#" class="btn-edit-promo me-2 text-center" style="background-color: #CB3473; display: inline-flex; align-items: center; justify-content: center; width:25px; height:25px; color: white !important; border: none; text-decoration: none; padding: 5px; border-radius: 5px;" data-promo-id="${promo.promo_id}">
                                    <i class="bi bi-pencil-square" ></i>
                                </a>
                                <!--<a href="#" class="btn-delete-promo" style="color: #d93636;" data-promo-id="${promo.promo_id}">
                                    <i class="bi bi-trash"></i>-->
                                </a>
                            </td>
                        </tr>`;
                    promoTableBody.insertAdjacentHTML('beforeend', promoRow);
                });
                
                if ($.fn.dataTable.isDataTable('#promoTable')) {
                    promoDataTable.destroy();
                }
                
                $.fn.dataTable.ext.search.length = 0;
                
                $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
                    let promoStatus = data[0];
                    let promoExpiration = new Date(data[6]);
                    
                    if (filter === 'public' && promoStatus.includes('PUBLIC')) {
                        return true;
                    }
                    
                    if (filter === 'private' && promoStatus.includes('PRIVATE')) {
                        return true;
                    }
                    
                    if (filter === 'active' && promoExpiration >= new Date()) {
                        return true;
                    }
                    
                    if (filter === 'expired' && promoExpiration < new Date()) {
                        return true;
                    }
                    
                    if (filter === 'all') {
                        return true; 
                    }
            
                });
                
                promoDataTable = $('#promoTable').DataTable({
                    "paging": true,
                    "pagingType": "full_numbers",
                    "searching": true,
                    "ordering": false,
                    "info": false,
                    "lengthChange": false,
                    "pageLength": 15,
                    "lengthMenu": [10, 25, 50, 100],
                    "dom": '<"top"p>rt<"bottom"fl>', 
                    "language": {
                        "search": "",
                        "paginate": {
                            "previous": "Previous",
                            "next": "Next",
                        }
                    },
                    "initComplete": function () {
                        var pagination = $(this).closest('.dataTables_wrapper').find('.dataTables_paginate');
                        $('#promoPagination').html(pagination);
                        
                        var promoTableSearchContainer = $(this).closest('.dataTables_wrapper').find('.dataTables_filter');
                        $('#promoTableSearch').html(promoTableSearchContainer);
                        
                        var promoTableSearchInput = promoTableSearchContainer.find('input');
                        promoTableSearchInput.attr('placeholder', 'Search');
                    }
                }); 


                document.querySelectorAll('.btn-edit-promo').forEach(button => {
                    button.addEventListener('click', function (event) {
                        event.preventDefault();
                        const promoId = this.getAttribute('data-promo-id');


                        fetch(`php/get_promo_details.php?promo_id=${promoId}`)
                            .then(response => response.json())
                            .then(data => {
                                // console.log('Fetched promo details:', data);
                                if (data.error) {
                                    console.error('Error fetching promo details:', data.error);
                                } else {

                                    document.getElementById('promoEditName').innerText = data.promo_name;
                                    document.getElementById('promoEditCode').innerText = data.promo_code;
                                    const promoEditStatusSelect = document.getElementById('promoEditStatus');
                                    promoEditStatusSelect.value = data.promo_status;
                                    document.getElementById('promoIdForUpdate').value = promoId;
                                    promoStatusUpdateModalInstance.show();
                                }
                            })
                            .catch(error => console.error('Error fetching promo details:', error));

                    });
                });
            })
            .catch(error => console.error('Error fetching promos:', error));
    }


    promoStatusUpdateForm.addEventListener('submit', function (event) {
        event.preventDefault();

        let formData = new FormData(this);
        fetch('php/update_promo_status.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(responseText => {
                if (responseText.includes('Promo status updated successfully')) {

                    editPromoSuccessModalInstance.show();
                    fetchAndDisplayPromos('all');
                    promoStatusUpdateModalInstance.hide();
                } else {

                    alert('Error updating promo status: ' + responseText);
                }
            })
            .catch(error => console.error('Error updating promo status:', error));
    });

    fetchAndDisplayPromos('all');
});




document.addEventListener('DOMContentLoaded', function () {
    const addPromoModal = document.getElementById('addPromoModal');
    const promoSuccessModal = document.getElementById('promoSuccessModal');
    const promoErrorModal = document.getElementById('promoErrorModal');
    const addPromoButton = document.querySelector('#addPromoButton');
    const addPromoForm = document.getElementById('addPromoForm');
    const promoOkButton = document.getElementById('promoOkButton');
    const cakeLimitationDropdown = document.getElementById('cakeLimitationDropdown');

    const addPromoModalInstance = new bootstrap.Modal(addPromoModal);
    const promoSuccessModalInstance = new bootstrap.Modal(promoSuccessModal);
    const promoErrorModalInstance = new bootstrap.Modal(promoErrorModal);

    const promoExpirationInput = document.getElementById('promoExpiration');
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    promoExpirationInput.setAttribute('min', today);

    addPromoButton.addEventListener('click', function () {
        addPromoModalInstance.show();
    });

    addPromoModal.addEventListener('show.bs.modal', function () {
        fetch('php/fetch_cakes_promo.php')
            .then(response => response.json())
            .then(data => {
                cakeLimitationDropdown.innerHTML = '';

                const allOption = document.createElement('li');
                allOption.innerHTML = `
                    <a class="dropdown-item">
                        <input type="checkbox" value="all" id="selectAll"> <label for="selectAll">ALL</label>
                    </a>`;
                cakeLimitationDropdown.appendChild(allOption);

                data.forEach(function (cake) {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <a class="dropdown-item">
                            <input type="checkbox" value="${cake.cake_id}" id="cake-${cake.cake_id}">
                            <label for="cake-${cake.cake_id}">${cake.cake_name} (${cake.cake_sold} sold, Rating: ${cake.cake_rating})</label>
                        </a>`;
                    cakeLimitationDropdown.appendChild(listItem);
                });

                const selectAllCheckbox = document.getElementById('selectAll');
                selectAllCheckbox.addEventListener('change', function () {
                    const checkboxes = cakeLimitationDropdown.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = this.checked;
                    });
                });

                cakeLimitationDropdown.addEventListener('change', function () {
                    const selectedOptions = [];
                    const checkboxes = cakeLimitationDropdown.querySelectorAll('input[type="checkbox"]:checked');

                    checkboxes.forEach(checkbox => {
                        selectedOptions.push(checkbox.value);
                    });

                    const button = document.getElementById('dropdownMenuButton');
                    button.textContent = selectedOptions.length > 0 ? `${selectedOptions.length} selected` : 'Select Cakes';
                });
            })
            .catch(error => console.error('Error fetching cakes:', error));
    });

    addPromoForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get the selected cakes
        const selectedCakes = Array.from(cakeLimitationDropdown.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

        // Validation for cake limitation
        if (selectedCakes.length === 0) {
            showErrorModal('Please select at least one cake.');
            return; // Prevent form submission
        }

        // Check for duplicate promo_code
        const promoCodeInput = document.getElementById('promoCode').value; // Assuming promoCode is the ID of the input
        fetch('php/check_promo_code.php', { // Endpoint to check for duplicate promo_code
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ promo_code: promoCodeInput })
        })
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                showErrorModal('This promo code already exists. Please use a different one.');
                return; // Prevent form submission
            }

            const formData = new FormData(addPromoForm);
            formData.append('cake_ids', selectedCakes.join(',')); // Append selected cakes to form data

            return fetch('php/add_promo.php', {
                method: 'POST',
                body: formData
            });
        })
        .then(response => response.text())
        .then(text => {
            console.log('Response text:', text);
            return JSON.parse(text);
        })
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('promoSuccessMessage').textContent = data.message;
                addPromoModalInstance.hide();
                promoSuccessModalInstance.show();
            } else {
                showErrorModal(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    promoOkButton.addEventListener('click', function () {
        promoSuccessModalInstance.hide();
        location.reload();
    });

    // Function to show error modal
    function showErrorModal(message) {
        document.getElementById('promoErrorMessage').textContent = message;
        promoErrorModalInstance.show();
    }
});









function generateIncomeReport() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (startDate && endDate) {
        fetch('php/get_income_report.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ startDate, endDate }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('totalIncome').innerText = data.totalIncome;
                    document.getElementById('successfulOrders').innerText = data.successfulOrders;
                    document.getElementById('topSellingCake').innerText = data.topSellingCake;
                    document.getElementById('bestEarningCake').innerText = data.bestEarningCake;
                    document.getElementById('preMadeCakesCount').innerText = data.preMadeCakesCount;
                    document.getElementById('threeDCakesCount').innerText = data.threeDCakesCount;
                    document.getElementById('report-date-range').innerText = `${startDate} to ${endDate}`;

                    const incomeReportModal = new bootstrap.Modal(document.getElementById('incomeReportModal'));
                    incomeReportModal.show();
                } else {
                    alert('Error fetching report data.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error fetching report data.');
            });
    } else {
        alert('Please select both start and end dates.');
    }
}

function printIncomeReport() {
    const reportContainer = document.querySelector('.income-report-container');

    const printWindow = window.open('', '', 'height=600,width=800');

    printWindow.document.write('<html><head><title>Income Statement</title>');

    printWindow.document.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">');
    printWindow.document.write('<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">');
    printWindow.document.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">');
    printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">');
    printWindow.document.write('<link rel="stylesheet" href="css/admin.css">');

    printWindow.document.write(`
        <style>
            body {
                background-color: white;
                color: black;
            }
            .income-report-container {
                margin: 20px;
            }
            h4, p, table {
                margin: 0;
                padding: 0;
            }
            table {
                width: 100%;
            }
            th, td {
                text-align: left;
            }
        </style>
    `);

    printWindow.document.write('</head><body>');
    printWindow.document.write(reportContainer.outerHTML);
    printWindow.document.write('</body></html>');

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

    printWindow.onafterprint = function () {
        printWindow.close();
    };
}





function exportIncomeReport() {
    const reportContainer = document.querySelector('.income-report-container');

    const dateRange = document.getElementById('report-date-range').innerText.trim();

    const fileName = `Income Statement (${dateRange}).png`;

    html2canvas(reportContainer, {
        useCORS: true,
        scale: 2
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = imgData;
        link.download = fileName;
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }).catch(error => {
        console.error('Error exporting image:', error);
    });
}

