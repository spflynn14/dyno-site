$(document).ready(function() {
    console.log('ready 3');

    var $master = {};
    $('#vw_1').find('tr').each(function() {
        $master = {'date': $(this).find('#vw_1-1').text(),
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
            'iso_date': $(this).find('#vw_1-14').text(),
            'id': $(this).find('#vw_1-15').text()};
        $(this).remove();
    });

    var amnesty_status = $('#vw_2-0').text();
    var amnesty_id = -1;
    var amnesty_percentage = -1;
    if (amnesty_status != 'none') {
        amnesty_id = Number($('#vw_2-1').text());
        amnesty_percentage = Number($('#vw_2-2').text());
    }

    var pos = '';
    var yr1_sal = 0;
    var yr2_sal = 0;
    var yr3_sal = 0;
    var yr4_sal = 0;
    var yr5_sal = 0;
    var yr1_sb = 0;
    var yr2_sb = 0;
    var yr3_sb = 0;
    var yr4_sb = 0;
    var yr5_sb = 0;
    $('#old_data_area').find('p').each(function(index, value) {
        if (index == 0) {
            pos = $(this).text();
        } else if (index == 7) {
            yr1_sal = Number($(this).text());
        } else if (index == 8) {
            yr2_sal = Number($(this).text());
        } else if (index == 9) {
            yr3_sal = Number($(this).text());
        } else if (index == 10) {
            yr4_sal = Number($(this).text());
        } else if (index == 11) {
            yr5_sal = Number($(this).text());
        } else if (index == 12) {
            yr1_sb = Number($(this).text());
        } else if (index == 13) {
            yr2_sb = Number($(this).text());
        } else if (index == 14) {
            yr3_sb = Number($(this).text());
        } else if (index == 15) {
            yr4_sb = Number($(this).text());
        } else if (index == 16) {
            yr5_sb = Number($(this).text());
        }
    });

    if (pos == 'DEF') {
        $('#input_1').val(0);
        $('#input_2').val(0);
        $('#input_3').val(0);
        $('#input_4').val(0);
        $('#input_5').val(0);
    } else {
        if (amnesty_percentage == 100) {
            $('#input_1').val(0);
            $('#input_2').val(0);
            $('#input_3').val(0);
            $('#input_4').val(0);
            $('#input_5').val(0);
        } else if (amnesty_percentage == 50) {
            var temp1 = (yr1_sal + yr1_sb) * 0.50;
            var temp2 = (yr2_sb) * 0.50;
            var temp3 = (yr3_sb) * 0.50;
            var temp4 = (yr4_sb) * 0.50;
            var temp5 = (yr5_sb) * 0.50;
            $('#input_1').val(temp1.toFixed(2));
            $('#input_2').val(temp2.toFixed(2));
            $('#input_3').val(temp3.toFixed(2));
            $('#input_4').val(temp4.toFixed(2));
            $('#input_5').val(temp5.toFixed(2));
        } else if (amnesty_percentage == 10) {
            var temp1 = (yr1_sal + yr1_sb) * 0.90;
            var temp2 = (yr2_sb) * 0.90;
            var temp3 = (yr3_sb) * 0.90;
            var temp4 = (yr4_sb) * 0.90;
            var temp5 = (yr5_sb) * 0.90;
            $('#input_1').val(temp1.toFixed(2));
            $('#input_2').val(temp2.toFixed(2));
            $('#input_3').val(temp3.toFixed(2));
            $('#input_4').val(temp4.toFixed(2));
            $('#input_5').val(temp5.toFixed(2));
        } else {
            $('#input_1').val(yr1_sal + yr1_sb);
            $('#input_2').val(yr2_sb);
            $('#input_3').val(yr3_sb);
            $('#input_4').val(yr4_sb);
            $('#input_5').val(yr5_sb);
        }
    }





    $('#amnesty_100_button').on('click', function() {
        $('#input_1').val(0);
        $('#input_2').val(0);
        $('#input_3').val(0);
        $('#input_4').val(0);
        $('#input_5').val(0);
    });

    $('#amnesty_50_button').on('click', function() {
        var temp1 = (yr1_sal + yr1_sb) * 0.50;
        var temp2 = (yr2_sb) * 0.50;
        var temp3 = (yr3_sb) * 0.50;
        var temp4 = (yr4_sb) * 0.50;
        var temp5 = (yr5_sb) * 0.50;
        $('#input_1').val(temp1.toFixed(2));
        $('#input_2').val(temp2.toFixed(2));
        $('#input_3').val(temp3.toFixed(2));
        $('#input_4').val(temp4.toFixed(2));
        $('#input_5').val(temp5.toFixed(2));
    });

    $('#amnesty_10_button').on('click', function() {
        var temp1 = (yr1_sal + yr1_sb) * 0.90;
        var temp2 = (yr2_sb) * 0.90;
        var temp3 = (yr3_sb) * 0.90;
        var temp4 = (yr4_sb) * 0.90;
        var temp5 = (yr5_sb) * 0.90;
        $('#input_1').val(temp1.toFixed(2));
        $('#input_2').val(temp2.toFixed(2));
        $('#input_3').val(temp3.toFixed(2));
        $('#input_4').val(temp4.toFixed(2));
        $('#input_5').val(temp5.toFixed(2));
    });

    $('#amnesty_0_button').on('click', function() {
        $('#input_1').val(yr1_sal + yr1_sb);
        $('#input_2').val(yr2_sb);
        $('#input_3').val(yr3_sb);
        $('#input_4').val(yr4_sb);
        $('#input_5').val(yr5_sb);
    });

    $('#amnesty_oldrules_button').on('click', function() {
        var temp1 = (yr1_sal + yr1_sb) * 0.25;
        var temp2 = (yr2_sal + yr2_sb) * 0.25;
        var temp3 = (yr3_sal + yr3_sb) * 0.25;
        var temp4 = (yr4_sal + yr4_sb) * 0.25;
        var temp5 = (yr5_sal + yr5_sb) * 0.25;
        $('#input_1').val(temp1.toFixed(2));
        $('#input_2').val(temp2.toFixed(2));
        $('#input_3').val(temp3.toFixed(2));
        $('#input_4').val(temp4.toFixed(2));
        $('#input_5').val(temp5.toFixed(2));
    });

    $('#trans_cut_submit_button').on('click', function() {
        var yr1_pen = $('#input_1').val();
        var yr2_pen = $('#input_2').val();
        var yr3_pen = $('#input_3').val();
        var yr4_pen = $('#input_4').val();
        var yr5_pen = $('#input_5').val();
        var cut_season = 99;
        if ($("input[name='type_cut'][value='offseason']").prop('checked') == true) {
            cut_season = 0;
        } else {
            cut_season = 1;
        }
        var trans_id = $master.id;

        $.ajax({
            url: '/save_transaction_cut',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'yr1_pen' : yr1_pen,
                'yr2_pen' : yr2_pen,
                'yr3_pen' : yr3_pen,
                'yr4_pen' : yr4_pen,
                'yr5_pen' : yr5_pen,
                'cut_season' : cut_season,
                'trans_id' : trans_id,
                'amnesty_id' : amnesty_id,
                'amnesty_percentage' : amnesty_percentage
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/commish/pending_transactions';
            }
        });
    });
});