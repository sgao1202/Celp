(function () {
    let form = $('#loginForm');
    form.submit((event) => {
        $('#submitButton').prop('disabled', true);
    });
})();