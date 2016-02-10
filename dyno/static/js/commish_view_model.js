$(document).ready(function() {
    console.log('ready');

    $('#view_model_player').on('click', function() {
        var player = $('#player_select').val();
        $.ajax({
            url: '/get_player_for_edit_model',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player' : player
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/commish/edit_player';
            }
        });
    });
});

