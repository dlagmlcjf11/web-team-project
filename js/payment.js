document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    const monthsSelect = document.getElementById('months');
    const otherMonthsGroup = document.getElementById('other-months-group');
    const otherMonthsInput = document.getElementById('other-months');
    const discountInfoEl = document.getElementById('discount-info');
    const totalPriceEl = document.getElementById('total-price');
    const paymentMethodSelect = document.getElementById('payment-method');
    const couponInputGroup = document.getElementById('coupon-input-group');
    const couponCodeInput = document.getElementById('coupon-code');
    const paymentForm = document.getElementById('payment-form');
    const paymentErrorMessageDiv = document.getElementById('payment-error-message');

    // --- Constants ---
    const basePricePerMonth = 10000;
    const discountPerBundle = 1000;
    const bundleSize = 3;

    // --- State ---
    let currentTotalPrice = 0;
    let isCouponApplied = false;

    // --- 1. Populate Months Dropdown (excluding "Other") ---
    function populateMonths() {
        for (let i = 1; i <= 12; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}개월`;
            // Insert before the "Other" option
            monthsSelect.insertBefore(option, monthsSelect.querySelector('option[value="other"]'));
        }
        monthsSelect.value = "1"; // Default to 1 month
    }

    // --- 2. Calculate Price and Apply Discounts ---
    function calculatePrice() {
        paymentErrorMessageDiv.style.display = 'none'; // Hide error on recalculation
        let currentMonths = 0;
        if (monthsSelect.value === 'other') {
            currentMonths = parseInt(otherMonthsInput.value) || 0;
        } else {
            currentMonths = parseInt(monthsSelect.value) || 0;
        }

        if (currentMonths <= 0) {
            totalPriceEl.textContent = '0원';
            discountInfoEl.textContent = '개월 수를 선택해주세요.';
            return;
        }

        let calculatedPrice = currentMonths * basePricePerMonth;
        let discountDetails = "";

        // Bundle Discount Logic
        const bundleDiscountCount = Math.floor(currentMonths / bundleSize);
        if (bundleDiscountCount > 0) {
            const totalBundleDiscount = bundleDiscountCount * discountPerBundle;
            calculatedPrice -= totalBundleDiscount;
            discountDetails = `${bundleDiscountCount * bundleSize}개월 묶음 할인 (${totalBundleDiscount.toLocaleString()}원 할인)`;
        } else {
            discountDetails = "적용된 할인 없음";
        }
        
        // Coupon Discount
        isCouponApplied = false;
        const enteredCouponCode = couponCodeInput.value.toUpperCase();
        if (enteredCouponCode) { // Only check if there is a coupon code entered
            // Check if couponData exists and the entered coupon code is valid
            if (typeof couponData !== 'undefined' && couponData[enteredCouponCode]) {
                const couponDiscountPercentage = couponData[enteredCouponCode];
                const couponDiscountAmount = calculatedPrice * couponDiscountPercentage;
                calculatedPrice -= couponDiscountAmount;

                const couponDetails = `쿠폰 할인 ${couponDiscountPercentage * 100}% (${couponDiscountAmount.toLocaleString()}원) 적용`;
                if (discountDetails === "적용된 할인 없음") {
                    discountDetails = couponDetails;
                } else {
                    discountDetails += `, ${couponDetails}`;
                }
                isCouponApplied = true;
            } else {
                // This path is taken if the coupon is entered but invalid.
                // We don't set isCouponApplied to true.
            }
        }

        currentTotalPrice = calculatedPrice;
        totalPriceEl.textContent = `${currentTotalPrice.toLocaleString()}원`;
        discountInfoEl.textContent = discountDetails;
    }

    // --- 3. Event Listeners ---
    monthsSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            otherMonthsGroup.style.display = 'block';
            otherMonthsInput.focus();
        } else {
            otherMonthsGroup.style.display = 'none';
        }
        calculatePrice();
    });

    otherMonthsInput.addEventListener('input', calculatePrice);
    couponCodeInput.addEventListener('input', calculatePrice);

    paymentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        paymentErrorMessageDiv.style.display = 'none';

        let months = (monthsSelect.value === 'other') ? parseInt(otherMonthsInput.value) : parseInt(monthsSelect.value);
        if (!months || months < 1) {
            paymentErrorMessageDiv.textContent = '유효한 개월 수를 선택하거나 입력해주세요.';
            paymentErrorMessageDiv.style.display = 'block';
            return;
        }

        // Validate that if a coupon is typed, it must be valid
        if (couponCodeInput.value && !isCouponApplied) {
            paymentErrorMessageDiv.textContent = '입력된 쿠폰 코드가 유효하지 않습니다.';
            paymentErrorMessageDiv.style.display = 'block';
            return;
        }

        // --- Update User Data in sessionStorage ---
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            const today = new Date();
            const currentExpiry = new Date(loggedInUser.expiresAt);
            
            // If current expiry is in the past, start new subscription from today.
            // Otherwise, extend the existing subscription.
            const startDate = currentExpiry > today ? currentExpiry : today;
            
            const newExpiryDate = new Date(startDate);
            newExpiryDate.setMonth(newExpiryDate.getMonth() + months);
            
            loggedInUser.expiresAt = newExpiryDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        }

        alert(`${currentTotalPrice.toLocaleString()}원 결제가 완료되었습니다!`);
        window.location.reload();
    });

    // --- Initialization ---
    populateMonths();
    calculatePrice();
});