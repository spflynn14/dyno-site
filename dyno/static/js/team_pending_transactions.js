$(document).ready(function() {
    console.log('ready 2');

    var $user_team = $('#vw_2-1').text();
    $('#vw_2').remove();

    var num_buttons = 0;

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
            'iso_date': $(this).find('#vw_1-14').text()});
        $(this).remove();
    });

    fill_table();

    function fill_table () {
        $.each($master, function (index, value) {
            var tr = $('<tr>');
            var td_date = $('<td>');
            var td_player = $('<td>');
            var td_transtype = $('<td>');
            var td_details = $('<td>');
            var td_pendingtime = $('<td>');
            var td_actions = $('<td>');
            var td_comments = $('<td>');

            td_date.text(value.date);

            if (value.player == 'trade') {
                td_player.text('');
            } else {
                td_player.text(value.player);
            }

            td_transtype.text(value.transaction_type);
            td_details.text(determine_details(value));
            var temp = determine_pending_time(value);
            var converted_time = convert_time(temp);
            td_pendingtime.text(converted_time);
            var actions = get_actions(value);
            $.each(actions, function (index, action_value) {
                var temp_button = make_button(action_value, value);
                td_actions.append(temp_button);
            });
            var comments = get_comments(actions);
            td_comments.text(comments);

            tr.append(td_date);
            tr.append(td_player);
            tr.append(td_transtype);
            tr.append(td_details);
            tr.append(td_pendingtime);
            tr.append(td_actions);
            tr.append(td_comments);
            tr.appendTo('#team_pending_transactions_body');
        });

        if (num_buttons == 0) {
            $('#message_area').text('You have 0 items that require action');
            $('#message_area').css({'color': 'black'});
        } else if (num_buttons == 1) {
            $('#message_area').text('You have ' + num_buttons + ' item that requires action');
            $('#message_area').css({'color': 'red'});
        } else {
            $('#message_area').text('You have ' + num_buttons + ' items that require action');
            $('#message_area').css({'color': 'red'});
        }
    }

    function determine_details (data) {
        var return_text = '';

        if (data.transaction_type == 'Auction End') {
            return_text = 'Auction Won ($' + data.var_d1 + ')'
        } else if (data.transaction_type == 'Contract Set') {
            return_text = "You have set this player's contract. Waiting for commish's office to process.";
        } else if (data.transaction_type == 'Waiver Extension') {
            return_text = "You have submitted this player's waiver extension. Waiting for commish's office to process.";
        } else if (data.transaction_type == 'Franchise Tag') {
            return_text = "You have submitted this player as your Franchise Tag. The auction for him will begin March 1.";
        } else if (data.transaction_type == 'Transition Tag') {
            return_text = "You have submitted this player's Transition Tag. Waiting for commish's office to process.";
        } else if (data.transaction_type == 'Extension Submitted') {
            return_text = "You have submitted an extension for this player. Waiting for commish's office to process.";
        } else if (data.transaction_type == 'Player Cut') {
            return_text = "You have designated this player to be released. Waiting for commish's office to process.";
        } else if (data.transaction_type == 'Trade Offer') {
            if (data.team1 == $user_team) {
                return_text = "You have sent a trade offer to " + data.team2 + ".";
            } else {
                return_text = data.team1 + " has sent a trade offer to you.";
            }
        } else if (data.transaction_type == 'Counter Offer') {
            if (data.team1 == $user_team) {
                return_text = "You have sent a counter offer to " + data.team2 + ".";
            } else {
                return_text = data.team1 + " has sent a counter offer to you.";
            }
        } else if (data.transaction_type == 'Trade Accepted') {
            return_text = "You have agreed to a trade. Waiting for commish's office to process.";
        } else if (data.transaction_type == 'Restructure Contract') {
            return_text = "You have restructured this player's contract. Waiting for commish's office to process.";
        }

        return return_text;
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

    function get_actions (data) {
        var action_list = [];
        if (data.transaction_type == 'Auction End') {
            action_list.push('Set Contract Structure')
        } else if (data.transaction_type == 'Trade Offer') {
            action_list.push('Trade Offer');
        } else if (data.transaction_type == 'Counter Offer') {
            action_list.push('Counter Offer');
        }

        return action_list;
    }

    function get_comments (action_list) {
        var comment_list = [];
        $.each(action_list, function(index, value) {
            if (value == 'Set Contract Structure') {
                comment_list.push("You may structure this player's contract. You have 48 hours to do so.")
            }
        });

        return comment_list;
    }

    function make_button (actions, data) {
        var button = $('<button>');

        if (actions == 'Set Contract Structure') {
            button.text('Set Contract Structure');
            button.addClass('set_con_str');
            num_buttons = num_buttons + 1;
        } else if (actions == 'Trade Offer') {
            button.text('View / Respond');
            button.addClass('trade_offer_button');
            button.val(data.var_i1);
            if (data.team2 == $user_team) {
                num_buttons = num_buttons + 1;
            }
        } else if (actions == 'Counter Offer') {
            button.text('View / Respond');
            button.addClass('trade_offer_button');
            button.val(data.var_i1);
            if (data.team2 == $user_team) {
                num_buttons = num_buttons + 1;
            }
        }
        return button;
    }


    $(document).on('click', '.set_con_str', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        var player_clicked = $(this).parent().prev().prev().prev().prev().text();

        $.ajax({
            url: '/set_player_for_contract_structure',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player' : player_clicked
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/set_contract_structure';
            }
        });
    });

    $(document).on('click', '.trade_offer_button', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        var trade_id = $(this).val();

        $.ajax({
            url: '/save_redirect_trade_data',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'trade_id' : trade_id,
                'from' : 'pending transaction'
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/confirm_trade';
            }
        });
    });
});