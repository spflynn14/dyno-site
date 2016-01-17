$(document).ready(function() {
    var $team = $('#team_header_name').text().replace(/\(|\)/g, '').trim();
    var $view = $('.organization_view_select').val();
    var $flex_1 = $('#vw_4').find('p').text();
    $('#vw_4').remove();
    var $flex_2 = $('#vw_5').find('p').text();
    $('#vw_5').remove();
    var $user = $('#vw_2').find('p').text();
    $('#vw_2').remove();
    var $user_team_index = $('#vw_6').find('p').text();
    $('#vw_6').remove();
    var $user_team = $('#vw_8').find('p').text();
    $('#vw_8').remove();

    var filtered_tags = [];
    $('#vw_7').find('td').each(function() {
        filtered_tags.push($(this).text());
    });
    $('#vw_7').remove();


    //get master list {player, role, pos}
    var $master = [];
    $('#vw_1').find('tr').each(function() {
        var a_r = [];
        $(this).find('#vw_1-8 > p').each(function() {
            a_r.push($(this).text());
        });
        $master.push({'name': $(this).find('#vw_1-1').text(),
            'pos': $(this).find('#vw_1-2').text(),
            'role': $(this).find('#vw_1-3').text(),
            'total_value': Number($(this).find('#vw_1-4').text()),
            'yrs_left': Number($(this).find('#vw_1-5').text()),
            'avg_yearly': Number($(this).find('#vw_1-6').text()),
            'cap_hit': Number($(this).find('#vw_1-7').text()),
            'avail_roles': a_r});
        $(this).remove();
    });

    //get available roles for this user
    var $avail_roles = [];
    $('#vw_3').find('tr').each(function() {
        $avail_roles.push({'role': $(this).find('#vw_3-1').text(),
            'unique_roles': $(this).find('#vw_3-2').text(),
            'applies_to_QB': $(this).find('#vw_3-3').text(),
            'applies_to_RB': $(this).find('#vw_3-4').text(),
            'applies_to_WR': $(this).find('#vw_3-5').text(),
            'applies_to_TE': $(this).find('#vw_3-6').text(),
            'applies_to_DEF': $(this).find('#vw_3-7').text(),
            'applies_to_K': $(this).find('#vw_3-8').text()});
        $(this).remove();
    });

    var list_of_starter_roles = ['QB 1', 'RB 1', 'RB 2', 'WR 1', 'WR 2', 'TE 1', $flex_1, $flex_2];
    var starter_list = [];
    var def_k_list = [];
    var bench_list = [];
    var dev_list = [];
    var QB_list = [];
    var RB_list = [];
    var WR_list = [];
    var TE_list = [];

    //finished getting variables

    //set view
    switch_view();



    // Functions
    function split_master_into_lists () {
        starter_list = [];
        def_k_list = [];
        bench_list = [];
        dev_list = [];
        $.each($master, function(index, data) {
            var in_list = (list_of_starter_roles.indexOf(data.role) > -1);
            var is_dev = data.role.substr(0,2) == 'D-';
            if (in_list) {
                starter_list.push(data);
            } else if (data.pos == 'DEF') {
                def_k_list.push(data);
            } else if (data.pos == 'K') {
                def_k_list.push(data);
            } else if (is_dev) {
                dev_list.push(data);
            } else {
                bench_list.push(data);
            }
        });
    }

    function split_master_into_pos () {
        QB_list = [];
        RB_list = [];
        WR_list = [];
        TE_list = [];
        $.each($master, function(index, value) {
            if (value.pos == 'QB') {
                QB_list.push(value);
            } else if (value.pos == 'RB') {
                RB_list.push(value);
            } else if (value.pos == 'WR') {
                WR_list.push(value);
            } else if (value.pos == 'TE') {
                TE_list.push(value);
            }
        });
    }

    function order_starter_list (data, starter_pos) {
        var o_list = ['','','','','','','',''];
        $.each(data, function(index, value) {
            if (value.role == starter_pos[0]) {
                o_list[0] = value;
            } else if (value.role == starter_pos[1]) {
                o_list[1] = value;
            } else if (value.role == starter_pos[2]) {
                o_list[2] = value;
            } else if (value.role == starter_pos[3]) {
                o_list[3] = value;
            } else if (value.role == starter_pos[4]) {
                o_list[4] = value;
            } else if (value.role == starter_pos[5]) {
                o_list[5] = value;
            } else if (value.role == starter_pos[6]) {
                o_list[6] = value;
            } else if (value.role == starter_pos[7]) {
                o_list[7] = value;
            }
        });
        return o_list;
    }

    function clear_starter_table () {
        $('#starters_body').empty();
    }

    function clear_def_k_table () {
        $('#def_k_body').empty();
    }

    function clear_bench_table () {
        $('#bench_body').empty();
    }

    function clear_dev_table () {
        $('#dev_body').empty();
    }

    function clear_QB_table () {
         $('#QB_body').empty();
    }

    function clear_RB_table () {
         $('#RB_body').empty();
    }

    function clear_WR_table () {
         $('#WR_body').empty();
    }

    function clear_TE_table () {
         $('#TE_body').empty();
    }

    function populate_starter_table_normal (data) {
        $('<tr>').appendTo('#starters_body');
        if (data != '') {
            var $role_select = $('<select>').addClass('role_selects').attr('style','width:100%;height: 100%').appendTo('#starters_body');
            $.each(data.avail_roles, function (index, value) {
                if (value == data.role) {
                    $role_select.append($('<option>')
                        .attr('value',value)
                        .prop('selected', true)
                        .text(value));
                } else {
                    $role_select.append($('<option>')
                        .attr('value',value)
                        .text(value));
                }
            });
            if ($team != $user_team) {
                $role_select.prop('disabled', true);
                $role_select.empty();
            }
            $('<td>').attr('align','center').text(data.pos).appendTo('#starters_body');
            $('<td>').addClass('name_link').text(data.name).appendTo('#starters_body');
            $('<td>').attr('align','center').text('$' + data.total_value.toFixed(2)).appendTo('#starters_body');
            $('<td>').attr('align','center').text(data.yrs_left).appendTo('#starters_body');
            $('<td>').attr('align','center').text('$' + data.avg_yearly.toFixed(2)).appendTo('#starters_body');
            $('<td>').attr('align','center').text('$' + data.cap_hit.toFixed(2)).appendTo('#starters_body');
        } else {
            $('<td>').attr('style', 'height:20px').appendTo('#starters_body');
        }
    }

    function populate_starter_table_aux (data) {
        $('<tr>').appendTo('#starters_body');
        if (data != '') {
            var $role_select = $('<select>').addClass('role_selects').attr('style','width:100%;height: 100%').appendTo('#starters_body');
            $.each(data.avail_roles, function (index, value) {
                if (value == data.role) {
                    $role_select.append($('<option>')
                        .attr('value',value)
                        .prop('selected', true)
                        .text(value));
                } else {
                    $role_select.append($('<option>')
                        .attr('value',value)
                        .text(value));
                }
            });
            if ($team != $user_team) {
                $role_select.prop('disabled', true);
                $role_select.empty();
            }
            $('<td>').attr('align','center').addClass('team_organization_data_aux').text(data.pos).appendTo('#starters_body');
            $('<td>').addClass('name_link').addClass('team_organization_data_aux').text(data.name).appendTo('#starters_body');
            $('<td>').attr('align','center').addClass('team_organization_data_aux').text('$' + data.total_value.toFixed(2)).appendTo('#starters_body');
            $('<td>').attr('align','center').addClass('team_organization_data_aux').text(data.yrs_left).appendTo('#starters_body');
            $('<td>').attr('align','center').addClass('team_organization_data_aux').text('$' + data.avg_yearly.toFixed(2)).appendTo('#starters_body');
            $('<td>').attr('align','center').addClass('team_organization_data_aux').text('$' + data.cap_hit.toFixed(2)).appendTo('#starters_body');
        } else {
            $('<td>').addClass('team_organization_data_aux').attr('style', 'height:20px').appendTo('#starters_body');
            $('<td>').addClass('team_organization_data_aux').attr('style', 'height:20px').appendTo('#starters_body');
            $('<td>').addClass('team_organization_data_aux').attr('style', 'height:20px').appendTo('#starters_body');
            $('<td>').addClass('team_organization_data_aux').attr('style', 'height:20px').appendTo('#starters_body');
            $('<td>').addClass('team_organization_data_aux').attr('style', 'height:20px').appendTo('#starters_body');
            $('<td>').addClass('team_organization_data_aux').attr('style', 'height:20px').appendTo('#starters_body');
            $('<td>').addClass('team_organization_data_aux').attr('style', 'height:20px').appendTo('#starters_body');
        }
    }

    function populate_def_k_table_normal (data) {
        if ($.inArray(data.role, filtered_tags) == -1) {
            $('<tr>').appendTo('#def_k_body');
            var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#def_k_body');
            $.each(data.avail_roles, function (index, value) {
                if (value == data.role) {
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
            if ($team != $user_team) {
                $role_select.prop('disabled', true);
                $role_select.empty();
            }
            $('<td>').attr('align', 'center').text(data.pos).appendTo('#def_k_body');
            $('<td>').addClass('name_link').text(data.name).appendTo('#def_k_body');
            $('<td>').attr('align', 'center').text('$' + data.total_value.toFixed(2)).appendTo('#def_k_body');
            $('<td>').attr('align', 'center').text(data.yrs_left).appendTo('#def_k_body');
            $('<td>').attr('align', 'center').text('$' + data.avg_yearly.toFixed(2)).appendTo('#def_k_body');
            $('<td>').attr('align', 'center').text('$' + data.cap_hit.toFixed(2)).appendTo('#def_k_body');
        }
    }

    function populate_def_k_table_aux (data) {
        if ($.inArray(data.role, filtered_tags) == -1) {
            $('<tr>').appendTo('#def_k_body');
            var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#def_k_body');
            $.each(data.avail_roles, function (index, value) {
                if (value == data.role) {
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
            if ($team != $user_team) {
                $role_select.prop('disabled', true);
                $role_select.empty();
            }
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text(data.pos).appendTo('#def_k_body');
            $('<td>').addClass('name_link').addClass('team_organization_data_aux').text(data.name).appendTo('#def_k_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text('$' + data.total_value.toFixed(2)).appendTo('#def_k_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text(data.yrs_left).appendTo('#def_k_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text('$' + data.avg_yearly.toFixed(2)).appendTo('#def_k_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text('$' + data.cap_hit.toFixed(2)).appendTo('#def_k_body');
        }
    }

    function populate_bench_table_normal (data) {
        if ($.inArray(data.role, filtered_tags) == -1) {
            $('<tr>').appendTo('#bench_body');
            var $role_select = $('<select>').addClass('role_selects').attr('style','width:100%;height: 100%').appendTo('#bench_body');
            $.each(data.avail_roles, function (index, value) {
                if (value == data.role) {
                    $role_select.append($('<option>')
                        .attr('value',value)
                        .prop('selected', true)
                        .text(value));
                } else {
                    $role_select.append($('<option>')
                        .attr('value',value)
                        .text(value));
                }
            });
            if ($team != $user_team) {
                $role_select.prop('disabled', true);
                $role_select.empty();
            }
            $('<td>').attr('align','center').text(data.pos).appendTo('#bench_body');
            $('<td>').addClass('name_link').text(data.name).appendTo('#bench_body');
            $('<td>').attr('align','center').text('$' + data.total_value.toFixed(2)).appendTo('#bench_body');
            $('<td>').attr('align','center').text(data.yrs_left).appendTo('#bench_body');
            $('<td>').attr('align','center').text('$' + data.avg_yearly.toFixed(2)).appendTo('#bench_body');
            $('<td>').attr('align','center').text('$' + data.cap_hit.toFixed(2)).appendTo('#bench_body');
        }
    }

    function populate_bench_table_aux (data) {
        if ($.inArray(data.role, filtered_tags) == -1) {
            $('<tr>').appendTo('#bench_body');
            var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#bench_body');
            $.each(data.avail_roles, function (index, value) {
                if (value == data.role) {
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
            if ($team != $user_team) {
                $role_select.prop('disabled', true);
                $role_select.empty();
            }
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text(data.pos).appendTo('#bench_body');
            $('<td>').addClass('name_link').addClass('team_organization_data_aux').text(data.name).appendTo('#bench_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text('$' + data.total_value.toFixed(2)).appendTo('#bench_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text(data.yrs_left).appendTo('#bench_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text('$' + data.avg_yearly.toFixed(2)).appendTo('#bench_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text('$' + data.cap_hit.toFixed(2)).appendTo('#bench_body');
        }
    }

    function populate_dev_table_normal (data) {
        if ($.inArray(data.role, filtered_tags) == -1) {
            $('<tr>').appendTo('#dev_body');
            var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#dev_body');
            $.each(data.avail_roles, function (index, value) {
                if (value == data.role) {
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
            if ($team != $user_team) {
                $role_select.prop('disabled', true);
                $role_select.empty();
            }
            $('<td>').attr('align', 'center').text(data.pos).appendTo('#dev_body');
            $('<td>').addClass('name_link').text(data.name).appendTo('#dev_body');
            $('<td>').attr('align', 'center').text('$' + data.total_value.toFixed(2)).appendTo('#dev_body');
            $('<td>').attr('align', 'center').text(data.yrs_left).appendTo('#dev_body');
            $('<td>').attr('align', 'center').text('$' + data.avg_yearly.toFixed(2)).appendTo('#dev_body');
            $('<td>').attr('align', 'center').text('$' + data.cap_hit.toFixed(2)).appendTo('#dev_body');
        }
    }

    function populate_dev_table_aux (data) {
        if ($.inArray(data.role, filtered_tags) == -1) {
            $('<tr>').appendTo('#dev_body');
            var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#dev_body');
            $.each(data.avail_roles, function (index, value) {
                if (value == data.role) {
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
            if ($team != $user_team) {
                $role_select.prop('disabled', true);
                $role_select.empty();
            }
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text(data.pos).appendTo('#dev_body');
            $('<td>').addClass('name_link').addClass('team_organization_data_aux').text(data.name).appendTo('#dev_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text('$' + data.total_value.toFixed(2)).appendTo('#dev_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text(data.yrs_left).appendTo('#dev_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text('$' + data.avg_yearly.toFixed(2)).appendTo('#dev_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text('$' + data.cap_hit.toFixed(2)).appendTo('#dev_body');
        }
    }

    function populate_QB_table_normal (data) {
        if ($.inArray(data.role, filtered_tags) == -1) {
            $('<tr>').appendTo('#QB_body');
            var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#QB_body');
            $.each(data.avail_roles, function (index, value) {
                if (value == data.role) {
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
            if ($team != $user_team) {
                $role_select.prop('disabled', true);
                $role_select.empty();
            }
            $('<td>').addClass('name_link').text(data.name).appendTo('#QB_body');
            $('<td>').attr('align', 'center').text(data.yrs_left).appendTo('#QB_body');
            $('<td>').attr('align', 'center').text('$' + data.avg_yearly.toFixed(2)).appendTo('#QB_body');
        }
    }

    function populate_QB_table_aux (data) {
        if ($.inArray(data.role, filtered_tags) == -1) {
            $('<tr>').appendTo('#QB_body');
            var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#QB_body');
            $.each(data.avail_roles, function (index, value) {
                if (value == data.role) {
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
            if ($team != $user_team) {
                $role_select.prop('disabled', true);
                $role_select.empty();
            }
            $('<td>').addClass('name_link').addClass('team_organization_data_aux').text(data.name).appendTo('#QB_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text(data.yrs_left).appendTo('#QB_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text('$' + data.avg_yearly.toFixed(2)).appendTo('#QB_body');
        }
    }

    function populate_RB_table_normal (data) {
        if ($.inArray(data.role, filtered_tags) == -1) {
            $('<tr>').appendTo('#RB_body');
            var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#RB_body');
            $.each(data.avail_roles, function (index, value) {
                if (value == data.role) {
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
            if ($team != $user_team) {
                $role_select.prop('disabled', true);
                $role_select.empty();
            }
            $('<td>').addClass('name_link').text(data.name).appendTo('#RB_body');
            $('<td>').attr('align', 'center').text(data.yrs_left).appendTo('#RB_body');
            $('<td>').attr('align', 'center').text('$' + data.avg_yearly.toFixed(2)).appendTo('#RB_body');
        }
    }

    function populate_RB_table_aux (data) {
        if ($.inArray(data.role, filtered_tags) == -1) {
            $('<tr>').appendTo('#RB_body');
            var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#RB_body');
            $.each(data.avail_roles, function (index, value) {
                if (value == data.role) {
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
            if ($team != $user_team) {
                $role_select.prop('disabled', true);
                $role_select.empty();
            }
            $('<td>').addClass('name_link').addClass('team_organization_data_aux').text(data.name).appendTo('#RB_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text(data.yrs_left).appendTo('#RB_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text('$' + data.avg_yearly.toFixed(2)).appendTo('#RB_body');
        }
    }

    function populate_WR_table_normal (data) {
        if ($.inArray(data.role, filtered_tags) == -1) {
            $('<tr>').appendTo('#WR_body');
            var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#WR_body');
            $.each(data.avail_roles, function (index, value) {
                if (value == data.role) {
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
            if ($team != $user_team) {
                $role_select.prop('disabled', true);
                $role_select.empty();
            }
            $('<td>').addClass('name_link').text(data.name).appendTo('#WR_body');
            $('<td>').attr('align', 'center').text(data.yrs_left).appendTo('#WR_body');
            $('<td>').attr('align', 'center').text('$' + data.avg_yearly.toFixed(2)).appendTo('#WR_body');
        }
    }

    function populate_WR_table_aux (data) {
        if ($.inArray(data.role, filtered_tags) == -1) {
            $('<tr>').appendTo('#WR_body');
            var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%;').appendTo('#WR_body');
            $.each(data.avail_roles, function (index, value) {
                if (value == data.role) {
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
            if ($team != $user_team) {
                $role_select.prop('disabled', true);
                $role_select.empty();
            }
            $('<td>').addClass('name_link').addClass('team_organization_data_aux').text(data.name).appendTo('#WR_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text(data.yrs_left).appendTo('#WR_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text('$' + data.avg_yearly.toFixed(2)).appendTo('#WR_body');
        }
    }

    function populate_TE_table_normal (data) {
        if ($.inArray(data.role, filtered_tags) == -1) {
            $('<tr>').appendTo('#TE_body');
            var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#TE_body');
            $.each(data.avail_roles, function (index, value) {
                if (value == data.role) {
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
            if ($team != $user_team) {
                $role_select.prop('disabled', true);
                $role_select.empty();
            }
            $('<td>').addClass('name_link').text(data.name).appendTo('#TE_body');
            $('<td>').attr('align', 'center').text(data.yrs_left).appendTo('#TE_body');
            $('<td>').attr('align', 'center').text('$' + data.avg_yearly.toFixed(2)).appendTo('#TE_body');
        }
    }

    function populate_TE_table_aux (data) {
        if ($.inArray(data.role, filtered_tags) == -1) {
            $('<tr>').appendTo('#TE_body');
            var $role_select = $('<select>').addClass('role_selects').attr('style', 'width:100%;height: 100%').appendTo('#TE_body');
            $.each(data.avail_roles, function (index, value) {
                if (value == data.role) {
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
            if ($team != $user_team) {
                $role_select.prop('disabled', true);
                $role_select.empty();
            }
            $('<td>').addClass('name_link').addClass('team_organization_data_aux').text(data.name).appendTo('#TE_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text(data.yrs_left).appendTo('#TE_body');
            $('<td>').attr('align', 'center').addClass('team_organization_data_aux').text('$' + data.avg_yearly.toFixed(2)).appendTo('#TE_body');
        }
    }

    function sortResults(input_list, prop, asc) {
        var return_list = input_list.sort(function(a, b) {
            if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        });
        return return_list;
    }

    function sort_by_role (data) {
        var role_list = [];
        $.each(data, function(index, value) {
            role_list.push(value);
        });
        role_list = sortResults(role_list, 'role', true);

        var role_json_s1 = [];
        $.each(role_list, function(index, x) {
            $.each($avail_roles, function(index, value) {
                if (value.role == x.role) {
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
        g_list = sortResults(g_list, 'avg_yearly', false);

        var s_fin_t = [];
        $.each(u_list, function(index, value) {
            s_fin_t.push(value);
        });
        $.each(g_list, function(index, value) {
            s_fin_t.push(value);
        });
        return s_fin_t;
    }

    function sort_list (data, sort_key) {
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
            QB_list = sort_by_role(QB_list);
            $.each(QB_list, function(index, value) {
                finished_list.push(value);
            });
            RB_list = sort_by_role(RB_list);
            $.each(RB_list, function(index, value) {
                finished_list.push(value);
            });
            WR_list = sort_by_role(WR_list);
            $.each(WR_list, function(index, value) {
                finished_list.push(value);
            });
            TE_list = sort_by_role(TE_list);
            $.each(TE_list, function(index, value) {
                finished_list.push(value);
            });
            DEF_list = sort_by_role(DEF_list);
            $.each(DEF_list, function(index, value) {
                finished_list.push(value);
            });
            K_list = sort_by_role(K_list);
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

    function populate_flex_1 () {
        $('#flex_1_select')
            .find('option')
            .remove()
            .end();

        if ('RB 3' != $flex_2) {
            if ('RB 3' == $flex_1) {
                $('<option>')
                .text('RB 3')
                .prop('selected', true)
                .appendTo('#flex_1_select')
            } else {
                $('<option>')
                .text('RB 3')
                .appendTo('#flex_1_select')
            }
        }
        if ('RB 4' != $flex_2) {
            if ('RB 4' == $flex_1) {
                $('<option>')
                .text('RB 4')
                .prop('selected', true)
                .appendTo('#flex_1_select')
            } else {
                $('<option>')
                .text('RB 4')
                .appendTo('#flex_1_select')
            }
        }
        if ('WR 3' != $flex_2) {
            if ('WR 3' == $flex_1) {
                $('<option>')
                .text('WR 3')
                .prop('selected', true)
                .appendTo('#flex_1_select')
            } else {
                $('<option>')
                .text('WR 3')
                .appendTo('#flex_1_select')
            }
        }
        if ('WR 4' != $flex_2) {
            if ('WR 4' == $flex_1) {
                $('<option>')
                .text('WR 4')
                .prop('selected', true)
                .appendTo('#flex_1_select')
            } else {
                $('<option>')
                .text('WR 4')
                .appendTo('#flex_1_select')
            }
        }
        if ('TE 2' != $flex_2) {
            if ('TE 2' == $flex_1) {
                $('<option>')
                .text('TE 2')
                .prop('selected', true)
                .appendTo('#flex_1_select')
            } else {
                $('<option>')
                .text('TE 2')
                .appendTo('#flex_1_select')
            }
        }
        if ('TE 3' != $flex_2) {
            if ('TE 3' == $flex_1) {
                $('<option>')
                .text('TE 3')
                .prop('selected', true)
                .appendTo('#flex_1_select')
            } else {
                $('<option>')
                .text('TE 3')
                .appendTo('#flex_1_select')
            }
        }
    }

    function populate_flex_2 () {
        $('#flex_2_select')
            .find('option')
            .remove()
            .end();

        if ('RB 3' != $flex_1) {
            if ('RB 3' == $flex_2) {
                $('<option>')
                .text('RB 3')
                .prop('selected', true)
                .appendTo('#flex_2_select')
            } else {
                $('<option>')
                .text('RB 3')
                .appendTo('#flex_2_select')
            }
        }
        if ('RB 4' != $flex_1) {
            if ('RB 4' == $flex_2) {
                $('<option>')
                .text('RB 4')
                .prop('selected', true)
                .appendTo('#flex_2_select')
            } else {
                $('<option>')
                .text('RB 4')
                .appendTo('#flex_2_select')
            }
        }
        if ('WR 3' != $flex_1) {
            if ('WR 3' == $flex_2) {
                $('<option>')
                .text('WR 3')
                .prop('selected', true)
                .appendTo('#flex_2_select')
            } else {
                $('<option>')
                .text('WR 3')
                .appendTo('#flex_2_select')
            }
        }
        if ('WR 4' != $flex_1) {
            if ('WR 4' == $flex_2) {
                $('<option>')
                .text('WR 4')
                .prop('selected', true)
                .appendTo('#flex_2_select')
            } else {
                $('<option>')
                .text('WR 4')
                .appendTo('#flex_2_select')
            }
        }
        if ('TE 2' != $flex_1) {
            if ('TE 2' == $flex_2) {
                $('<option>')
                .text('TE 2')
                .prop('selected', true)
                .appendTo('#flex_2_select')
            } else {
                $('<option>')
                .text('TE 2')
                .appendTo('#flex_2_select')
            }
        }
        if ('TE 3' != $flex_1) {
            if ('TE 3' == $flex_2) {
                $('<option>')
                .text('TE 3')
                .prop('selected', true)
                .appendTo('#flex_2_select')
            } else {
                $('<option>')
                .text('TE 3')
                .appendTo('#flex_2_select')
            }
        }
    }

    function populate_select_view () {
        $('.organization_view_select').empty();
        if ($view == 'Default') {
                $('<option>')
                .text('Default')
                .prop('selected', true)
                .appendTo('.organization_view_select')
            } else {
                $('<option>')
                .text('Default')
                .appendTo('.organization_view_select')
            }
        if ($view == 'By Position') {
                $('<option>')
                .text('By Position')
                .prop('selected', true)
                .appendTo('.organization_view_select')
            } else {
                $('<option>')
                .text('By Position')
                .appendTo('.organization_view_select')
            }
    }

    function switch_view () {
        //Determine which view to show
        if ($view == 'Default') {
            $('#by_pos_view').hide();
            $('#organization_left_area').show();
            $('#organization_form_area').show();
            $('#organization_interaction_area').show();
        } else if ($view == 'By Position') {
            $('#organization_left_area').hide();
            $('#organization_form_area').hide();
            $('#organization_interaction_area').hide();
            $('#by_pos_view').appendTo('#display_area').show();
        }
    }
    // END FUNCTIONS


    // ON READY ACTIONS

    //split master into lists of names for each table
    split_master_into_lists();

    //populate starter table
    var sorted_starter_list = order_starter_list(starter_list, list_of_starter_roles);
    $.each(sorted_starter_list, function(index, value) {
        var num_rows = $('#starters_body').find('tr').length;
        if (num_rows % 2 == 0) {
            populate_starter_table_normal(value);
        } else {
            populate_starter_table_aux(value);
        }
    });

    //populate def_k table
    var sorted_def_k_list = sort_list(def_k_list, 'avg_yearly');
    $.each(sorted_def_k_list, function(index, value) {
        var num_rows = $('#def_k_body').find('tr').length;
        if (num_rows % 2 == 0) {
            populate_def_k_table_normal(value);
        } else {
            populate_def_k_table_aux(value);
        }
    });

    //populate bench table
    var sorted_bench_list = sort_list(bench_list, 'avg_yearly');
    $.each(sorted_bench_list, function(index, value) {
        var num_rows = $('#bench_body').find('tr').length;
        if (num_rows % 2 == 0) {
            populate_bench_table_normal(value);
        } else {
            populate_bench_table_aux(value);
        }
    });

    //populate dev table
    var sorted_dev_list = sort_list(dev_list, 'avg_yearly');
    $.each(sorted_dev_list, function(index, value) {
        var num_rows = $('#dev_body').find('tr').length;
        if (num_rows % 2 == 0) {
            populate_dev_table_normal(value);
        } else {
            populate_dev_table_aux(value);
        }
    });

    //populate flex selects
    populate_flex_1();
    populate_flex_2();

    //END ON READY ACTIONS



    //ON EVENT ACTIONS **************************************

    //change flex 1 select *********
    //save new flex selection
    $('#flex_1_select').change(function() {
        var new_flex_1 = $('#flex_1_select').val();
        //save new selection
        $.ajax({
            url: '/team_org_processing_save_flex',
            type: 'POST',
            data: {csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value, 'flex': new_flex_1, 'team': $team, 'which': 'flex_1'},
            dataType: 'json',
            success: function (data) {
                //do nothing
            }
        });
        //save locally
        $flex_1 = $('#flex_1_select').val();
        list_of_starter_roles = ['QB 1', 'RB 1', 'RB 2', 'WR 1', 'WR 2', 'TE 1', $flex_1, $flex_2];
        //re-populate flex selections and all tables
        populate_flex_1();
        populate_flex_2();
        clear_starter_table();
        clear_def_k_table();
        clear_bench_table();
        clear_dev_table();
        split_master_into_lists();

        //populate starter table
        sorted_starter_list = order_starter_list(starter_list, list_of_starter_roles);
        $.each(sorted_starter_list, function(index, value) {
            var num_rows = $('#starters_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_starter_table_normal(value);
            } else {
                populate_starter_table_aux(value);
            }
        });

        //populate def_k table
        sorted_def_k_list = sort_list(def_k_list, 'avg_yearly');
        $.each(sorted_def_k_list, function(index, value) {
            var num_rows = $('#def_k_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_def_k_table_normal(value);
            } else {
                populate_def_k_table_aux(value);
            }
        });

        //populate bench table
        sorted_bench_list = sort_list(bench_list, 'avg_yearly');
        $.each(sorted_bench_list, function(index, value) {
            var num_rows = $('#bench_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_bench_table_normal(value);
            } else {
                populate_bench_table_aux(value);
            }
        });

        //populate dev table
        sorted_dev_list = sort_list(dev_list, 'avg_yearly');
        $.each(sorted_dev_list, function(index, value) {
            var num_rows = $('#dev_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_dev_table_normal(value);
            } else {
                populate_dev_table_aux(value);
            }
        });
    });

    //change flex 2 select *********
    $('#flex_2_select').change(function() {
        var new_flex_2 = $('#flex_2_select').val();
        //save new selection
        $.ajax({
            url: '/team_org_processing_save_flex',
            type: 'POST',
            data: {csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value, 'flex': new_flex_2, 'team': $team, 'which': 'flex_2'},
            dataType: 'json',
            success: function (data) {
                //do nothing
            }
        });
        //save locally
        $flex_2 = $('#flex_2_select').val();
        list_of_starter_roles = ['QB 1', 'RB 1', 'RB 2', 'WR 1', 'WR 2', 'TE 1', $flex_1, $flex_2];
        //re-populate flex selections and all tables
        populate_flex_1();
        populate_flex_2();
        clear_starter_table();
        clear_def_k_table();
        clear_bench_table();
        clear_dev_table();
        split_master_into_lists();
        sorted_starter_list = order_starter_list(starter_list, list_of_starter_roles);
        $.each(sorted_starter_list, function(index, value) {
            var num_rows = $('#starters_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_starter_table_normal(value);
            } else {
                populate_starter_table_aux(value);
            }
        });

        //populate def_k table
        sorted_def_k_list = sort_list(def_k_list, 'avg_yearly');
        $.each(sorted_def_k_list, function(index, value) {
            var num_rows = $('#def_k_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_def_k_table_normal(value);
            } else {
                populate_def_k_table_aux(value);
            }
        });

        //populate bench table
        sorted_bench_list = sort_list(bench_list, 'avg_yearly');
        $.each(sorted_bench_list, function(index, value) {
            var num_rows = $('#bench_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_bench_table_normal(value);
            } else {
                populate_bench_table_aux(value);
            }
        });

        //populate dev table
        sorted_dev_list = sort_list(dev_list, 'avg_yearly');
        $.each(sorted_dev_list, function(index, value) {
            var num_rows = $('#dev_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_dev_table_normal(value);
            } else {
                populate_dev_table_aux(value);
            }
        });
    });

    //role change **********
    $(document.body).on('change', '.role_selects', function() {
        if ($view == 'Default') {
            var s_name = $(this).next().next().text();
        } else if ($view == 'By Position') {
            var s_name = $(this).next().text();
        }
        var s_role = $(this).val();
        var previous_role = '';
        var this_pos = '';
        $.each($master, function(index, value) {
            if (value.name == s_name) {
                previous_role = value.role;
                this_pos = value.pos;
                //save role change locally
                value.role = s_role;
            }
        });

        //save role change
        $.ajax({
            url: '/team_org_processing_save_role_change',
            type: 'POST',
            data: {csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value, 'new_role': s_role, 'name': s_name},
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
                if (value.pos == this_pos) {
                    if (value.name != s_name) {
                        var new_role_list = value.avail_roles;
                        new_role_list.push(previous_role);
                        new_role_list = sort_roles_list(new_role_list, false);
                        value.avail_roles = new_role_list;
                    }
                }
            });
        }
        //check is new role is unique
        is_unique = '';
        $.each($avail_roles, function(index, value) {
            if (s_role == value.role) {
                is_unique = value.unique_roles;
            }
        });
        //if unique, remove from all relevent selects
        if (is_unique != 0) {
            $.each($master, function(index, value) {
                if (value.pos == this_pos) {
                    if (value.name != s_name) {
                        var new_role_list = [];
                        $.each(value.avail_roles, function(index, x) {
                            if (x != s_role) {
                                new_role_list.push(x);
                            }
                        });
                        new_role_list = sort_roles_list(new_role_list, false);
                        value.avail_roles = new_role_list;
                    }
                }
            });
        }
        //re-populate all tables
        clear_starter_table();
        clear_def_k_table();
        clear_bench_table();
        clear_dev_table();
        clear_QB_table();
        clear_RB_table();
        clear_WR_table();
        clear_TE_table();
        split_master_into_lists();
        split_master_into_pos();

        //populate starter table
        sorted_starter_list = order_starter_list(starter_list, list_of_starter_roles);
        $.each(sorted_starter_list, function(index, value) {
            var num_rows = $('#starters_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_starter_table_normal(value);
            } else {
                populate_starter_table_aux(value);
            }
        });

        //populate def_k table
        sorted_def_k_list = sort_list(def_k_list, 'avg_yearly');
        $.each(sorted_def_k_list, function(index, value) {
            var num_rows = $('#def_k_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_def_k_table_normal(value);
            } else {
                populate_def_k_table_aux(value);
            }
        });

        //populate bench table
        sorted_bench_list = sort_list(bench_list, 'avg_yearly');
        $.each(sorted_bench_list, function(index, value) {
            var num_rows = $('#bench_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_bench_table_normal(value);
            } else {
                populate_bench_table_aux(value);
            }
        });

        //populate dev table
        sorted_dev_list = sort_list(dev_list, 'avg_yearly');
        $.each(sorted_dev_list, function(index, value) {
            var num_rows = $('#dev_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_dev_table_normal(value);
            } else {
                populate_dev_table_aux(value);
            }
        });

        //populate QB table
        var sorted_QB_list = sort_list(QB_list, 'role');
        $.each(sorted_QB_list, function(index, value) {
            var num_rows = $('#QB_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_QB_table_normal(value);
            } else {
                populate_QB_table_aux(value);
            }
        });

        //populate RB table
        var sorted_RB_list = sort_list(RB_list, 'role');
        $.each(sorted_RB_list, function(index, value) {
            var num_rows = $('#RB_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_RB_table_normal(value);
            } else {
                populate_RB_table_aux(value);
            }
        });

        //populate WR table
        var sorted_WR_list = sort_list(WR_list, 'role');
        $.each(sorted_WR_list, function(index, value) {
            var num_rows = $('#WR_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_WR_table_normal(value);
            } else {
                populate_WR_table_aux(value);
            }
        });

        //populate TE table
        var sorted_TE_list = sort_list(TE_list, 'role');
        $.each(sorted_TE_list, function(index, value) {
            var num_rows = $('#TE_body').find('tr').length;
            if (num_rows % 2 == 0) {
                populate_TE_table_normal(value);
            } else {
                populate_TE_table_aux(value);
            }
        });
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

    //change view
    $('.organization_view_select').change(function() {
        var new_view = $(this).val();
        //store team selected variable
        $.ajax({
            url: '/team_org_store_view_selected',
            type: 'POST',
            data: {csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value, 'new_view': new_view},
            dataType: 'json',
            success: function (data) {
                //do nothing
            }
        });
        //change variable locally
        $view = new_view;
        //change view
        switch_view();
        populate_select_view();
    });



    // BY POSITION VIEW SECTION *****************************************
    split_master_into_pos();

    //populate QB table
    var sorted_QB_list = sort_list(QB_list, 'role');
    $.each(sorted_QB_list, function(index, value) {
        var num_rows = $('#QB_body').find('tr').length;
        if (num_rows % 2 == 0) {
            populate_QB_table_normal(value);
        } else {
            populate_QB_table_aux(value);
        }
    });

    //populate RB table
    var sorted_RB_list = sort_list(RB_list, 'role');
    $.each(sorted_RB_list, function(index, value) {
        var num_rows = $('#RB_body').find('tr').length;
        if (num_rows % 2 == 0) {
            populate_RB_table_normal(value);
        } else {
            populate_RB_table_aux(value);
        }
    });

    //populate WR table
    var sorted_WR_list = sort_list(WR_list, 'role');
    $.each(sorted_WR_list, function(index, value) {
        var num_rows = $('#WR_body').find('tr').length;
        if (num_rows % 2 == 0) {
            populate_WR_table_normal(value);
        } else {
            populate_WR_table_aux(value);
        }
    });

    //populate TE table
    var sorted_TE_list = sort_list(TE_list, 'role');
    $.each(sorted_TE_list, function(index, value) {
        var num_rows = $('#TE_body').find('tr').length;
        if (num_rows % 2 == 0) {
            populate_TE_table_normal(value);
        } else {
            populate_TE_table_aux(value);
        }
    });




    //reset Variable team selected on page exit
    window.onbeforeunload = unload_var;
    function unload_var() {
        var going_to = document.activeElement.href;
        var is_going_to_local = false;
        if (typeof going_to == 'undefined') {
            is_going_to_local = false;
        } else {
            if (going_to.substr(going_to.length - 13) == 'change_team_1') {
                is_going_to_local = true;
            } else if (going_to.substr(going_to.length - 13) == 'change_team_2') {
                is_going_to_local = true;
            } else if (going_to.substr(going_to.length - 13) == 'change_team_3') {
                is_going_to_local = true;
            } else if (going_to.substr(going_to.length - 13) == 'change_team_4') {
                is_going_to_local = true;
            } else if (going_to.substr(going_to.length - 13) == 'change_team_5') {
                is_going_to_local = true;
            } else if (going_to.substr(going_to.length - 13) == 'change_team_6') {
                is_going_to_local = true;
            } else if (going_to.substr(going_to.length - 13) == 'change_team_7') {
                is_going_to_local = true;
            } else if (going_to.substr(going_to.length - 13) == 'change_team_8') {
                is_going_to_local = true;
            } else if (going_to.substr(going_to.length - 13) == 'change_team_9') {
                is_going_to_local = true;
            } else if (going_to.substr(going_to.length - 14) == 'change_team_10') {
                is_going_to_local = true;
            } else {
                is_going_to_local = false;
            }
        }

        if (is_going_to_local) {
            //do nothing
        } else {
            $.ajax({
                url : '/unload_team_selected_variable',
                type: "POST",
                data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value},
                dataType: 'json',
                success: function(data){
                    //do nothing
                }
            });
        }
    }
});