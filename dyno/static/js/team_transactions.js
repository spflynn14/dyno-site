$(document).ready(function() {
    console.log('ready');

    var d = new Date();
    var today = format_date(d);
    var filtered_data = [];
    var cat_filter_items = [];

    $('#datepicker_start').datepicker({
        showButtonPanel: true
    });
    $('#datepicker_end').datepicker({
        showButtonPanel: true
    });

    $('#datepicker_end').val(today);
    var end_date = new Date(Date.parse($('#datepicker_end').val()));
    var tempd = new Date(end_date);
    tempd.setDate(tempd.getDate() - 1);
    var temp1 = format_date(tempd);
    $('#datepicker_start').val(temp1);
    $('#filter_24_hours_div').css({'border' : '2px dashed #2d99d4'});

    var $master = [];
    $('#vw_1').find('tr').each(function() {
        $master.push({'date': $(this).find('#vw_1-1').text(),
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
            'date_iso': $(this).find('#vw_1-14').text()});
        $(this).remove();
    });

    filtered_data = filter_by_date($master);
    fill_table(filtered_data);
    $("table").tablesorter();



    function format_date (data) {
        var month = data.getMonth()+1;
        var day = data.getDate();
        var return_date =  (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + data.getFullYear();
        return return_date;
    }

    function daysInMonth(month,year) {
        return new Date(year, month, 0).getDate();
    }

    function fill_table (data) {
        $('#team_transactions_body').empty();

        $.each(data, function(index, value) {
            var tr = $('<tr>');
            var td_date = $('<td>');
            var td_player = $('<td>');
            var td_transtype = $('<td>');
            var td_details = $('<td>');

            td_date.text(value.date);
            td_player.text(value.player);
            td_transtype.text(value.transaction_type);
            var temp = determine_details(value);
            td_details.text(temp);

            tr.append(td_date);
            tr.append(td_player);
            tr.append(td_transtype);
            tr.append(td_details);
            tr.appendTo('#team_transactions_body');
        });
        $('table').trigger('update');
    }

    function determine_details (data) {
        var return_text = '';

        if (data.transaction_type == 'Auction Bid') {
            return_text = 'You bid $' + data.var_d1;
        } else if (data.transaction_type == 'Auction Created') {
            return_text = 'Your proxy bid at creation was $' + data.var_d1;
        } else if (data.transaction_type == 'Auction End') {
            return_text = 'You won this auction at $' + data.var_d1 + '. Your max bid was $' + data.var_d2 + '.';
        } else if (data.transaction_type == 'Contract Processed') {
            if (data.var_t1 == 'Waiver Extension') {
                return_text = 'Waiver Extension was granted this player. His contract has been updated.';
            } else if (data.var_t1 == 'Franchise Tag') {
                return_text = "This player's Franchise Tag has been processed.";
            } else if (data.var_t1 == 'Transition Tag') {
                return_text = 'Transition Tag was applied to this player. His contract has been updated';
            } else if (data.var_t1 == 'Extension Submitted') {
                return_text = 'Player was signed to a ' + data.var_i1 + ' year extension. His contract has been updated';
            } else {
                return_text = 'Player was added to your roster';
            }
        } else if (data.transaction_type == 'Contract Set') {
            var temp_list = data.var_t3.split(',');
            var fixed_string = '';
            $.each(temp_list, function(index, value) {
                if (Number(value) != 0) {
                    fixed_string = fixed_string + '$' + Number(value).toFixed(2) + ', ';
                }
            });
            fixed_string = fixed_string.slice(0,-2);
            if (data.var_i1 == 1) {
                return_text = 'Contract was set for this player: ' + data.var_i1 + ' year, $' + data.var_d2 + ' signing bonus per year, salary structure = ' + fixed_string;
            } else {
                return_text = 'Contract was set for this player: ' + data.var_i1 + ' years, $' + data.var_d2 + ' signing bonus per year, salary structure = ' + fixed_string;
            }
        } else if (data.transaction_type == 'Waiver Extension') {
            return_text = "Waiver Extension submitted: 1 year, $" + data.var_d1;
        } else if (data.transaction_type == 'Franchise Tag') {
            return_text = "Franchise Tag submitted. Auction will begin at $" + data.var_d1;
        } else if (data.transaction_type == 'Transition Tag') {
            return_text = "Transition Tag submitted: 1 year, $" + data.var_d1;
        } else if (data.transaction_type == 'Extension Submitted') {
            var temp_list = data.var_t3.split(',');
            var fixed_string = '';
            $.each(temp_list, function(index, value) {
                if (Number(value) != 0) {
                    fixed_string = fixed_string + '$' + Number(value).toFixed(2) + ', ';
                }
            });
            fixed_string = fixed_string.slice(0,-2);
            if (data.var_i1 == 1) {
                return_text = 'Extension submitted: ' + data.var_i1 + ' year, $' + data.var_d2 + ' signing bonus per year, salary structure = ' + fixed_string;
            } else {
                return_text = 'Extension submitted: ' + data.var_i1 + ' years, $' + data.var_d2 + ' signing bonus per year, salary structure = ' + fixed_string;
            }
        } else if (data.transaction_type == 'Expansion Draft Pick') {
            return_text = "Expansion Draft Pick: taken by " + data.team2 + ' in round ' + data.var_i1 + '. Previously owned by ' + data.team1 + '.';
        } else {
            return_text = 'determine_details function is broke; report this bug'
        }

        return return_text;
    }

    function filter_by_date (data) {
        var f_data = [];

        if ($('#datepicker_start').val() == '') {
            return data;
        }

        var d1 = $('#datepicker_start').val();
        var d2 = $('#datepicker_end').val();
        var from = new Date(Date.parse(d1));
        var to   = new Date(Date.parse(d2));
        to.setDate(to.getDate() + 1);

        $.each(data, function(index, value) {
            var r = new Date(Date.parse(value.date_iso));
            if (r > from && r < to == true) {
                f_data.push(value);
            }
        });

        return f_data;
    }

    function filter_by_cat (data) {
        var f_data = [];

        $.each(data, function(index, value) {
            if ($.inArray(value.transaction_type, cat_filter_items) == -1) {
                f_data.push(value);
            }
        });

        return f_data;
    }




    $('#filter_24_hours_button').on('click', function() {
        var end_date = new Date(Date.parse($('#datepicker_end').val()));
        var tempd = new Date(end_date);
        tempd.setDate(tempd.getDate() - 1);
        var temp1 = format_date(tempd);
        $('#datepicker_start').val(temp1);
        $('#filter_24_hours_div').css({'border' : '2px dashed #2d99d4'});
        $('#filter_48_hours_div').css({'border' : '2px dashed white'});
        $('#filter_72_hours_div').css({'border' : '2px dashed white'});
        $('#filter_week_div').css({'border' : '2px dashed white'});
        $('#filter_month_div').css({'border' : '2px dashed white'});
        var output1 = filter_by_date($master);
        filtered_data = filter_by_cat(output1);
        fill_table(filtered_data);
    });

    $('#filter_48_hours_button').on('click', function() {
        var end_date = new Date(Date.parse($('#datepicker_end').val()));
        var tempd = new Date(end_date);
        tempd.setDate(tempd.getDate() - 2);
        var temp1 = format_date(tempd);
        $('#datepicker_start').val(temp1);
        $('#filter_24_hours_div').css({'border' : '2px dashed white'});
        $('#filter_48_hours_div').css({'border' : '2px dashed #2d99d4'});
        $('#filter_72_hours_div').css({'border' : '2px dashed white'});
        $('#filter_week_div').css({'border' : '2px dashed white'});
        $('#filter_month_div').css({'border' : '2px dashed white'});
        var output1 = filter_by_date($master);
        filtered_data = filter_by_cat(output1);
        fill_table(filtered_data);
    });

    $('#filter_72_hours_button').on('click', function() {
        var end_date = new Date(Date.parse($('#datepicker_end').val()));
        var tempd = new Date(end_date);
        tempd.setDate(tempd.getDate() - 3);
        var temp1 = format_date(tempd);
        $('#datepicker_start').val(temp1);
        $('#filter_24_hours_div').css({'border' : '2px dashed white'});
        $('#filter_48_hours_div').css({'border' : '2px dashed white'});
        $('#filter_72_hours_div').css({'border' : '2px dashed #2d99d4'});
        $('#filter_week_div').css({'border' : '2px dashed white'});
        $('#filter_month_div').css({'border' : '2px dashed white'});
        var output1 = filter_by_date($master);
        filtered_data = filter_by_cat(output1);
        fill_table(filtered_data);
    });

    $('#filter_week_button').on('click', function() {
        var end_date = new Date(Date.parse($('#datepicker_end').val()));
        var tempd = new Date(end_date);
        tempd.setDate(tempd.getDate() - 7);
        var temp1 = format_date(tempd);
        $('#datepicker_start').val(temp1);
        $('#filter_24_hours_div').css({'border' : '2px dashed white'});
        $('#filter_48_hours_div').css({'border' : '2px dashed white'});
        $('#filter_72_hours_div').css({'border' : '2px dashed white'});
        $('#filter_week_div').css({'border' : '2px dashed #2d99d4'});
        $('#filter_month_div').css({'border' : '2px dashed white'});
        var output1 = filter_by_date($master);
        filtered_data = filter_by_cat(output1);
        fill_table(filtered_data);
    });

    $('#filter_month_button').on('click', function() {
        var end_date = new Date(Date.parse($('#datepicker_end').val()));
        var m = end_date.getMonth();
        var y = end_date.getFullYear();
        if (m == 0) {
            m = 12;
            y = y - 1;
        }
        var month_days = daysInMonth(m, y);
        var tempd = new Date(end_date);
        tempd.setDate(tempd.getDate() - month_days);
        var temp1 = format_date(tempd);
        $('#datepicker_start').val(temp1);
        $('#filter_24_hours_div').css({'border' : '2px dashed white'});
        $('#filter_48_hours_div').css({'border' : '2px dashed white'});
        $('#filter_72_hours_div').css({'border' : '2px dashed white'});
        $('#filter_week_div').css({'border' : '2px dashed white'});
        $('#filter_month_div').css({'border' : '2px dashed #2d99d4'});
        var output1 = filter_by_date($master);
        filtered_data = filter_by_cat(output1);
        fill_table(filtered_data);
    });

    $('#datepicker_start').on('change', function() {
        $('#filter_24_hours_div').css({'border' : '2px dashed white'});
        $('#filter_48_hours_div').css({'border' : '2px dashed white'});
        $('#filter_72_hours_div').css({'border' : '2px dashed white'});
        $('#filter_week_div').css({'border' : '2px dashed white'});
        $('#filter_month_div').css({'border' : '2px dashed white'});
        var output1 = filter_by_date($master);
        filtered_data = filter_by_cat(output1);
        fill_table(filtered_data);
    });

    $('#datepicker_end').on('change', function() {
        $('#filter_24_hours_div').css({'border' : '2px dashed white'});
        $('#filter_48_hours_div').css({'border' : '2px dashed white'});
        $('#filter_72_hours_div').css({'border' : '2px dashed white'});
        $('#filter_week_div').css({'border' : '2px dashed white'});
        $('#filter_month_div').css({'border' : '2px dashed white'});
        var output1 = filter_by_date($master);
        filtered_data = filter_by_cat(output1);
        fill_table(filtered_data);
    });

    $('input[type=checkbox]').on('click', function() {
        var s = $(this).prop('checked');
        var n = $(this).parent().prev().text();
        if (s == true) {
            var temp_list = [];
            $.each(cat_filter_items, function(index, value) {
                if (n != value) {
                    temp_list.push(value);
                }
            });
            cat_filter_items = temp_list;
        } else {
            cat_filter_items.push(n);
        }

        var output1 = filter_by_date($master);
        filtered_data = filter_by_cat(output1);
        fill_table(filtered_data);
    });
});