(function ($) {
    function updateLikesOnPage(btn, responseMessage){
        var likes = btn.closest('.container').find('.likes');
        var dislikes = btn.closest('.container').find('.dislikes');
        
        //update likes on page
        likes.html(responseMessage.likeNum);
        dislikes.html(responseMessage.dislikeNum);
    }
    function showLikeError(btn){
        var error = btn.closest('.container').find('.error');
        error.html("You must be logged in to like/dislike");
        error.removeAttr('hidden');
    }

    $('.likebtn').on('click', function(event){
        event.preventDefault();
        var btn = $(this);
        var reviewId = btn.data('rid');
        var userId = btn.data('uid');

        if (userId){
            var requestConfig = {
                method: "POST",
                url: '/api/like/' + reviewId + '/' + userId,
                contentType: 'application/json',
                data: JSON.stringify({
                    rid: reviewId,
                    uid: userId
                })
            };
            $.ajax(requestConfig).then(function(responseMessage){
                updateLikesOnPage(btn, responseMessage);
    
                //toggle icon color
                var other = btn.parent().find('.fa-thumbs-down')
                if (other.hasClass('filled')){
                    other.removeClass('filled');
                }
                btn.toggleClass('filled');
            })
        }else{
            showLikeError(btn);
        }
        
    })

    $('.dislikebtn').on('click', function(event){
        event.preventDefault();
        var btn = $(this);
        var reviewId = btn.data('rid');
        var userId = btn.data('uid');
        if (userId){
            var requestConfig = {
                method: "POST",
                url: '/api/dislike/' + reviewId + '/' + userId,
                contentType: 'application/json',
                data: JSON.stringify({
                    rid: reviewId,
                    uid: userId
                })
            };
            $.ajax(requestConfig).then(function(responseMessage){
                updateLikesOnPage(btn, responseMessage);
    
                //toggle icon color
                var other = btn.parent().find('.fa-thumbs-up')
                if (other.hasClass('filled')){
                    other.removeClass('filled');
                }
                btn.toggleClass('filled');
            })
        }else{
            showLikeError(btn);
        }
    })
        
})(jQuery);