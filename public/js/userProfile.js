(function($){
    $('.delbtn').on('click', (function(event){
        event.preventDefault();
        var button = $(this);
        var reviewId = button.data('id');
        
        var requestConfig = {
            method: "POST",
            url: '/api/delete/' + reviewId,
            contentType: 'application/json',
            data: JSON.stringify({
                id: reviewId
            })
        }
        $.ajax(requestConfig).then(function(responseMessage){
            button.closest('li').remove();
        });
    }));
})(jQuery);