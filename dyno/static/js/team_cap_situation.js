$(document).ready(function() {
    console.log('ready');

    var current_selected_year = 'yr1';
    highlight_current_selected_year();

    var cap_pen_yr1 = Number($('#vw_3').find('p').text());
    $('#vw_3').remove();
    var cap_pen_yr2 = Number($('#vw_4').find('p').text());
    $('#vw_4').remove();
    var cap_pen_yr3 = Number($('#vw_5').find('p').text());
    $('#vw_5').remove();
    var cap_pen_yr4 = Number($('#vw_6').find('p').text());
    $('#vw_6').remove();
    var cap_pen_yr5 = Number($('#vw_7').find('p').text());
    $('#vw_7').remove();

    var filtered_tags = [];
    $('#vw_8').find('td').each(function() {
        filtered_tags.push($(this).text());
    });
    console.log(filtered_tags);
    $('#vw_8').remove();

    if (isNaN(cap_pen_yr1)) {
        cap_pen_yr1 = 0;
    }
    if (isNaN(cap_pen_yr2)) {
        cap_pen_yr2 = 0;
    }
    if (isNaN(cap_pen_yr3)) {
        cap_pen_yr3 = 0;
    }
    if (isNaN(cap_pen_yr4)) {
        cap_pen_yr4 = 0;
    }
    if (isNaN(cap_pen_yr5)) {
        cap_pen_yr5 = 0;
    }

    var $master = [];
    $('#vw_1').find('tr').each(function() {
        var a_r_1 = [];
        var a_r_2 = [];
        var a_r_3 = [];
        var a_r_4 = [];
        var a_r_5 = [];
        $(this).find('#vw_1-20 > p').each(function() {
            a_r_1.push($(this).text());
        });
        $(this).find('#vw_1-21 > p').each(function() {
            a_r_2.push($(this).text());
        });
        $(this).find('#vw_1-22 > p').each(function() {
            a_r_3.push($(this).text());
        });
        $(this).find('#vw_1-23 > p').each(function() {
            a_r_4.push($(this).text());
        });
        $(this).find('#vw_1-24 > p').each(function() {
            a_r_5.push($(this).text());
        });
        $master.push({'yr1_role': $(this).find('#vw_1-1').text(),
            'yr2_role': $(this).find('#vw_1-2').text(),
            'yr3_role': $(this).find('#vw_1-3').text(),
            'yr4_role': $(this).find('#vw_1-4').text(),
            'yr5_role': $(this).find('#vw_1-5').text(),
            'pos': $(this).find('#vw_1-6').text(),
            'name': $(this).find('#vw_1-7').text(),
            'contract_type': $(this).find('#vw_1-8').text(),
            'yr1_salary': Number($(this).find('#vw_1-9').text()),
            'yr2_salary': Number($(this).find('#vw_1-10').text()),
            'yr3_salary': Number($(this).find('#vw_1-11').text()),
            'yr4_salary': Number($(this).find('#vw_1-12').text()),
            'yr5_salary': Number($(this).find('#vw_1-13').text()),
            'yr1_sb': Number($(this).find('#vw_1-14').text()),
            'yr2_sb': Number($(this).find('#vw_1-15').text()),
            'yr3_sb': Number($(this).find('#vw_1-16').text()),
            'yr4_sb': Number($(this).find('#vw_1-17').text()),
            'yr5_sb': Number($(this).find('#vw_1-18').text()),
            'notes': $(this).find('#vw_1-19').text(),
            'avail_roles_yr1': a_r_1,
            'avail_roles_yr2': a_r_2,
            'avail_roles_yr3': a_r_3,
            'avail_roles_yr4': a_r_4,
            'avail_roles_yr5': a_r_5});
        $(this).remove();
    });

    //get available roles for this user
    var $avail_roles = [];
    $('#vw_2').find('tr').each(function() {
        $avail_roles.push({'role': $(this).find('#vw_2-1').text(),
            'unique_roles': $(this).find('#vw_2-2').text(),
            'applies_to_QB': $(this).find('#vw_2-3').text(),
            'applies_to_RB': $(this).find('#vw_2-4').text(),
            'applies_to_WR': $(this).find('#vw_2-5').text(),
            'applies_to_TE': $(this).find('#vw_2-6').text(),
            'applies_to_DEF': $(this).find('#vw_2-7').text(),
            'applies_to_K': $(this).find('#vw_2-8').text()});
        $(this).remove();
    });

    var QB_list = [];
    var RB_list = [];
    var WR_list = [];
    var TE_list = [];
    var DEF_K_list = [];
    var total_cost = 0;



    function highlight_current_selected_year () {
        if (current_selected_year == 'yr1') {
            $('#yr1_cap_situation').css('background-color', '#2d99d4').css('color', 'white');
            $('#yr2_cap_situation').css('background-color', 'white').css('color', 'black');
            $('#yr3_cap_situation').css('background-color', 'white').css('color', 'black');
            $('#yr4_cap_situation').css('background-color', 'white').css('color', 'black');
            $('#yr5_cap_situation').css('background-color', 'white').css('color', 'black');
        } else if (current_selected_year == 'yr2') {
            $('#yr1_cap_situation').css('background-color', 'white').css('color', 'black');
            $('#yr2_cap_situation').css('background-color', '#2d99d4').css('color', 'white');
            $('#yr3_cap_situation').css('background-color', 'white').css('color', 'black');
            $('#yr4_cap_situation').css('background-color', 'white').css('color', 'black');
            $('#yr5_cap_situation').css('background-color', 'white').css('color', 'black');
        } else if (current_selected_year == 'yr3') {
            $('#yr1_cap_situation').css('background-color', 'white').css('color', 'black');
            $('#yr2_cap_situation').css('background-color', 'white').css('color', 'black');
            $('#yr3_cap_situation').css('background-color', '#2d99d4').css('color', 'white');
            $('#yr4_cap_situation').css('background-color', 'white').css('color', 'black');
            $('#yr5_cap_situation').css('background-color', 'white').css('color', 'black');
        } else if (current_selected_year == 'yr4') {
            $('#yr1_cap_situation').css('background-color', 'white').css('color', 'black');
            $('#yr2_cap_situation').css('background-color', 'white').css('color', 'black');
            $('#yr3_cap_situation').css('background-color', 'white').css('color', 'black');
            $('#yr4_cap_situation').css('background-color', '#2d99d4').css('color', 'white');
            $('#yr5_cap_situation').css('background-color', 'white').css('color', 'black');
        } else if (current_selected_year == 'yr5') {
            $('#yr1_cap_situation').css('background-color', 'white').css('color', 'black');
            $('#yr2_cap_situation').css('background-color', 'white').css('color', 'black');
            $('#yr3_cap_situation').css('background-color', 'white').css('color', 'black');
            $('#yr4_cap_situation').css('background-color', 'white').css('color', 'black');
            $('#yr5_cap_situation').css('background-color', '#2d99d4').css('color', 'white');
        }
    }

    function split_master_into_pos () {
        QB_list = [];
        RB_list = [];
        WR_list = [];
        TE_list = [];
        DEF_K_list = [];
        $.each($master, function(index, value) {
            if (value.pos == 'QB') {
                QB_list.push(value);
            } else if (value.pos == 'RB') {
                RB_list.push(value);
            } else if (value.pos == 'WR') {
                WR_list.push(value);
            } else if (value.pos == 'TE') {
                TE_list.push(value);
            } else {
                DEF_K_list.push(value);
            }
        });
    }

    function clear_table () {
        $('#team_cap_body').empty();
    }

    function populate_yr1_table_normal (data) {
        var cap_hit = data.yr1_salary + data.yr1_sb;
        if ($.inArray(data.yr1_role, filtered_tags) == -1) {
            $('<tr>').appendTo('#team_cap_body');
            var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#team_cap_body');
            $.each(data.avail_roles_yr1, function (index, value) {
                if (value == data.yr1_role) {
                    $role_select.append($('<option>')
                        .attr('value', value)
                        .prop('selected', true)
                        .text(value));
                } else {
                    $role_select.append($('<option>')
                        .attr('value', value)
                        .text(value));
                }
            });
            $('<td>').attr('align', 'center').text(data.pos).appendTo('#team_cap_body');
            $('<td>').addClass('name_link').text(data.name).appendTo('#team_cap_body');
            $('<td>').attr('align', 'center').text(data.contract_type).appendTo('#team_cap_body');
            $('<td>').attr('align', 'center').text('$' + cap_hit.toFixed(2)).appendTo('#team_cap_body');
            $('<td>').attr('align', 'center').text('$' + data.yr1_salary.toFixed(2)).appendTo('#team_cap_body');
            $('<td>').attr('align', 'center').text('$' + data.yr1_sb.toFixed(2)).appendTo('#team_cap_body');
            $('<td>').text(data.notes).appendTo('#team_cap_body');
        }
        total_cost = total_cost + cap_hit;
    }

    function populate_yr1_table_aux (data) {
        var cap_hit = data.yr1_salary + data.yr1_sb;
        if ($.inArray(data.yr1_role, filtered_tags) == -1) {
            $('<tr>').appendTo('#team_cap_body');
            var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#team_cap_body');
            $.each(data.avail_roles_yr1, function (index, value) {
                if (value == data.yr1_role) {
                    $role_select.append($('<option>')
                        .attr('value', value)
                        .prop('selected', true)
                        .text(value));
                } else {
                    $role_select.append($('<option>')
                        .attr('value', value)
                        .text(value));
                }
            });
            $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text(data.pos).appendTo('#team_cap_body');
            $('<td>').addClass('name_link').addClass('team_cap_data_aux').text(data.name).appendTo('#team_cap_body');
            $('<td>').addClass('team_cap_data_aux').attr('align', 'center').text(data.contract_type).appendTo('#team_cap_body');
            $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text('$' + cap_hit.toFixed(2)).appendTo('#team_cap_body');
            $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text('$' + data.yr1_salary.toFixed(2)).appendTo('#team_cap_body');
            $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text('$' + data.yr1_sb.toFixed(2)).appendTo('#team_cap_body');
            $('<td>').addClass('team_cap_data_aux').text(data.notes).appendTo('#team_cap_body');
        }
        total_cost = total_cost + cap_hit;
    }
    
    function populate_yr2_table_normal (data) {
        var cap_hit = data.yr2_salary + data.yr2_sb;
        if ($.inArray(data.yr2_role, filtered_tags) == -1) {
            if (data.yr2_salary != 0) {
                $('<tr>').appendTo('#team_cap_body');
                var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#team_cap_body');
                $.each(data.avail_roles_yr2, function (index, value) {
                    if (value == data.yr2_role) {
                        $role_select.append($('<option>')
                            .attr('value', value)
                            .prop('selected', true)
                            .text(value));
                    } else {
                        $role_select.append($('<option>')
                            .attr('value', value)
                            .text(value));
                    }
                });
                $('<td>').attr('align', 'center').text(data.pos).appendTo('#team_cap_body');
                $('<td>').addClass('name_link').text(data.name).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').text(data.contract_type).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').text('$' + cap_hit.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').text('$' + data.yr2_salary.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').text('$' + data.yr2_sb.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').text(data.notes).appendTo('#team_cap_body');
            }
        }
        total_cost = total_cost + cap_hit;
    }

    function populate_yr2_table_aux (data) {
        var cap_hit = data.yr2_salary + data.yr2_sb;
        if ($.inArray(data.yr2_role, filtered_tags) == -1) {
            if (data.yr2_salary != 0) {
                $('<tr>').appendTo('#team_cap_body');
                var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#team_cap_body');
                $.each(data.avail_roles_yr2, function (index, value) {
                    if (value == data.yr2_role) {
                        $role_select.append($('<option>')
                            .attr('value', value)
                            .prop('selected', true)
                            .text(value));
                    } else {
                        $role_select.append($('<option>')
                            .attr('value', value)
                            .text(value));
                    }
                });
                $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text(data.pos).appendTo('#team_cap_body');
                $('<td>').addClass('name_link').addClass('team_cap_data_aux').text(data.name).appendTo('#team_cap_body');
                $('<td>').addClass('team_cap_data_aux').attr('align', 'center').text(data.contract_type).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text('$' + cap_hit.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text('$' + data.yr2_salary.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text('$' + data.yr2_sb.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').addClass('team_cap_data_aux').text(data.notes).appendTo('#team_cap_body');
            }
        }
        total_cost = total_cost + cap_hit;
    }
    
    function populate_yr3_table_normal (data) {
        var cap_hit = data.yr3_salary + data.yr3_sb;
        if ($.inArray(data.yr3_role, filtered_tags) == -1) {
            if (data.yr3_salary != 0) {
                $('<tr>').appendTo('#team_cap_body');
                var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#team_cap_body');
                $.each(data.avail_roles_yr3, function (index, value) {
                    if (value == data.yr3_role) {
                        $role_select.append($('<option>')
                            .attr('value', value)
                            .prop('selected', true)
                            .text(value));
                    } else {
                        $role_select.append($('<option>')
                            .attr('value', value)
                            .text(value));
                    }
                });
                $('<td>').attr('align', 'center').text(data.pos).appendTo('#team_cap_body');
                $('<td>').addClass('name_link').text(data.name).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').text(data.contract_type).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').text('$' + cap_hit.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').text('$' + data.yr3_salary.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').text('$' + data.yr3_sb.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').text(data.notes).appendTo('#team_cap_body');
            }
        }
        total_cost = total_cost + cap_hit;
    }

    function populate_yr3_table_aux (data) {
        var cap_hit = data.yr3_salary + data.yr3_sb;
        if ($.inArray(data.yr3_role, filtered_tags) == -1) {
            if (data.yr3_salary != 0) {
                $('<tr>').appendTo('#team_cap_body');
                var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#team_cap_body');
                $.each(data.avail_roles_yr3, function (index, value) {
                    if (value == data.yr3_role) {
                        $role_select.append($('<option>')
                            .attr('value', value)
                            .prop('selected', true)
                            .text(value));
                    } else {
                        $role_select.append($('<option>')
                            .attr('value', value)
                            .text(value));
                    }
                });
                $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text(data.pos).appendTo('#team_cap_body');
                $('<td>').addClass('name_link').addClass('team_cap_data_aux').text(data.name).appendTo('#team_cap_body');
                $('<td>').addClass('team_cap_data_aux').attr('align', 'center').text(data.contract_type).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text('$' + cap_hit.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text('$' + data.yr3_salary.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text('$' + data.yr3_sb.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').addClass('team_cap_data_aux').text(data.notes).appendTo('#team_cap_body');
            }
        }
        total_cost = total_cost + cap_hit;
    }
    
    function populate_yr4_table_normal (data) {
        var cap_hit = data.yr4_salary + data.yr4_sb;
        if ($.inArray(data.yr4_role, filtered_tags) == -1) {
            if (data.yr4_salary != 0) {
                $('<tr>').appendTo('#team_cap_body');
                var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#team_cap_body');
                $.each(data.avail_roles_yr4, function (index, value) {
                    if (value == data.yr4_role) {
                        $role_select.append($('<option>')
                            .attr('value', value)
                            .prop('selected', true)
                            .text(value));
                    } else {
                        $role_select.append($('<option>')
                            .attr('value', value)
                            .text(value));
                    }
                });
                $('<td>').attr('align', 'center').text(data.pos).appendTo('#team_cap_body');
                $('<td>').addClass('name_link').text(data.name).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').text(data.contract_type).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').text('$' + cap_hit.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').text('$' + data.yr4_salary.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').text('$' + data.yr4_sb.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').text(data.notes).appendTo('#team_cap_body');
            }
        }
        total_cost = total_cost + cap_hit;
    }

    function populate_yr4_table_aux (data) {
        var cap_hit = data.yr4_salary + data.yr4_sb;
        if ($.inArray(data.yr4_role, filtered_tags) == -1) {
            if (data.yr4_salary != 0) {
                $('<tr>').appendTo('#team_cap_body');
                var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#team_cap_body');
                $.each(data.avail_roles_yr4, function (index, value) {
                    if (value == data.yr4_role) {
                        $role_select.append($('<option>')
                            .attr('value', value)
                            .prop('selected', true)
                            .text(value));
                    } else {
                        $role_select.append($('<option>')
                            .attr('value', value)
                            .text(value));
                    }
                });
                $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text(data.pos).appendTo('#team_cap_body');
                $('<td>').addClass('name_link').addClass('team_cap_data_aux').text(data.name).appendTo('#team_cap_body');
                $('<td>').addClass('team_cap_data_aux').attr('align', 'center').text(data.contract_type).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text('$' + cap_hit.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text('$' + data.yr4_salary.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text('$' + data.yr4_sb.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').addClass('team_cap_data_aux').text(data.notes).appendTo('#team_cap_body');
            }
        }
        total_cost = total_cost + cap_hit;
    }
    
    function populate_yr5_table_normal (data) {
        var cap_hit = data.yr5_salary + data.yr5_sb;
        if ($.inArray(data.yr5_role, filtered_tags) == -1) {
            if (data.yr5_salary != 0) {
                $('<tr>').appendTo('#team_cap_body');
                var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#team_cap_body');
                $.each(data.avail_roles_yr5, function (index, value) {
                    if (value == data.yr5_role) {
                        $role_select.append($('<option>')
                            .attr('value', value)
                            .prop('selected', true)
                            .text(value));
                    } else {
                        $role_select.append($('<option>')
                            .attr('value', value)
                            .text(value));
                    }
                });
                $('<td>').attr('align', 'center').text(data.pos).appendTo('#team_cap_body');
                $('<td>').addClass('name_link').text(data.name).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').text(data.contract_type).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').text('$' + cap_hit.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').text('$' + data.yr5_salary.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').text('$' + data.yr5_sb.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').text(data.notes).appendTo('#team_cap_body');
                ;
            }
        }
        total_cost = total_cost + cap_hit;
    }

    function populate_yr5_table_aux (data) {
        var cap_hit = data.yr5_salary + data.yr5_sb;
        if ($.inArray(data.yr5_role, filtered_tags) == -1) {
            if (data.yr5_salary != 0) {
                $('<tr>').appendTo('#team_cap_body');
                var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#team_cap_body');
                $.each(data.avail_roles_yr5, function (index, value) {
                    if (value == data.yr5_role) {
                        $role_select.append($('<option>')
                            .attr('value', value)
                            .prop('selected', true)
                            .text(value));
                    } else {
                        $role_select.append($('<option>')
                            .attr('value', value)
                            .text(value));
                    }
                });
                $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text(data.pos).appendTo('#team_cap_body');
                $('<td>').addClass('name_link').addClass('team_cap_data_aux').text(data.name).appendTo('#team_cap_body');
                $('<td>').addClass('team_cap_data_aux').attr('align', 'center').text(data.contract_type).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text('$' + cap_hit.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text('$' + data.yr5_salary.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').attr('align', 'center').addClass('team_cap_data_aux').text('$' + data.yr5_sb.toFixed(2)).appendTo('#team_cap_body');
                $('<td>').addClass('team_cap_data_aux').text(data.notes).appendTo('#team_cap_body');
            }
        }
        total_cost = total_cost + cap_hit;
    }

    function sortResults(input_list, prop, asc) {
        var return_list = input_list.sort(function(a, b) {
            if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        });
        return return_list;
    }

    function sort_by_role_yr1 (data) {
        var role_list = [];
        $.each(data, function(index, value) {
            role_list.push(value);
        });
        role_list = sortResults(role_list, 'yr1_role', true);

        var role_json_s1 = [];
        $.each(role_list, function(index, x) {
            $.each($avail_roles, function(index, value) {
                if (value.role == x.yr1_role) {
                    role_json_s1.push({'is_unique': value.unique_roles, 'name': x.name});
                }
            });
        });

        var u_list = [];
        var g_list = [];
        $.each(role_json_s1, function(index, value) {
            $.each(data, function(index, y) {
                if (y.name == value.name) {
                    if (value.is_unique == '1') {
                        u_list.push(y);
                    } else {
                        g_list.push(y);
                    }
                }
            });
        });
        g_list = sortResults(g_list, 'yr1_salary', false);

        var s_fin_t = [];
        $.each(u_list, function(index, value) {
            s_fin_t.push(value);
        });
        $.each(g_list, function(index, value) {
            s_fin_t.push(value);
        });
        return s_fin_t;
    }
    
    function sort_by_role_yr2 (data) {
        var role_list = [];
        $.each(data, function(index, value) {
            role_list.push(value);
        });
        role_list = sortResults(role_list, 'yr2_role', true);

        var role_json_s1 = [];
        $.each(role_list, function(index, x) {
            $.each($avail_roles, function(index, value) {
                if (value.role == x.yr2_role) {
                    role_json_s1.push({'is_unique': value.unique_roles, 'name': x.name});
                }
            });
        });

        var u_list = [];
        var g_list = [];
        $.each(role_json_s1, function(index, value) {
            $.each(data, function(index, y) {
                if (y.name == value.name) {
                    if (value.is_unique == '1') {
                        u_list.push(y);
                    } else {
                        g_list.push(y);
                    }
                }
            });
        });
        g_list = sortResults(g_list, 'yr2_salary', false);

        var s_fin_t = [];
        $.each(u_list, function(index, value) {
            s_fin_t.push(value);
        });
        $.each(g_list, function(index, value) {
            s_fin_t.push(value);
        });
        return s_fin_t;
    }
    
    function sort_by_role_yr3 (data) {
        var role_list = [];
        $.each(data, function(index, value) {
            role_list.push(value);
        });
        role_list = sortResults(role_list, 'yr3_role', true);

        var role_json_s1 = [];
        $.each(role_list, function(index, x) {
            $.each($avail_roles, function(index, value) {
                if (value.role == x.yr3_role) {
                    role_json_s1.push({'is_unique': value.unique_roles, 'name': x.name});
                }
            });
        });

        var u_list = [];
        var g_list = [];
        $.each(role_json_s1, function(index, value) {
            $.each(data, function(index, y) {
                if (y.name == value.name) {
                    if (value.is_unique == '1') {
                        u_list.push(y);
                    } else {
                        g_list.push(y);
                    }
                }
            });
        });
        g_list = sortResults(g_list, 'yr3_salary', false);

        var s_fin_t = [];
        $.each(u_list, function(index, value) {
            s_fin_t.push(value);
        });
        $.each(g_list, function(index, value) {
            s_fin_t.push(value);
        });
        return s_fin_t;
    }
    
    function sort_by_role_yr4 (data) {
        var role_list = [];
        $.each(data, function(index, value) {
            role_list.push(value);
        });
        role_list = sortResults(role_list, 'yr4_role', true);

        var role_json_s1 = [];
        $.each(role_list, function(index, x) {
            $.each($avail_roles, function(index, value) {
                if (value.role == x.yr4_role) {
                    role_json_s1.push({'is_unique': value.unique_roles, 'name': x.name});
                }
            });
        });

        var u_list = [];
        var g_list = [];
        $.each(role_json_s1, function(index, value) {
            $.each(data, function(index, y) {
                if (y.name == value.name) {
                    if (value.is_unique == '1') {
                        u_list.push(y);
                    } else {
                        g_list.push(y);
                    }
                }
            });
        });
        g_list = sortResults(g_list, 'yr4_salary', false);

        var s_fin_t = [];
        $.each(u_list, function(index, value) {
            s_fin_t.push(value);
        });
        $.each(g_list, function(index, value) {
            s_fin_t.push(value);
        });
        return s_fin_t;
    }
    
    function sort_by_role_yr5 (data) {
        var role_list = [];
        $.each(data, function(index, value) {
            role_list.push(value);
        });
        role_list = sortResults(role_list, 'yr5_role', true);

        var role_json_s1 = [];
        $.each(role_list, function(index, x) {
            $.each($avail_roles, function(index, value) {
                if (value.role == x.yr5_role) {
                    role_json_s1.push({'is_unique': value.unique_roles, 'name': x.name});
                }
            });
        });

        var u_list = [];
        var g_list = [];
        $.each(role_json_s1, function(index, value) {
            $.each(data, function(index, y) {
                if (y.name == value.name) {
                    if (value.is_unique == '1') {
                        u_list.push(y);
                    } else {
                        g_list.push(y);
                    }
                }
            });
        });
        g_list = sortResults(g_list, 'yr5_salary', false);

        var s_fin_t = [];
        $.each(u_list, function(index, value) {
            s_fin_t.push(value);
        });
        $.each(g_list, function(index, value) {
            s_fin_t.push(value);
        });
        return s_fin_t;
    }

    function sort_list_yr1 (data, sort_key) {
        var QB_list = [];
        var RB_list = [];
        var WR_list = [];
        var TE_list = [];
        var DEF_list = [];
        var K_list = [];
        $.each(data, function(index, value) {
            if (value.pos == 'QB') {
                QB_list.push(value);
            } else if (value.pos == 'RB') {
                RB_list.push(value);
            } else if (value.pos == 'WR') {
                WR_list.push(value);
            } else if (value.pos == 'TE') {
                TE_list.push(value);
            } else if (value.pos == 'DEF') {
                DEF_list.push(value);
            } else if (value.pos == 'K') {
                K_list.push(value);
            }
        });

        var finished_list = [];

        if (sort_key == 'role') {
            QB_list = sort_by_role_yr1(QB_list);
            $.each(QB_list, function(index, value) {
                finished_list.push(value);
            });
            RB_list = sort_by_role_yr1(RB_list);
            $.each(RB_list, function(index, value) {
                finished_list.push(value);
            });
            WR_list = sort_by_role_yr1(WR_list);
            $.each(WR_list, function(index, value) {
                finished_list.push(value);
            });
            TE_list = sort_by_role_yr1(TE_list);
            $.each(TE_list, function(index, value) {
                finished_list.push(value);
            });
            DEF_list = sort_by_role_yr1(DEF_list);
            $.each(DEF_list, function(index, value) {
                finished_list.push(value);
            });
            K_list = sort_by_role_yr1(K_list);
            $.each(K_list, function(index, value) {
                finished_list.push(value);
            });
        } else {
            QB_list = sortResults(QB_list, sort_key, false);
            $.each(QB_list, function(index, value) {
                finished_list.push(value);
            });
            RB_list = sortResults(RB_list, sort_key, false);
            $.each(RB_list, function(index, value) {
                finished_list.push(value);
            });
            WR_list = sortResults(WR_list, sort_key, false);
            $.each(WR_list, function(index, value) {
                finished_list.push(value);
            });
            TE_list = sortResults(TE_list, sort_key, false);
            $.each(TE_list, function(index, value) {
                finished_list.push(value);
            });
            DEF_list = sortResults(DEF_list, sort_key, false);
            $.each(DEF_list, function(index, value) {
                finished_list.push(value);
            });
            K_list = sortResults(K_list, sort_key, false);
            $.each(K_list, function(index, value) {
                finished_list.push(value);
            });
        }

        return finished_list;
    }
    
    function sort_list_yr2 (data, sort_key) {
        var QB_list = [];
        var RB_list = [];
        var WR_list = [];
        var TE_list = [];
        var DEF_list = [];
        var K_list = [];
        $.each(data, function(index, value) {
            if (value.pos == 'QB') {
                QB_list.push(value);
            } else if (value.pos == 'RB') {
                RB_list.push(value);
            } else if (value.pos == 'WR') {
                WR_list.push(value);
            } else if (value.pos == 'TE') {
                TE_list.push(value);
            } else if (value.pos == 'DEF') {
                DEF_list.push(value);
            } else if (value.pos == 'K') {
                K_list.push(value);
            }
        });

        var finished_list = [];

        if (sort_key == 'role') {
            QB_list = sort_by_role_yr2(QB_list);
            $.each(QB_list, function(index, value) {
                finished_list.push(value);
            });
            RB_list = sort_by_role_yr2(RB_list);
            $.each(RB_list, function(index, value) {
                finished_list.push(value);
            });
            WR_list = sort_by_role_yr2(WR_list);
            $.each(WR_list, function(index, value) {
                finished_list.push(value);
            });
            TE_list = sort_by_role_yr2(TE_list);
            $.each(TE_list, function(index, value) {
                finished_list.push(value);
            });
            DEF_list = sort_by_role_yr2(DEF_list);
            $.each(DEF_list, function(index, value) {
                finished_list.push(value);
            });
            K_list = sort_by_role_yr2(K_list);
            $.each(K_list, function(index, value) {
                finished_list.push(value);
            });
        } else {
            QB_list = sortResults(QB_list, sort_key, false);
            $.each(QB_list, function(index, value) {
                finished_list.push(value);
            });
            RB_list = sortResults(RB_list, sort_key, false);
            $.each(RB_list, function(index, value) {
                finished_list.push(value);
            });
            WR_list = sortResults(WR_list, sort_key, false);
            $.each(WR_list, function(index, value) {
                finished_list.push(value);
            });
            TE_list = sortResults(TE_list, sort_key, false);
            $.each(TE_list, function(index, value) {
                finished_list.push(value);
            });
            DEF_list = sortResults(DEF_list, sort_key, false);
            $.each(DEF_list, function(index, value) {
                finished_list.push(value);
            });
            K_list = sortResults(K_list, sort_key, false);
            $.each(K_list, function(index, value) {
                finished_list.push(value);
            });
        }

        return finished_list;
    }
    
    function sort_list_yr3 (data, sort_key) {
        var QB_list = [];
        var RB_list = [];
        var WR_list = [];
        var TE_list = [];
        var DEF_list = [];
        var K_list = [];
        $.each(data, function(index, value) {
            if (value.pos == 'QB') {
                QB_list.push(value);
            } else if (value.pos == 'RB') {
                RB_list.push(value);
            } else if (value.pos == 'WR') {
                WR_list.push(value);
            } else if (value.pos == 'TE') {
                TE_list.push(value);
            } else if (value.pos == 'DEF') {
                DEF_list.push(value);
            } else if (value.pos == 'K') {
                K_list.push(value);
            }
        });

        var finished_list = [];

        if (sort_key == 'role') {
            QB_list = sort_by_role_yr3(QB_list);
            $.each(QB_list, function(index, value) {
                finished_list.push(value);
            });
            RB_list = sort_by_role_yr3(RB_list);
            $.each(RB_list, function(index, value) {
                finished_list.push(value);
            });
            WR_list = sort_by_role_yr3(WR_list);
            $.each(WR_list, function(index, value) {
                finished_list.push(value);
            });
            TE_list = sort_by_role_yr3(TE_list);
            $.each(TE_list, function(index, value) {
                finished_list.push(value);
            });
            DEF_list = sort_by_role_yr3(DEF_list);
            $.each(DEF_list, function(index, value) {
                finished_list.push(value);
            });
            K_list = sort_by_role_yr3(K_list);
            $.each(K_list, function(index, value) {
                finished_list.push(value);
            });
        } else {
            QB_list = sortResults(QB_list, sort_key, false);
            $.each(QB_list, function(index, value) {
                finished_list.push(value);
            });
            RB_list = sortResults(RB_list, sort_key, false);
            $.each(RB_list, function(index, value) {
                finished_list.push(value);
            });
            WR_list = sortResults(WR_list, sort_key, false);
            $.each(WR_list, function(index, value) {
                finished_list.push(value);
            });
            TE_list = sortResults(TE_list, sort_key, false);
            $.each(TE_list, function(index, value) {
                finished_list.push(value);
            });
            DEF_list = sortResults(DEF_list, sort_key, false);
            $.each(DEF_list, function(index, value) {
                finished_list.push(value);
            });
            K_list = sortResults(K_list, sort_key, false);
            $.each(K_list, function(index, value) {
                finished_list.push(value);
            });
        }

        return finished_list;
    }
    
    function sort_list_yr4 (data, sort_key) {
        var QB_list = [];
        var RB_list = [];
        var WR_list = [];
        var TE_list = [];
        var DEF_list = [];
        var K_list = [];
        $.each(data, function(index, value) {
            if (value.pos == 'QB') {
                QB_list.push(value);
            } else if (value.pos == 'RB') {
                RB_list.push(value);
            } else if (value.pos == 'WR') {
                WR_list.push(value);
            } else if (value.pos == 'TE') {
                TE_list.push(value);
            } else if (value.pos == 'DEF') {
                DEF_list.push(value);
            } else if (value.pos == 'K') {
                K_list.push(value);
            }
        });

        var finished_list = [];

        if (sort_key == 'role') {
            QB_list = sort_by_role_yr4(QB_list);
            $.each(QB_list, function(index, value) {
                finished_list.push(value);
            });
            RB_list = sort_by_role_yr4(RB_list);
            $.each(RB_list, function(index, value) {
                finished_list.push(value);
            });
            WR_list = sort_by_role_yr4(WR_list);
            $.each(WR_list, function(index, value) {
                finished_list.push(value);
            });
            TE_list = sort_by_role_yr4(TE_list);
            $.each(TE_list, function(index, value) {
                finished_list.push(value);
            });
            DEF_list = sort_by_role_yr4(DEF_list);
            $.each(DEF_list, function(index, value) {
                finished_list.push(value);
            });
            K_list = sort_by_role_yr4(K_list);
            $.each(K_list, function(index, value) {
                finished_list.push(value);
            });
        } else {
            QB_list = sortResults(QB_list, sort_key, false);
            $.each(QB_list, function(index, value) {
                finished_list.push(value);
            });
            RB_list = sortResults(RB_list, sort_key, false);
            $.each(RB_list, function(index, value) {
                finished_list.push(value);
            });
            WR_list = sortResults(WR_list, sort_key, false);
            $.each(WR_list, function(index, value) {
                finished_list.push(value);
            });
            TE_list = sortResults(TE_list, sort_key, false);
            $.each(TE_list, function(index, value) {
                finished_list.push(value);
            });
            DEF_list = sortResults(DEF_list, sort_key, false);
            $.each(DEF_list, function(index, value) {
                finished_list.push(value);
            });
            K_list = sortResults(K_list, sort_key, false);
            $.each(K_list, function(index, value) {
                finished_list.push(value);
            });
        }

        return finished_list;
    }
    
    function sort_list_yr5 (data, sort_key) {
        var QB_list = [];
        var RB_list = [];
        var WR_list = [];
        var TE_list = [];
        var DEF_list = [];
        var K_list = [];
        $.each(data, function(index, value) {
            if (value.pos == 'QB') {
                QB_list.push(value);
            } else if (value.pos == 'RB') {
                RB_list.push(value);
            } else if (value.pos == 'WR') {
                WR_list.push(value);
            } else if (value.pos == 'TE') {
                TE_list.push(value);
            } else if (value.pos == 'DEF') {
                DEF_list.push(value);
            } else if (value.pos == 'K') {
                K_list.push(value);
            }
        });

        var finished_list = [];

        if (sort_key == 'role') {
            QB_list = sort_by_role_yr5(QB_list);
            $.each(QB_list, function(index, value) {
                finished_list.push(value);
            });
            RB_list = sort_by_role_yr5(RB_list);
            $.each(RB_list, function(index, value) {
                finished_list.push(value);
            });
            WR_list = sort_by_role_yr5(WR_list);
            $.each(WR_list, function(index, value) {
                finished_list.push(value);
            });
            TE_list = sort_by_role_yr5(TE_list);
            $.each(TE_list, function(index, value) {
                finished_list.push(value);
            });
            DEF_list = sort_by_role_yr5(DEF_list);
            $.each(DEF_list, function(index, value) {
                finished_list.push(value);
            });
            K_list = sort_by_role_yr5(K_list);
            $.each(K_list, function(index, value) {
                finished_list.push(value);
            });
        } else {
            QB_list = sortResults(QB_list, sort_key, false);
            $.each(QB_list, function(index, value) {
                finished_list.push(value);
            });
            RB_list = sortResults(RB_list, sort_key, false);
            $.each(RB_list, function(index, value) {
                finished_list.push(value);
            });
            WR_list = sortResults(WR_list, sort_key, false);
            $.each(WR_list, function(index, value) {
                finished_list.push(value);
            });
            TE_list = sortResults(TE_list, sort_key, false);
            $.each(TE_list, function(index, value) {
                finished_list.push(value);
            });
            DEF_list = sortResults(DEF_list, sort_key, false);
            $.each(DEF_list, function(index, value) {
                finished_list.push(value);
            });
            K_list = sortResults(K_list, sort_key, false);
            $.each(K_list, function(index, value) {
                finished_list.push(value);
            });
        }

        return finished_list;
    }

    function sort_roles_list (data, keep_blanks) {
        var role_json = [];
        $.each(data, function(index, x) {
            $.each($avail_roles, function(index, value) {
                if (value.role == x) {
                    role_json.push({'role': x, 'is_unique': value.unique_roles});
                }
            });
        });
        var s_u_roles = [];
        var s_g_roles = [];
        $.each(role_json, function(index, value) {
            if (value.is_unique == '1') {
                s_u_roles.push(value.role);
            } else {
                if (value.role != '--') {
                    s_g_roles.push(value.role);
                } else {
                    if (keep_blanks == true) {
                        s_g_roles.push(value.role);
                    }
                }
            }
        });
        s_u_roles.sort();
        if (keep_blanks == true) {
            var s_fin = [];
        } else {
            var s_fin = ['--'];
        }

        $.each(s_u_roles, function(index, value) {
            s_fin.push(value);
        });
        $.each(s_g_roles, function(index, value) {
            s_fin.push(value);
        });
        return s_fin;
    }

    function populate_complete_yr1 () {
        total_cost = 0;
        //populate yr1 table - QB
        var sorted_QB_list = sort_list_yr1(QB_list, 'role');
        $.each(sorted_QB_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr1_table_normal(value);
            } else {
                populate_yr1_table_aux(value);
            }
        });
        var num_rows = $('#team_cap_body').find('tr').length;
        if (num_rows % 2 == 0) {
            $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
        } else {
            $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux');
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr1 table - RB
        var sorted_RB_list = sort_list_yr1(RB_list, 'role');
        $.each(sorted_RB_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr1_table_normal(value);
            } else {
                populate_yr1_table_aux(value);
            }
        });
        var num_rows = $('#team_cap_body').find('tr').length;
        if (num_rows % 2 == 0) {
            $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
        } else {
            $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux');
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr1 table - WR
        var sorted_WR_list = sort_list_yr1(WR_list, 'role');
        $.each(sorted_WR_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr1_table_normal(value);
            } else {
                populate_yr1_table_aux(value);
            }
        });
        var num_rows = $('#team_cap_body').find('tr').length;
        if (num_rows % 2 == 0) {
            $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
        } else {
            $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux');
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr1 table - TE
        var sorted_TE_list = sort_list_yr1(TE_list, 'role');
        $.each(sorted_TE_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr1_table_normal(value);
            } else {
                populate_yr1_table_aux(value);
            }
        });
        var num_rows = $('#team_cap_body').find('tr').length;
        if (num_rows % 2 == 0) {
            $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
        } else {
            $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux')
                .append('<td>').addClass('team_cap_data_aux');
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr1 table - DEF/K
        var sorted_DEF_K_list = sort_list_yr1(DEF_K_list, 'role');
        $.each(sorted_DEF_K_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr1_table_normal(value);
            } else {
                populate_yr1_table_aux(value);
            }
        });

        write_cap_numbers_yr1();
    }

    function populate_complete_yr2 () {
        total_cost = 0;
        //populate yr2 table - QB
        var sorted_QB_list = sort_list_yr2(QB_list, 'role');
        $.each(sorted_QB_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr2_table_normal(value);
            } else {
                populate_yr2_table_aux(value);
            }
        });
        var total_sal = 0;
        $.each(RB_list, function(index, value) {
            total_sal = total_sal + value.yr2_salary
        });
        if (total_sal != 0) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
            } else {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux');
            }
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr2 table - RB
        var sorted_RB_list = sort_list_yr2(RB_list, 'role');
        $.each(sorted_RB_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr2_table_normal(value);
            } else {
                populate_yr2_table_aux(value);
            }
        });
        var total_sal = 0;
        $.each(WR_list, function(index, value) {
            total_sal = total_sal + value.yr2_salary
        });
        if (total_sal != 0) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
            } else {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux');
            }
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr2 table - WR
        var sorted_WR_list = sort_list_yr2(WR_list, 'role');
        $.each(sorted_WR_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr2_table_normal(value);
            } else {
                populate_yr2_table_aux(value);
            }
        });
        var total_sal = 0;
        $.each(TE_list, function(index, value) {
            total_sal = total_sal + value.yr2_salary
        });
        if (total_sal != 0) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
            } else {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux');
            }
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr2 table - TE
        var sorted_TE_list = sort_list_yr2(TE_list, 'role');
        $.each(sorted_TE_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr2_table_normal(value);
            } else {
                populate_yr2_table_aux(value);
            }
        });
        var total_sal = 0;
        $.each(DEF_K_list, function(index, value) {
            total_sal = total_sal + value.yr2_salary
        });
        if (total_sal != 0) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
            } else {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux');
            }
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr2 table - DEF/K
        var sorted_DEF_K_list = sort_list_yr2(DEF_K_list, 'role');
        $.each(sorted_DEF_K_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr2_table_normal(value);
            } else {
                populate_yr2_table_aux(value);
            }
        });

        write_cap_numbers_yr2();
    }
    
    function populate_complete_yr3 () {
        total_cost = 0;
        //populate yr3 table - QB
        var sorted_QB_list = sort_list_yr3(QB_list, 'role');
        $.each(sorted_QB_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr3_table_normal(value);
            } else {
                populate_yr3_table_aux(value);
            }
        });
        var total_sal = 0;
        $.each(RB_list, function(index, value) {
            total_sal = total_sal + value.yr3_salary
        });
        if (total_sal != 0) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
            } else {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux');
            }
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr3 table - RB
        var sorted_RB_list = sort_list_yr3(RB_list, 'role');
        $.each(sorted_RB_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr3_table_normal(value);
            } else {
                populate_yr3_table_aux(value);
            }
        });
        var total_sal = 0;
        $.each(WR_list, function(index, value) {
            total_sal = total_sal + value.yr3_salary
        });
        if (total_sal != 0) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
            } else {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux');
            }
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr3 table - WR
        var sorted_WR_list = sort_list_yr3(WR_list, 'role');
        $.each(sorted_WR_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr3_table_normal(value);
            } else {
                populate_yr3_table_aux(value);
            }
        });
        var total_sal = 0;
        $.each(TE_list, function(index, value) {
            total_sal = total_sal + value.yr3_salary
        });
        if (total_sal != 0) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
            } else {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux');
            }
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr3 table - TE
        var sorted_TE_list = sort_list_yr3(TE_list, 'role');
        $.each(sorted_TE_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr3_table_normal(value);
            } else {
                populate_yr3_table_aux(value);
            }
        });
        var total_sal = 0;
        $.each(DEF_K_list, function(index, value) {
            total_sal = total_sal + value.yr3_salary
        });
        if (total_sal != 0) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
            } else {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux');
            }
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr3 table - DEF/K
        var sorted_DEF_K_list = sort_list_yr3(DEF_K_list, 'role');
        $.each(sorted_DEF_K_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr3_table_normal(value);
            } else {
                populate_yr3_table_aux(value);
            }
        });

        write_cap_numbers_yr3();
    }
    
    function populate_complete_yr4 () {
        total_cost = 0;
        //populate yr4 table - QB
        var sorted_QB_list = sort_list_yr4(QB_list, 'role');
        $.each(sorted_QB_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr4_table_normal(value);
            } else {
                populate_yr4_table_aux(value);
            }
        });
        var total_sal = 0;
        $.each(RB_list, function(index, value) {
            total_sal = total_sal + value.yr4_salary
        });
        if (total_sal != 0) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
            } else {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux');
            }
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr4 table - RB
        var sorted_RB_list = sort_list_yr4(RB_list, 'role');
        $.each(sorted_RB_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr4_table_normal(value);
            } else {
                populate_yr4_table_aux(value);
            }
        });
        var total_sal = 0;
        $.each(WR_list, function(index, value) {
            total_sal = total_sal + value.yr4_salary
        });
        if (total_sal != 0) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
            } else {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux');
            }
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr4 table - WR
        var sorted_WR_list = sort_list_yr4(WR_list, 'role');
        $.each(sorted_WR_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr4_table_normal(value);
            } else {
                populate_yr4_table_aux(value);
            }
        });
        var total_sal = 0;
        $.each(TE_list, function(index, value) {
            total_sal = total_sal + value.yr4_salary
        });
        if (total_sal != 0) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
            } else {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux');
            }
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr4 table - TE
        var sorted_TE_list = sort_list_yr4(TE_list, 'role');
        $.each(sorted_TE_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr4_table_normal(value);
            } else {
                populate_yr4_table_aux(value);
            }
        });
        var total_sal = 0;
        $.each(DEF_K_list, function(index, value) {
            total_sal = total_sal + value.yr4_salary
        });
        if (total_sal != 0) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
            } else {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux');
            }
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr4 table - DEF/K
        var sorted_DEF_K_list = sort_list_yr4(DEF_K_list, 'role');
        $.each(sorted_DEF_K_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr4_table_normal(value);
            } else {
                populate_yr4_table_aux(value);
            }
        });

        write_cap_numbers_yr4();
    }
    
    function populate_complete_yr5 () {
        total_cost = 0;
        //populate yr5 table - QB
        var sorted_QB_list = sort_list_yr5(QB_list, 'role');
        $.each(sorted_QB_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr5_table_normal(value);
            } else {
                populate_yr5_table_aux(value);
            }
        });
        var total_sal = 0;
        $.each(RB_list, function(index, value) {
            total_sal = total_sal + value.yr5_salary
        });
        if (total_sal != 0) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
            } else {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux');
            }
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr5 table - RB
        var sorted_RB_list = sort_list_yr5(RB_list, 'role');
        $.each(sorted_RB_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr5_table_normal(value);
            } else {
                populate_yr5_table_aux(value);
            }
        });
        var total_sal = 0;
        $.each(WR_list, function(index, value) {
            total_sal = total_sal + value.yr5_salary
        });
        if (total_sal != 0) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
            } else {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux');
            }
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr5 table - WR
        var sorted_WR_list = sort_list_yr5(WR_list, 'role');
        $.each(sorted_WR_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr5_table_normal(value);
            } else {
                populate_yr5_table_aux(value);
            }
        });
        var total_sal = 0;
        $.each(TE_list, function(index, value) {
            total_sal = total_sal + value.yr5_salary
        });
        if (total_sal != 0) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
            } else {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux');
            }
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr5 table - TE
        var sorted_TE_list = sort_list_yr5(TE_list, 'role');
        $.each(sorted_TE_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr5_table_normal(value);
            } else {
                populate_yr5_table_aux(value);
            }
        });
        var total_sal = 0;
        $.each(DEF_K_list, function(index, value) {
            total_sal = total_sal + value.yr5_salary
        });
        if (total_sal != 0) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body');
            } else {
                $('<tr>').attr('style', 'height: 20px').appendTo('#team_cap_body')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux')
                    .append('<td>').addClass('team_cap_data_aux');
            }
        }
        if (total_cost == 0) {
            $('#team_cap_body tr:first').remove();
        }

        //populate yr5 table - DEF/K
        var sorted_DEF_K_list = sort_list_yr5(DEF_K_list, 'role');
        $.each(sorted_DEF_K_list, function(index, value) {
            var num_rows = $('#team_cap_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_yr5_table_normal(value);
            } else {
                populate_yr5_table_aux(value);
            }
        });

        write_cap_numbers_yr5();
    }

    function write_cap_numbers_yr1 () {
        $('#cap_penalty_text').text('$'+cap_pen_yr1.toFixed(2));
        $('#total_cost_text').text('$'+total_cost.toFixed(2));
        var cap_space = 200 - total_cost - cap_pen_yr1;
        if (cap_space <= 0) {
            $('#cap_space_text').css('font-size', 'larger').css('font-weight','bold').css('color','red').text('( '+cap_space.toFixed(2)+' )');
        } else {
            $('#cap_space_text').css('font-size', 'small').css('font-weight','normal').css('color','green').text('$'+cap_space.toFixed(2));
        }
    }

    function write_cap_numbers_yr2 () {
        $('#cap_penalty_text').text('$'+cap_pen_yr2.toFixed(2));
        $('#total_cost_text').text('$'+total_cost.toFixed(2));
        var cap_space = 200 - total_cost - cap_pen_yr2;
        if (cap_space <= 0) {
            $('#cap_space_text').css('font-size', 'larger').css('font-weight','bold').css('color','red').text('( '+cap_space.toFixed(2)+' )');
        } else {
            $('#cap_space_text').css('font-size', 'small').css('font-weight','normal').css('color','green').text('$'+cap_space.toFixed(2));
        }
    }

    function write_cap_numbers_yr3 () {
        $('#cap_penalty_text').text('$'+cap_pen_yr3.toFixed(2));
        $('#total_cost_text').text('$'+total_cost.toFixed(2));
        var cap_space = 200 - total_cost - cap_pen_yr3;
        if (cap_space <= 0) {
            $('#cap_space_text').css('font-size', 'larger').css('font-weight','bold').css('color','red').text('( '+cap_space.toFixed(2)+' )');
        } else {
            $('#cap_space_text').css('font-size', 'small').css('font-weight','normal').css('color','green').text('$'+cap_space.toFixed(2));
        }
    }

    function write_cap_numbers_yr4 () {
        $('#cap_penalty_text').text('$'+cap_pen_yr4.toFixed(2));
        $('#total_cost_text').text('$'+total_cost.toFixed(2));
        var cap_space = 200 - total_cost - cap_pen_yr4;
        if (cap_space <= 0) {
            $('#cap_space_text').css('font-size', 'larger').css('font-weight','bold').css('color','red').text('( '+cap_space.toFixed(2)+' )');
        } else {
            $('#cap_space_text').css('font-size', 'small').css('font-weight','normal').css('color','green').text('$'+cap_space.toFixed(2));
        }
    }

    function write_cap_numbers_yr5 () {
        $('#cap_penalty_text').text('$'+cap_pen_yr5.toFixed(2));
        $('#total_cost_text').text('$'+total_cost.toFixed(2));
        var cap_space = 200 - total_cost - cap_pen_yr5;
        if (cap_space <= 0) {
            $('#cap_space_text').css('font-size', 'larger').css('font-weight','bold').css('color','red').text('( '+cap_space.toFixed(2)+' )');
        } else {
            $('#cap_space_text').css('font-size', 'small').css('font-weight','normal').css('color','green').text('$'+cap_space.toFixed(2));
        }
    }


    // ON READY ACTIONS

    //split master into lists of names for each table
    split_master_into_pos();
    populate_complete_yr1();





    //role change **********
    $(document.body).on('change', '.role_selects', function() {
        var s_name = $(this).next().next().text();
        var new_role = $(this).val();
        var previous_role = '';
        var this_pos = '';
        $.each($master, function(index, value) {
            if (value.name == s_name) {
                if (current_selected_year == 'yr1') {
                    previous_role = value.yr1_role;
                    value.yr1_role = new_role;
                } else if (current_selected_year == 'yr2') {
                    previous_role = value.yr2_role;
                    value.yr2_role = new_role;
                } else if (current_selected_year == 'yr3') {
                    previous_role = value.yr3_role;
                    value.yr3_role = new_role;
                } else if (current_selected_year == 'yr4') {
                    previous_role = value.yr4_role;
                    value.yr4_role = new_role;
                } else if (current_selected_year == 'yr5') {
                    previous_role = value.yr5_role;
                    value.yr5_role = new_role;
                }
                this_pos = value.pos;
                //save role change locally - see 2nd part above
            }
        });

        //save role change
        $.ajax({
            url: '/team_cap_save_role_change',
            type: 'POST',
            data: {csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value, 'new_role': new_role, 'name': s_name, 'year' : current_selected_year},
            dataType: 'json',
            success: function (data) {
                //do nothing
            }
        });

        //alter all selects
        //check if old role was unique
        var is_unique = '';
        $.each($avail_roles, function(index, value) {
            if (previous_role == value.role) {
                is_unique = value.unique_roles;
            }
        });
        //if unique, add previous role to all relevent roles
        if (is_unique != 0) {
            $.each($master, function(index, value) {
                if (current_selected_year == 'yr1') {
                    if (value.pos == this_pos) {
                        if (value.name != s_name) {
                            var new_role_list = value.avail_roles_yr1;
                            new_role_list.push(previous_role);
                            new_role_list = sort_roles_list(new_role_list, false);
                            value.avail_roles_yr1 = new_role_list;
                        }
                    }
                } else if (current_selected_year == 'yr2') {
                    if (value.pos == this_pos) {
                        if (value.name != s_name) {
                            var new_role_list = value.avail_roles_yr2;
                            new_role_list.push(previous_role);
                            new_role_list = sort_roles_list(new_role_list, false);
                            value.avail_roles_yr2 = new_role_list;
                        }
                    }
                } else if (current_selected_year == 'yr3') {
                    if (value.pos == this_pos) {
                        if (value.name != s_name) {
                            var new_role_list = value.avail_roles_yr3;
                            new_role_list.push(previous_role);
                            new_role_list = sort_roles_list(new_role_list, false);
                            value.avail_roles_yr3 = new_role_list;
                        }
                    }
                } else if (current_selected_year == 'yr4') {
                    if (value.pos == this_pos) {
                        if (value.name != s_name) {
                            var new_role_list = value.avail_roles_yr4;
                            new_role_list.push(previous_role);
                            new_role_list = sort_roles_list(new_role_list, false);
                            value.avail_roles_yr4 = new_role_list;
                        }
                    }
                } else if (current_selected_year == 'yr5') {
                    if (value.pos == this_pos) {
                        if (value.name != s_name) {
                            var new_role_list = value.avail_roles_yr5;
                            new_role_list.push(previous_role);
                            new_role_list = sort_roles_list(new_role_list, false);
                            value.avail_roles_yr5 = new_role_list;
                        }
                    }
                }
            });
        }
        //check is new role is unique
        is_unique = '';
        $.each($avail_roles, function(index, value) {
            if (new_role == value.role) {
                is_unique = value.unique_roles;
            }
        });
        //if unique, remove from all relevent selects
        if (is_unique != 0) {
            $.each($master, function(index, value) {
                if (current_selected_year == 'yr1') {
                    if (value.pos == this_pos) {
                        if (value.name != s_name) {
                            var new_role_list = [];
                            $.each(value.avail_roles_yr1, function(index, x) {
                                if (x != new_role) {
                                    new_role_list.push(x);
                                }
                            });
                            new_role_list = sort_roles_list(new_role_list, false);
                            value.avail_roles_yr1 = new_role_list;
                        }
                    }
                } else if (current_selected_year == 'yr2') {
                    if (value.pos == this_pos) {
                        if (value.name != s_name) {
                            var new_role_list = [];
                            $.each(value.avail_roles_yr2, function(index, x) {
                                if (x != new_role) {
                                    new_role_list.push(x);
                                }
                            });
                            new_role_list = sort_roles_list(new_role_list, false);
                            value.avail_roles_yr2 = new_role_list;
                        }
                    }
                } else if (current_selected_year == 'yr3') {
                    if (value.pos == this_pos) {
                        if (value.name != s_name) {
                            var new_role_list = [];
                            $.each(value.avail_roles_yr3, function(index, x) {
                                if (x != new_role) {
                                    new_role_list.push(x);
                                }
                            });
                            new_role_list = sort_roles_list(new_role_list, false);
                            value.avail_roles_yr3 = new_role_list;
                        }
                    }
                } else if (current_selected_year == 'yr4') {
                    if (value.pos == this_pos) {
                        if (value.name != s_name) {
                            var new_role_list = [];
                            $.each(value.avail_roles_yr4, function(index, x) {
                                if (x != new_role) {
                                    new_role_list.push(x);
                                }
                            });
                            new_role_list = sort_roles_list(new_role_list, false);
                            value.avail_roles_yr4 = new_role_list;
                        }
                    }
                } else if (current_selected_year == 'yr5') {
                    if (value.pos == this_pos) {
                        if (value.name != s_name) {
                            var new_role_list = [];
                            $.each(value.avail_roles_yr5, function(index, x) {
                                if (x != new_role) {
                                    new_role_list.push(x);
                                }
                            });
                            new_role_list = sort_roles_list(new_role_list, false);
                            value.avail_roles_yr5 = new_role_list;
                        }
                    }
                }
            });
        }
        //re-populate all tables
        clear_table();
        split_master_into_pos();
        if (current_selected_year == 'yr1') {
            populate_complete_yr1();
        } else if (current_selected_year == 'yr2') {
            populate_complete_yr2();
        } else if (current_selected_year == 'yr3') {
            populate_complete_yr3();
        } else if (current_selected_year == 'yr4') {
            populate_complete_yr4();
        } else if (current_selected_year == 'yr5') {
            populate_complete_yr5();
        }

    });


    //change year
    $(document.body).on('click', '.third_tab_button_team', function() {
        var new_year_clicked = $(this).text();
        clear_table();
        split_master_into_pos();
        if (new_year_clicked == '2015') {
            current_selected_year = 'yr1';
            highlight_current_selected_year();
            populate_complete_yr1();
        } else if (new_year_clicked == '2016') {
            current_selected_year = 'yr2';
            highlight_current_selected_year();
            populate_complete_yr2();
        } else if (new_year_clicked == '2017') {
            current_selected_year = 'yr3';
            highlight_current_selected_year();
            populate_complete_yr3();
        } else if (new_year_clicked == '2018') {
            current_selected_year = 'yr4';
            highlight_current_selected_year();
            populate_complete_yr4();
        } else if (new_year_clicked == '2019') {
            current_selected_year = 'yr5';
            highlight_current_selected_year();
            populate_complete_yr5();
        }
    });




    //click on a name to go to player page
    $(document.body).on('click', '.name_link', function() {
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
});