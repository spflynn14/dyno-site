$(document).ready(function() {
    console.log('ready');

    var today = new Date();
    //today = document.getElementById('time');

    $('#date_text').val(today);

    var a = window.screen.width;
    var b = window.screen.height;
    var c = a + 'x' + b;

    $('#res_text').val(c);

    $('button').click(function() {
        var report = $('#report_text').val();
        $.ajax({
            url: '/save_new_bug',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'resolution': c,
                'report' : report
            },
            dataType: 'json',
            success: function (data) {
                window.location.href = '/bug_tracking'
            }
        });
    });
});

