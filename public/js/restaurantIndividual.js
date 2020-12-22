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
    function showFavError(btn){
        var error = btn.closest('.border-bottom').find('.error');
        error.html("You must be logged in to favorite restaurants");
        error.removeAttr('hidden');
    }
    function showRepError(btn){
        var error = btn.closest('.container').find('.error');
        error.html("You must be logged in to report reviews");
        error.removeAttr('hidden');
    }

    // Attach 'active' class to first carousel item to show the carousel
    let firstItem = $('.carousel-item')[0];
    $(firstItem).addClass('active');

    // 'Google Maps API Integration'
    let map;
    let geocoder;

    window.initMap = () => {
        let latlng =  new google.maps.LatLng(40.7440, -74.0324);
        let mapOptions = {
            zoom: 15,
            center: latlng
        }
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        geocoder = new google.maps.Geocoder();
        let address = $('#address').html() + ' Hoboken, NJ 07030';
        geocoder.geocode({'address': address}, (results, status) => {
            if (status == 'OK') {
                // Display map of the restaurant with a marker
                map.setCenter(results[0].geometry.location);
                let marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            }
        });
    }

    $('.favbtn').on('click', function(event){
        event.preventDefault();
        var btn = $(this);
        var restId = btn.data('rid');
        var userId = btn.data('uid');
        if (userId){
            var requestConfig = {
                method : "POST",
                url: '/api/favorite/' + restId + '/' + userId,
                contentType: 'application/json',
                data: JSON.stringify({
                    rid: restId,
                    uid: userId
                })
            }
            $.ajax(requestConfig).then(function(responseMessage){
                //toggle icon color
                btn.toggleClass('fa-star-o')
                btn.toggleClass('fa-star')
                btn.toggleClass('filled');
            })
        }else{
            showFavError(btn);
        }

    })
    $('.reportbtn').on('click', function(event){
        event.preventDefault();
        var btn = $(this);
        var revId = btn.data('rid');
        var userId = btn.data('uid');
        var restId = btn.data('restid');
        if (userId){
            var requestConfig = {
                method : "POST",
                url: '/api/report/' + revId + '/' + userId + '/' + restId,
                contentType: 'application/json',
                data: JSON.stringify({
                    rid: revId,
                    uid: userId,
                    restId: restId
                })
            }
            $.ajax(requestConfig).then(function(responseMessage){
                var restaurant = responseMessage.restaurant;
                if (responseMessage.deleted){
                    let li = "<li class = 'list-group-item error font-italic'>This review has been deleted due to multiple reports</li>"
                    btn.closest('.list-group-item').replaceWith(li);

                    $('#rating').text(restaurant.rating + "%")
                    $('#distanced').text(restaurant.distancedTables + "%");
                    $('#masked').text(restaurant.maskedEmployees + "%");
                    $('#noTouch').text(restaurant.noTouchPayment + "%");
                    $('#outdoor').text(restaurant.outdoorSeating + "%");
                }

                //toggle icon color and text
                var reportText = btn.children('.report-text');
                reportText.text(reportText.text() == "Report" ? "Unreport": "Report")

                var msg = btn.closest('.container').find('.msg');
                if (btn.hasClass('btn-danger')){
                    msg.text("Thank you, your review has been submitted!");
                }
                else{
                    msg.text("You have unreported this review.");
                }
                msg.removeAttr('hidden');

                btn.toggleClass('btn-danger');
                btn.toggleClass('btn-secondary');
                
            })
        }else{
            showRepError(btn);
        }

    })

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
    

    /*
        AJAX for adding a comment
    */ 
    let commentForms = $('.comment-form');
    if (commentForms.length > 0) {
        commentForms.each((index) => {
            let currentForm = $(commentForms[index]);
            currentForm.submit((event) => {
                event.preventDefault();

                let commentInput = currentForm.find('.form-group').find('input');
                commentInput.removeClass('is-invalid is-valid');

                let commentText = commentInput.val().trim();
                let reviewId = currentForm.data('review');
                let hasErrors = false;
                
                if (!commentText) {
                    commentInput.addClass('is-invalid');
                    hasErrors = true;
                }
                
                if (!hasErrors) {
                    let requestConfig = {
                        method: 'POST',
                        url: '/api/comment/new',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            reviewId: currentForm.data('review'),
                            text: commentText
                        })
                    }
                    
                    $.ajax(requestConfig).then((response) => {
                        let commentList = $(`#comment-list-${reviewId}`);
                        commentList.append(response);
                    });
                }
                commentInput.val('');
            });
        });
    }
})(jQuery);