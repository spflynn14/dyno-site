$(document).ready(function() {
    console.log('ready 2');

    var $master = {};
    $('#vw_1').find('tr').each(function() {
        $master = {'daily_emails': Number($(this).find('#vw_1-1').text()),
            'daily_email_time': $(this).find('#vw_1-2').text(),
            'weekly_emails': Number($(this).find('#vw_1-3').text()),
            'weekly_emails_day': $(this).find('#vw_1-4').text(),
            'weekly_emails_time': $(this).find('#vw_1-5').text(),
            'blank_emails': Number($(this).find('#vw_1-6').text()),
            'instant_alerts': $(this).find('#vw_1-7').text()};
        $(this).remove();
    });

    var instant_alerts_list = $master.instant_alerts.split(',');

    if ($master.daily_emails == 1) {
        $('#daily_email_checkbox').prop('checked', true)
    } else {
        $('#daily_email_checkbox').prop('checked', false)
    }

    if ($master.weekly_emails == 1) {
        $('#weekly_email_checkbox').prop('checked', true)
    } else {
        $('#weekly_email_checkbox').prop('checked', false)
    }

    if ($master.blank_emails == 1) {
        $('#email_send_blank_checkbox').prop('checked', true)
    } else {
        $('#email_send_blank_checkbox').prop('checked', false)
    }

    var daily_time = '';
    var weekly_time = '';
    var temp_list = [];
    var a = '';

    temp_list = $master.daily_email_time.split(' ');
    if (temp_list[1] == 'a.m.') {
        a = 'am'
    } else {
        a = 'pm'
    }
    daily_time = temp_list[0] + ':00' + ' ' + a;
    $('#daily_email_time_select').val(daily_time);
    $master.daily_email_time = daily_time;

    temp_list = $master.weekly_emails_time.split(' ');
    if (temp_list[1] == 'a.m.') {
        a = 'am'
    } else {
        a = 'pm'
    }
    weekly_time = temp_list[0] + ':00' + ' ' + a;
    $('#weekly_email_time_select').val(weekly_time);
    $master.weekly_emails_time = weekly_time;

    $('#weekly_email_day_select').val($master.weekly_emails_day);

    if (instant_alerts_list[0] == '1') {
        $("input[name='instant_auction-outbid_checkbox'][value='yes']").prop('checked', true);
    } else {
         $("input[name='instant_auction-outbid_checkbox'][value='no']").prop('checked', true);
    }

    if (instant_alerts_list[1] == '1') {
        $("input[name='instant_auction-new_checkbox'][value='yes']").prop('checked', true);
    } else {
         $("input[name='instant_auction-new_checkbox'][value='no']").prop('checked', true);
    }

    if (instant_alerts_list[2] == '1') {
        $("input[name='instant_auction-won_checkbox'][value='yes']").prop('checked', true);
    } else {
         $("input[name='instant_auction-won_checkbox'][value='no']").prop('checked', true);
    }

    if (instant_alerts_list[3] == '1') {
        $("input[name='instant_player_cut_checkbox'][value='yes']").prop('checked', true);
    } else {
         $("input[name='instant_player_cut_checkbox'][value='no']").prop('checked', true);
    }

    if (instant_alerts_list[4] == '1') {
        $("input[name='instant_trade_accepted_checkbox'][value='yes']").prop('checked', true);
    } else {
         $("input[name='instant_trade_accepted_checkbox'][value='no']").prop('checked', true);
    }

    if (instant_alerts_list[5] == '1') {
        $("input[name='new_board_post_checkbox'][value='yes']").prop('checked', true);
    } else {
         $("input[name='new_board_post_checkbox'][value='no']").prop('checked', true);
    }


    function save_changes() {
        console.log($master);
        console.log(instant_alerts_list);
        $.ajax({
            url: '/save_team_manage_alerts',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'daily_emails': $master.daily_emails,
                'daily_email_time': $master.daily_email_time,
                'weekly_emails': $master.weekly_emails,
                'weekly_emails_day': $master.weekly_emails_day,
                'weekly_emails_time': $master.weekly_emails_time,
                'blank_emails': $master.blank_emails,
                'instant_alerts': instant_alerts_list
            },
            dataType: 'json',
            success: function (data) {
                //do nothing
            }
        });
    }



    $('#send_test_email').on('click', function() {
        $.ajax({
            url: '/send_test_email',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value
            },
            dataType: 'json',
            success: function (data) {
                //do nothing
            }
        });
    });

    $(document.body).on('click', '#daily_email_checkbox', function() {
        if ($(this).prop('checked') == true) {
            $master.daily_emails = 1;
        } else {
            $master.daily_emails = 0;
        }
        save_changes();
    });

    $(document.body).on('click', '#weekly_email_checkbox', function() {
        if ($(this).prop('checked') == true) {
            $master.weekly_emails = 1;
        } else {
            $master.weekly_emails = 0;
        }
        save_changes();
    });

    $(document.body).on('change', '#daily_email_time_select', function() {
        $master.daily_email_time = $(this).val();
        save_changes();
    });

    $(document.body).on('change', '#weekly_email_time_select', function() {
        $master.weekly_emails_time = $(this).val();
        save_changes();
    });

    $(document.body).on('change', '#weekly_email_day_select', function() {
        $master.weekly_emails_day = $(this).val();
        save_changes();
    });

    $(document.body).on('click', '#email_send_blank_checkbox', function() {
        if ($(this).prop('checked') == true) {
            $master.blank_emails = 1;
        } else {
            $master.blank_emails = 0;
        }
        save_changes();
    });

    $(document.body).on('click', 'input[type="radio"]', function() {
        if ($("input[name='instant_auction-outbid_checkbox'][value='yes']").prop('checked') == true) {
            instant_alerts_list[0] = '1'
        } else {
            instant_alerts_list[0] = '0'
        }

        if ($("input[name='instant_auction-new_checkbox'][value='yes']").prop('checked') == true) {
            instant_alerts_list[1] = '1'
        } else {
            instant_alerts_list[1] = '0'
        }

        if ($("input[name='instant_auction-won_checkbox'][value='yes']").prop('checked') == true) {
            instant_alerts_list[2] = '1'
        } else {
            instant_alerts_list[2] = '0'
        }

        if ($("input[name='instant_player_cut_checkbox'][value='yes']").prop('checked') == true) {
            instant_alerts_list[3] = '1'
        } else {
            instant_alerts_list[3] = '0'
        }

        if ($("input[name='instant_trade_accepted_checkbox'][value='yes']").prop('checked') == true) {
            instant_alerts_list[4] = '1'
        } else {
            instant_alerts_list[4] = '0'
        }

        if ($("input[name='new_board_post_checkbox'][value='yes']").prop('checked') == true) {
            instant_alerts_list[5] = '1'
        } else {
            instant_alerts_list[5] = '0'
        }

        save_changes();
    });
});