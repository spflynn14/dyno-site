$(document).ready(function() {
    console.log('ready');

    var team_list = [];
    $('#vw_1').find('p').each(function() {
        team_list.push($(this).text());
        $(this).remove();
    });

    var year_list = [];
    $('#vw_2').find('p').each(function() {
        year_list.push($(this).text());
        $(this).remove();
    });

    $('#user_icon').hide();
    $('.hidden_divs').hide();
    $('.hidden_headers').hide();

    var $player_selected = '';

    var cap_hit_yr1 = 0;
    var cap_hit_yr2 = 0;
    var cap_hit_yr3 = 0;
    var cap_hit_yr4 = 0;
    var cap_hit_yr5 = 0;

    var $total = 0;
    var $sb = 0;
    var $sal = 0;
    var $years_remaining = 0;

    var $num_sliders_disabled = 0;

    var $avail_sliders = 5;

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

    var $t = [];
    $('option').each(function() {
        $t.push($(this).val());
        });

    $('#player_interaction_area').hide();

    function display_player () {
        $('#player_interaction_area').hide();
        $.ajax({
            url: '/player_processing_2',
            type: 'POST',
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value, 'player_selected':$player_selected},
            dataType: 'json',
            success: function(data){
                $('.line_text').hide();
                $('.hidden_headers').hide();
                $('.hidden_divs').show();
                $('#name_text').text(data.name);
                $('#pos_text').text(data.pos);
                $('i').show();
                $('#team_text').text(data.team);
                $('#yr1_header').show();
                $('#yr1_total_text').text('$' + data.yr1_total).show();
                $('#yr1_salary_text').text('$' + data.yr1_salary).show();
                $('#yr1_sb_text').text('$' + data.yr1_sb).show();
                if (data.yr2_total > 0) {
                    $('#yr2_header').show();
                    $('#yr2_total_text').text('$' + data.yr2_total).show();
                    $('#yr2_salary_text').text('$' + data.yr2_salary).show();
                    $('#yr2_sb_text').text('$' + data.yr2_sb).show();
                }
                if (data.yr3_total > 0) {
                    $('#yr3_header').show();
                    $('#yr3_total_text').text('$' + data.yr3_total).show();
                    $('#yr3_salary_text').text('$' + data.yr3_salary).show();
                    $('#yr3_sb_text').text('$' + data.yr3_sb).show();
                }
                if (data.yr4_total > 0) {
                    $('#yr4_header').show();
                    $('#yr4_total_text').text('$' + data.yr4_total).show();
                    $('#yr4_salary_text').text('$' + data.yr4_salary).show();
                    $('#yr4_sb_text').text('$' + data.yr4_sb).show();
                }
                if (data.yr5_total > 0) {
                    $('#yr5_header').show();
                    $('#yr5_total_text').text('$' + data.yr5_total).show();
                    $('#yr5_salary_text').text('$' + data.yr5_salary).show();
                    $('#yr5_sb_text').text('$' + data.yr5_sb).show();
                }
                $('#all_header').show();
                $('#all_total_text').text('$' + data.total_value).show();
                $('#all_salary_text').text('$' + data.salary).show();
                $('#all_sb_text').text('$' + data.signing_bonus).show();
                $('#contract_type_text').text(data.contract_type);
                $('#notes_text').text(data.notes);

                if ($.inArray(data.team, team_list) != -1) {
                    $('#player_interaction_area').show();
                    $('#player_interaction_display_area').hide();
                }

                if (data.team != data.user_team) {
                    $('#player_cut_player_button').hide();
                } else {
                    $('#player_cut_player_button').show();
                }
            }
        });
    }

    var pre_selected = $('#player_select_listbox').val();
    var in_player_list = ($t.indexOf(pre_selected) > -1);
    if (pre_selected == '') {
        //do nothing
    } else if (in_player_list) {
        $player_selected = pre_selected;
        display_player();
    }



    //EVENTS **************

    $('#search_text').keyup(function() {
        var $search_text = $('#search_text').val();
        $.ajax({
            url : '/player_processing_1',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value, 'search_text':$search_text, 'player_list':$t},
            dataType: 'json',
            success: function(data){
                $('#player_select_listbox')
                    .find('option')
                    .remove()
                    .end();
                $.each(data, function() {
                   $('#player_select_listbox').append($('<option>').attr('value',this).text(this));
                });
            }
        });
    });


    $('#player_select_listbox').click(function() {
        $('#message_area').hide();
        $player_selected = $('#player_select_listbox').val();
        display_player();
    });


    $('#player_cut_eval_button').click(function() {
        $('#player_restructure_area').hide();
        $('#message_area').hide();
        $('#player_cut_area').show();
        var player_team = $('#team_text').text();
        var player = $('#name_text').text();
        $.ajax({
            url: '/player_processing_3',
            type: 'POST',
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value, 'player_selected': player, 'team': player_team},
            dataType: 'json',
            success: function(data){
                $('#player_interaction_1').empty();
                //row 1
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[0]).appendTo('#player_interaction_1');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr1_total_cost).appendTo('#player_interaction_1');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr1_guar).appendTo('#player_interaction_1');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$0.00').appendTo('#player_interaction_1');
                if (Number(data.yr2_total_cost) != 0) {
                    //row 2
                    $('<tr>').appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[1]).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr2_total_cost).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr2_guar).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr2_salary).appendTo('#player_interaction_1');
                }
                if (Number(data.yr3_total_cost) != 0) {
                    //row 3
                    $('<tr>').appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[2]).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr3_total_cost).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr3_guar).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr3_salary).appendTo('#player_interaction_1');
                }
                if (Number(data.yr4_total_cost) != 0) {
                    //row 4
                    $('<tr>').appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[3]).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr4_total_cost).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr4_guar).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr4_salary).appendTo('#player_interaction_1');
                }
                if (Number(data.yr5_total_cost) != 0) {
                    //row 5
                    $('<tr>').appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[4]).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr5_total_cost).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr5_guar).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr5_salary).appendTo('#player_interaction_1');
                }
                //row 6
                $('<tr>').css('height', '15px').appendTo('#player_interaction_1');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text('Total').appendTo('#player_interaction_1');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.total_cost).appendTo('#player_interaction_1');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.total_guar).appendTo('#player_interaction_1');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.total_cap_savings).appendTo('#player_interaction_1');


                $('#player_interaction_2').empty();
                //row 1
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[0]).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr1_costs).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'red').text('$'+Number(data.yr1_pen).toFixed(2)).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr1_space).appendTo('#player_interaction_2');
                //row 2
                $('<tr>').appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[1]).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr2_costs).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'red').text('$'+Number(data.yr2_pen).toFixed(2)).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr2_space).appendTo('#player_interaction_2');
                //row 3
                $('<tr>').appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[2]).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr3_costs).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'red').text('$'+Number(data.yr3_pen).toFixed(2)).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr3_space).appendTo('#player_interaction_2');
                //row 4
                $('<tr>').appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[3]).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr4_costs).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'red').text('$'+Number(data.yr4_pen).toFixed(2)).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr4_space).appendTo('#player_interaction_2');
                //row 5
                $('<tr>').appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[4]).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr5_costs).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'red').text('$'+Number(data.yr5_pen).toFixed(2)).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr5_space).appendTo('#player_interaction_2');

                $('#player_interaction_display_area').show();
            },
            error: function(data) {
                console.log('fail', data);
            }
        });
    });

    function fill_bottom_table_restructure (data) {
        //fill bottom table
        $('#player_interaction_2').empty();

        var yr1_costs = Number(data.yr1_costs) + cap_hit_yr1;
        var yr1_pen = Number(data.yr1_pen) - Number(data.yr1_guar);
        var yr1_space = 200 - yr1_costs - yr1_pen;
        var yr1_space_diff = Number(data.yr1_space) - yr1_space;

        if (Number(data.yr2_guar) == 0) {
            var yr2_costs = Number(data.yr2_costs);
            var yr2_pen = Number(data.yr2_pen);

        } else {
            var yr2_costs = Number(data.yr2_costs) + cap_hit_yr2;
            var yr2_pen = Number(data.yr2_pen) - Number(data.yr2_guar);
        }
        var yr2_space = 200 - yr2_costs - yr2_pen;
        var yr2_space_diff = Number(data.yr2_space) - yr2_space;

        if (Number(data.yr3_guar) == 0) {
            var yr3_costs = Number(data.yr3_costs);
            var yr3_pen = Number(data.yr3_pen);
        } else {
            var yr3_costs = Number(data.yr3_costs) + cap_hit_yr3;
            var yr3_pen = Number(data.yr3_pen) - Number(data.yr3_guar);
        }
        var yr3_space = 200 - yr3_costs - yr3_pen;
        var yr3_space_diff = Number(data.yr3_space) - yr3_space;

        if (Number(data.yr4_guar) == 0) {
            var yr4_costs = Number(data.yr4_costs);
            var yr4_pen = Number(data.yr4_pen);
        } else {
            var yr4_costs = Number(data.yr4_costs) + cap_hit_yr4;
            var yr4_pen = Number(data.yr4_pen) - Number(data.yr4_guar);
        }
        var yr4_space = 200 - yr4_costs - yr4_pen;
        var yr4_space_diff = Number(data.yr4_space) - yr4_space;

        if (Number(data.yr5_guar) == 0) {
            var yr5_costs = Number(data.yr5_costs);
            var yr5_pen = Number(data.yr5_pen);
        } else {
            var yr5_costs = Number(data.yr5_costs) + cap_hit_yr5;
            var yr5_pen = Number(data.yr5_pen) - Number(data.yr5_guar);
        }
        var yr5_space = 200 - yr5_costs - yr5_pen;
        var yr5_space_diff = Number(data.yr5_space) - yr5_space;

        //row 1
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('font-weight', 'bold').text(year_list[0]).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').text('$' + yr1_costs.toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + Number(yr1_pen).toFixed(2)).appendTo('#player_interaction_2');
        if (yr1_space_diff > 0) {
            $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + yr1_space.toFixed(2) + ' (+' + yr1_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        } else {
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'green').text('$' + yr1_space.toFixed(2) + ' (' + yr1_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        }
        //row 2
        $('<tr>').appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('font-weight', 'bold').text(year_list[1]).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').text('$' + yr2_costs.toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + Number(yr2_pen).toFixed(2)).appendTo('#player_interaction_2');
        if (yr2_space_diff > 0) {
            $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + yr2_space.toFixed(2) + ' (+' + yr2_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        } else {
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'green').text('$' + yr2_space.toFixed(2) + ' (' + yr2_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        }//row 3
        $('<tr>').appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('font-weight', 'bold').text(year_list[2]).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').text('$' + yr3_costs.toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + Number(yr3_pen).toFixed(2)).appendTo('#player_interaction_2');
        if (yr3_space_diff > 0) {
            $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + yr3_space.toFixed(2) + ' (+' + yr3_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        } else {
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'green').text('$' + yr3_space.toFixed(2) + ' (' + yr3_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        }//row 4
        $('<tr>').appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('font-weight', 'bold').text(year_list[3]).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').text('$' + yr4_costs.toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + Number(yr4_pen).toFixed(2)).appendTo('#player_interaction_2');
        if (yr4_space_diff > 0) {
            $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + yr4_space.toFixed(2) + ' (+' + yr4_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        } else {
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'green').text('$' + yr4_space.toFixed(2) + ' (' + yr4_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        }//row 5
        $('<tr>').appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('font-weight', 'bold').text(year_list[4]).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').text('$' + yr5_costs.toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + Number(yr5_pen).toFixed(2)).appendTo('#player_interaction_2');
        if (yr5_space_diff > 0) {
            $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + yr5_space.toFixed(2) + ' (+' + yr5_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        } else {
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'green').text('$' + yr5_space.toFixed(2) + ' (' + yr5_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        }
    }

    function fill_total_cost_column () {
        cap_hit_yr1 = ($sb / $years_remaining) + ($('#spinner_1').spinner('value'));
        cap_hit_yr2 = ($sb / $years_remaining) + ($('#spinner_2').spinner('value'));
        cap_hit_yr3 = ($sb / $years_remaining) + ($('#spinner_3').spinner('value'));
        cap_hit_yr4 = ($sb / $years_remaining) + ($('#spinner_4').spinner('value'));
        cap_hit_yr5 = ($sb / $years_remaining) + ($('#spinner_5').spinner('value'));

        $('#cap_hit_1').text('$' + cap_hit_yr1.toFixed(2));
        $('#cap_hit_2').text('$' + cap_hit_yr2.toFixed(2));
        $('#cap_hit_3').text('$' + cap_hit_yr3.toFixed(2));
        $('#cap_hit_4').text('$' + cap_hit_yr4.toFixed(2));
        $('#cap_hit_5').text('$' + cap_hit_yr5.toFixed(2));
    }

    function disable_all_sliders () {
        $('#slider_1').slider('disable', true);
        $('#slider_1').fadeTo('fast', 0.35);
        $('#spinner_1').spinner('disable', true);

        if ($avail_sliders >= 2) {
            $('#slider_2').slider('disable', true);
            $('#slider_2').fadeTo('fast', 0.35);
            $('#spinner_2').spinner('disable', true);
        }

        if ($avail_sliders >= 3) {
            $('#slider_3').slider('disable', true);
            $('#slider_3').fadeTo('fast', 0.35);
            $('#spinner_3').spinner('disable', true);
        }

        if ($avail_sliders >= 4) {
            $('#slider_4').slider('disable', true);
            $('#slider_4').fadeTo('fast', 0.35);
            $('#spinner_4').spinner('disable', true);
        }

        if ($avail_sliders == 5) {
            $('#slider_5').slider('disable', true);
            $('#slider_5').fadeTo('fast', 0.35);
            $('#spinner_5').spinner('disable', true);
        }

        $num_sliders_disabled = $avail_sliders;
    }

    function enable_all_sliders () {
        $('#slider_1').slider('enable', true);
        $('#slider_1').fadeTo('fast', 1);
        $('#spinner_1').spinner('enable', true);

        $('#slider_2').slider('enable', true);
        $('#slider_2').fadeTo('fast', 1);
        $('#spinner_2').spinner('enable', true);

        $('#slider_3').slider('enable', true);
        $('#slider_3').fadeTo('fast', 1);
        $('#spinner_3').spinner('enable', true);

        $('#slider_4').slider('enable', true);
        $('#slider_4').fadeTo('fast', 1);
        $('#spinner_5').spinner('enable', true);

        $('#slider_5').slider('enable', true);
        $('#slider_5').fadeTo('fast', 1);
        $('#spinner_5').spinner('enable', true);

        $num_sliders_disabled = 0;
    }

    function enable_two_sliders () {
        if ($('#slider_1').slider('option', 'disabled') == true) {
            $('#slider_1').slider('enable', true);
            $('#slider_1').fadeTo('fast', 1);
            $('#spinner_1').spinner('enable', true);
            $num_sliders_disabled = $num_sliders_disabled - 1;
        } else {
            $('#slider_2').slider('enable', true);
            $('#slider_2').fadeTo('fast', 1);
            $('#spinner_2').spinner('enable', true);
            $num_sliders_disabled = $num_sliders_disabled - 1;
        }
    }

    function adjust_sliders (ui, ui_source, slider_source) {
        var enabled_sliders = $avail_sliders - $num_sliders_disabled;
        var current_slider_value = 0;
        var disabled_pool = 0;
        var enabled_slider_list = [];

        if (ui_source == 'slider') {
            current_slider_value = ui.value/20;
        } else {
            current_slider_value = ui.value;
        }

        if ($('#slider_1').slider('option','disabled')) {
            console.log('count 1');
            disabled_pool = disabled_pool + Number($('#spinner_1').val());
        } else {
            if (slider_source != 1) {
                enabled_slider_list.push(1);
            }
        }
        if ($('#slider_2').slider('option','disabled')) {
            console.log('count 2');
            disabled_pool = disabled_pool + Number($('#spinner_2').val());
        } else {
            if (slider_source != 2) {
                enabled_slider_list.push(2);
            }
        }
        if ($('#slider_3').slider('option','disabled')) {
            console.log('count 3');
            disabled_pool = disabled_pool + Number($('#spinner_3').val());
        } else {
            if (slider_source != 3) {
                enabled_slider_list.push(3);
            }
        }
        if ($('#slider_4').slider('option','disabled')) {
            console.log('count 4');
            disabled_pool = disabled_pool + Number($('#spinner_4').val());
        } else {
            if (slider_source != 4) {
                enabled_slider_list.push(4);
            }
        }
        if ($('#slider_5').slider('option','disabled')) {
            console.log('count 5');
            disabled_pool = disabled_pool + Number($('#spinner_5').val());
        } else {
            if (slider_source != 5) {
                enabled_slider_list.push(5);
            }
        }

        var max_salary = $sal - disabled_pool - (enabled_sliders - 1);
        if (current_slider_value > max_salary) {
            current_slider_value = max_salary;
            if (slider_source == 1) {
                $('#slider_1').slider('value', current_slider_value*20);
                $('#spinner_1').val(((current_slider_value)).toFixed(2));
            } else if (slider_source == 2) {
                $('#slider_2').slider('value', current_slider_value*20);
                $('#spinner_2').val(((current_slider_value)).toFixed(2));
            }
             else if (slider_source == 3) {
                $('#slider_3').slider('value', current_slider_value*20);
                $('#spinner_3').val(((current_slider_value)).toFixed(2));
            }
             else if (slider_source == 4) {
                $('#slider_4').slider('value', current_slider_value*20);
                $('#spinner_4').val(((current_slider_value)).toFixed(2));
            }
             else if (slider_source == 5) {
                $('#slider_5').slider('value', current_slider_value*20);
                $('#spinner_5').val(((current_slider_value)).toFixed(2));
            }
        }

        //console.log('before = ', total_avail_pool);
        var total_avail_pool = $sal - current_slider_value - disabled_pool;

        var per_year = Math.round(((total_avail_pool / (enabled_sliders-1)) * 100)) / 100;
        if (per_year < 1) {
            per_year = 1
        }
        var last_year = Math.round((total_avail_pool - (per_year * (enabled_sliders - 2))) * 100) / 100;


        //console.log('per_year = ',per_year);
        //console.log('last_year = ',last_year);
        //console.log('total_avail_pool = ',total_avail_pool);
        //console.log('disabled_pool = ',disabled_pool);
        //console.log('enabled_slider_list = ',enabled_slider_list);
        //console.log('current_slider_value = ',current_slider_value);
        //console.log('max_salary = ',max_salary);
        //console.log('spinner_1 = ',$('#spinner_1').val());
        //console.log('spinner_2 = ',$('#spinner_2').val());
        //console.log('spinner_3 = ',$('#spinner_3').val());
        //console.log('spinner_4 = ',$('#spinner_4').val());
        //console.log('spinner_5 = ',$('#spinner_5').val());
        //console.log('**********');




        $.each(enabled_slider_list, function(index, x) {
            if (index == enabled_slider_list.length-1) {
                if (x == 1) {
                    $('#slider_1').slider('value', last_year*20);
                    $('#spinner_1').val(((last_year)).toFixed(2));
                } else if (x == 2) {
                    $('#slider_2').slider('value', last_year*20);
                    $('#spinner_2').val(((last_year)).toFixed(2));
                } else if (x == 3) {
                    $('#slider_3').slider('value', last_year*20);
                    $('#spinner_3').val(((last_year)).toFixed(2));
                } else if (x == 4) {
                    $('#slider_4').slider('value', last_year*20);
                    $('#spinner_4').val(((last_year)).toFixed(2));
                } else if (x == 5) {
                    $('#slider_5').slider('value', last_year*20);
                    $('#spinner_5').val(((last_year)).toFixed(2));
                }
            } else {
                if (x == 1) {
                    $('#slider_1').slider('value', per_year*20);
                    $('#spinner_1').val(((per_year)).toFixed(2));
                } else if (x == 2) {
                    $('#slider_2').slider('value', per_year*20);
                    $('#spinner_2').val(((per_year)).toFixed(2));
                } else if (x == 3) {
                    $('#slider_3').slider('value', per_year*20);
                    $('#spinner_3').val(((per_year)).toFixed(2));
                } else if (x == 4) {
                    $('#slider_4').slider('value', per_year*20);
                    $('#spinner_4').val(((per_year)).toFixed(2));
                } else if (x == 5) {
                    $('#slider_5').slider('value', per_year*20);
                    $('#spinner_5').val(((per_year)).toFixed(2));
                }
            }
        });
    }

    $('#player_restructure_eval_button').click(function() {
        $('#player_cut_area').hide();
        $('#message_area').hide();
        $('#player_restructure_area').show();
        $('#player_interaction_display_area').show();

        var player_team = $('#team_text').text();
        var player = $('#name_text').text();
        $.ajax({
            url: '/player_processing_3',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player_selected': player,
                'team': player_team
            },
            dataType: 'json',
            success: function (data) {

                $total = Number(data.total_cost);
                $sb = Number(data.total_guar);
                $sal = $total - $sb;
                $avail_sliders = 5;

                $('#player_interaction_3').find('tr').eq(1).show();
                $('#player_interaction_3').find('tr').eq(2).show();
                $('#player_interaction_3').find('tr').eq(3).show();
                $('#player_interaction_3').find('tr').eq(4).show();
                $('#player_interaction_3').find('tr').eq(5).show();

                $years_remaining = 0;
                if (Number(data.yr1_total_cost) > 0) {
                    $years_remaining = $years_remaining + 1;
                }
                if (Number(data.yr2_total_cost) > 0) {
                    $years_remaining = $years_remaining + 1;
                }
                if (Number(data.yr3_total_cost) > 0) {
                    $years_remaining = $years_remaining + 1;
                }
                if (Number(data.yr4_total_cost) > 0) {
                    $years_remaining = $years_remaining + 1;
                }
                if (Number(data.yr5_total_cost) > 0) {
                    $years_remaining = $years_remaining + 1;
                }

                var $max_slider = $sal - ($years_remaining - 1);

                var $per_year = Math.round((($sal / $years_remaining) * 100)) / 100;
                var $last_year = Math.round(($sal - ($per_year * ($years_remaining - 1))) * 100) / 100;

                if (data.contract_type == 'Rookie') {
                    $('#player_interaction_display_area').hide();
                    $('#message_area').html("<br><br>Rookie contracts cannot be re-structured");
                    $('#message_area').show();
                    return;
                }
                if ($years_remaining == 1) {
                    $('#player_interaction_display_area').hide();
                    $('#message_area').html("<br><br>This player's contract cannot be re-structured - contract is only for one year");
                    $('#message_area').show();
                    return;
                }
                if ($max_slider == 0) {
                    $('#player_interaction_display_area').hide();
                    $('#message_area').html("<br><br>This player's contract cannot be re-structured - there is no guaranteed money");
                    $('#message_area').show();
                    return;
                }

                //make sliders
                $('#slider_1').slider({
                    min: 20,
                    max: $max_slider * 20,
                    value: $per_year * 20
                });
                $('#slider_2').slider({
                    min: 20,
                    max: $max_slider * 20,
                    value: $per_year * 20
                });
                $('#slider_3').slider({
                    min: 20,
                    max: $max_slider * 20,
                    value: $per_year * 20
                });
                $('#slider_4').slider({
                    min: 20,
                    max: $max_slider * 20,
                    value: $per_year * 20
                });
                $('#slider_5').slider({
                    min: 20,
                    max: $max_slider * 20,
                    value: $last_year * 20
                });
                $('.ui-slider-handle').css('cursor', 'pointer').css('background', '#2d99d4');

                //make spinners
                $('#spinner_1').spinner({
                    min: 1,
                    max: $max_slider,
                    step: 0.01,
                    incremental: false,
                    stop: function (event, ui) {
                        var n = Number($('#spinner_1').spinner('value'));
                        $('#spinner_1').val((n).toFixed(2));
                    }
                });
                $('#spinner_2').spinner({
                    min: 1,
                    max: $max_slider,
                    step: 0.01,
                    incremental: false,
                    stop: function (event, ui) {
                        var n = Number($('#spinner_2').spinner('value'));
                        $('#spinner_2').val((n).toFixed(2));
                    }
                });
                $('#spinner_3').spinner({
                    min: 1,
                    max: $max_slider,
                    step: 0.01,
                    incremental: false,
                    stop: function (event, ui) {
                        var n = Number($('#spinner_3').spinner('value'));
                        $('#spinner_3').val((n).toFixed(2));
                    }
                });
                $('#spinner_4').spinner({
                    min: 1,
                    max: $max_slider,
                    step: 0.01,
                    incremental: false,
                    stop: function (event, ui) {
                        var n = Number($('#spinner_4').spinner('value'));
                        $('#spinner_4').val((n).toFixed(2));
                    }
                });
                $('#spinner_5').spinner({
                    min: 1,
                    max: $max_slider,
                    step: 0.01,
                    incremental: false,
                    stop: function (event, ui) {
                        var n = Number($('#spinner_5').spinner('value'));
                        $('#spinner_5').val((n).toFixed(2));
                    }
                });

                $('#spinner_1').val($per_year);
                $('#spinner_2').val($per_year);
                $('#spinner_3').val($per_year);
                $('#spinner_4').val($per_year);
                $('#spinner_5').val($last_year);

                enable_all_sliders();

                //fill total cost column
                fill_total_cost_column();

                if (Number(data.yr2_total_cost) == 0) {
                    $('#player_interaction_3').find('tr').eq(2).hide();
                    $avail_sliders = $avail_sliders - 1;
                }
                if (Number(data.yr3_total_cost) == 0) {
                    $('#player_interaction_3').find('tr').eq(3).hide();
                    $avail_sliders = $avail_sliders - 1;
                }
                if (Number(data.yr4_total_cost) == 0) {
                    $('#player_interaction_3').find('tr').eq(4).hide();
                    $avail_sliders = $avail_sliders - 1;
                }
                if (Number(data.yr5_total_cost) == 0) {
                    $('#player_interaction_3').find('tr').eq(5).hide();
                    $avail_sliders = $avail_sliders - 1;
                }

                //fill middle table
                $('#restructure_total').text('$' + $total.toFixed(2));
                $('#restructure_salary').text('$' + $sal.toFixed(2));
                $('#restructure_sb').text('$' + $sb.toFixed(2));

                //fill bottom table
                fill_bottom_table_restructure(data);

                $bottom_table_data.yr1_costs = data.yr1_costs;
                $bottom_table_data.yr2_costs = data.yr2_costs;
                $bottom_table_data.yr3_costs = data.yr3_costs;
                $bottom_table_data.yr4_costs = data.yr4_costs;
                $bottom_table_data.yr5_costs = data.yr5_costs;
                $bottom_table_data.yr1_pen = data.yr1_pen;
                $bottom_table_data.yr2_pen = data.yr2_pen;
                $bottom_table_data.yr3_pen = data.yr3_pen;
                $bottom_table_data.yr4_pen = data.yr4_pen;
                $bottom_table_data.yr5_pen = data.yr5_pen;
                $bottom_table_data.yr1_guar = data.yr1_guar;
                $bottom_table_data.yr2_guar = data.yr2_guar;
                $bottom_table_data.yr3_guar = data.yr3_guar;
                $bottom_table_data.yr4_guar = data.yr4_guar;
                $bottom_table_data.yr5_guar = data.yr5_guar;
                $bottom_table_data.yr1_space = data.yr1_space;
                $bottom_table_data.yr2_space = data.yr2_space;
                $bottom_table_data.yr3_space = data.yr3_space;
                $bottom_table_data.yr4_space = data.yr4_space;
                $bottom_table_data.yr5_space = data.yr5_space;
            }
        });
    });

    $('#spinner_1').on('spin', function(event, ui) {
        console.log('called spinner 1');
        $('#slider_1').slider('value', ui.value*20);
        adjust_sliders(ui, 'spinner', 1);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });
    $('#spinner_2').on('spin', function(event, ui) {
        $('#slider_2').slider('value', ui.value*20);
        adjust_sliders(ui, 'spinner', 2);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });
    $('#spinner_3').on('spin', function(event, ui) {
        $('#slider_3').slider('value', ui.value*20);
        adjust_sliders(ui, 'spinner', 3);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });
    $('#spinner_4').on('spin', function(event, ui) {
        $('#slider_4').slider('value', ui.value*20);
        adjust_sliders(ui, 'spinner', 4);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });
    $('#spinner_5').on('spin', function(event, ui) {
        $('#slider_5').slider('value', ui.value*20);
        adjust_sliders(ui, 'spinner', 5);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });

    $('#slider_1').on('slide', function(event, ui) {
        console.log('called slider 1');
        $('#spinner_1').val(((ui.value/20)).toFixed(2));
        adjust_sliders(ui, 'slider', 1);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });
    $('#slider_2').on('slide', function(event, ui) {
        $('#spinner_2').val(((ui.value/20)).toFixed(2));
         adjust_sliders(ui, 'slider', 2);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });
    $('#slider_3').on('slide', function(event, ui) {
        $('#spinner_3').val(((ui.value/20)).toFixed(2));
         adjust_sliders(ui, 'slider', 3);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });
    $('#slider_4').on('slide', function(event, ui) {
        $('#spinner_4').val(((ui.value/20)).toFixed(2));
         adjust_sliders(ui, 'slider', 4);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });
    $('#slider_5').on('slide', function(event, ui) {
        $('#spinner_5').val(((ui.value/20)).toFixed(2));
         adjust_sliders(ui, 'slider', 5);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });

    $('#freeze_button_1').mousedown(function(e) {
        if ($('#slider_1').slider('option', 'disabled')) {
            $('#slider_1').slider('enable', true);
            $('#slider_1').fadeTo('fast', 1);
            $('#spinner_1').spinner('enable', true);
            $num_sliders_disabled = $num_sliders_disabled - 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                enable_two_sliders();
            }
        } else {
            $('#slider_1').slider('disable', true);
            $('#slider_1').fadeTo('fast', 0.35);
            $('#spinner_1').spinner('disable', true);
            $num_sliders_disabled = $num_sliders_disabled + 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                disable_all_sliders();
            }
        }
        console.log($num_sliders_disabled, $avail_sliders);
    });
    $('#freeze_button_2').mousedown(function(e) {
        if ($('#slider_2').slider('option', 'disabled')) {
            $('#slider_2').slider('enable', true);
            $('#slider_2').fadeTo('fast', 1);
            $('#spinner_2').spinner('enable', true);
            $num_sliders_disabled = $num_sliders_disabled - 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                enable_two_sliders();
            }
        } else {
            $('#slider_2').slider('disable', true);
            $('#slider_2').fadeTo('fast', 0.35);
            $('#spinner_2').spinner('disable', true);
            $num_sliders_disabled = $num_sliders_disabled + 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                disable_all_sliders();
            }
        }
        console.log($num_sliders_disabled, $avail_sliders);
    });
    $('#freeze_button_3').mousedown(function(e) {
        if ($('#slider_3').slider('option', 'disabled')) {
            $('#slider_3').slider('enable', true);
            $('#slider_3').fadeTo('fast', 1);
            $('#spinner_3').spinner('enable', true);
            $num_sliders_disabled = $num_sliders_disabled - 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                enable_two_sliders();
            }
        } else {
            $('#slider_3').slider('disable', true);
            $('#slider_3').fadeTo('fast', 0.35);
            $('#spinner_3').spinner('disable', true);
            $num_sliders_disabled = $num_sliders_disabled + 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                disable_all_sliders();
            }
        }
        console.log($num_sliders_disabled, $avail_sliders);
    });
    $('#freeze_button_4').mousedown(function(e) {
        if ($('#slider_4').slider('option', 'disabled')) {
            $('#slider_4').slider('enable', true);
            $('#slider_4').fadeTo('fast', 1);
            $('#spinner_4').spinner('enable', true);
            $num_sliders_disabled = $num_sliders_disabled - 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                enable_two_sliders();
            }
        } else {
            $('#slider_4').slider('disable', true);
            $('#slider_4').fadeTo('fast', 0.35);
            $('#spinner_4').spinner('disable', true);
            $num_sliders_disabled = $num_sliders_disabled + 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                disable_all_sliders();
            }
        }
        console.log($num_sliders_disabled, $avail_sliders);
    });
    $('#freeze_button_5').mousedown(function(e) {
        if ($('#slider_5').slider('option', 'disabled')) {
            $('#slider_5').slider('enable', true);
            $('#slider_5').fadeTo('fast', 1);
            $('#spinner_5').spinner('enable', true);
            $num_sliders_disabled = $num_sliders_disabled - 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                enable_two_sliders();
            }
        } else {
            $('#slider_5').slider('disable', true);
            $('#slider_5').fadeTo('fast', 0.35);
            $('#spinner_5').spinner('disable', true);
            $num_sliders_disabled = $num_sliders_disabled + 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                disable_all_sliders();
            }
        }
        console.log($num_sliders_disabled, $avail_sliders);
    });




    $('#player_cut_player_button').on('click', function() {
        var out_player = $('#name_text').text();
        $.ajax({
            url: '/save_data_cut_player',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player' : out_player,
                'from' : 'player'
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/confirm_cut_players';
            }
        });
    });
});

