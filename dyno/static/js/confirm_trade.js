$(document).ready(function() {
    console.log('ready confirm 4');

    var secondary_flag = '';

    var view_flag_text = $('#vw_3-1').text();
    var view_flag_trade_id = Number($('#vw_3-2').text());
    $('#vw_3').remove();

    if (view_flag_text == 'trade log') {
        $.when(get_trade_data(view_flag_trade_id)).done(function(a1) {
            var trade_data = JSON.parse(a1.trade_data);
            var temp = new Date(trade_data[0].fields.expiration_date);
            var temp2 = temp.toString().split(' ');
            var temp3 = temp2[0] + ' ' + temp2[1] + ' ' + temp2[2] + ' ' + temp2[3] + ',  ';
            var temp1 = temp3 + temp.toLocaleTimeString();
            $('#proposal_expiration_text').text(temp1).css({'vertical-align' : 'top'});
            $('#trade_comments_text_label').text(trade_data[0].fields.message);
        });
    } else if (view_flag_text == 'pending transaction') {
        $.when(get_trade_data(view_flag_trade_id)).done(function(a1) {
            var trade_data = JSON.parse(a1.trade_data);
            var temp = new Date(trade_data[0].fields.expiration_date);
            var temp2 = temp.toString().split(' ');
            var temp3 = temp2[0] + ' ' + temp2[1] + ' ' + temp2[2] + ' ' + temp2[3] + ',  ';
            var temp1 = temp3 + temp.toLocaleTimeString();
            $('#proposal_expiration_text').text(temp1).css({'vertical-align' : 'top'});
            $('#trade_comments_text_label').text(trade_data[0].fields.message);
        });
    }

    function get_trade_data (data) {
        return $.ajax({
            url: '/get_trade_data_for_alerts',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'trade_id' : data
            },
            dataType: 'json',
            success: function (return_data) {
                //do nothing
            }
        });
    }

    function add_comment_box () {
        $('#trade_button_row').hide();
        $('#secondary_bottom_row').show();
    }

    $('#trade_confirm_button').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        $('#message_text').text('Processing, please wait......');

        var expiration_time = $('#trade_expiration_select').val();
        var comments = $('#trade_comments_text').val();

        if (view_flag_text == 'counter offer') {
            $.ajax({
                url: '/process_trade',
                type: 'POST',
                data: {
                    csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                    'process_instruction': 'finish counter offer',
                    'expiration_time': expiration_time,
                    'comments': comments,
                    'trade_id' : view_flag_trade_id
                },
                dataType: 'json',
                success: function (data) {
                    location.href = '/team/trade_log';
                }
            });
        } else {
            $.ajax({
                url: '/process_trade',
                type: 'POST',
                data: {
                    csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                    'process_instruction': 'confirm initial offer',
                    'expiration_time': expiration_time,
                    'comments': comments
                },
                dataType: 'json',
                success: function (data) {
                    location.href = '/team/pending_transactions';
                }
            });
        }
    });

    $('#trade_cancel_button').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        location.href = '/team/trade';
    });

    $('#trade_go_back_button').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        if (view_flag_text == 'trade log') {
            location.href = '/team/trade_log';
        } else if (view_flag_text == 'pending transaction') {
            location.href = '/team/pending_transactions';
        } else {
            location.href = '/team/trade';
        }
    });

    $('#trade_reject_button').on('click', function() {
        $('#message_text').text('If you would like to include a comment with your rejection, type it in the box below. When finished, click Submit.');
        add_comment_box();
        secondary_flag = 'reject offer';
    });

    $('#trade_accept_button').on('click', function() {
        $('#message_text').text('If you would like to include a comment with your acceptance, type it in the box below. When finished, click Submit.');
        add_comment_box();
        secondary_flag = 'accept offer';
    });

    $('#trade_counter_button').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);

        $.ajax({
            url: '/process_trade',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'process_instruction' : 'counter offer',
                'trade_id' : view_flag_trade_id
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/team/trade';
            }
        });
    });

    $('#trade_withdraw_button').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);

        $.ajax({
            url: '/process_trade',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'process_instruction' : 'withdraw',
                'trade_id' : view_flag_trade_id
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/team/trade_log';
            }
        });
    });

    $('#secondary_confirm_button').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        var comments = $('#secondary_comments_text').val();

        $('#secondary_bottom_row').hide();
        $('#message_text').text('Processing........');

        $.ajax({
            url: '/process_trade',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'process_instruction' : secondary_flag,
                'comments' : comments,
                'trade_id' : view_flag_trade_id
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/team/trade_log';
            }
        });
    });
});