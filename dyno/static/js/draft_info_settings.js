$(document).ready(function() {
    console.log('ready 2');

    $("table").tablesorter();

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

});