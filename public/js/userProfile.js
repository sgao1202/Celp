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
            if (responseMessage.empty){
                let empty = "<p class = 'font-italic'>None, go write some reviews!</p>";
                button.closest('ul').replaceWith(empty);
            }else{
                button.closest('li').remove();
            }
            $('#numReviews').text(responseMessage.numReviews);
        });
    }));
})(jQuery);