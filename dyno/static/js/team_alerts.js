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
            'user': $(this).find('#vw_1-2').text(),
            'alert_type': $(this).find('#vw_1-3').text(),
            'var_d1': $(this).find('#vw_1-4').text(),
            'var_d2': $(this).find('#vw_1-5').text(),
            'var_d3': $(this).find('#vw_1-6').text(),
            'var_i1': $(this).find('#vw_1-7').text(),
            'var_i2': $(this).find('#vw_1-8').text(),
            'var_t1': $(this).find('#vw_1-9').text(),
            'var_t2': $(this).find('#vw_1-10').text(),
            'var_t3': $(this).find('#vw_1-11').text(),
            'date_iso': $(this).find('#vw_1-12').text()});
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
        $('#team_alerts_body').empty();

        $.each(data, function(index, value) {
            var tr = $('<tr>');
            var td_date = $('<td>');
            var td_alert_type = $('<td>');
            var td_details = $('<td>');

            td_date.text(value.date);
            td_alert_type.text(value.alert_type);
            var temp = determine_details(value);
            td_details.text(temp);

            tr.append(td_date);
            tr.append(td_alert_type);
            tr.append(td_details);
            tr.appendTo('#team_alerts_body');
        });
        $('table').trigger('update');
    }

    function determine_details (data) {
        var return_text = '';

        if (data.alert_type == 'Auction - New Auction') {
            return_text = data.var_t1 + ' - started by ' + data.var_t2;
        } else if (data.alert_type == 'Auction - Outbid') {
            return_text = data.var_t2 + ' - you were outbid by ' + data.var_t1 + '. New high bid is $' + data.var_d1 + '.';
        } else if (data.alert_type == 'Auction - Won') {
            return_text = data.var_t1 + ' - auction was won by ' + data.var_t2 + ' with a bid of $' + data.var_d1 + '.';
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
            if ($.inArray(value.alert_type, cat_filter_items) == -1) {
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