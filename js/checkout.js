document.addEventListener('DOMContentLoaded', function () {
    // Set minimum date for all date inputs to today
    setMinDate("pickupDate");
    setMinDate("deliveryDate");
    setMinDate("deliveryDateOther");

    toggleShippingMethod();
    toggleCourierOptions();
    setupPaymentMethodListeners();

    // Bind validateForm to form submission
    document.querySelector("form").onsubmit = function (event) {
        if (!validateForm()) {
            event.preventDefault(); // Prevent form submission if validation fails
        }
    };
});

// Function to set minimum date to today
function setMinDate(id) {
    const dateField = document.getElementById(id);
    if (dateField) {
        const today = new Date();
        today.setDate(today.getDate() + 7);
        const minDate = today.toISOString().split("T")[0];
        dateField.setAttribute("min", minDate);
    }
}

// Toggle display and validation of shipping method options
function toggleShippingMethod() {
    const delivery = document.getElementById("delivery");
    const pickup = document.getElementById("pickup");
    const courierOptions = document.getElementById("courierOptions");
    const pickupDetails = document.getElementById("pickupDetails");
    const deliveryFeeMessage = document.getElementById("deliveryFeeMessage");

    // Reset required fields and hide the delivery fee message
    resetRequiredFields();
    deliveryFeeMessage.style.display = "none"; // Hide the message initially

    if (delivery.checked) {
        // Show courier options and hide pickup details
        courierOptions.style.display = "block";
        pickupDetails.style.display = "none";
        setRequiredFields(["courier"]); // Make courier required for delivery

        // Trigger additional courier options validation
        toggleCourierOptions();
    } else if (pickup.checked) {
        // Hide courier options and show pickup details
        courierOptions.style.display = "none";
        pickupDetails.style.display = "block";
        setRequiredFields(["pickupDate", "pickupTime"]); // Required for pickup
    }
}

function toggleCourierOptions() {
    const courierSelect = document.getElementById("courier");
    const courier = courierSelect.value;
    const familySweetsOptions = document.getElementById("familySweetsOptions");
    const otherOptions = document.getElementById("otherOptions");
    const deliveryFeeMessage = document.getElementById("deliveryFeeMessage");

    // Reset required fields
    resetRequiredFields();

    if (courier === "familySweets") {
        // Show Family Sweets options
        familySweetsOptions.style.display = "block";
        otherOptions.style.display = "none";
        setRequiredFields(["region", "city", "address", "deliveryDate", "deliveryTime"]); // Required for Family Sweets

        // Show the delivery fee message when Family Sweets is selected
        if (document.getElementById("delivery").checked) {
            deliveryFeeMessage.style.display = "block"; // Show the delivery fee message
        }
    } else if (courier === "other") {
        // Show Other options
        familySweetsOptions.style.display = "none";
        otherOptions.style.display = "block";
        setRequiredFields(["regionTextbox", "cityTextbox", "addressTextbox", "deliveryDateOther", "deliveryTimeOther"]); // Required for Other courier

        // Hide the delivery fee message if not using Family Sweets
        deliveryFeeMessage.style.display = "none";
    } else {
        // Hide both options if no valid courier is selected
        familySweetsOptions.style.display = "none";
        otherOptions.style.display = "none";
        deliveryFeeMessage.style.display = "none"; // Hide the message
    }
}


// Reset all required fields
function resetRequiredFields() {
    const requiredFields = ["region", "city", "address", "regionTextbox", "cityTextbox", "addressTextbox",
        "deliveryDateOther", "deliveryTimeOther", "pickupDate", "pickupTime", "deliveryDate",
        "deliveryTime", "courier"];
    requiredFields.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.removeAttribute("required");
        }
    });
}

// Set required attributes to fields dynamically, but only if they are visible
function setRequiredFields(fieldIds) {
    fieldIds.forEach(id => {
        const element = document.getElementById(id);
        if (element && isElementVisible(element)) {
            element.setAttribute("required", "required");
        }
    });
}

// Helper function to check if an element is visible
function isElementVisible(element) {
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}

// Populate cities based on region selection
function populateCities() {
    const citySelect = document.getElementById("city");
    const selectedRegion = document.getElementById("region").value;
    const cities = {
        metroManila: ['Caloocan', 'Makati', 'Manila', 'Navotas', 'Quezon City', 'Valenzuela'],
        bulacan: ['Bocaue', 'Marilao', 'Meycauayan', 'San Jose del Monte']
    };

    citySelect.innerHTML = '<option selected disabled value="">Select City</option>';
    if (selectedRegion in cities) {
        cities[selectedRegion].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.text = city;
            citySelect.add(option);
        });
    }
}

// Payment method selection and validation for QR code display
function setupPaymentMethodListeners() {
    const paymentMethodInputs = document.querySelectorAll('input[name="paymentMethod"]');
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    const gcashQrCode = document.getElementById('gcashQrCode');
    const mayaQrCode = document.getElementById('mayaQrCode');

    paymentMethodInputs.forEach(input => {
        input.addEventListener('change', function () {
            qrCodeContainer.style.display = 'block';

            if (this.value === 'gcash') {
                gcashQrCode.style.display = 'block';
                mayaQrCode.style.display = 'none';
            } else if (this.value === 'maya') {
                gcashQrCode.style.display = 'none';
                mayaQrCode.style.display = 'block';
            }
        });
    });
}

function validateForm() {
    const requiredFields = {
        firstName: "First name is required.",
        lastName: "Last name is required.",
        email: "Email is required.",
        mobile: "Mobile number is required."
    };
    
    const invalidCourierOptionModal = document.getElementById('invalidCourierOptionModal');

    // Basic required fields check
    for (const [id, message] of Object.entries(requiredFields)) {
        const field = document.getElementById(id);
        if (!field.value.trim()) {
            alert(message);
            field.focus();
            return false;
        }
    }

    // Validate selected shipping method
    const shippingMethod = document.querySelector('input[name="shippingMethod"]:checked');
    if (!shippingMethod) {
        alert("Please select a shipping method.");
        return false;
    }

    // Check required fields for each shipping method and courier option
    if (shippingMethod.value === "delivery") {
        const courier = document.getElementById("courier");

        // Check if courier is valid
        if (courier.value !== "familySweets" && courier.value !== "other") {
            // alert("Please select a valid courier option: Family Sweets or Other.");
            invalidCourierOptionModal.style.display = 'block';
            courier.focus();
            return false;
        }

        if (courier.value === "familySweets" && !validateFields(["region", "city", "address", "deliveryDate", "deliveryTime"])) {
            alert("Please fill in all Family Sweets delivery details.");
            return false;
        } else if (courier.value === "other" && !validateFields(["regionTextbox", "cityTextbox", "addressTextbox", "deliveryDateOther", "deliveryTimeOther"])) {
            alert("Please fill in all Other courier delivery details.");
            return false;
        }
    } else if (shippingMethod.value === "pickup" && !validateFields(["pickupDate", "pickupTime"])) {
        alert("Please fill in all pickup details.");
        return false;
    }

    // Validate payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (!paymentMethod) {
        alert("Please select a payment method.");
        return false;
    }

    // Validate proof of payment for QR code methods
    const proofOfPayment = document.getElementById("proofOfPayment");
    if ((paymentMethod.value === "gcash" || paymentMethod.value === "maya") && !proofOfPayment.files.length) {
        alert("Please upload proof of payment.");
        return false;
    }

    return true; // Return false if validation fails
}


// Check required fields by ID
function validateFields(fieldIds) {
    return fieldIds.every(id => {
        const field = document.getElementById(id);
        return field && field.value.trim();
    });
}

function invalidCourierOptionCloseModal() {
    const invalidCourierOptionModal = document.getElementById('invalidCourierOptionModal');
    if (invalidCourierOptionModal) {
      invalidCourierOptionModal.style.display = 'none';
    } else {
      console.error('Invalid courier option modal not found.');
    }
  }































function applyPromoCodeButton() {
    const promoCode = document.getElementById('promoCode').value;
    const promoCodeInputContainer = document.getElementById('promoCodeContainer');
    const orderCostElement = document.getElementById('orderCost');
    const orderCostContainer = document.getElementById('orderCostContainer');
    const totalSection = document.getElementById('totalSection');
    const usePromoButton = document.getElementById('usePromoButton');
    const removePromoButton = document.getElementById('removePromoButton');
    const invalidPromoCodeModal = document.getElementById('invalidPromoCodeModal');

    if (!orderCostElement || !orderCostContainer || !totalSection) {
        console.error('Order cost or related elements not found.');
        return;
    }

    let orderCostText = orderCostElement.textContent.replace('₱', '').replace(/,/g, '').trim();
    let orderCost = parseFloat(orderCostText);

    if (isNaN(orderCost)) {
        console.error('Order cost is not a valid number.');
        return;
    }

    if (!promoCode) {
        alert("Please enter a promo code.");
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "php/apply_promo_code.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
        try {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);

                if (response.success) {
                    let discountedTotal = orderCost;

                    if (response.promo_percent_discount > 0) {
                        discountedTotal -= (orderCost * response.promo_percent_discount / 100);
                    } else if (response.promo_off_discount > 0) {
                        discountedTotal -= response.promo_off_discount;
                    }

                    if (isNaN(discountedTotal)) {
                        console.error('Discounted total calculation resulted in NaN.');
                        return;
                    }

                    document.getElementById('discountLabel').textContent = `Discounted Total (${response.promo_percent_discount > 0 ? response.promo_percent_discount + '%' : response.promo_off_discount + ' OFF'})`;
                    document.getElementById('discountedTotal').textContent = `₱${discountedTotal.toFixed(2)}`;
                    document.getElementById('discountSection').classList.remove('d-none');

                    orderCostContainer.style.color = 'gray';
                    orderCostContainer.style.textDecoration = 'line-through';

                    usePromoButton.classList.add('d-none');
                    removePromoButton.classList.remove('d-none');
                    promoCodeInputContainer.classList.add('d-none');
                } else {
                    // Display specific error messages based on the response
                    // alert(response.error || "Invalid or expired promo code.");
                    invalidPromoCodeModal.style.display = 'block';
                }
            } else {
                alert("Error with the request. Status: " + xhr.status);
            }
        } catch (e) {
            console.error("Error parsing JSON response: ", e);
        }
    };
    xhr.send("promo_code=" + encodeURIComponent(promoCode));
}

function invalidPromoCodeCloseModal() {
    const invalidPromoCodeModal = document.getElementById('invalidPromoCodeModal');
    if (invalidPromoCodeModal) {
      invalidPromoCodeModal.style.display = 'none';
    } else {
      console.error('Invalid promo code modal not found.');
    }
  }


function clearPromoCode() {
    const promoCodeInput = document.getElementById('promoCode');
    const promoCodeInputContainer = document.getElementById('promoCodeContainer');
    const orderCostElement = document.getElementById('orderCost');
    const orderCostContainer = document.getElementById('orderCostContainer');
    const usePromoButton = document.getElementById('usePromoButton');
    const removePromoButton = document.getElementById('removePromoButton');


    promoCodeInput.value = '';


    document.getElementById('discountLabel').textContent = 'Discounted Total';
    document.getElementById('discountedTotal').textContent = '';
    document.getElementById('discountSection').classList.add('d-none');


    orderCostContainer.style.color = '';
    orderCostContainer.style.textDecoration = '';


    usePromoButton.classList.remove('d-none');
    removePromoButton.classList.add('d-none');
    promoCodeInputContainer.classList.remove('d-none');


    const xhr = new XMLHttpRequest();
    xhr.open("POST", "php/remove_promo_code.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
                console.log("Promo code removed successfully.");
            } else {
                console.error("Failed to remove promo code.");
            }
        } else {
            console.error("Error with the request. Status: " + xhr.status);
        }
    };
    xhr.send();
}

