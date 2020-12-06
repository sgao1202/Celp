(function($){
    $('.delbtn').on('click', (function(event){
        event.preventDefault();
        var button = $(this);
        var reviewId = button.data('id');
        

        var requestConfig = {
            method: "POST",
            url: '/api/delete/' + reviewId
        }
        $.ajax(requestConfig).then(function(responseMessage){
            button.closest('li').remove();
        })
    }))
})(jQuery);