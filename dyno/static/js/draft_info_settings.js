$(document).ready(function() {
    console.log('ready 2');
    
    var cost_list = [];
    var pen_list = [];
    var draft_board = [];
    var autopick_info = [];
    var draft_settings = [];
    var current_pick = 0;
    $.ajax({
        url : '/draft_info_settings_data_pull',
        type: "POST",
        data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value
        },
        dataType: 'json',
        success: function(data){
            cost_list = [data.cost_yr1, data.cost_yr2, data.cost_yr3, data.cost_yr4, data.cost_yr5];
            pen_list = [data.pen_yr1, data.pen_yr2, data.pen_yr3, data.pen_yr4, data.pen_yr5];
            autopick_info = data.autopick_info;
            draft_settings = data.draft_settings;
            current_pick = data.current_pick;
            // console.log(cost_list);
            // console.log(pen_list);
            if (data.draft_board === null) {
                console.log('null');
            } else {
                // console.log(data.draft_board);
                draft_board = data.draft_board;
                fill_draft_board(data.draft_board)
            }

            fill_cap_summary(false);
            fill_autopick_table(autopick_info);
            set_draft_settings();
        }
    });

    function set_draft_settings () {
        if (draft_settings[0] === '1') {
            $("input[name=turn_off_autopick_trade][value='yes']").prop('checked', true);
        } else {
            $("input[name=turn_off_autopick_trade][value='no']").prop('checked', true);
        }

        if (draft_settings[1] === '1') {
            $("input[name=alert_draft_update][value='yes']").prop('checked', true);
        } else {
            $("input[name=alert_draft_update][value='no']").prop('checked', true);
        }

        if (draft_settings[2] === '1') {
            $("input[name=alert_with_autopick][value='yes']").prop('checked', true);
        } else {
            $("input[name=alert_with_autopick][value='no']").prop('checked', true);
        }
    }

    function fill_cap_summary (add_remaining_bool) {
        if (add_remaining_bool === false) {
            $('#yr1_cost').text('$' + cost_list[0]);
            $('#yr2_cost').text('$' + cost_list[1]);
            $('#yr3_cost').text('$' + cost_list[2]);
            $('#yr4_cost').text('$' + cost_list[3]);

            var space_yr1 = 200 - Number(cost_list[0]) - Number(pen_list[0]);
            var space_yr2 = 200 - Number(cost_list[1]) - Number(pen_list[1]);
            var space_yr3 = 200 - Number(cost_list[2]) - Number(pen_list[2]);
            var space_yr4 = 200 - Number(cost_list[3]) - Number(pen_list[3]);

            $('#yr1_space').text('$' + space_yr1.toFixed(2));
            $('#yr2_space').text('$' + space_yr2.toFixed(2));
            $('#yr3_space').text('$' + space_yr3.toFixed(2));
            $('#yr4_space').text('$' + space_yr4.toFixed(2));
        } else {
            var yr1_pick_cost = Number($('#yr1_pick_cost').text().substr(1));
            var yr2_pick_cost = Number($('#yr2_pick_cost').text().substr(1));
            var yr3_pick_cost = Number($('#yr3_pick_cost').text().substr(1));
            var yr4_pick_cost = Number($('#yr4_pick_cost').text().substr(1));
            
            var temp_cost_list = [Number(cost_list[0]) + yr1_pick_cost, Number(cost_list[1]) + yr2_pick_cost, Number(cost_list[2]) + yr3_pick_cost, Number(cost_list[3]) + yr4_pick_cost];
            
            $('#yr1_cost').text('$' + temp_cost_list[0].toFixed(2));
            $('#yr2_cost').text('$' + temp_cost_list[1].toFixed(2));
            $('#yr3_cost').text('$' + temp_cost_list[2].toFixed(2));
            $('#yr4_cost').text('$' + temp_cost_list[3].toFixed(2));

            var space_yr1 = 200 - temp_cost_list[0] - Number(pen_list[0]);
            var space_yr2 = 200 - temp_cost_list[1] - Number(pen_list[1]);
            var space_yr3 = 200 - temp_cost_list[2] - Number(pen_list[2]);
            var space_yr4 = 200 - temp_cost_list[3] - Number(pen_list[3]);

            $('#yr1_space').text('$' + space_yr1.toFixed(2));
            $('#yr2_space').text('$' + space_yr2.toFixed(2));
            $('#yr3_space').text('$' + space_yr3.toFixed(2));
            $('#yr4_space').text('$' + space_yr4.toFixed(2));
        }
        $('#yr5_cost').text('$' + cost_list[4]);
        $('#yr1_pen').text('$' + pen_list[0]);
        $('#yr2_pen').text('$' + pen_list[1]);
        $('#yr3_pen').text('$' + pen_list[2]);
        $('#yr4_pen').text('$' + pen_list[3]);
        $('#yr5_pen').text('$' + pen_list[4]);
        var space_yr5 = 200 - Number(cost_list[4]) - Number(pen_list[4]);
        $('#yr5_space').text('$' + space_yr5.toFixed(2));
    }

    function fill_autopick_table (data) {
        $('#autopick_table_tbody').empty();

        $.each(data, function(index, value) {
            console.log(value);
            var tr = $('<tr>');
            var td_pick = $('<td>');
            var td_autopick1 = $('<td>').css({'text-align' : 'right'});
            var td_autopick2 = $('<td>');
            var td_timeframe = $('<td>').addClass('autopick_select_delay');
            var td_pickorpass = $('<td>').addClass('autopick_select_pick');

            td_pick.text(value.pick).prop('id', value.pick_overall);

            var chkbox = $('<input />', {type: 'checkbox'}).addClass('autopick_checkbox');
            td_autopick1.append(chkbox);
            td_autopick2.html('&nbsp&nbspAutopick');
            // console.log(current_pick, value.pick_overall);
            if (current_pick === value.pick_overall) {
                chkbox.prop('disabled', true);
            }
            var delay_select = $('<select>').addClass('delay_select');
            var delay0 = $('<option>', {value: '0'}).text('Immediately').appendTo(delay_select);
            var delay5 = $('<option>', {value: '5'}).text('After 5 Minutes').appendTo(delay_select);
            var delay10 = $('<option>', {value: '10'}).text('After 10 Minutes').appendTo(delay_select);
            var delay15 = $('<option>', {value: '15'}).text('After 15 Minutes').appendTo(delay_select);
            var delay20 = $('<option>', {value: '20'}).text('After 20 Minutes').appendTo(delay_select);
            var delay30 = $('<option>', {value: '30'}).text('After 30 Minutes').appendTo(delay_select);
            var delay45 = $('<option>', {value: '45'}).text('After 45 Minutes').appendTo(delay_select);
            var delay60 = $('<option>', {value: '60'}).text('After 1 Hour').appendTo(delay_select);
            var delayend = $('<option>', {value: 'end'}).text('When Clock Expires').appendTo(delay_select);
            td_timeframe.append(delay_select);
            var pickorpass_select = $('<select>').addClass('pickorpass_select');
            var pick = $('<option>', {value: 'pick'}).text('Take player at top of draft board').appendTo(pickorpass_select);
            var pass = $('<option>', {value: 'pass'}).text('Pass pick').appendTo(pickorpass_select);
            td_pickorpass.append(pickorpass_select);

            if (value.player_selected === '') {
                if (value.delay === '') {
                    td_timeframe.hide();
                    td_pickorpass.hide();
                    delay15.prop('selected', true);
                } else {
                    chkbox.prop('checked', true);
                    if (value.delay === 0) {
                        delay0.prop('selected', true);
                    } else if (value.delay === 5) {
                        delay5.prop('selected', true);
                    } else if (value.delay === 10) {
                        delay10.prop('selected', true);
                    } else if (value.delay === 15) {
                        delay15.prop('selected', true);
                    } else if (value.delay === 20) {
                        delay20.prop('selected', true);
                    } else if (value.delay === 30) {
                        delay30.prop('selected', true);
                    } else if (value.delay === 45) {
                        delay45.prop('selected', true);
                    } else if (value.delay === 60) {
                        delay60.prop('selected', true);
                    } else if (value.delay === 'end') {
                        delayend.prop('selected', true);
                    }
                    if (value.skip_pick_flag === 'pick') {
                        pick.prop('selected', true);
                    } else if (value.skip_pick_flag === 'pass') {
                        pass.prop('selected', true);
                    }
                }
            } else {
                td_autopick1.empty();
                td_autopick2.empty();
                td_timeframe.empty();
                if (value.player_selected === 'pick passed') {
                    td_pickorpass.text('Pick Passed');
                } else {
                    td_pickorpass.text('You selected ' + value.player_selected);
                }
                // td_timeframe.prop('colspan', '2');
            }

            tr.append(td_pick);
            tr.append(td_autopick1);
            tr.append(td_autopick2);
            tr.append(td_timeframe);
            tr.append(td_pickorpass);
            tr.appendTo('#autopick_table_tbody');
        });

        $('.autopick_checkbox').on('click', function() {
            var state = $(this).prop('checked');
            // console.log(state);
            if (state == true) {
                $(this).parent().next().next().show();
                $(this).parent().next().next().next().show();
                // console.log($(this).parent().next());
                var p = $(this).parent().prev().prop('id');
                var d = $(this).parent().next().next().find('.delay_select').val();
                var pp = $(this).parent().next().next().next().find('.pickorpass_select').val();
                // console.log(p, d, pp);
                save_autopick_settings(p, d, pp);
            } else {
                $(this).parent().next().next().hide();
                $(this).parent().next().next().next().hide();
                // console.log($(this).parent().next());
                var p = $(this).parent().prev().prop('id');
                // console.log(p, d, pp);
                save_autopick_settings(p, '', '');
            }
        });

        $('.autopick_select_delay').on('change', function() {
            var pick = $(this).prev().prev().prev().prop('id');
            var delay = $(this).find('.delay_select').val();
            var pickorpass = $(this).next().find('.pickorpass_select').val();
            // console.log(pick, delay, pickorpass);
            save_autopick_settings(pick, delay, pickorpass);
        });

        $('.autopick_select_pick').on('change', function() {
            var pick = $(this).prev().prev().prev().prev().prop('id');
            var delay = $(this).prev().find('.delay_select').val();
            var pickorpass = $(this).find('.pickorpass_select').val();
            // console.log(pick, delay, pickorpass);
            save_autopick_settings(pick, delay, pickorpass);
        });
    }

    function save_autopick_settings (pick, delay, pickorpass) {
        $.ajax({
            url : '/save_autopick_settings',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'pick' : pick,
                'delay' : delay,
                'pickorpass' : pickorpass,
                'current_pick' : current_pick
            },
            dataType: 'json',
            success: function(data){
                
            }
        });
    }

    function fill_draft_board (data) {
        $('#draft_board_tbody').empty();

        $.each(data, function(index, value) {
            var tr = $('<tr>');
            var td_rank = $('<td>').addClass('draft_board_cell');
            var td_pos = $('<td>').addClass('draft_board_cell');
            var td_player = $('<td>').addClass('draft_board_cell').addClass('player');
            var td_college = $('<td>').addClass('draft_board_cell');
            var td_team = $('<td>').addClass('draft_board_cell');

            td_rank.text(index+1);
            td_pos.text(value.pos);
            td_player.text(value.player);
            td_college.text(value.college);
            td_team.text(value.nfl_team);

            tr.append(td_rank);
            tr.append(td_pos);
            tr.append(td_player);
            tr.append(td_college);
            tr.append(td_team);
            tr.appendTo('#draft_board_tbody');
        });

        $('.draft_board_cell').on('click', function() {
            // console.log($(this).parent().prop('id'));
            if ($(this).parent().prop('id') == 'selected') {
                $(this).parent().prop('id', 'none');
                $(this).parent().css({'color': 'inherit'});
            } else {
                $.each($('#draft_board_tbody tr'), function() {
                    $(this).prop('id', 'none');
                    $(this).css({'color' : 'inherit'});
                });
                $(this).parent().prop('id', 'selected');
                $(this).parent().css({'color': '#2d99d4'});
            }
        });
    }

    function sum_picks(team) {
        var yr_1_pick_sum = 0;
        var yr_2_pick_sum = 0;
        var yr_3_pick_sum = 0;
        var yr_4_pick_sum = 0;

        $('.pick_owner').each(function() {
            console.log($(this).text());
            if ($(this).text() == team) {
                var temp1 = Number($(this).next().text());
                var temp2 = Number($(this).next().next().text());
                var temp3 = Number($(this).next().next().next().text());
                var temp4 = Number($(this).next().next().next().next().text());
                yr_1_pick_sum = yr_1_pick_sum + temp1;
                yr_2_pick_sum = yr_2_pick_sum + temp2;
                yr_3_pick_sum = yr_3_pick_sum + temp3;
                yr_4_pick_sum = yr_4_pick_sum + temp4;
            }
        });
        $('#pick_sum_label_yr1').text(yr_1_pick_sum.toFixed(2));
        $('#pick_sum_label_yr2').text(yr_2_pick_sum.toFixed(2));
        $('#pick_sum_label_yr3').text(yr_3_pick_sum.toFixed(2));
        $('#pick_sum_label_yr4').text(yr_4_pick_sum.toFixed(2));
    }

    $('#team_pick_sum_select').on('change', function() {
        var team = $(this).val();
        sum_picks(team);
    });

    $('#include_remaining_picks_checkbox').on('click', function() {
        var state = $(this).prop('checked');
        if (state == true) {
            fill_cap_summary(true);
        } else {
            fill_cap_summary(false);
        }
    });

    $('#click_to_import').on('click', function() {
        var state = $(this).parent().prop('id');
        // console.log(state);
        if (state == 'closed') {
            $(this).parent().prop('id', 'open');
            $('#add_player_to_board_div').css({'height' : '50%'});
            $('#draft_board').css({'height' : '35%'});
            $.each($('.import_rows'), function() {
                $(this).show();
            })
        } else {
            $(this).parent().prop('id', 'closed');
            $('#add_player_to_board_div').css({'height' : '20%'});
            $('#draft_board').css({'height' : '65%'});
            $.each($('.import_rows'), function() {
                $(this).hide();
            })
        }
    });

    $('#add_individual_button').on('click', function() {
        var player_selected = $('#add_individual_select').val();
        // console.log(player_selected);
        if (player_selected !== '_blank_') {
            $.ajax({
                url : '/add_player_to_draft_board',
                type: "POST",
                data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value,
                    'player' : player_selected
                },
                dataType: 'json',
                success: function(data){
                    if (data.add_player_bool === true) {
                        draft_board = data.player_info;
                        fill_draft_board(draft_board);
                    }
                }
            });
        }
        $('#add_individual_select').val('_blank_');
    });
    
    function edit_draft_board(player, action) {
        $.ajax({
            url : '/edit_draft_board',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player' : player,
                'action' : action
            },
            dataType: 'json',
            success: function(data){
                enable_buttons();
            }
        });
    }

    function disable_buttons () {
        $('#move_up').prop('disabled', true);
        $('#move_down').prop('disabled', true);
        $('#move_delete').prop('disabled', true);
        $('#move_clear').prop('disabled', true);
    }

    function enable_buttons () {
        $('#move_up').prop('disabled', false);
        $('#move_down').prop('disabled', false);
        $('#move_delete').prop('disabled', false);
        $('#move_clear').prop('disabled', false);
    }

    $('#move_up').on('click', function() {
        disable_buttons();
        var player_selected = '';
        $.each($('#draft_board_tbody tr'), function() {
            if ($(this).prop('id') == 'selected') {
                player_selected = $(this).find('.player').text();
            }
        });
        // console.log(player_selected);
        var output = [];
        if (player_selected.length > 0) {
            var i = '';
            $.each(draft_board, function(index, value) {
                // console.log(value);
                if (value.player == player_selected) {
                    i = index;
                }
            });
            // console.log(i);
            var selected_info = draft_board[i];
            // console.log(selected_info);
            if (i == 0) {
                //do nothing
            } else {
                $.each(draft_board, function(index, value) {
                    if (index == i-1) {
                        output.push(selected_info);
                        output.push(value);
                    } else if (index == i) {
                        //pass
                    } else {
                        output.push(value);
                    }
                });
                draft_board = output;
                edit_draft_board(player_selected, 'up');
            }
            fill_draft_board(draft_board);
            $.each($('.player'), function() {
                if ($(this).text() == player_selected) {
                    $(this).parent().prop('id', 'selected');
                    $(this).parent().css({'color': '#2d99d4'});
                }
            });
        } else {
            enable_buttons();
        }
    });

    $('#move_down').on('click', function() {
        disable_buttons();
        var player_selected = '';
        $.each($('#draft_board_tbody tr'), function() {
            if ($(this).prop('id') == 'selected') {
                player_selected = $(this).find('.player').text();
            }
        });
        // console.log(player_selected);
        var output = [];
        if (player_selected.length > 0) {
            var i = '';
            $.each(draft_board, function(index, value) {
                // console.log(value);
                if (value.player == player_selected) {
                    i = index;
                }
            });
            // console.log(i);
            var selected_info = draft_board[i];
            // console.log(selected_info);
            if (i == draft_board.length-1) {
                //do nothing
            } else {
                $.each(draft_board, function(index, value) {
                    if (index == i+1) {
                        output.push(value);
                        output.push(selected_info);
                    } else if (index == i) {
                        //pass
                    } else {
                        output.push(value);
                    }
                });
                draft_board = output;
                edit_draft_board(player_selected, 'down');
            }
            fill_draft_board(draft_board);
            $.each($('.player'), function() {
                if ($(this).text() == player_selected) {
                    $(this).parent().prop('id', 'selected');
                    $(this).parent().css({'color': '#2d99d4'});
                }
            });
        } else {
            enable_buttons();
        }
    });

    $('#move_delete').on('click', function() {
        disable_buttons();
        var player_selected = '';
        $.each($('#draft_board_tbody tr'), function () {
            if ($(this).prop('id') == 'selected') {
                player_selected = $(this).find('.player').text();
            }
        });
        // console.log(player_selected);
        var output = [];
        if (player_selected.length > 0) {
            var i = '';
            $.each(draft_board, function(index, value) {
                // console.log(value);
                if (value.player == player_selected) {
                    i = index;
                }
            });
            // console.log(i);
            $.each(draft_board, function(index, value) {
                if (index == i) {
                    //pass
                } else {
                    output.push(value);
                }
            });
            draft_board = output;
            fill_draft_board(draft_board);
            edit_draft_board(player_selected, 'remove');
        } else {
            enable_buttons();
        }
    });

    $('#move_clear').on('click', function() {
        disable_buttons();
        $('.clear_board_button').hide();
        $('.confirm_clear').show();

        $('#clear_board_no').on('click', function() {
            $('.confirm_clear').hide();
            $('.clear_board_button').show();
            enable_buttons();
        });

        $('#clear_board_yes').on('click', function() {
            draft_board = [];
            edit_draft_board('', 'clear');
            fill_draft_board(draft_board);
            $('.confirm_clear').hide();
            $('.clear_board_button').show();
            enable_buttons();
        });
    });
    
    $('#cancel_import_button').on('click', function() {
        $('#click_to_import').parent().prop('id', 'closed');
        $('#add_player_to_board_div').css({'height' : '20%'});
        $('#draft_board').css({'height' : '65%'});
        $.each($('.import_rows'), function() {
            $(this).hide();
        });
    });

    $('#process_import_button').on('click', function() {
        var shortlist = $('#shortlist_select').val();
        var sort_column = $('#sort_column_select').val();
        var sort_direction = $('#sort_column_direction').val();
        $.ajax({
            url : '/import_shortlist_to_draft_board',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'shortlist' : shortlist,
                'sort_column' : sort_column,
                'direction' : sort_direction
            },
            dataType: 'json',
            success: function(data){
                $.ajax({
                    url : '/draft_info_settings_data_pull',
                    type: "POST",
                    data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value
                    },
                    dataType: 'json',
                    success: function(data){
                        cost_list = [data.cost_yr1, data.cost_yr2, data.cost_yr3, data.cost_yr4, data.cost_yr5];
                        pen_list = [data.pen_yr1, data.pen_yr2, data.pen_yr3, data.pen_yr4, data.pen_yr5];
                        // console.log(cost_list);
                        // console.log(pen_list);
                        if (data.draft_board == null) {
                            console.log('null');
                        } else {
                            console.log(data.draft_board);
                            draft_board = data.draft_board;
                            fill_draft_board(data.draft_board)
                        }
                        $('#click_to_import').parent().prop('id', 'closed');
                        $('#add_player_to_board_div').css({'height' : '20%'});
                        $('#draft_board').css({'height' : '65%'});
                        $.each($('.import_rows'), function() {
                            $(this).hide();
                        });
                    }
                });
            }
        });
    });

    $("input[type=radio]").on('click', function() {
        var state1 = $("input:radio[name='turn_off_autopick_trade']:checked").val();
        var state2 = $("input:radio[name='alert_draft_update']:checked").val();
        var state3 = $("input:radio[name='alert_with_autopick']:checked").val();
        // console.log(state1, state2, state3);
        $.ajax({
            url : '/save_draft_settings',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'state1' : state1,
                'state2' : state2,
                'state3' : state3
            },
            dataType: 'json',
            success: function(data){
                
            }
        });
    });
});