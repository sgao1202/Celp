(function ($) {
    // Returns
    function validInput(info) {
        if (!info || !info.name || !info.address || !info.cuisine) return false;
        return true;
    }

    let form = $('#restaurant-form');
    let nameInput = $('#restaurant-name-input');
    let addressInput = $('#restaurant-address-input');
    let cuisineInput = $('#restaurant-cuisine-input');
    console.log(nameInput);
    console.log(addressInput);
    console.log(cuisineInput);

    form.submit((event) => {
        // Validate user input
        event.preventDefault();
        let info = {
            name: nameInput.val().trim(),
            address: addressInput.val().trim(),
            cuisine: cuisineInput.val().trim()
        };
        console.log(info);
        /*
            Make POST request to server if input is valid, 
            otherwise reload the form with errors attached
            to corresponding input boxes.
        */
        // if (validInput) form.submit();
    });
    
})(jQuery);