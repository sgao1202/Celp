(function ($) {

    // Make rows clickable
    $(".clickable-row").click( (event) => {
        let href = event.currentTarget.getAttribute('data-href')
        console.log(href);
        console.log(window.location);
        window.location = href;
    });
})(jQuery);