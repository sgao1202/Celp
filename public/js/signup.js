(function ($) {
    let hasErrors = false;
    function validString(str) {
        if (!str) {
            hasErrors = true;
            return false
        }
        return true;
    }

    let signupForm =$('#signup-form');
    let firstNameInput = $('#firstName');
    let lastNameInput = $('#lastName');
    let usernameInput = $('#username');
    let passwordInput = $('#password');
    let emailInput = $('#email');
    let ageInput = $('#age');
    let submitButton = $('#submitButton');

    signupForm.submit((event) => {
        event.preventDefault();

        $('.error').hide();

        firstNameInput.removeClass('is-invalid is-valid');
        lastNameInput.removeClass('is-invalid is-valid');
        usernameInput.removeClass('is-invalid is-valid');
        passwordInput.removeClass('is-invalid is-valid');
        emailInput.removeClass('is-invalid is-valid');
        ageInput.removeClass('is-invalid is-valid');

        submitButton.prop('disabled', true);
        let info = {
            firstName: firstNameInput.val().trim(),
            lastName: lastNameInput.val().trim(),
            username: usernameInput.val().trim(),
            password: passwordInput.val().trim(),
            email: emailInput.val().trim(),
            age: ageInput.val().trim()
        };
        
        if (!validString(info.firstName)) firstNameInput.addClass('is-invalid');
        if (!validString(info.lastName)) lastNameInput.addClass('is-invalid');
        if (!validString(info.username)) usernameInput.addClass('is-invalid');
        if (!validString(info.password)) passwordInput.addClass('is-invalid');
        if (!validString(info.email)) emailInput.addClass('is-invalid');
        if (!validString(info.age)) ageInput.addClass('is-invalid');

        if (!hasErrors) {
            signupForm.unbind().submit();
        } else {
            submitButton.prop('disabled', false);
        }
    });
})(jQuery);