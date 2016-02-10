$(document).ready(function() {
    console.log('ready');

    $('#auction_default_clock_message').hide();


    $('#auction_default_clock_submit').on('click', function() {
        var temp = Number($('#auction_default_clock_input').val()) * 60;
        console.log(temp);
        $.ajax({
            url: '/save_default_auction_clock',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'auction_default_clock' : temp
            },
            dataType: 'json',
            success: function (data) {
                $('#auction_default_clock_message').text('save successful').show();
            }
        });
    });

    $(document.body).on('click', 'input[name="extensions-onoff"]', function() {
        var ext_on = 99;
        if ($("input[name='extensions-onoff'][value='on']").prop('checked') == true) {
            console.log('extensions on');
            ext_on = 1;
        } else {
            console.log('extensions off');
            ext_on = 0;
        }

        $.ajax({
            url: '/save_extension_switch',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'extension_switch_state' : ext_on
            },
            dataType: 'json',
            success: function (data) {
                //do nothing
            }
        });
    });

    $(document.body).on('click', 'input[name="commish_periodic-onoff"]', function() {
        var commish_periodic_on = 99;
        if ($("input[name='commish_periodic-onoff'][value='on']").prop('checked') == true) {
            console.log('commish_periodic on');
            commish_periodic_on = 1;
        } else {
            console.log('commish_periodic off');
            commish_periodic_on = 0;
        }

        $.ajax({
            url: '/save_commish_periodic',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'commish_periodic_state' : commish_periodic_on
            },
            dataType: 'json',
            success: function (data) {
                //do nothing
            }
        });
    });
});