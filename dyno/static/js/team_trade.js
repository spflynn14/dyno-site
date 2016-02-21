$(document).ready(function() {
    console.log('ready 3');

    var $draft_picks = [];
    var $assets = [];
    var $cap_space = [];
    var $player_list = [];
    var $year_list = [];
    
    var team_selected = '';

    $year_list.push(Number($('#vw_1-1').text()));
    $year_list.push(Number($('#vw_1-2').text()));
    $year_list.push(Number($('#vw_1-3').text()));
    $year_list.push(Number($('#vw_1-4').text()));
    $year_list.push(Number($('#vw_1-5').text()));
    var $opp_team = $('#vw_1-6').text();
    var opp_players = $('#vw_1-7').text();
    var opp_picks = $('#vw_1-8').text();
    var opp_assets = $('#vw_1-9').text();
    var opp_cash = $('#vw_1-10').text();
    var view_flag_text = $('#vw_1-11').text();
    var is_proposing_team = $('#vw_1-12').text();
    var view_flag_trade_id = $('#vw_1-13').text();
    $('#vw_1').remove();

    var $opp_players = opp_players.trim().split(':');
    var $opp_picks = opp_picks.trim().split(':');
    var $opp_assets = opp_assets.trim().split(':');
    var $opp_cash = opp_cash.trim().split(':');

    $.each($opp_picks, function(index, value) {
        if (value != '') {
            $opp_picks[index] = Number(value);
        }
    });

    $.each($opp_assets, function(index, value) {
        if (value != '') {
            $opp_assets[index] = Number(value);
        }
    });

    $.each($opp_cash, function(index, value) {
        $opp_cash[index] = Number(value);
    });

    console.log($opp_team);
    console.log($opp_players);
    console.log($opp_picks);
    console.log($opp_assets);
    console.log($opp_cash);

    var $master = [];
    $('#vw_2').find('tr').each(function() {
        $master.push({'player': $(this).find('#vw_2-1').text(),
            'yr1_cost': Number($(this).find('#vw_2-2').text()) + Number($(this).find('#vw_2-7').text()),
            'yr2_cost': Number($(this).find('#vw_2-3').text()) + Number($(this).find('#vw_2-8').text()),
            'yr3_cost': Number($(this).find('#vw_2-4').text()) + Number($(this).find('#vw_2-9').text()),
            'yr4_cost': Number($(this).find('#vw_2-5').text()) + Number($(this).find('#vw_2-10').text()),
            'yr5_cost': Number($(this).find('#vw_2-6').text()) + Number($(this).find('#vw_2-11').text())});
        $(this).remove();
    });

    if ($opp_team == '') {
        $('#trade_submit_button_area').hide();
        $('#trade_opp_team_area').hide();
        $('#trade_right_area').hide();
    } else {
        team_selected = $opp_team;
        $('#trade_opp_team_area').text(team_selected);
        show_team();
    }


    function fill_draft_pick_table (data) {
        $('#trade_right_picks_body').empty();

        $.each(data, function(index, value) {
            var tr = $('<tr>').css({'height' : '25px'});
            var td_checkbox = $('<td>');
            var td_text = $('<td>');

            var checkbox = $('<input>').prop('type', 'checkbox').val(value.pk);
            td_checkbox.append(checkbox);

            if ($.inArray(value.pk, $opp_picks) != -1) {
                checkbox.prop('checked', 'true');
            }

            if (value.fields.pick_overall != 0) {
                if (value.fields.pick_in_round > 9) {
                    td_text.text(value.fields.year + ' ' + value.fields.round + '.' + value.fields.pick_in_round + ' pick').css({'padding-left': '8px'});
                } else {
                    td_text.text(value.fields.year + ' ' + value.fields.round + '.0' + value.fields.pick_in_round + ' pick').css({'padding-left': '8px'});
                }
            } else {
                if (value.fields.owner != value.fields.original_owner) {
                    td_text.text(value.fields.year + ' round ' + value.fields.round + ' pick (' + value.fields.original_owner + ')').css({'padding-left': '8px'});
                } else {
                    td_text.text(value.fields.year + ' round ' + value.fields.round + ' pick').css({'padding-left': '8px'});
                }
            }

            tr.append(td_checkbox);
            tr.append(td_text);
            tr.appendTo('#trade_right_picks_body');
        });
    }

    function fill_assets_table (data) {
        $('#trade_right_assets_body').empty();

        $.each(data, function(index, value) {
            var tr = $('<tr>').css({'height': '25px'});
            var td_checkbox = $('<td>');
            var td_text = $('<td>');

            var checkbox = $('<input>').prop('type', 'checkbox').val(value.pk);
            td_checkbox.append(checkbox);

            if ($.inArray(value.pk, $opp_assets) != -1) {
                checkbox.prop('checked', 'true');
            }

            if (value.fields.asset_type == 'Amnesty') {
                td_text.text(value.fields.asset_type + ' (' + value.fields.var_i1 + '%)').css({'padding-left': '8px'});
            } else if (value.fields.asset_type == 'Salary Cap Boon') {
                td_text.text(value.fields.asset_type + ' ($' + value.fields.var_d1 + ')').css({'padding-left': '8px'});
            } else {
                td_text.text(value.fields.asset_type).css({'padding-left': '8px'});
            }

            tr.append(td_checkbox);
            tr.append(td_text);
            tr.appendTo('#trade_right_assets_body');
        });
    }

    function fill_cash_table (data) {
        $('#trade_right_cash_body').empty();

        $.each(data, function(index, value) {
            var tr = $('<tr>').css({'height': '30px'});
            var td_input = $('<td>');
            var td_text = $('<td>');

            var input_box = $('<input>').prop('type', 'text').prop('size', '4');
            td_input.text('Enter Amount:  ');
            td_input.append(input_box);

            if ($opp_cash[index] != 0 && isNaN($opp_cash[index]) == false) {
                if (team_selected == $opp_team) {
                    input_box.val($opp_cash[index]);
                }
            }

            td_text.text($year_list[index] + ' Cash ($' + value + ' available)').css({'padding-left': '6px'});

            if (value < 0) {
                input_box.prop('disabled', true);
            }

            tr.append(td_input);
            tr.append(td_text);
            tr.appendTo('#trade_right_cash_body');
        });
    }

    function fill_player_table (data) {
        $('#trade_right_players_body').empty();

        $.each(data, function(index, value) {
            var tr = $('<tr>').css({'height': '25px'});
            var td_checkbox = $('<td>');
            var td_pos = $('<td>');
            var td_player = $('<td>');
            var td_yrs_left = $('<td>');
            var td_yearly_cost = $('<td>');
            var td_cap_hit = $('<td>');

            var checkbox = $('<input>').prop('type', 'checkbox').val(value.fields.name);
            td_checkbox.append(checkbox);

            if ($.inArray(value.fields.name, $opp_players) != -1) {
                checkbox.prop('checked', 'true');
            }

            td_pos.text(value.fields.position).css({'text-align' : 'center'});
            td_player.text(value.fields.name);

            var yrs_left = years_remaining(value.fields);
            td_yrs_left.text(yrs_left).css({'text-align' : 'center'});

            var avg_yearly = average_yearly_cost(value.fields, yrs_left);
            td_yearly_cost.text('$' + avg_yearly.toFixed(2)).css({'text-align' : 'center'});

            var year_selected = Number($('#trade_year_cost_select').val());
            var cap_hit = 0;
            if (year_selected == 0) {
                cap_hit = Number(value.fields.yr1_salary) + Number(value.fields.yr1_sb);
            } else if (year_selected == 1) {
                cap_hit = Number(value.fields.yr2_salary) + Number(value.fields.yr2_sb);
            } else if (year_selected == 2) {
                cap_hit = Number(value.fields.yr3_salary) + Number(value.fields.yr3_sb);
            } else if (year_selected == 3) {
                cap_hit = Number(value.fields.yr4_salary) + Number(value.fields.yr4_sb);
            } else if (year_selected == 4) {
                cap_hit = Number(value.fields.yr5_salary) + Number(value.fields.yr5_sb);
            }
            if (cap_hit == 0) {
                td_cap_hit.text('-').css({'text-align' : 'center'});
            } else {
                td_cap_hit.text('$' + cap_hit.toFixed(2)).css({'text-align': 'center'});
            }

            tr.append(td_checkbox);
            tr.append(td_pos);
            tr.append(td_player);
            tr.append(td_yrs_left);
            tr.append(td_yearly_cost);
            tr.append(td_cap_hit);
            tr.appendTo('#trade_right_players_body');
        });
    }

    function years_remaining (data) {
        var years_left = 0;

        if (data.yr1_salary != 0) {
            years_left = years_left + 1;
        }
        if (data.yr2_salary != 0) {
            years_left = years_left + 1;
        }
        if (data.yr3_salary != 0) {
            years_left = years_left + 1;
        }
        if (data.yr4_salary != 0) {
            years_left = years_left + 1;
        }
        if (data.yr5_salary != 0) {
            years_left = years_left + 1;
        }

        return years_left;
    }

    function average_yearly_cost (data, yrs_left) {
        return data.total_value/yrs_left;
    }

    function show_team () {
        $.ajax({
            url: '/load_trade_opp_data',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'team_selected' : team_selected
            },
            dataType: 'json',
            success: function (data) {
                $draft_picks = JSON.parse(data.draft_picks);
                $assets = JSON.parse(data.assets);
                $cap_space = data.cap_space;
                $player_list = JSON.parse(data.player_list);

                fill_draft_pick_table($draft_picks);
                fill_assets_table($assets);
                fill_cash_table($cap_space);
                fill_player_table($player_list);
            }
        });
    }




    $('#trade_year_cost_select').on('change', function() {
        fill_player_table($player_list);
        var year_selected = Number($(this).val());
        $('#trade_left_year_header').text($year_list[year_selected] + ' Cost');
        $('#trade_right_year_header').text($year_list[year_selected] + ' Cost');

        $('.trade_left_cost_text').each(function() {
            var p = $(this).prev().prev().prev().text();
            var new_text = 0;
            $.each($master, function(index, value) {
                if (value.player == p) {
                    if (year_selected == 0) {
                        new_text = value.yr1_cost;
                    } else if (year_selected == 1) {
                        new_text = value.yr2_cost;
                    } else if (year_selected == 2) {
                        new_text = value.yr3_cost;
                    } else if (year_selected == 3) {
                        new_text = value.yr4_cost;
                    } else if (year_selected == 4) {
                        new_text = value.yr5_cost;
                    }
                }
            });
            if (new_text == 0) {
                $(this).text('-');
            } else {
                $(this).text('$' + new_text.toFixed(2));
            }
        });
    });

    $('.team_selection_link').on('click', function() {
        team_selected = $(this).text();
        $('#trade_opp_team_area').text(team_selected).show();
        $('#trade_right_area').show();
        $('#trade_submit_button_area').show();
        $('#trade_year_cost_div').css({'margin-top' : 0});
        $('#trade_year_cost_select').css({'margin-top' : 0});

        show_team();
    });

    $('#trade_submit_button').on('click', function() {
        console.log('click');
        var left_players = [];
        var left_picks = [];
        var left_assets = [];
        var left_cash = [];
        var right_players = [];
        var right_picks = [];
        var right_assets = [];
        var right_cash = [];

        var is_left_checked = false;
        var is_right_checked = false;

        var rejection_reason = '';

        $('#trade_left_players_area').find('input').each(function() {
            if ($(this).prop('checked') == true) {
                var temp = $(this).parent().next().next().text();
                left_players.push(temp);
                is_left_checked = true;
            }
        });

        $('#trade_left_picks_area').find('input').each(function() {
            if ($(this).prop('checked') == true) {
                var temp = $(this).val();
                left_picks.push(temp);
                is_left_checked = true;
            }
        });

        $('#trade_left_assets_area').find('input').each(function() {
            if ($(this).prop('checked') == true) {
                var temp = $(this).val();
                left_assets.push(temp);
                is_left_checked = true;
            }
        });

        $('#trade_left_cash_area').find('input').each(function() {
            if ($.isNumeric(Number($(this).val()))) {
                var temp = Number($(this).val());
                var allowed = Number($(this).parent().next().text().split('$')[1].split(' ')[0]);
                left_cash.push(temp);
                if (temp > 0 && temp < allowed) {
                    is_left_checked = true;
                } else {
                    if (temp < 0) {
                        rejection_reason = 'enter a positive number in your Cash'
                    } else if (temp > allowed) {
                        rejection_reason = 'Cash amount larger than available...'
                    }
                }
            } else {
                rejection_reason = 'you have entered a non-number in your Cash'
            }
        });
        
        $('#trade_right_players_area').find('input').each(function() {
            if ($(this).prop('checked') == true) {
                var temp = $(this).parent().next().next().text();
                right_players.push(temp);
                is_right_checked = true;
            }
        });

        $('#trade_right_picks_area').find('input').each(function() {
            if ($(this).prop('checked') == true) {
                var temp = $(this).val();
                right_picks.push(temp);
                is_right_checked = true;
            }
        });

        $('#trade_right_assets_area').find('input').each(function() {
            if ($(this).prop('checked') == true) {
                var temp = $(this).val();
                right_assets.push(temp);
                is_right_checked = true;
            }
        });

        $('#trade_right_cash_area').find('input').each(function() {
            if ($.isNumeric(Number($(this).val()))) {
                var temp = Number($(this).val());
                var allowed = Number($(this).parent().next().text().split('$')[1].split(' ')[0]);
                right_cash.push(temp);
                if (temp > 0 && temp < allowed) {
                    is_right_checked = true;
                } else {
                    if (temp < 0) {
                        rejection_reason = 'enter a positive number in ' + team_selected + "'s Cash"
                    } else if (temp > allowed) {
                        rejection_reason = 'Cash amount larger than available...'
                    }
                }
            } else {
                rejection_reason = 'entered a non-number in ' + team_selected + "'s Cash"
            }
        });

        if (is_left_checked && is_right_checked) {
            $('#trade_rejection_message').text('accepted, processing...').css({'color' : 'blue'});
            $.ajax({
                url: '/save_trade_data',
                type: 'POST',
                data: {
                    csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                    'team_selected' : team_selected,
                    'left_players' : left_players,
                    'left_picks' : left_picks,
                    'left_assets' : left_assets,
                    'left_cash' : left_cash,
                    'right_players' : right_players,
                    'right_picks' : right_picks,
                    'right_assets' : right_assets,
                    'right_cash' : right_cash,
                    'view_flag_text' : view_flag_text,
                    'is_proposing_team' : is_proposing_team,
                    'view_flag_trade_id' : view_flag_trade_id
                },
                dataType: 'json',
                success: function (data) {
                    location.href = '/confirm_trade'
                }
            });
        }

        if (rejection_reason == '') {
            if (is_left_checked == false) {
                rejection_reason = 'you have offered nothing...'
            } else if (is_right_checked == false) {
                rejection_reason = 'you have asked for nothing...'
            }
        }

        $('#trade_rejection_message').text(rejection_reason);
    });
});