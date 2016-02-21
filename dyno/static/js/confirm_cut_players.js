$(document).ready(function() {
    console.log('ready confirm 4');

    var from_int = Number($('#vw_3-1').text());
    var current_year = $('#vw_3-2').text();
    $('#vw_3').remove();

    var return_address = '';
    if (from_int == 0) {
        return_address = '/player';
    } else if (from_int == 1) {
        return_address = '/team/release_players'
    }

    var selected_list = [];

    var $master = [];
    $('#vw_1').find('tr').each(function() {
        $master.push({'name': $(this).find('#vw_1-1').text(),
            'pos': $(this).find('#vw_1-2').text(),
            'current_selection' : -1});
        $(this).remove();
    });

    var $assets = [];
    $('#vw_2').find('tr').each(function() {
        $assets.push({'asset_type': $(this).find('#vw_2-1').text(),
            'percentage': Number($(this).find('#vw_2-2').text()),
            'description': $(this).find('#vw_2-3').text(),
            'id' : Number($(this).find('#vw_2-4').text())});
        $(this).remove();
    });

    console.log(return_address);
    console.log($master);
    console.log($assets);

    populate_table();

    function populate_dropbox (current_selection) {
        var db = $('<select>');
        var o = $('<option>').text('').val(-1);
        if (current_selection == -1) {
            o.prop('selected', true);
        }
        db.append(o);

        $.each($assets, function(index, value) {
            if (value.id == current_selection) {
                var o = $('<option>');
                o.text(value.percentage.toFixed(0) + '% ' + value.asset_type);
                o.val(value.id);
                o.prop('selected', true);
                o.appendTo(db);
            } else {
                if ($.inArray(value.id, selected_list) == -1) {
                    var o = $('<option>');
                    o.text(value.percentage.toFixed(0) + '% ' + value.asset_type);
                    o.val(value.id);
                    o.appendTo(db);
                }
            }
        });

        console.log(current_selection, selected_list);

        return db;
    }

    function get_message_text (current_selection, position) {
        if (position == 'DEF') {
            return 'No Cap Penalty for this player';
        }
        if (current_selection == -1) {
            return ''
        }

        var percent = 0;
        $.each($assets, function(index, value) {
            if (value.id == current_selection) {
                percent = value.percentage;
            }
        });

        if (percent == 100) {
            return 'No Cap Penalty for this player';
        } else {
            return 'Cap Penalty for this player will be reduced by ' + percent.toFixed(0) + '%';
        }
    }

    function populate_table () {
        $('#confirm_cut_tbody').empty();

        $.each($master, function(index, value) {
            var tr = $('<tr>').css({'height' : '40px'});
            var td_player = $('<td>').css({'width' : '30%'});
            var td_dropbox = $('<td>').css({'width' : '30%'});
            var td_message = $('<td>').css({'width' : '40%'});

            if (current_year == '2015') {
                $('#message_text').text('Old cut rules still apply, cap penalty is 25% of total cost each year of contract');
            }
            td_player.text(value.name);

            var dropbox = populate_dropbox(value.current_selection);
            td_dropbox.append(dropbox);

            var m_text = get_message_text(value.current_selection, value.pos);
            td_message.text(m_text);

            tr.append(td_player);
            tr.append(td_dropbox);
            tr.append(td_message);
            tr.appendTo('#confirm_cut_tbody');
        });
    }


    $(document).on('change', 'select', function() {
        var select_val = Number($(this).val());
        var t = $(this).parent().prev().text();
        var player = t.split('(')[0].trim();
        var old_selected = 99;
        $.each($master, function(index, value) {
            if (value.name == player) {
                old_selected = value.current_selection;
                value.current_selection = select_val
            }
        });
        var o_list = [];
        $.each(selected_list, function(index, value) {
            if (value != old_selected) {
                o_list.push(value);
            }
        });
        o_list.push(select_val);
        selected_list = o_list;
        populate_table();
    });

    $('#cut_confirm_button').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        $('#message_text').text('Processing, please wait......');
        var total_players = $master.length;
        $.ajax({
            url: '/process_cuts',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                cut_list : $master,
                total_players : total_players
            },
            dataType: 'json',
            success: function (data) {
                location.href = return_address;
            }
        });
    });

    $('#cut_cancel_button').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        location.href = return_address;
    });
});