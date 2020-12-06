(function ($) {
    $('.likebtn').on('click', function(){
        var reviewId = $(this).data('revId');
        var userId = $(this).data('userId');

        var requestConfig = {
            method: "POST",
            url: "/api/like/" + reviewId + "/" + userId
        }
    })

    $('.dislikebtn').on('click', function(){

    })
})(jQuery);