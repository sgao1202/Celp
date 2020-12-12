(function ($) {
    // Returns
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
    let cuisineInput = $('#restaurant-cuisine-input');
    let linkInput = $('#restaurant-link-input');

    form.submit((event) => {
        // Prevent default form submission
        noErrors = true;
        event.preventDefault();
        nameInput.removeClass('is-invalid is-valid');
        addressInput.removeClass('is-invalid is-valid');
        cuisineInput.removeClass('is-invalid is-valid');
        linkInput.removeClass('is-invalid is-valid');

        let info = {
            name: nameInput.val().trim(),
            address: addressInput.val().trim(),
            cuisine: cuisineInput.val().trim(),
            link: linkInput.val().trim()
        };
        /*
            Make POST request to server if input is valid, 
            otherwise reload the form with errors attached
            to corresponding input boxes.
        */
        
        // Validate user input and reload the page with proper errors attached
        if (!validString(info.name)) nameInput.addClass('is-invalid');
        if (!validString(info.address)) addressInput.addClass('is-invalid');
        if (!validString(info.cuisine)) cuisineInput.addClass('is-invalid');
        if (!validString(info.link)) linkInput.addClass('is-invalid');

        // Unbind submit event to avoid an infinite loop
        if (noErrors) form.unbind().submit();
    });
    
})(jQuery);