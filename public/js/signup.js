(function ($) {
    let form = $('#signupForm');
    form.submit((event) => {
        $('#submitbutton').prop('disabled', true);
    });
})(jQuery);