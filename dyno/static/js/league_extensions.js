$(document).ready(function() {
    console.log('ready 2');

    var filtered_data = [];

    var $master = [];
    $('#vw_1').find('tr').each(function() {
        $master.push({'pos': $(this).find('#vw_1-1').text(),
            'player': $(this).find('#vw_1-2').text(),
            'team': $(this).find('#vw_1-3').text(),
            'avg_yearly_cost': Number($(this).find('#vw_1-4').text()),
            'years_left': Number($(this).find('#vw_1-5').text()),
            'base_extension_value': Number($(this).find('#vw_1-6').text()),
            'max_extension_length': Number($(this).find('#vw_1-7').text()),
            'yr1_extension': $(this).find('#vw_1-8').text(),
            'yr2_extension': $(this).find('#vw_1-9').text(),
            'yr3_extension': $(this).find('#vw_1-10').text(),
            'yr4_extension': $(this).find('#vw_1-11').text()});
        $(this).remove();
    });

    var user_team = $('#vw_2-1').text();
    var ext_switch = Number($('#vw_2-2').text());
    $('#vw_2').remove();

    var submitted_extensions_list = [];
    $('#vw_3').find('tr').each(function() {
        submitted_extensions_list.push($(this).find('#vw_3-1').text());
        $(this).remove();
    });

    console.log(submitted_extensions_list);

    fill_table($master);
    $("table").tablesorter();




    function fill_table (data) {
        $('#extensions_body').empty();

        $.each(data, function(index, value) {
            var tr = $('<tr>').css({'height' : '30px'});
            var td_pos = $('<td>');
            var td_player = $('<td>');
            var td_team = $('<td>');
            var td_avg_yearly_cost = $('<td>');
            var td_years_left = $('<td>');
            var td_base_extension_value = $('<td>');
            var td_max_extension_length = $('<td>');
            var td_yr1 = $('<td>');
            var td_yr2 = $('<td>');
            var td_yr3 = $('<td>');
            var td_yr4 = $('<td>');
            var td_button = $('<td>');

            td_pos.text(value.pos).css({'text-align' : 'center'});
            var name_link = $('<div>').addClass('name_link').text(value.player);
            td_player.append(name_link);
            td_team.text(value.team);
            td_avg_yearly_cost.text('$' + value.avg_yearly_cost.toFixed(2)).css({'text-align' : 'center'});
            td_years_left.text(value.years_left).css({'text-align' : 'center'});
            td_base_extension_value.text('$' + value.base_extension_value.toFixed(2)).css({'text-align' : 'center'});
            td_max_extension_length.text(value.max_extension_length).css({'text-align' : 'center'});

            if (value.yr1_extension == '-') {
                td_yr1.text(value.yr1_extension).css({'text-align' : 'center'});
            } else {
                td_yr1.text('$' + Number(value.yr1_extension).toFixed(2)).css({'text-align' : 'center'});
            }
            if (value.yr2_extension == '-') {
                td_yr2.text(value.yr2_extension).css({'text-align' : 'center'});
            } else {
                td_yr2.text('$' + Number(value.yr2_extension).toFixed(2)).css({'text-align' : 'center'});
            }
            if (value.yr3_extension == '-') {
                td_yr3.text(value.yr3_extension).css({'text-align' : 'center'});
            } else {
                td_yr3.text('$' + Number(value.yr3_extension).toFixed(2)).css({'text-align' : 'center'});
            }
            if (value.yr4_extension == '-') {
                td_yr4.text(value.yr4_extension).css({'text-align' : 'center'});
            } else {
                td_yr4.text('$' + Number(value.yr4_extension).toFixed(2)).css({'text-align' : 'center'});
            }

            var already_submitted = 0;
            if ($.inArray(value.player, submitted_extensions_list) == -1) {
                already_submitted = 0;
            } else {
                already_submitted = 1;
            }
            if (value.team == user_team && ext_switch == 1 && already_submitted == 0) {
                var ext_button = $('<button>').text('Extend Player').addClass('submit_extension_button');
                td_button.append(ext_button).css({'text-align' : 'center'});
            }

            tr.append(td_pos);
            tr.append(td_player);
            tr.append(td_team);
            tr.append(td_avg_yearly_cost);
            tr.append(td_years_left);
            tr.append(td_base_extension_value);
            tr.append(td_max_extension_length);
            tr.append(td_yr1);
            tr.append(td_yr2);
            tr.append(td_yr3);
            tr.append(td_yr4);
            tr.append(td_button);
            tr.appendTo('#extensions_body');
        });
        $('table').trigger('update');
    }


    $('#extensions_team_checkbox').on('click', function() {
        if ($(this).prop('checked') == true) {
            var filter_data = [];
            $.each($master, function(index, value) {
                if (value.team == user_team) {
                    filter_data.push(value);
                }
            });
            fill_table(filter_data);
        } else {
            fill_table($master);
        }
    });

    $(document).on('click', '.submit_extension_button', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        var player = $(this).parent().prev().prev().prev().prev().prev().prev().prev().prev().prev().prev().text();
        var team = user_team;
        var yr1 = $(this).parent().prev().prev().prev().prev().text();
        if (yr1 == '-') {
            return;
        }
        var yr2 = $(this).parent().prev().prev().prev().text();
        var yr3 = $(this).parent().prev().prev().text();
        var yr4 = $(this).parent().prev().text();
        var ext_string = yr1 + ',' + yr2 + ',' + yr3 + ',' + yr4;
        $.ajax({
            url: '/get_extension_info',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player' : player,
                'team' : team,
                'ext_string' : ext_string
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/confirm_extension_structure';
            }
        });
    });

});