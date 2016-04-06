$(document).ready(function() {
    console.log('ready');
    
    add_action_button();

    $("#rookie_pool_table").tablesorter();

    $('#check_uncheck_all').on('click', function() {
        var state = $(this).prop('checked');
        if (state == true) {
            $('.add_checkbox').each(function() {
                $(this).prop('checked', true);
            });
        } else {
            $('.add_checkbox').each(function() {
                $(this).prop('checked', false);
            });
        }
    });

    $('.add_checkbox').on('click', function() {
        var state = $(this).prop('checked');
        if (state == false) {
            $('#check_uncheck_all').prop('checked', false);
        }
    });
    
    function add_action_button() {
        var shortlists = [];
        $('#vw_2 p').each(function() {
            var id = $(this).prop('id');
            var title = $(this).text();
            shortlists.push({'id' : id,
                            'title' : title})
        });
        $('#vw_2').remove();
        
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

        var new_add_li = $('<li>').addClass('dropdown').addClass('dropdown-submenu').addClass('action_dropdown');
        var new_add_header = $('<div>').attr('data-toggle', 'dropdown').addClass('dropdown-toggle');
        new_add_header.text('Add Selected to Shortlist').css({'padding-left' : '6px', 'color' : 'black'});
        new_add_header.append($('<i>').addClass('glyphicon').addClass('glyphicon-chevron-right').css({'color' : '#555555', 'float' : 'right', 'margin-right' : '5px'}));
        var new_add_ul = $('<ul>').addClass('dropdown-menu').css({'top' : neg_shortlists.toString() + 'px'});

        $.each(shortlists, function(i, d) {
            var li1 = $('<li>').prop('id', d.id).text(d.title).addClass('action_li').addClass('add_to_shortlist_action');
            new_add_ul.append(li1);
        });

        new_add_li.append(new_add_header).append(new_add_ul);

        top_ul.append(new_add_li);

        action_dropdown.append(actions_header).append(top_ul);
        $('#action_cell').append(action_dropdown);
    }

    $(document).on('click', '.add_to_shortlist_action', function() {
        var shortlist = $(this).prop('id');
        var player_list = [];

        $('.add_checkbox').each(function() {
            if ($(this).prop('checked')) {
                var name = $(this).parent().prev().prev().prev().prev().text();
                player_list.push(name);
            }
        });
        // console.log(player_list);

        $.ajax({
            url : '/save_player_shortlist_assignments_batch',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'players' : player_list,
                'shortlist_id' : shortlist,
                'which' : 'add'
            },
            dataType: 'json',
            success: function(data){
                $('.add_checkbox').each(function() {
                    $(this).prop('checked', false);
                });
                $('#check_uncheck_all').prop('checked', false);
            }
        });
    });
});