$(document).ready(function() {
    console.log('ready');

    var user_team = $('#vw_2-1').text();
    $('#vw_2').remove();

    var d = new Date();
    var today = format_date(d);
    var filtered_data = [];
    var selected_thread = 'all';

    $('#datepicker_start').datepicker({
        showButtonPanel: true
    });
    $('#datepicker_end').datepicker({
        showButtonPanel: true
    });

    $('#datepicker_end').val(today);
    var end_date = new Date(Date.parse($('#datepicker_end').val()));
    var tempd = new Date(end_date);
    tempd.setDate(tempd.getDate() - 7);
    var temp1 = format_date(tempd);
    $('#datepicker_start').val(temp1);
    $('#filter_week_div').css({'border' : '2px dashed #2d99d4'});

    var $master = [];
    $('#vw_1').find('tr').each(function() {
        $master.push({'team1': $(this).find('#vw_1-1').text(),
            'team2': $(this).find('#vw_1-2').text(),
            'trade_thread': $(this).find('#vw_1-3').text(),
            'date': $(this).find('#vw_1-4').text(),
            'expiration_date': $(this).find('#vw_1-5').text(),
            'pro_players': $(this).find('#vw_1-6').text(),
            'pro_picks': $(this).find('#vw_1-7').text(),
            'pro_assets': $(this).find('#vw_1-8').text(),
            'pro_cash': $(this).find('#vw_1-9').text(),
            'opp_players': $(this).find('#vw_1-10').text(),
            'opp_picks': $(this).find('#vw_1-11').text(),
            'opp_assets': $(this).find('#vw_1-12').text(),
            'opp_cash': $(this).find('#vw_1-13').text(),
            'message': $(this).find('#vw_1-14').text(),
            'status1': $(this).find('#vw_1-15').text(),
            'status2': $(this).find('#vw_1-16').text(),
            'status3': $(this).find('#vw_1-17').text(),
            'date_iso': $(this).find('#vw_1-18').text(),
            'expiration_iso': $(this).find('#vw_1-19').text(),
            'id': Number($(this).find('#vw_1-20').text())});
        $(this).remove();
    });

    filtered_data = filter_by_date($master);
    fill_table(filtered_data);
    $("table").tablesorter();

    function format_date (data) {
        var month = data.getMonth()+1;
        var day = data.getDate();
        var return_date =  (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + data.getFullYear();
        return return_date;
    }

    function daysInMonth(month,year) {
        return new Date(year, month, 0).getDate();
    }

    function filter_by_date (data) {
        var f_data = [];

        if ($('#datepicker_start').val() == '') {
            return data;
        }

        var d1 = $('#datepicker_start').val();
        var d2 = $('#datepicker_end').val();
        var from = new Date(Date.parse(d1));
        var to   = new Date(Date.parse(d2));
        to.setDate(to.getDate() + 1);

        $.each(data, function(index, value) {
            var r = new Date(Date.parse(value.date_iso));
            if (r > from && r < to == true) {
                f_data.push(value);
            }
        });

        return f_data;
    }

    function filter_by_trade_thread (data) {
        var output = [];
        $.each(data, function(index, value) {
            if (value.trade_thread == selected_thread) {
                output.push(value);
            }
        });
        return output;
    }

    function fill_table (data) {
        $('#team_trade_log_body').empty();

        $.each(data, function(index, value) {
            var tr = $('<tr>');
            var tr_2 = $('<tr>').css({'border-bottom' : '1px solid #cdcdcd'});

            var td_date = $('<td>').css({'vertical-align' : 'top'});
            var td_from_to = $('<td>').css({'vertical-align' : 'top'});
            var td_opp_team = $('<td>').css({'vertical-align' : 'top'});
            var td_status = $('<td>').css({'vertical-align' : 'top'});
            var td_expiration = $('<td>').css({'vertical-align' : 'top'});
            var td_pro_pieces = $('<td>').css({'vertical-align' : 'top'});
            var td_opp_pieces = $('<td>').css({'vertical-align' : 'top'});
            var td_comments = $('<td>').css({'vertical-align' : 'top'});
            var td_thread = $('<td>').css({'vertical-align' : 'top', 'text-align' : 'center'});
            var td_button = $('<td>').css({'vertical-align' : 'top'});

            td_date.text(value.date).val(value.date_iso);

            if (value.team1 == user_team) {
                td_from_to.text('To');
                td_opp_team.text(value.team2);
            } else {
                td_from_to.text('From');
                td_opp_team.text(value.team1);
            }

            var status_text = determine_status(value);
            td_status.text(status_text);

            td_expiration.text(value.expiration_date);

            $.when(get_trade_data(value)).done(function(trade_data) {
                var verbose_pro_string = '';
                $.each(trade_data.pro_players, function(index, value) {
                    verbose_pro_string = verbose_pro_string + value + '; ';
                });
                $.each(trade_data.pro_picks, function(index, value) {
                    verbose_pro_string = verbose_pro_string + value + '; ';
                });
                $.each(trade_data.pro_assets, function(index, value) {
                    verbose_pro_string = verbose_pro_string + value + '; ';
                });
                $.each(trade_data.pro_cash, function(index, value) {
                    verbose_pro_string = verbose_pro_string + value + '; ';
                });

                var verbose_opp_string = '';
                $.each(trade_data.opp_players, function(index, value) {
                    verbose_opp_string = verbose_opp_string + value + '; ';
                });
                $.each(trade_data.opp_picks, function(index, value) {
                    verbose_opp_string = verbose_opp_string + value + '; ';
                });
                $.each(trade_data.opp_assets, function(index, value) {
                    verbose_opp_string = verbose_opp_string + value + '; ';
                });
                $.each(trade_data.opp_cash, function(index, value) {
                    verbose_opp_string = verbose_opp_string + value + '; ';
                });
                 
                verbose_pro_string = verbose_pro_string.substring(0, verbose_pro_string.length -2);
                verbose_opp_string = verbose_opp_string.substring(0, verbose_opp_string.length -2);

                if (value.team1 == user_team) {
                    td_pro_pieces.text(verbose_pro_string);
                    td_opp_pieces.text(verbose_opp_string);
                } else {
                    td_pro_pieces.text(verbose_opp_string);
                    td_opp_pieces.text(verbose_pro_string);
                }
            });

            td_comments.text(value.message);
            td_thread.text(value.trade_thread);

            var button = $('<button>').addClass('view_trade_button').text('View / Respond');
            td_button.append(button);

            tr.append(td_date);
            tr.append(td_from_to);
            tr.append(td_opp_team);
            tr.append(td_status);
            tr.append(td_expiration);
            tr.append(td_pro_pieces);
            tr.append(td_opp_pieces);
            tr.append(td_thread);
            tr.append(td_comments);

            if (value.status3 != 'Closed') {
                tr.append(td_button);
            }

            tr.appendTo('#team_trade_log_body');
        });
        $('table').trigger('update');
    }

    function determine_status (data) {
        if (data.status2 == 'Withdrawn') {
            return 'Offer Withdrawn';
        } else if (data.status2 == 'Expired') {
            return 'Offer Expired';
        } else if (data.status2 == 'Invalid') {
            return 'Invalid Offer';
        }
        if (data.status1 == 'Offer') {
            return 'Initial Offer';
        } else if (data.status1 == 'Rejection') {
            return 'Offer Rejected';
        } else if (data.status1 == 'Accepted') {
            return 'Offer Accepted';
        } else if (data.status1 == 'Counter') {
            return 'Counter Offer';
        }
    }

    function get_trade_data (data) {
        return $.ajax({
            url: '/get_verbose_trade_data',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'trade_id' : data.id
            },
            dataType: 'json',
            success: function (return_data) {
                //do nothing
            }
        });
    }




    $('#filter_24_hours_button').on('click', function() {
        var end_date = new Date(Date.parse($('#datepicker_end').val()));
        var tempd = new Date(end_date);
        tempd.setDate(tempd.getDate() - 1);
        var temp1 = format_date(tempd);
        $('#datepicker_start').val(temp1);
        $('#filter_24_hours_div').css({'border' : '2px dashed #2d99d4'});
        $('#filter_48_hours_div').css({'border' : '2px dashed white'});
        $('#filter_72_hours_div').css({'border' : '2px dashed white'});
        $('#filter_week_div').css({'border' : '2px dashed white'});
        $('#filter_month_div').css({'border' : '2px dashed white'});
        var output1 = filter_by_date($master);
        fill_table(output1);
    });

    $('#filter_48_hours_button').on('click', function() {
        var end_date = new Date(Date.parse($('#datepicker_end').val()));
        var tempd = new Date(end_date);
        tempd.setDate(tempd.getDate() - 2);
        var temp1 = format_date(tempd);
        $('#datepicker_start').val(temp1);
        $('#filter_24_hours_div').css({'border' : '2px dashed white'});
        $('#filter_48_hours_div').css({'border' : '2px dashed #2d99d4'});
        $('#filter_72_hours_div').css({'border' : '2px dashed white'});
        $('#filter_week_div').css({'border' : '2px dashed white'});
        $('#filter_month_div').css({'border' : '2px dashed white'});
        var output1 = filter_by_date($master);
        fill_table(output1);
    });

    $('#filter_72_hours_button').on('click', function() {
        var end_date = new Date(Date.parse($('#datepicker_end').val()));
        var tempd = new Date(end_date);
        tempd.setDate(tempd.getDate() - 3);
        var temp1 = format_date(tempd);
        $('#datepicker_start').val(temp1);
        $('#filter_24_hours_div').css({'border' : '2px dashed white'});
        $('#filter_48_hours_div').css({'border' : '2px dashed white'});
        $('#filter_72_hours_div').css({'border' : '2px dashed #2d99d4'});
        $('#filter_week_div').css({'border' : '2px dashed white'});
        $('#filter_month_div').css({'border' : '2px dashed white'});
        var output1 = filter_by_date($master);
        fill_table(output1);
    });

    $('#filter_week_button').on('click', function() {
        var end_date = new Date(Date.parse($('#datepicker_end').val()));
        var tempd = new Date(end_date);
        tempd.setDate(tempd.getDate() - 7);
        var temp1 = format_date(tempd);
        $('#datepicker_start').val(temp1);
        $('#filter_24_hours_div').css({'border' : '2px dashed white'});
        $('#filter_48_hours_div').css({'border' : '2px dashed white'});
        $('#filter_72_hours_div').css({'border' : '2px dashed white'});
        $('#filter_week_div').css({'border' : '2px dashed #2d99d4'});
        $('#filter_month_div').css({'border' : '2px dashed white'});
        var output1 = filter_by_date($master);
        fill_table(output1);
    });

    $('#filter_month_button').on('click', function() {
        var end_date = new Date(Date.parse($('#datepicker_end').val()));
        var m = end_date.getMonth();
        var y = end_date.getFullYear();
        if (m == 0) {
            m = 12;
            y = y - 1;
        }
        var month_days = daysInMonth(m, y);
        var tempd = new Date(end_date);
        tempd.setDate(tempd.getDate() - month_days);
        var temp1 = format_date(tempd);
        $('#datepicker_start').val(temp1);
        $('#filter_24_hours_div').css({'border' : '2px dashed white'});
        $('#filter_48_hours_div').css({'border' : '2px dashed white'});
        $('#filter_72_hours_div').css({'border' : '2px dashed white'});
        $('#filter_week_div').css({'border' : '2px dashed white'});
        $('#filter_month_div').css({'border' : '2px dashed #2d99d4'});
        var output1 = filter_by_date($master);
        fill_table(output1);
    });

    $('#datepicker_start').on('change', function() {
        $('#filter_24_hours_div').css({'border' : '2px dashed white'});
        $('#filter_48_hours_div').css({'border' : '2px dashed white'});
        $('#filter_72_hours_div').css({'border' : '2px dashed white'});
        $('#filter_week_div').css({'border' : '2px dashed white'});
        $('#filter_month_div').css({'border' : '2px dashed white'});
        var output1 = filter_by_date($master);
        filtered_data = filter_by_cat(output1);
        fill_table(filtered_data);
    });

    $('#datepicker_end').on('change', function() {
        $('#filter_24_hours_div').css({'border' : '2px dashed white'});
        $('#filter_48_hours_div').css({'border' : '2px dashed white'});
        $('#filter_72_hours_div').css({'border' : '2px dashed white'});
        $('#filter_week_div').css({'border' : '2px dashed white'});
        $('#filter_month_div').css({'border' : '2px dashed white'});
        var output1 = filter_by_date($master);
        fill_table(output1);
    });

    $('#thread_input').on('keyup', function() {
        selected_thread = $(this).val();
        if (selected_thread.length == 0) {
            var output1 = filter_by_date($master);
            fill_table(output1);
        } else {
            var output1 = filter_by_date($master);
            filtered_data = filter_by_trade_thread(output1);
            fill_table(filtered_data);
        }
    });

    $(document).on('click', '.view_trade_button', function() {
        var date_identifier = $(this).parent().prev().prev().prev().prev().prev().prev().prev().prev().prev().val();
        var trade_id = '';
        $.each($master, function(index, value) {
            if (value.date_iso == date_identifier) {
                trade_id = value.id;
            }
        });
        $.ajax({
            url: '/save_redirect_trade_data',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'trade_id' : trade_id,
                'from' : 'trade log'
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/confirm_trade';
            }
        });
    });
});