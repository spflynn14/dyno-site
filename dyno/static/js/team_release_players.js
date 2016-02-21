$(document).ready(function() {
    console.log('ready');

    var $base_pen_yr1 = Number($('#vw_1-1').text());
    var $base_pen_yr2 = Number($('#vw_1-2').text());
    var $base_pen_yr3 = Number($('#vw_1-3').text());
    var $base_pen_yr4 = Number($('#vw_1-4').text());
    var $base_pen_yr5 = Number($('#vw_1-5').text());
    $('#vw_1').remove();

    if (isNaN($base_pen_yr1)) {
        $base_pen_yr1 = 0;
    }
    if (isNaN($base_pen_yr2)) {
        $base_pen_yr2 = 0;
    }
    if (isNaN($base_pen_yr3)) {
        $base_pen_yr3 = 0;
    }
    if (isNaN($base_pen_yr4)) {
        $base_pen_yr4 = 0;
    }
    if (isNaN($base_pen_yr5)) {
        $base_pen_yr5 = 0;
    }
    
    var $team_total_yr1 = 0;
    var $team_space_yr1 = 0;
    var $team_total_yr2 = 0;
    var $team_space_yr2 = 0;
    var $team_total_yr3 = 0;
    var $team_space_yr3 = 0;
    var $team_total_yr4 = 0;
    var $team_space_yr4 = 0;
    var $team_total_yr5 = 0;
    var $team_space_yr5 = 0;
    
    var temp_total_yr1 = 0;
    var temp_total_yr2 = 0;
    var temp_total_yr3 = 0;
    var temp_total_yr4 = 0;
    var temp_total_yr5 = 0;
    var temp_pen_yr1 = 0;
    var temp_pen_yr2 = 0;
    var temp_pen_yr3 = 0;
    var temp_pen_yr4 = 0;
    var temp_pen_yr5 = 0;
    var temp_space_yr1 = 0;
    var temp_space_yr2 = 0;
    var temp_space_yr3 = 0;
    var temp_space_yr4 = 0;
    var temp_space_yr5 = 0;

    function total_team () {
        $team_total_yr1 = 0;
        $team_total_yr2 = 0;
        $team_total_yr3 = 0;
        $team_total_yr4 = 0;
        $team_total_yr5 = 0;
        $('.team_release_yr1_cell').each(function() {
            var temp = Number($(this).text().split('$')[1]) + Number($(this).text().split('$')[2]);
            $team_total_yr1 = $team_total_yr1 + temp;
        });
        $('.team_release_yr2_cell').each(function() {
            var temp = Number($(this).text().split('$')[1]) + Number($(this).text().split('$')[2]);
            $team_total_yr2 = $team_total_yr2 + temp;
        });
        $('.team_release_yr3_cell').each(function() {
            var temp = Number($(this).text().split('$')[1]) + Number($(this).text().split('$')[2]);
            $team_total_yr3 = $team_total_yr3 + temp;
        });
        $('.team_release_yr4_cell').each(function() {
            var temp = Number($(this).text().split('$')[1]) + Number($(this).text().split('$')[2]);
            $team_total_yr4 = $team_total_yr4 + temp;
        });
        $('.team_release_yr5_cell').each(function() {
            var temp = Number($(this).text().split('$')[1]) + Number($(this).text().split('$')[2]);
            $team_total_yr5 = $team_total_yr5 + temp;
        });

        $team_total_yr1 = $team_total_yr1 - temp_total_yr1;
        $team_total_yr2 = $team_total_yr2 - temp_total_yr2;
        $team_total_yr3 = $team_total_yr3 - temp_total_yr3;
        $team_total_yr4 = $team_total_yr4 - temp_total_yr4;
        $team_total_yr5 = $team_total_yr5 - temp_total_yr5;
    }

    function total_space () {
        $team_space_yr1 = 200 - $team_total_yr1 - $base_pen_yr1 - temp_pen_yr1;
        $team_space_yr2 = 200 - $team_total_yr2 - $base_pen_yr2 - temp_pen_yr2;
        $team_space_yr3 = 200 - $team_total_yr3 - $base_pen_yr3 - temp_pen_yr3;
        $team_space_yr4 = 200 - $team_total_yr4 - $base_pen_yr4 - temp_pen_yr4;
        $team_space_yr5 = 200 - $team_total_yr5 - $base_pen_yr5 - temp_pen_yr5;
    }

    function fill_bottom_table () {
        var here_pen_yr1 = $base_pen_yr1 + temp_pen_yr1;
        var here_pen_yr2 = $base_pen_yr2 + temp_pen_yr2;
        var here_pen_yr3 = $base_pen_yr3 + temp_pen_yr3;
        var here_pen_yr4 = $base_pen_yr4 + temp_pen_yr4;
        var here_pen_yr5 = $base_pen_yr5 + temp_pen_yr5;

        $('#trr2_1-1').text('$'+$team_total_yr1.toFixed(2));
        $('#trr2_1-2').text('$'+here_pen_yr1.toFixed(2));
        $('#trr2_1-3').text('$'+$team_space_yr1.toFixed(2));

        $('#trr2_2-1').text('$'+$team_total_yr2.toFixed(2));
        $('#trr2_2-2').text('$'+here_pen_yr2.toFixed(2));
        $('#trr2_2-3').text('$'+$team_space_yr2.toFixed(2));

        $('#trr2_3-1').text('$'+$team_total_yr3.toFixed(2));
        $('#trr2_3-2').text('$'+here_pen_yr3.toFixed(2));
        $('#trr2_3-3').text('$'+$team_space_yr3.toFixed(2));

        $('#trr2_4-1').text('$'+$team_total_yr4.toFixed(2));
        $('#trr2_4-2').text('$'+here_pen_yr4.toFixed(2));
        $('#trr2_4-3').text('$'+$team_space_yr4.toFixed(2));

        $('#trr2_5-1').text('$'+$team_total_yr5.toFixed(2));
        $('#trr2_5-2').text('$'+here_pen_yr5.toFixed(2));
        $('#trr2_5-3').text('$'+$team_space_yr5.toFixed(2));
    }

    function check_nan (data) {
        if (isNaN(data)) {
            return 0;
        } else {
            return data;
        }
    }

    function fill_top_table () {
        temp_total_yr1 = 0;
        temp_total_yr2 = 0;
        temp_total_yr3 = 0;
        temp_total_yr4 = 0;
        temp_total_yr5 = 0;
        temp_pen_yr1 = 0;
        temp_pen_yr2 = 0;
        temp_pen_yr3 = 0;
        temp_pen_yr4 = 0;
        temp_pen_yr5 = 0;
        temp_space_yr1 = 0;
        temp_space_yr2 = 0;
        temp_space_yr3 = 0;
        temp_space_yr4 = 0;
        temp_space_yr5 = 0;
        $('.release_checkbox').each(function() {
            var temp = $(this).prop('checked');
            
            if (temp == true) {
                var temp1 = 0;
                var temp11 = 0;

                temp1 = $(this).parent().parent().next().next().next().next().text();
                temp11 = Number(temp1.split('$')[1]) + Number(temp1.split('$')[2]);
                temp11 = check_nan(temp11);
                temp_total_yr1 = temp_total_yr1 + temp11;
                temp_pen_yr1 = temp_pen_yr1 + temp11;

                temp1 = $(this).parent().parent().next().next().next().next().next().text();
                temp11 = Number(temp1.split('$')[1]) + Number(temp1.split('$')[2]);
                temp11 = check_nan(temp11);
                temp_total_yr2 = temp_total_yr2 + temp11;
                temp11 = Number(temp1.split('$')[2]);
                temp11 = check_nan(temp11);
                temp_pen_yr2 = temp_pen_yr2 + temp11;

                temp1 = $(this).parent().parent().next().next().next().next().next().next().text();
                temp11 = Number(temp1.split('$')[1]) + Number(temp1.split('$')[2]);
                temp11 = check_nan(temp11);
                temp_total_yr3 = temp_total_yr3 + temp11;
                temp11 = Number(temp1.split('$')[2]);
                temp11 = check_nan(temp11);
                temp_pen_yr3 = temp_pen_yr3 + temp11;

                temp1 = $(this).parent().parent().next().next().next().next().next().next().next().text();
                temp11 = Number(temp1.split('$')[1]) + Number(temp1.split('$')[2]);
                temp11 = check_nan(temp11);
                temp_total_yr4 = temp_total_yr4 + temp11;
                temp11 = Number(temp1.split('$')[2]);
                temp11 = check_nan(temp11);
                temp_pen_yr4 = temp_pen_yr4 + temp11;

                temp1 = $(this).parent().parent().next().next().next().next().next().next().next().next().text();
                temp11 = Number(temp1.split('$')[1]) + Number(temp1.split('$')[2]);
                temp11 = check_nan(temp11);
                temp_total_yr5 = temp_total_yr5 + temp11;
                temp11 = Number(temp1.split('$')[2]);
                temp11 = check_nan(temp11);
                temp_pen_yr5 = temp_pen_yr5 + temp11;
            }
        });
        temp_space_yr1 = $team_space_yr1 - temp_pen_yr1 + temp_total_yr1;
        temp_space_yr2 = $team_space_yr2 - temp_pen_yr2 + temp_total_yr2;
        temp_space_yr3 = $team_space_yr3 - temp_pen_yr3 + temp_total_yr3;
        temp_space_yr4 = $team_space_yr4 - temp_pen_yr4 + temp_total_yr4;
        temp_space_yr5 = $team_space_yr5 - temp_pen_yr5 + temp_total_yr5;

        var cap_saving_yr1 = temp_space_yr1 - $team_space_yr1;
        var cap_saving_yr2 = temp_space_yr2 - $team_space_yr2;
        var cap_saving_yr3 = temp_space_yr3 - $team_space_yr3;
        var cap_saving_yr4 = temp_space_yr4 - $team_space_yr4;
        var cap_saving_yr5 = temp_space_yr5 - $team_space_yr5;
        
        $('#trr1_1-1').text('$'+temp_total_yr1.toFixed(2));
        $('#trr1_1-2').text('$'+temp_pen_yr1.toFixed(2));
        $('#trr1_1-3').text('$'+cap_saving_yr1.toFixed(2));

        $('#trr1_2-1').text('$'+temp_total_yr2.toFixed(2));
        $('#trr1_2-2').text('$'+temp_pen_yr2.toFixed(2));
        $('#trr1_2-3').text('$'+cap_saving_yr2.toFixed(2));

        $('#trr1_3-1').text('$'+temp_total_yr3.toFixed(2));
        $('#trr1_3-2').text('$'+temp_pen_yr3.toFixed(2));
        $('#trr1_3-3').text('$'+cap_saving_yr3.toFixed(2));

        $('#trr1_4-1').text('$'+temp_total_yr4.toFixed(2));
        $('#trr1_4-2').text('$'+temp_pen_yr4.toFixed(2));
        $('#trr1_4-3').text('$'+cap_saving_yr4.toFixed(2));

        $('#trr1_5-1').text('$'+temp_total_yr5.toFixed(2));
        $('#trr1_5-2').text('$'+temp_pen_yr5.toFixed(2));
        $('#trr1_5-3').text('$'+cap_saving_yr5.toFixed(2));

        if (temp_total_yr1 == 0) {
            $('#team_release_cut_player_button').hide();
        } else {
            $('#team_release_cut_player_button').show();
        }
    }

    total_team();
    total_space();
    fill_bottom_table();
    fill_top_table();


    $(document.body).on('click', '.release_checkbox', function() {
        fill_top_table();
        total_team();
        total_space();
        fill_bottom_table();
    });

    $('#team_release_cut_player_button').on('click', function() {
        var player_list = [];
        $('.release_checkbox').each(function() {
            var temp = $(this).prop('checked');

            if (temp == true) {
                var temp1 = $(this).parent().parent().next().next().text();
                player_list.push(temp1);
            }
        });
        $.ajax({
            url: '/save_data_cut_player',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player_list' : player_list,
                'from' : 'team'
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/confirm_cut_players';
            }
        });
    });
});