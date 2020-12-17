(function ($) {
    let noErrors = true;
    function validString(str) {
        if (!str || !isNaN(str)) {
            noErrors = false;
            return false;
        }
        return true;
    }

    // form.removeClass('was-validated');
    let form = $('#restaurant-form');
    let nameInput = $('#restaurant-name-input');
    let addressInput = $('#restaurant-address-input');
    let cuisineSelect = $('#cuisine-type-select');
    let cuisineInput = $('#restaurant-cuisine-input');
    let cuisineInputDiv = $('#cuisine-input-div');
    let linkInput = $('#restaurant-link-input');
    let btn = $('#submitButton');
    let errors = $('.error');
    cuisineInputDiv.hide();

    let otherOption = 'Other';
    cuisineSelect.change((event) => {
        let selectValue = cuisineSelect.val();
        cuisineInputDiv.hide();
        if (selectValue === otherOption) cuisineInputDiv.show();
    });

    form.submit((event) => {
        // Prevent default form submission
        noErrors = true;
        event.preventDefault();
        btn.prop('disabled', true);

        errors.hide();


        nameInput.removeClass('is-invalid is-valid');
        addressInput.removeClass('is-invalid is-valid');
        cuisineInput.removeClass('is-invalid is-valid');
        cuisineSelect.removeClass('is-invalid is-valid');
        // linkInput.removeClass('is-invalid is-valid');

        let info = {
            name: nameInput.val().trim(),
            address: addressInput.val().trim(),
            cuisine: cuisineSelect.val().trim(),
            link: linkInput.val().trim()
        };

        let cuisineTypeElem = cuisineSelect;
        if (cuisineSelect.val() === otherOption) {
            info.cuisine = cuisineInput.val().trim();
            cuisineTypeElem = cuisineInput;
        }

        /*
            Make POST request to server if input is valid, 
            otherwise reload the form with errors attached
            to corresponding input boxes.
        */
        // Validate user input and reload the page with proper errors attached
        if (!validString(info.name)) nameInput.addClass('is-invalid');
        if (!validString(info.address)) addressInput.addClass('is-invalid');
        if (!validString(info.cuisine)) cuisineTypeElem.addClass('is-invalid');
        // if (!validString(info.link)) linkInput.addClass('is-invalid');

        // Unbind submit event to avoid an infinite loop
        if (noErrors) {
            form.unbind().submit();
        } else {
            btn.prop('disabled', false);
        }
    });
    
})(jQuery);