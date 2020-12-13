(function($) {

    let hasErrors = false;
    function validString(str) {
        if (!str || !isNaN(str)) {
            hasErrors = true;
            return false;
        }
        return true;
    }

    function validNumber(num) {
        // Must be a whole integer between 1 and 5
        if (!num || isNaN(num) || num.includes('.') || parseInt(num) < 1 || parseInt(num) > 5) {
            hasErrors = true;
            return false;
        }
        return true;
    }

    let form = $('#review-form');
    let ratingInput = $('#review-rating');
    let priceInput = $('#review-price');
    let distancedTablesInput = $('#distanced-tables');
    let maskedEmployeesInput = $('#masked-employees');
    let noTouchPaymentInput = $('#no-touch-payment');
    let outdoorDiningInput = $('#outdoor-dining');
    let reviewTextInput = $('#review-text');
    let btn = $('#submitButton');

    form.submit((event) => {
        // Client side validation
        event.preventDefault();

        btn.prop('disabled', true);

        hasErrors = false;
        ratingInput.removeClass('is-valid is-invalid');
        priceInput.removeClass('is-valid is-invalid');
        reviewTextInput.removeClass('is-valid is-invalid');

        let info = {
            rating: ratingInput.val().trim(),
            price: priceInput.val().trim(),
            distancedTables: distancedTablesInput.prop('checked'),
            maskedEmployeesInput: maskedEmployeesInput.prop('checked'),
            noTouchPayment: noTouchPaymentInput.prop('checked'),
            outdoorDining: outdoorDiningInput.prop('checked'),
            text: reviewTextInput.val().trim()
        };

        if (!validNumber(info.rating)) ratingInput.addClass('is-invalid');
        if (!validNumber(info.price)) priceInput.addClass('is-invalid');
        if (!validString(info.text)) reviewTextInput.addClass('is-invalid');

        if (!hasErrors) {
            form.unbind().submit();
        } else {
            btn.prop('disabled', false);
        }
    });

})(jQuery);