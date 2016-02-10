$(document).ready(function() {
    console.log('ready 2');

    var filtered_data = [];

    var user_status = $('#vw_2-1').text();
    console.log(user_status);

    var $master = [];
    $('#vw_1').find('tr').each(function() {
        $master.push({'pos': $(this).find('#vw_1-1').text(),
            'name': $(this).find('#vw_1-2').text(),
            'team': $(this).find('#vw_1-3').text(),
            'contract_type': $(this).find('#vw_1-4').text(),
            'total_value': Number($(this).find('#vw_1-5').text()),
            'signing_bonus': Number($(this).find('#vw_1-6').text()),
            'salary': Number($(this).find('#vw_1-7').text()),
            'yr1_salary': Number($(this).find('#vw_1-8').text()),
            'yr1_sb': Number($(this).find('#vw_1-9').text()),
            'yr2_salary': Number($(this).find('#vw_1-10').text()),
            'yr2_sb': Number($(this).find('#vw_1-11').text()),
            'yr3_salary': Number($(this).find('#vw_1-12').text()),
            'yr3_sb': Number($(this).find('#vw_1-13').text()),
            'yr4_salary': Number($(this).find('#vw_1-14').text()),
            'yr4_sb': Number($(this).find('#vw_1-15').text()),
            'yr5_salary': Number($(this).find('#vw_1-16').text()),
            'yr5_sb': Number($(this).find('#vw_1-17').text()),
            'notes': $(this).find('#vw_1-18').text()});
        $(this).remove();
    });

    fill_table($master);
    $("#all_players_table").tablesorter();



    function fill_table (data) {
        $('#all_players_body').empty();

        $.each(data, function(index, value) {
            var tr = $('<tr>');
            var td_pos = $('<td>');
            var td_name = $('<td>');
            var td_team = $('<td>');
            var td_contract_type = $('<td>');
            var td_total_value = $('<td>');
            var td_signing_bonus = $('<td>');
            var td_salary = $('<td>');
            var td_yr1 = $('<td>');
            var td_yr2 = $('<td>');
            var td_yr3 = $('<td>');
            var td_yr4 = $('<td>');
            var td_yr5 = $('<td>');
            var td_notes = $('<td>');

            td_pos.text(value.pos);
            var name_link = $('<div>').addClass('name_link').text(value.name);
            if (user_status == 'True') {
                td_name.append(name_link);
            } else {
                td_name.text(value.name);
            }

            td_team.text(value.team);
            td_contract_type.text(value.contract_type).css({'text-align' : 'center'});
            td_total_value.text('$' + value.total_value.toFixed(2)).css({'text-align' : 'center'});
            td_signing_bonus.text('$' + value.signing_bonus.toFixed(2)).css({'text-align' : 'center'});
            td_salary.text('$' + value.salary.toFixed(2)).css({'text-align' : 'center'});
            var yr1_string = '$' + value.yr1_salary.toFixed(2) + ' ($' + value.yr1_sb.toFixed(2) + ')';
            td_yr1.text(yr1_string).css({'text-align' : 'center'});
            var yr2_string = '';
            if (value.yr2_salary != 0) {
                yr2_string = '$' + value.yr2_salary.toFixed(2) + ' ($' + value.yr2_sb.toFixed(2) + ')';
            }
            td_yr2.text(yr2_string).css({'text-align' : 'center'});
            var yr3_string = '';
            if (value.yr3_salary != 0) {
                yr3_string = '$' + value.yr3_salary.toFixed(2) + ' ($' + value.yr3_sb.toFixed(2) + ')';
            }
            td_yr3.text(yr3_string).css({'text-align' : 'center'});
            var yr4_string = '';
            if (value.yr4_salary != 0) {
                yr4_string = '$' + value.yr4_salary.toFixed(2) + ' ($' + value.yr4_sb.toFixed(2) + ')';
            }
            td_yr4.text(yr4_string).css({'text-align' : 'center'});
            var yr5_string = '';
            if (value.yr5_salary != 0) {
                yr5_string = '$' + value.yr5_salary.toFixed(2) + ' ($' + value.yr5_sb.toFixed(2) + ')';
            }
            td_yr5.text(yr5_string).css({'text-align' : 'center'});
            td_notes.text(value.notes);

            tr.append(td_pos);
            tr.append(td_name);
            tr.append(td_team);
            tr.append(td_contract_type);
            tr.append(td_total_value);
            tr.append(td_signing_bonus);
            tr.append(td_salary);
            tr.append(td_yr1);
            tr.append(td_yr2);
            tr.append(td_yr3);
            tr.append(td_yr4);
            tr.append(td_yr5);
            tr.append(td_notes);
            tr.appendTo('#all_players_body');
        });
        $('#all_players_table').trigger('update');
    }

    function filter_position (data) {
        var output = [];
        var pos_selected_list = [];

        if ($('#all_players_filter_QB').prop('checked') == true) {
            pos_selected_list.push('QB')
        }
        if ($('#all_players_filter_RB').prop('checked') == true) {
            pos_selected_list.push('RB')
        }
        if ($('#all_players_filter_WR').prop('checked') == true) {
            pos_selected_list.push('WR')
        }
        if ($('#all_players_filter_TE').prop('checked') == true) {
            pos_selected_list.push('TE')
        }
        if ($('#all_players_filter_DEF').prop('checked') == true) {
            pos_selected_list.push('DEF')
        }
        if ($('#all_players_filter_K').prop('checked') == true) {
            pos_selected_list.push('K')
        }

        $.each(data, function(index, value) {
            if ($.inArray(value.pos, pos_selected_list) != -1) {
                output.push(value);
            }
        });

        return output;
    }

    function filter_team (data) {
        var output = [];
        var team_selected_list = [];

        if ($('#all_players_filter_Alexander').prop('checked') == true) {
            team_selected_list.push('Alexander');
        }
        if ($('#all_players_filter_Burd').prop('checked') == true) {
            team_selected_list.push('Burd');
        }
        if ($('#all_players_filter_Confer').prop('checked') == true) {
            team_selected_list.push('Confer');
        }
        if ($('#all_players_filter_Fletemake').prop('checked') == true) {
            team_selected_list.push('Fletemake');
        }
        if ($('#all_players_filter_Flynn').prop('checked') == true) {
            team_selected_list.push('Flynn');
        }
        if ($('#all_players_filter_DLucas').prop('checked') == true) {
            team_selected_list.push('DLucas');
        }
        if ($('#all_players_filter_CLucas').prop('checked') == true) {
            team_selected_list.push('CLucas');
        }
        if ($('#all_players_filter_Marchek').prop('checked') == true) {
            team_selected_list.push('Marchek');
        }
        if ($('#all_players_filter_Pape').prop('checked') == true) {
            team_selected_list.push('Pape');
        }
        if ($('#all_players_filter_Riley').prop('checked') == true) {
            team_selected_list.push('Riley');
        }
        if ($('#all_players_filter_Runkle').prop('checked') == true) {
            team_selected_list.push('Runkle');
        }
        if ($('#all_players_filter_Wilcox').prop('checked') == true) {
            team_selected_list.push('Wilcox');
        }

        $.each(data, function(index, value) {
            if ($.inArray(value.team, team_selected_list) != -1) {
                output.push(value);
            }
        });

        return output;
    }

    function filter_contract_type (data) {
        var output = [];
        var contract_type_selected_list = [];

        if ($('#all_players_filter_Regular').prop('checked') == true) {
            contract_type_selected_list.push('Regular');
        }
        if ($('#all_players_filter_Rookie').prop('checked') == true) {
            contract_type_selected_list.push('Rookie');
        }

        $.each(data, function(index, value) {
            if ($.inArray(value.contract_type, contract_type_selected_list) != -1) {
                output.push(value);
            }
        });

        return output;
    }

    function filter_salary (data) {
        var output = [];

        var year_selected = $('#all_players_filter_select_year').val();
        var start = Number($('#all_players_filter_salary_from').val());
        var end = Number($('#all_players_filter_salary_to').val());

        $.each(data, function(index, value) {
            if (year_selected == '2015') {
                if (value.yr1_salary >= start && value.yr1_salary <= end) {
                    if (value.yr1_salary != 0) {
                        output.push(value);
                    }
                }
            } else if (year_selected == '2016') {
                if (value.yr2_salary >= start && value.yr2_salary <= end) {
                    if (value.yr2_salary != 0) {
                        output.push(value);
                    }
                }
            } else if (year_selected == '2017') {
                if (value.yr3_salary >= start && value.yr3_salary <= end) {
                    if (value.yr3_salary != 0) {
                        output.push(value);
                    }
                }
            } else if (year_selected == '2018') {
                if (value.yr4_salary >= start && value.yr4_salary <= end) {
                    if (value.yr4_salary != 0) {
                        output.push(value);
                    }
                }
            } else if (year_selected == '2019') {
                if (value.yr5_salary >= start && value.yr5_salary <= end) {
                    if (value.yr5_salary != 0) {
                        output.push(value);
                    }
                }
            }
        });

        return output;
    }

    function filter_notes (data) {
        var output = [];

        if ($('#all_players_filter_inpickup').prop('checked') == false) {
            return data;
        } else {
            $.each(data, function(index, value) {
                if (value.notes == 'In-season pickup') {
                    output.push(value);
                }
            });
            return output;
        }
    }






    $('input[type=checkbox]').on('click', function() {
        var output1 = filter_position($master);
        var output2 = filter_team(output1);
        var output3 = filter_contract_type(output2);
        var output4 = filter_salary(output3);
        var output5 = filter_notes(output4);
        fill_table(output5);
    });

    $('#all_players_filter_select_year').on('change', function() {
        var output1 = filter_position($master);
        var output2 = filter_team(output1);
        var output3 = filter_contract_type(output2);
        var output4 = filter_salary(output3);
        var output5 = filter_notes(output4);
        fill_table(output5);
    });

    $('#all_players_filter_salary_from').on('keyup', function() {
        var output1 = filter_position($master);
        var output2 = filter_team(output1);
        var output3 = filter_contract_type(output2);
        var output4 = filter_salary(output3);
        var output5 = filter_notes(output4);
        fill_table(output5);
    });

    $('#all_players_filter_salary_to').on('keyup', function() {
        var output1 = filter_position($master);
        var output2 = filter_team(output1);
        var output3 = filter_contract_type(output2);
        var output4 = filter_salary(output3);
        var output5 = filter_notes(output4);
        fill_table(output5);
    });



    $(document).on('click', '.name_link', function() {
        console.log('click');
        var player_clicked = $(this).text();
        $.ajax({
            url : '/store_player_selected_redirect_to_playerpage',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value, 'player': player_clicked},
            dataType: 'json',
            success: function(data) {
                location.href = '/player';
            }
        });
    });

    $('#all_player_filter_toggle').on('click', function() {
        var vis = $('#all_players_filter_area').is(':visible');
        if (vis == false) {
            $('#all_players_filter_area').show();
            $('.all_players_datagrid').css({'height' : '70%'});
        } else {
            $('#all_players_filter_area').hide();
            $('.all_players_datagrid').css({'height' : '100%'});
        }

    });
});