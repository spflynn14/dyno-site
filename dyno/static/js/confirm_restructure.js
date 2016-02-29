$(document).ready(function() {
    console.log('ready confirm');

    $('#restructure_submit_button').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        $('#message_text').text('Processing, please wait......');

        $.ajax({
            url: '/process_restructure',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/player';
            }
        });
    });

    $('#restructure_cancel_button').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        location.href = '/player';
    });
});
