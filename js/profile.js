document.getElementById('profileBtn').addEventListener('click', function () {
    showSection('profileSection', 'profileBtn');
});

document.getElementById('purchaseBtn').addEventListener('click', function () {
    showSection('purchaseSection', 'purchaseBtn');
});

document.getElementById('notificationBtn').addEventListener('click', function () {
    showSection('notificationSection', 'notificationBtn');
});

document.getElementById('reviewsBtn').addEventListener('click', function () {
    showSection('reviewsSection', 'reviewsBtn');
});

function showSection(sectionId, buttonId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById(buttonId).classList.add('active');
}



document.addEventListener('DOMContentLoaded', function () {
    const activeOrdersTab = document.getElementById('activeOrdersTab');
    const orderHistoryTab = document.getElementById('orderHistoryTab');

    const activeOrdersContent = document.getElementById('activeOrdersContent');
    const orderHistoryContent = document.getElementById('orderHistoryContent');


    activeOrdersTab.classList.add('active');
    activeOrdersContent.style.display = 'block';
    orderHistoryContent.style.display = 'none';


    activeOrdersTab.addEventListener('click', function (e) {
        e.preventDefault();
        activeOrdersTab.classList.add('active');
        orderHistoryTab.classList.remove('active');

        activeOrdersContent.style.display = 'block';
        orderHistoryContent.style.display = 'none';
    });


    orderHistoryTab.addEventListener('click', function (e) {
        e.preventDefault();
        orderHistoryTab.classList.add('active');
        activeOrdersTab.classList.remove('active');

        orderHistoryContent.style.display = 'block';
        activeOrdersContent.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const toBeReviewedTab = document.getElementById('toBeReviewedTab');
    const reviewHistoryTab = document.getElementById('reviewHistoryTab');
    const toBeReviewedContent = document.getElementById('toBeReviewedContent');
    const reviewHistoryContent = document.getElementById('reviewHistoryContent');

    if (!toBeReviewedTab || !reviewHistoryTab || !toBeReviewedContent || !reviewHistoryContent) {
        console.error('One or more elements are missing from the DOM.');
        return;
    }

    toBeReviewedTab.addEventListener('click', function (e) {
        e.preventDefault();
        toBeReviewedTab.classList.add('active');
        reviewHistoryTab.classList.remove('active');

        toBeReviewedContent.classList.add('active');
        reviewHistoryContent.classList.remove('active');
    });

    reviewHistoryTab.addEventListener('click', function (e) {
        e.preventDefault();
        reviewHistoryTab.classList.add('active');
        toBeReviewedTab.classList.remove('active');

        reviewHistoryContent.classList.add('active');
        toBeReviewedContent.classList.remove('active');
    });
});






document.addEventListener('DOMContentLoaded', function () {
    var reviewModal = document.getElementById('reviewModal');

    reviewModal.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget;
        var orderNo = button.getAttribute('data-order-no');


        fetch('php/fetch_order_data.php?order_no=' + encodeURIComponent(orderNo))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {

                reviewModal.querySelector('#cakeNames').textContent = data.cake_names || 'No cakes found';
                reviewModal.querySelector('#orderNo').textContent = data.order_no || 'No order number';
            })
            .catch(error => {
                console.error('Error fetching order details:', error);
                reviewModal.querySelector('#cakeNames').textContent = 'Error fetching cake names';
                reviewModal.querySelector('#orderNo').textContent = 'Error fetching order number';
            });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    let selectedRating = 0;


    const stars = document.querySelectorAll('.star');

    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const value = parseInt(star.getAttribute('data-value'));
            updateStars(value);
        });

        star.addEventListener('mouseout', () => {
            updateStars(selectedRating);
        });

        star.addEventListener('click', () => {
            selectedRating = parseInt(star.getAttribute('data-value'));
            updateStars(selectedRating);
        });
    });

    function updateStars(value) {
        stars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'));
            if (starValue <= value) {
                star.classList.add('bi-star-fill');
                star.classList.remove('bi-star');
                star.style.color = '#f39c12';
            } else {
                star.classList.add('bi-star');
                star.classList.remove('bi-star-fill');
                star.style.color = '#ccc';
            }
        });
    }


    const reviewModal = document.getElementById('reviewModal');
    reviewModal.addEventListener('show.bs.modal', () => {
        selectedRating = 0;
        updateStars(selectedRating);


        const reviewImages = document.getElementById('reviewImages');
        reviewImages.value = '';


        document.getElementById('reviewText').value = '';
    });


    document.getElementById('submitReviewBtn').addEventListener('click', () => {
        const orderNo = document.getElementById('orderNo').innerText.trim();
        const reviewText = document.getElementById('reviewText').value.trim();
        const reviewImages = document.getElementById('reviewImages').files;

        const formData = new FormData();
        formData.append('order_no', orderNo);
        formData.append('rating', selectedRating);
        formData.append('review_text', reviewText);

        for (let i = 0; i < reviewImages.length; i++) {
            formData.append('review_images[]', reviewImages[i]);
        }

        fetch('php/submit_review.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(text => {
                try {
                    const data = JSON.parse(text);
                    if (data.status === 'success') {
                        const reviewBootstrapModal = bootstrap.Modal.getInstance(reviewModal);
                        if (reviewBootstrapModal) {
                            reviewBootstrapModal.hide();
                        }
                        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                        successModal.show();
                    } else {
                        alert('Failed to submit review: ' + data.message);
                    }
                } catch (e) {
                    console.error('Failed to parse JSON:', e);
                    alert('Server returned invalid JSON: ' + text);
                }
            })
            .catch(error => {
                console.error('Error submitting review:', error);
            });

    });


    document.getElementById('editProfileForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(this);

        fetch('php/update_profile.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                    successModal.show();


                    successModal._element.addEventListener('hidden.bs.modal', () => {
                        window.location.reload();
                    });


                    const editProfileModal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
                    if (editProfileModal) {
                        editProfileModal.hide();
                    }
                } else {
                    alert('Failed to update profile: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error updating profile:', error);
            });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const successModal = document.getElementById('successModal');


    successModal.addEventListener('hidden.bs.modal', () => {

        window.location.reload();
    });
});





document.addEventListener('DOMContentLoaded', function () {
    const orderContainers = document.querySelectorAll('.order-details-container');

    orderContainers.forEach(container => {
        container.addEventListener('click', function () {
            const orderData = JSON.parse(this.getAttribute('data-order'));

            
            showInvoiceModal(orderData.order_no);
        });
    });

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

                    
                    const userContacts = data.order_user_contact ? data.order_user_contact.split(', ') : [];
                    userContactEmailEl.innerText = userContacts[0] || "N/A";
                    userContactNumberEl.innerText = userContacts[1] || "N/A";

                    
                    invoiceAddressEl.innerText =
                        data.order_delivery_method === "pickup" ? data.order_pickup_address : data.order_address;

                    
                    invoiceProductsBody.innerHTML = "";
                    let subtotal = 0;

                    
                    const products = data.order_info.split(', ');
                    let cakeIndex = 0;
                    
                    let i = 0;
                    while (i < products.length) {
                        const cakeType = products[i].trim();
                        
                        if (cakeType === 'PRE-MADE CAKE') {
                            const cakeName = products[i + 1]?.trim();
                            const cakeSize = products[i + 2]?.trim();
                            const quantity = parseInt(products[i + 3]?.trim(), 10);
                    
                            if (isNaN(quantity) || quantity <= 0 || !cakeSize || !cakeName) {
                                console.error('Invalid quantity, size, or name for PRE-MADE CAKE:', cakeName);
                                i += 4; 
                                continue;
                            }
                    
                            const cakeId = data.cake_ids.split(',')[cakeIndex]?.trim(); // Use the global cakeIndex
                    
                            fetch(`php/get_cake_details.php?id=${cakeId}`)
                                .then(response => {
                                    if (!response.ok) throw new Error('Network response was not ok');
                                    return response.json();
                                })
                                .then(cakeData => {
                                    if (!cakeData) {
                                        console.error('No cake data found for PRE-MADE CAKE ID:', cakeId);
                                        return;
                                    }
                    
                                    let unitPrice = 0;
                    
                                    if (cakeSize.includes("6 inch")) {
                                        unitPrice = parseFloat(cakeData.cake_price_small) || 0;
                                    } else if (cakeSize.includes("7 inch")) {
                                        unitPrice = parseFloat(cakeData.cake_price_medium) || 0;
                                    } else if (cakeSize.includes("8 inch")) {
                                        unitPrice = parseFloat(cakeData.cake_price_large) || 0;
                                    } else if (cakeSize.includes("No Size")) {
                                        unitPrice = parseFloat(cakeData.cake_baseprice) || 0;
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
                    
                                    if (i + 4 >= products.length) { 
                                        let discount = 0;
                                        if (data.order_discounted_cost && parseFloat(data.order_discounted_cost) > 0) {
                                            discount = parseFloat(data.order_cost) - parseFloat(data.order_discounted_cost);
                                        }
                    
                                        invoiceDiscountEl.innerText = `₱${discount.toFixed(2)}`;
                    
                                        const total = parseFloat(data.order_discounted_cost) || parseFloat(data.order_cost) || 0;
                                        invoiceTotalEl.innerText = `₱${total.toFixed(2)}`;
                                    }
                                })
                                .catch(err => console.error('Error fetching PRE-MADE CAKE details for ID:', cakeId, 'Error:', err));
                    
                            cakeIndex++; 
                            i += 4;
                        } 
                        else if (cakeType === '3D CAKE') {
                            const cakeDetails = products.slice(i + 2, i + 17).map(detail => detail.trim()).join(', ');
                            const quantity = parseInt(products[i + 18]?.trim(), 10);
                    
                            if (isNaN(quantity) || quantity <= 0) {
                                i += 19; 
                                continue;
                            }
                    
                            const cakeId = data.cake_ids.split(',')[cakeIndex]?.trim();
                            console.log('Cake ID:', cakeId); 
                    
                            fetch(`php/get_3dcake_details.php?id=${cakeId}`)
                                .then(response => {
                                    if (!response.ok) throw new Error('Network response was not ok');
                                    return response.json();
                                })
                                .then(cakeData => {
                                    if (!cakeData) {
                                        console.error('No cake data found for 3D CAKE ID:', cakeId);
                                        return;
                                    }
                    
                                    const unitPrice = parseFloat(cakeData.orderCost) || 0;
                                    const totalPrice = unitPrice * quantity;
                                    subtotal += totalPrice;
                    
                                    const row = `
                                        <tr>
                                            <td>3D Cake (${cakeDetails})</td>
                                            <td>${quantity}</td>
                                            <td>₱${unitPrice.toFixed(2)}</td>
                                            <td>₱${totalPrice.toFixed(2)}</td>
                                        </tr>
                                    `;
                                    invoiceProductsBody.insertAdjacentHTML('beforeend', row);
                    
                                    invoiceSubtotalEl.innerText = `₱${subtotal.toFixed(2)}`;
                    
                                    if (i + 19 >= products.length) { 
                                        let discount = 0;
                                        if (data.order_discounted_cost && parseFloat(data.order_discounted_cost) > 0) {
                                            discount = parseFloat(data.order_cost) - parseFloat(data.order_discounted_cost);
                                        }
                    
                                        invoiceDiscountEl.innerText = `₱${discount.toFixed(2)}`;
                    
                                        const total = parseFloat(data.order_discounted_cost) || parseFloat(data.order_cost) || 0;
                                        invoiceTotalEl.innerText = `₱${total.toFixed(2)}`;
                                    }
                                })
                                .catch(err => console.error('Error fetching 3D CAKE details for ID:', cakeId, 'Error:', err));
                    
                            cakeIndex++; 
                            i += 19; 
                        } else {
                            i++;
                        }
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
});




document.addEventListener('DOMContentLoaded', function () {
    const orderHistoryContainers = document.querySelectorAll('.order-details');

    orderHistoryContainers.forEach(container => {
        container.addEventListener('click', function () {
            const orderData = JSON.parse(this.getAttribute('data-order'));

            
            showInvoiceModal(orderData.order_no);
        });
    });

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

                    
                    const userContacts = data.order_user_contact ? data.order_user_contact.split(', ') : [];
                    userContactEmailEl.innerText = userContacts[0] || "N/A";
                    userContactNumberEl.innerText = userContacts[1] || "N/A";

                    
                    invoiceAddressEl.innerText =
                        data.order_delivery_method === "pickup" ? data.order_pickup_address : data.order_address;

                    
                    invoiceProductsBody.innerHTML = "";
                    let subtotal = 0;

                    
                    const products = data.order_info.split(', ');
                    let cakeIndex = 0;
                    
                    let i = 0;
                    while (i < products.length) {
                        const cakeType = products[i].trim();
                        
                        if (cakeType === 'PRE-MADE CAKE') {
                            const cakeName = products[i + 1]?.trim();
                            const cakeSize = products[i + 2]?.trim();
                            const quantity = parseInt(products[i + 3]?.trim(), 10);
                    
                            if (isNaN(quantity) || quantity <= 0 || !cakeSize || !cakeName) {
                                console.error('Invalid quantity, size, or name for PRE-MADE CAKE:', cakeName);
                                i += 4; 
                                continue;
                            }
                    
                            const cakeId = data.cake_ids.split(',')[cakeIndex]?.trim(); // Use the global cakeIndex
                    
                            fetch(`php/get_cake_details.php?id=${cakeId}`)
                                .then(response => {
                                    if (!response.ok) throw new Error('Network response was not ok');
                                    return response.json();
                                })
                                .then(cakeData => {
                                    if (!cakeData) {
                                        console.error('No cake data found for PRE-MADE CAKE ID:', cakeId);
                                        return;
                                    }
                    
                                    let unitPrice = 0;
                    
                                    if (cakeSize.includes("6 inch")) {
                                        unitPrice = parseFloat(cakeData.cake_price_small) || 0;
                                    } else if (cakeSize.includes("7 inch")) {
                                        unitPrice = parseFloat(cakeData.cake_price_medium) || 0;
                                    } else if (cakeSize.includes("8 inch")) {
                                        unitPrice = parseFloat(cakeData.cake_price_large) || 0;
                                    } else if (cakeSize.includes("No Size")) {
                                        unitPrice = parseFloat(cakeData.cake_baseprice) || 0;
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
                    
                                    if (i + 4 >= products.length) { 
                                        let discount = 0;
                                        if (data.order_discounted_cost && parseFloat(data.order_discounted_cost) > 0) {
                                            discount = parseFloat(data.order_cost) - parseFloat(data.order_discounted_cost);
                                        }
                    
                                        invoiceDiscountEl.innerText = `₱${discount.toFixed(2)}`;
                    
                                        const total = parseFloat(data.order_discounted_cost) || parseFloat(data.order_cost) || 0;
                                        invoiceTotalEl.innerText = `₱${total.toFixed(2)}`;
                                    }
                                })
                                .catch(err => console.error('Error fetching PRE-MADE CAKE details for ID:', cakeId, 'Error:', err));
                    
                            cakeIndex++; 
                            i += 4;
                        } 
                        else if (cakeType === '3D CAKE') {
                            const cakeDetails = products.slice(i + 2, i + 17).map(detail => detail.trim()).join(', ');
                            const quantity = parseInt(products[i + 18]?.trim(), 10);
                    
                            if (isNaN(quantity) || quantity <= 0) {
                                i += 19; 
                                continue;
                            }
                    
                            const cakeId = data.cake_ids.split(',')[cakeIndex]?.trim();
                            console.log('Cake ID:', cakeId); 
                    
                            fetch(`php/get_3dcake_details.php?id=${cakeId}`)
                                .then(response => {
                                    if (!response.ok) throw new Error('Network response was not ok');
                                    return response.json();
                                })
                                .then(cakeData => {
                                    if (!cakeData) {
                                        console.error('No cake data found for 3D CAKE ID:', cakeId);
                                        return;
                                    }
                    
                                    const unitPrice = parseFloat(cakeData.orderCost) || 0;
                                    const totalPrice = unitPrice * quantity;
                                    subtotal += totalPrice;
                    
                                    const row = `
                                        <tr>
                                            <td>3D Cake (${cakeDetails})</td>
                                            <td>${quantity}</td>
                                            <td>₱${unitPrice.toFixed(2)}</td>
                                            <td>₱${totalPrice.toFixed(2)}</td>
                                        </tr>
                                    `;
                                    invoiceProductsBody.insertAdjacentHTML('beforeend', row);
                    
                                    invoiceSubtotalEl.innerText = `₱${subtotal.toFixed(2)}`;
                    
                                    if (i + 19 >= products.length) { 
                                        let discount = 0;
                                        if (data.order_discounted_cost && parseFloat(data.order_discounted_cost) > 0) {
                                            discount = parseFloat(data.order_cost) - parseFloat(data.order_discounted_cost);
                                        }
                    
                                        invoiceDiscountEl.innerText = `₱${discount.toFixed(2)}`;
                    
                                        const total = parseFloat(data.order_discounted_cost) || parseFloat(data.order_cost) || 0;
                                        invoiceTotalEl.innerText = `₱${total.toFixed(2)}`;
                                    }
                                })
                                .catch(err => console.error('Error fetching 3D CAKE details for ID:', cakeId, 'Error:', err));
                    
                            cakeIndex++; 
                            i += 19; 
                        } else {
                            i++;
                        }
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
});




function fetchNotifications() {
    fetch('php/fetch_notifications.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const notificationsList = document.getElementById('notificationsList');
            notificationsList.innerHTML = ''; 

            const statusTextClass = {
                'PENDING': 'text-warning',
                'PREPARING': 'text-info',
                'FOR PICK-UP': 'text-primary',
                'SHIPPED': 'text-secondary',
                'COMPLETED': 'text-success',
                'CANCELLED': 'text-danger'
            };

            if (data.length === 0) {
                notificationsList.innerHTML = '<li class="list-group-item">No new notifications.</li>';
            } else {
                data.forEach(notification => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item'; 

                    const textClass = statusTextClass[notification.order_status] || 'text-dark';

                    const formattedDatetime = new Date(notification.order_progress_datetime).toLocaleString();

                    listItem.innerHTML = `
                        <p>Your order <strong class="${textClass}">${notification.order_info}</strong> 
                        with order number <strong class="${textClass}">${notification.order_no}</strong> 
                        is now <strong class="${textClass}">${notification.order_status}</strong>.</p>
                        <small class="text-muted">Updated on: ${formattedDatetime}</small>
                    `;

                    notificationsList.prepend(listItem); 
                });
            }
        })
        .catch(error => {
            console.error('Error fetching notifications:', error);
            document.getElementById('notificationsList').innerHTML = '<li class="list-group-item text-danger">Failed to load notifications.</li>';
        });
}


setInterval(fetchNotifications, 5000);
fetchNotifications(); 



