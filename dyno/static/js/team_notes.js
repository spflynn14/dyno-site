$(document).ready(function() {
    console.log('ready 2');
    var $display_bottom = $('#display_area').position().top+$('#display_area').height();
    var $threshhold_dropup = $display_bottom;

    var default_shortlist = $('#vw_1').find('p').text();
    $('#vw_1').remove();

    if (default_shortlist == 'all') {
        $('#shortlist_select').val('all');
    }

    var shortlists = [];
    $('#vw_2 p').each(function() {
        var id = $(this).prop('id');
        var title = $(this).text();
        shortlists.push({'id' : id,
                        'title' : title})
    });
    $('#vw_2').remove();

    //console.log(default_shortlist);
    get_players(default_shortlist);

    $("#notes_table").tablesorter();

    var current_shortlist = default_shortlist;

    function get_players (shortlist_id) {
        $.ajax({
            url : '/get_shortlist_members',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'shortlist_id' : shortlist_id
            },
            dataType: 'json',
            success: function(data){
                fill_table(data);
            },
            error: function(data) {
                console.log(data);
            }
        });
    }

    function fill_table (data) {
        $('#notes_table_tbody').empty();
        $('#table_area').css({'overflow' : 'auto'});

        $.each(data, function(index, value) {
            var tr = $('<tr>');
            var td_pos = $('<td>').css({'text-align' : 'center'});
            var td_name = $('<td>');
            var td_team = $('<td>');
            var td_age = $('<td>').css({'text-align' : 'center'});
            var td_avg_yearly_cost = $('<td>').css({'text-align' : 'center'});
            var td_cap_hit = $('<td>').css({'text-align' : 'center'});
            var td_years_left = $('<td>').css({'text-align' : 'center'});
            var td_notes = $('<td>');
            var td_actions = $('<td>').css({'text-align' : 'center', 'padding-top' : '10px', 'padding-bottom' : '10px'});

            td_pos.text(value.pos);
            var name_link = $('<div>').addClass('name_link').text(value.name);
            td_name.append(name_link);
            td_team.text(value.team);
            td_age.text(value.age);
            td_avg_yearly_cost.text('$' + Number(value.avg_yearly_cost).toFixed(2));
            td_cap_hit.text('$' + Number(value.cap_hit).toFixed(2));
            td_years_left.text(value.years_left);
            var notes_label = $('<p>').text(value.notes).css({'vertical-align' : 'middle', 'display' : 'inherit'});
            var notes_edit = $('<textarea>').val(value.notes).prop('hidden', true).css({'height' : '100%', 'width' : '100%'});
            td_notes.append(notes_label).append(notes_edit);

            var neg_shortlists = 0;
            var neg_shortlists_move = 0;
            if (shortlists.length > 3) {
                neg_shortlists = (shortlists.length * -27) + 91;
            }
            if (shortlists.length > 2) {
                neg_shortlists_move = (shortlists.length * -27) + 74;
            }

            var actions_icon = $('<i>').addClass('glyphicon').addClass('glyphicon-cog').css({'color' : '#555555', 'width' : '50%'});
            var actions_header = $('<div>').attr('data-toggle', 'dropdown').addClass('dropdown-toggle');
            actions_header.append(actions_icon).append($('<b>').addClass('caret').css({'color' : '#555555'}));
            var action_dropdown = $('<div>').addClass('dropdown').addClass('action_dropdown');

            var top_ul = $('<ul>').addClass('dropdown-menu').addClass('action_li');
            var edit_notes_li = $('<li>').text('Edit Note').addClass('action_li').addClass('edit_note_action');

            var new_add_li = $('<li>').addClass('dropdown').addClass('dropdown-submenu').addClass('action_dropdown');
            var new_add_header = $('<div>').attr('data-toggle', 'dropdown').addClass('dropdown-toggle');
            new_add_header.text('Add to Shortlist').css({'padding-left' : '6px', 'color' : 'black'});
            new_add_header.append($('<i>').addClass('glyphicon').addClass('glyphicon-chevron-right').css({'color' : '#555555', 'float' : 'right', 'margin-right' : '5px'}));
            var new_add_ul = $('<ul>').addClass('dropdown-menu').css({'top' : neg_shortlists.toString() + 'px'});

            var new_move_li = $('<li>').addClass('dropdown').addClass('dropdown-submenu').addClass('action_dropdown');
            var new_move_header = $('<div>').attr('data-toggle', 'dropdown').addClass('dropdown-toggle');
            new_move_header.text('Move to Shortlist').css({'padding-left' : '6px', 'color' : 'black'});
            new_move_header.append($('<i>').addClass('glyphicon').addClass('glyphicon-chevron-right').css({'color' : '#555555', 'float' : 'right', 'margin-right' : '5px'}));
            var new_move_ul = $('<ul>').addClass('dropdown-menu').css({'top' : neg_shortlists_move.toString() + 'px'});

            $.each(shortlists, function(i, d) {
                var li1 = $('<li>').prop('id', d.id).text(d.title).addClass('action_li').addClass('add_to_shortlist_action');
                var li2 = $('<li>').prop('id', d.id).text(d.title).addClass('action_li').addClass('move_to_shortlist_action');
                new_add_ul.append(li1);
                new_move_ul.append(li2);
            });

            new_add_li.append(new_add_header).append(new_add_ul);
            new_move_li.append(new_move_header).append(new_move_ul);

            var move_li = $('<li>').text('Move to Shortlist').addClass('action_li');
            var remove_li = $('<li>').text('Remove from this Shortlist').addClass('action_li').addClass('remove_action');
            var li_divider1 = $('<li>').addClass('divider');
            var li_divider2 = $('<li>').addClass('divider');

            top_ul.append(edit_notes_li).append(li_divider1).append(new_add_li).append(new_move_li).append(li_divider2).append(remove_li);

            action_dropdown.append(actions_header).append(top_ul);
            td_actions.append(action_dropdown);

            var cancel_button = $('<button>').addClass('cancel_button').text('Cancel').css({'font-size' : 'x-small', 'width' : '100%', 'color' : 'red'}).prop('hidden', true);
            var save_button = $('<button>').addClass('save_button').text('Save').css({'font-size' : 'x-small', 'width' : '100%', 'color' : 'blue'}).prop('hidden', true);
            td_actions.append(cancel_button).append(save_button);

            tr.append(td_actions);
            tr.append(td_pos);
            tr.append(td_name);
            tr.append(td_team);
            tr.append(td_age);
            tr.append(td_avg_yearly_cost);
            tr.append(td_cap_hit);
            tr.append(td_years_left);
            tr.append(td_notes);
            tr.appendTo('#notes_table_tbody');
        });
        $('#notes_table').trigger('update');
    }

    $(document).on('click', '.name_link', function() {
        //console.log('click');
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

    $(document).on('click', '.dropdown-toggle', function() {
        var cell_top = $(this).parent().position().top;
        var table_top = $('#table_area').position().top;
        var table_bottom = table_top + $('#table_area').height();
        //console.log(cell_top + 158, table_bottom);
        if (cell_top + 158 > table_bottom) {
            $('#table_area').scrollTop(cell_top + 158);
        }
    });

    $(document).on('click', '.edit_note_action', function() {
        var $this_cell = $(this).parent().parent().parent();
        var $notes_cell = $(this).parent().parent().parent().next().next().next().next().next().next().next().next();
        $notes_cell.find('p').hide();
        $notes_cell.find('textarea').show();
        $this_cell.find('.action_dropdown').hide();
        $this_cell.find('button').show();

        $('.cancel_button').on('click', function () {
            var text = $notes_cell.find('p').text();
            $notes_cell.find('p').show();
            $notes_cell.find('textarea').hide().val(text);
            $this_cell.find('.action_dropdown').show();
            $this_cell.find('button').hide();
        });

        $('.save_button').on('click', function() {
            var player = $this_cell.next().next().text();
            var text = $notes_cell.find('textarea').val();
            $notes_cell.find('p').show().text(text);
            $notes_cell.find('textarea').hide();
            $this_cell.find('.action_dropdown').show();
            $this_cell.find('button').hide();
            $.ajax({
                url: '/save_player_notes',
                type: 'POST',
                data: {
                    csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                    'player' : player,
                    'notes_text' : text
                },
                dataType: 'json',
                success: function (data) {
                    //do nothing;
                }
            });
        });
    });

    $(document).on('click', '.remove_action', function() {
        var $this_cell = $(this).parent().parent().parent();
        var player = $this_cell.next().next().text();
        $.ajax({
            url : '/save_player_shortlist_assignments',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player' : player,
                'shortlist_id' : current_shortlist,
                'which' : 'remove'
            },
            dataType: 'json',
            success: function(data){
                get_players(current_shortlist);
            }
        });
    });

    $(document).on('click', '.add_to_shortlist_action', function() {
        var $this_cell = $(this).parent().parent().parent().parent().parent();
        var player = $this_cell.next().next().text();
        var shortlist = $(this).prop('id');
        $.ajax({
            url : '/save_player_shortlist_assignments',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player' : player,
                'shortlist_id' : shortlist,
                'which' : 'add'
            },
            dataType: 'json',
            success: function(data){
                get_players(current_shortlist);
            }
        });
    });

    $(document).on('click', '.move_to_shortlist_action', function() {
        var $this_cell = $(this).parent().parent().parent().parent().parent();
        var player = $this_cell.next().next().text();
        var shortlist = $(this).prop('id');
        $.ajax({
            url : '/save_player_shortlist_assignments',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player' : player,
                'shortlist_id' : shortlist,
                'which' : 'add'
            },
            dataType: 'json',
            success: function(data){
                get_players(current_shortlist);
            }
        });
        $.ajax({
            url : '/save_player_shortlist_assignments',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player' : player,
                'shortlist_id' : current_shortlist,
                'which' : 'remove'
            },
            dataType: 'json',
            success: function(data){
                get_players(current_shortlist);
            }
        });
    });

    $('#button_make_default').on('click', function() {
        var selected_shortlist = $('#shortlist_select').val();

        $.ajax({
            url : '/save_default_shortlist',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'shortlist_id' : selected_shortlist
            },
            dataType: 'json',
            success: function(data){
                $('#message_area').text('This shortlist will now be shown by default when you return to this page.');
                $('#message_area').css({'color' : 'blue'});
            }
        });
    });

    $('#shortlist_select').on('change', function() {
        clear_messages();
        current_shortlist = $(this).val();
        get_players(current_shortlist);
        if (current_shortlist == 'all') {
            $('#message_area').text('"Show All Notes" displays all players you have created a note for, regardless of which shortlist they are on (if any).');
            $('#message_area').css({'color' : 'black'});
        }
    });

    function clear_messages () {
        $('#message_area').text('');
    }
});