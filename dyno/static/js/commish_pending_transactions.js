$(document).ready(function() {
    console.log('ready');

    var $master = [];
    $('#vw_1').find('tr').each(function() {
        $master.push({'date': $(this).find('#vw_1-1').text(),
            'player': $(this).find('#vw_1-2').text(),
            'team1': $(this).find('#vw_1-3').text(),
            'team2': $(this).find('#vw_1-4').text(),
            'transaction_type': $(this).find('#vw_1-5').text(),
            'var_d1': $(this).find('#vw_1-6').text(),
            'var_d2': $(this).find('#vw_1-7').text(),
            'var_d3': $(this).find('#vw_1-8').text(),
            'var_i1': $(this).find('#vw_1-9').text(),
            'var_i2': $(this).find('#vw_1-10').text(),
            'var_t1': $(this).find('#vw_1-11').text(),
            'var_t2': $(this).find('#vw_1-12').text(),
            'var_t3': $(this).find('#vw_1-13').text(),
            'iso_date': $(this).find('#vw_1-14').text(),
            'id': $(this).find('#vw_1-15').text()});
        $(this).remove();
    });

    fill_table();

    function fill_table () {
        $.each($master, function(index, value) {
            var tr = $('<tr>');
            var td_date = $('<td>');
            var td_player = $('<td>');
            var td_transtype = $('<td>');
            var td_pendingtime = $('<td>');
            var td_team1 = $('<td>');
            var td_team2 = $('<td>');
            var td_var_t1 = $('<td>');
            var td_var_t2 = $('<td>');
            var td_var_t3 = $('<td>');

            var a_date = $('<a>');
            a_date.addClass('date_link');
            a_date.text(value.date);

            td_date.append(a_date);
            td_player.text(value.player);
            td_transtype.text(value.transaction_type);
            var temp = determine_pending_time(value);
            var converted_time = convert_time(temp);
            td_pendingtime.text(converted_time);
            td_team1.text(value.team1);
            td_team2.text(value.team2);
            td_var_t1.text(value.var_t1);
            td_var_t2.text(value.var_t2);
            td_var_t3.text(value.var_t3);

            tr.append(td_date);
            tr.append(td_player);
            tr.append(td_transtype);
            tr.append(td_pendingtime);
            tr.append(td_team1);
            tr.append(td_team2);
            tr.append(td_var_t1);
            tr.append(td_var_t2);
            tr.append(td_var_t3);
            tr.appendTo('#commish_pending_transactions_body');
        });
    }

    function determine_pending_time (data) {
        var row_date = new Date(Date.parse(data.iso_date));

        var now = new Date($.now());
        var diff_min = ((now - row_date) / 1000) / 60;

        return diff_min;
    }

    function convert_time (data) {
        if (data >= 1440) {
            var hours = Math.floor((data / 60));
            var days = Math.floor((hours / 24));
            hours = hours - (days * 24);
            var min = Math.floor((data - (hours * 60) - (days * 60 * 24)));
            return days + ' days, ' + hours + ' hours, ' + min + ' minutes';
        } else if (data > 60) {
            var hours = Math.floor((data / 60));
            var min = Math.floor(data - (hours * 60));
            return hours + ' hours, ' + min + ' minutes';
        } else if (data >= 2) {
            return Math.floor(data) + ' minutes';
        } else if (data >= 1) {
            return Math.floor(data) + ' minute';
        } else if (data >= 0) {
            return 'less than a minute...'
        } else {
            return 'Uhhh, error'
        }
    }



    $('.date_link').on('click', function() {
        var player_selected = $(this).parent().next().text();
        var id = 0;
        $.each($master, function(index, value) {
            if (value.player == player_selected) {
                id = Number(value.id);
            }
        });
        $.ajax({
            url: '/get_data_for_transaction_single_player',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'id' : id
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/transaction_single_player';
            }
        });
    });
});