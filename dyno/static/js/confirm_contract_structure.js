$(document).ready(function() {
    console.log('ready 2');

    var yearly_sb = 0;
    var yearly_sal = 0;
    var max_years = 0;

    $('#vw_1').find('tr').each(function() {
        yearly_sb = Number($(this).find('#vw_1-1').text());
        yearly_sal = Number($(this).find('#vw_1-2').text());
        max_years = Number($(this).find('#vw_1-3').text());
        $(this).remove();
    });

    var year_list = [];
    $('#vw_3').find('p').each(function() {
        year_list.push($(this).text());
        $(this).remove();
    });

    var num_years = 1;
    var years_list = [Number(year_list[0])];

    var $bottom_table_data = {'yr1_costs' : 0,
                            'yr2_costs' : 0,
                            'yr3_costs' : 0,
                            'yr4_costs' : 0,
                            'yr5_costs' : 0,
                            'yr1_pen' : 0,
                            'yr2_pen' : 0,
                            'yr3_pen' : 0,
                            'yr4_pen' : 0,
                            'yr5_pen' : 0,
                            'yr1_guar' : 0,
                            'yr2_guar' : 0,
                            'yr3_guar' : 0,
                            'yr4_guar' : 0,
                            'yr5_guar' : 0,
                            'yr1_space' : 0,
                            'yr2_space' : 0,
                            'yr3_space' : 0,
                            'yr4_space' : 0,
                            'yr5_space' : 0
    };

    $('#vw_2').find('tr').each(function() {
        $bottom_table_data.yr1_costs = Number($(this).find('#vw_2-1').text());
        $bottom_table_data.yr2_costs = Number($(this).find('#vw_2-2').text());
        $bottom_table_data.yr3_costs = Number($(this).find('#vw_2-3').text());
        $bottom_table_data.yr4_costs = Number($(this).find('#vw_2-4').text());
        $bottom_table_data.yr5_costs = Number($(this).find('#vw_2-5').text());
        $bottom_table_data.yr1_pen = Number($(this).find('#vw_2-6').text());
        $bottom_table_data.yr2_pen = Number($(this).find('#vw_2-7').text());
        $bottom_table_data.yr3_pen = Number($(this).find('#vw_2-8').text());
        $bottom_table_data.yr4_pen = Number($(this).find('#vw_2-9').text());
        $bottom_table_data.yr5_pen = Number($(this).find('#vw_2-10').text());
        $bottom_table_data.yr1_space = Number($(this).find('#vw_2-11').text());
        $bottom_table_data.yr2_space = Number($(this).find('#vw_2-12').text());
        $bottom_table_data.yr3_space = Number($(this).find('#vw_2-13').text());
        $bottom_table_data.yr4_space = Number($(this).find('#vw_2-14').text());
        $bottom_table_data.yr5_space = Number($(this).find('#vw_2-15').text());
        $(this).remove();
    });


    fill_tables();
    get_totals_for_bottom_table();
    fill_bottom_table($bottom_table_data);

    function clear_tables () {
        $('#setconstr_table_body').empty();
    }

    function fill_tables () {
        var total_a = 0;
        var total_b = 0;
        var total_c = 0;
        $.each(years_list, function(index, value) {
            var tr = $('<tr>');
            var td_year = $('<td>');
            var td_total_cost = $('<td>').addClass('total_cost_cell');
            var td_sb = $('<td>');
            var td_salary = $('<td>');
            var salary_textbox = $('<input type="text">');
            td_salary.append(salary_textbox);
            salary_textbox.attr({'size' : 4});
            salary_textbox.addClass('setconstr_salary_input');

            td_year.text(value);
            var temp = (yearly_sb + yearly_sal).toFixed(2);
            td_total_cost.text('$' + temp);
            td_sb.text('$' + yearly_sb.toFixed(2));
            salary_textbox.val(yearly_sal.toFixed(2));
            if (yearly_sal < 1) {
                salary_textbox.prop('disabled', true);
            }

            td_year.addClass('setconstr_cell');
            td_total_cost.addClass('setconstr_cell');
            td_sb.addClass('setconstr_cell');
            td_salary.addClass('setconstr_cell');

            tr.append(td_year);
            tr.append(td_total_cost);
            tr.append(td_sb);
            tr.append(td_salary);
            tr.appendTo('#setconstr_table_body');

            total_a = total_a + Number(temp);
            total_b = total_b + yearly_sb;
            total_c = total_c + yearly_sal;
        });

        $('#setconstr_totals_total_cost').text('$' + total_a.toFixed(2));
        $('#setconstr_totals_sb').text('$' + total_b.toFixed(2));
        $('#setconstr_totals_salary').text('$' + total_c.toFixed(2));
    }

    function set_totals_table (where_from) {
        var below1 = false;
        var temp = 0;
        $('.setconstr_salary_input').each(function() {
            temp = temp + Number($(this).val());
            if (Number($(this).val()) < 1) {
                below1 = true;
            }
            var total_cost_cell = $(this).parent().prev().prev();
            var total = yearly_sb + Number($(this).val());
            total_cost_cell.text('$' + total.toFixed(2));
        });
        $('#setconstr_totals_salary').text('$' + temp.toFixed(2));
        var temp2 = temp + (yearly_sb * num_years);
        $('#setconstr_totals_total_cost').text('$' + temp2.toFixed(2));

        var temp_total = Math.round((yearly_sal * num_years)*100)/100;
        temp = Math.round(temp*100)/100;

        if (temp == temp_total) {
            $('#setconstr_totals_message').text('');
            $('#setconstr_totals_message').addClass('setconstr_cell');
            $('#setconstr_submit_button').prop('disabled', false);
        } else if (temp > temp_total) {
            var temp3 = temp - temp_total;
            $('#setconstr_totals_message').text('over by $' + temp3.toFixed(2));
            $('#setconstr_totals_message').addClass('setconstr_totals_message_red');
            $('#setconstr_submit_button').prop('disabled', true);
        } else if (temp < temp_total) {
            var temp4 = temp_total - temp;
            $('#setconstr_totals_message').text('under by $' + temp4.toFixed(2));
            $('#setconstr_totals_message').addClass('setconstr_totals_message_red');
            $('#setconstr_submit_button').prop('disabled', true);
        }

        if (below1 == true && where_from == 'keyup') {
            $('#setconstr_submit_button').prop('disabled', true);
        }
    }

    function get_totals_for_bottom_table () {
        var temp_list = [];
        var temp = 0;
        $('.setconstr_salary_input').each(function() {
            temp = Number($(this).val());
            temp_list.push(temp + yearly_sb);
        });
        if (temp_list.length == 1) {
            temp_list.push(0);
            temp_list.push(0);
            temp_list.push(0);
            temp_list.push(0);
        } else if (temp_list.length == 2) {
            temp_list.push(0);
            temp_list.push(0);
            temp_list.push(0);
        } else if (temp_list.length == 3) {
            temp_list.push(0);
            temp_list.push(0);
        } else if (temp_list.length == 4) {
            temp_list.push(0);
        }
        $bottom_table_data.yr1_guar = temp_list[0];
        $bottom_table_data.yr2_guar = temp_list[1];
        $bottom_table_data.yr3_guar = temp_list[2];
        $bottom_table_data.yr4_guar = temp_list[3];
        $bottom_table_data.yr5_guar = temp_list[4];
    }

    function fill_bottom_table (data) {
        //fill bottom table
        $('#player_interaction_2').empty();

        var yr1_costs = Number(data.yr1_costs) + data.yr1_guar;
        var yr1_pen = Number(data.yr1_pen);
        var yr1_space = 200 - yr1_costs - yr1_pen;

        if (Number(data.yr2_guar) == 0) {
            var yr2_costs = Number(data.yr2_costs);
            var yr2_pen = Number(data.yr2_pen);

        } else {
            var yr2_costs = Number(data.yr2_costs) + data.yr2_guar;
            var yr2_pen = Number(data.yr2_pen);
        }
        var yr2_space = 200 - yr2_costs - yr2_pen;

        if (Number(data.yr3_guar) == 0) {
            var yr3_costs = Number(data.yr3_costs);
            var yr3_pen = Number(data.yr3_pen);
        } else {
            var yr3_costs = Number(data.yr3_costs) + data.yr3_guar;
            var yr3_pen = Number(data.yr3_pen);
        }
        var yr3_space = 200 - yr3_costs - yr3_pen;

        if (Number(data.yr4_guar) == 0) {
            var yr4_costs = Number(data.yr4_costs);
            var yr4_pen = Number(data.yr4_pen);
        } else {
            var yr4_costs = Number(data.yr4_costs) + data.yr4_guar;
            var yr4_pen = Number(data.yr4_pen);
        }
        var yr4_space = 200 - yr4_costs - yr4_pen;

        if (Number(data.yr5_guar) == 0) {
            var yr5_costs = Number(data.yr5_costs);
            var yr5_pen = Number(data.yr5_pen);
        } else {
            var yr5_costs = Number(data.yr5_costs) + data.yr5_guar;
            var yr5_pen = Number(data.yr5_pen);
        }
        var yr5_space = 200 - yr5_costs - yr5_pen;

        //row 1
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('font-weight', 'bold').text(year_list[0]).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').text('$' + yr1_costs.toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + Number(yr1_pen).toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'green').text('$' + yr1_space.toFixed(2)).appendTo('#player_interaction_2');

        //row 2
        $('<tr>').appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('font-weight', 'bold').text(year_list[1]).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').text('$' + yr2_costs.toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + Number(yr2_pen).toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'green').text('$' + yr2_space.toFixed(2)).appendTo('#player_interaction_2');

        //row 3
        $('<tr>').appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('font-weight', 'bold').text(year_list[2]).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').text('$' + yr3_costs.toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + Number(yr3_pen).toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'green').text('$' + yr3_space.toFixed(2)).appendTo('#player_interaction_2');

        //row 4
        $('<tr>').appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('font-weight', 'bold').text(year_list[3]).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').text('$' + yr4_costs.toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + Number(yr4_pen).toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'green').text('$' + yr4_space.toFixed(2)).appendTo('#player_interaction_2');

        //row 5
        $('<tr>').appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('font-weight', 'bold').text(year_list[4]).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').text('$' + yr5_costs.toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + Number(yr5_pen).toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'green').text('$' + yr5_space.toFixed(2)).appendTo('#player_interaction_2');

    }




    $('#setconstr_add_year_button').on('click', function() {
        if (num_years != max_years) {
            num_years = num_years + 1;
            var temp = years_list[years_list.length-1] + 1;
            years_list.push(temp);
            clear_tables();
            fill_tables();
            set_totals_table('add_year');
            get_totals_for_bottom_table();
            fill_bottom_table($bottom_table_data);
        }
    });

    $('#setconstr_remove_year_button').on('click', function() {
        if (num_years != 1) {
            num_years = num_years - 1;
            years_list.splice(-1, 1);
            clear_tables();
            fill_tables();
            set_totals_table('remove_year');
            get_totals_for_bottom_table();
            fill_bottom_table($bottom_table_data);
        }
    });

    $(document).on('keyup', '.setconstr_salary_input', function() {
        var input_value = $(this).val();
        if ($.isNumeric(Number(input_value)) == false) {
            console.log('not a number');
            $(this).val(yearly_sal);
            set_totals_table('keyup');
            get_totals_for_bottom_table();
            fill_bottom_table($bottom_table_data);
        } else {
            set_totals_table('keyup');
            get_totals_for_bottom_table();
            fill_bottom_table($bottom_table_data);
        }
    });

    $('#setconstr_submit_button').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        var player = $('#player_label').text();
        $.ajax({
            url: '/submit_contract_structure',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                player : player,
                num_years : num_years,
                yearly_sb : yearly_sb,
                yr1_total : $bottom_table_data.yr1_guar,
                yr2_total : $bottom_table_data.yr2_guar,
                yr3_total : $bottom_table_data.yr3_guar,
                yr4_total : $bottom_table_data.yr4_guar,
                yr5_total : $bottom_table_data.yr5_guar
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/team/pending_transactions';
            }
        });
    });

    $('#setconstr_cancel_button').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        location.href = '/team/pending_transactions';
    });
});