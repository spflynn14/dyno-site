$(document).ready(function() {
    console.log('ready');

    $('.name_link').click(function () {
        var player_clicked = $(this).text();
        $.ajax({
            url : '/store_player_selected_redirect_to_playerpage',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value, 'player': player_clicked},
            dataType: 'json',
            success: function(data) {
                location.href = '/player';
            }
        });
    });
});