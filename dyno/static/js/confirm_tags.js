$(document).ready(function() {
    console.log('ready confirm');

    var player = $('#vw_1-1').text();
    var type = $('#vw_1-2').text();
    var value = $('#vw_1-3').text();
    var sb = $('#vw_1-4').text();
    var salary = $('#vw_1-5').text();


    $('#tags_confirm_button').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        $('#message_text').text('Processing, please wait......');
        $.ajax({
            url: '/process_tags',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player' : player,
                'type' : type,
                'value' : value,
                'sb' : sb,
                'salary' : salary
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/team/tags';
            }
        });
    });

    $('#tags_cancel_button').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        location.href = '/team/tags';
    });
});