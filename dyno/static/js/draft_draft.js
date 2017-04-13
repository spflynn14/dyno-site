$(document).ready(function() {
    console.log('ready 3');

    var draft_switch = '';
    var draft_clock_end = '';
    var on_clock = '';
    var current_user = '';
    var rookie_info = [];
    var current_pick = '';
    $.ajax({
        url : '/draft_data_pull',
        type: "POST",
        data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value
        },
        dataType: 'json',
        success: function(data){
            draft_switch = data.draft_switch;
            draft_clock_end = data.draft_clock_end;
            on_clock = data.on_clock;
            current_user = data.current_user;
            rookie_info = data.rookie_info;
            current_pick = data.pick_on_clock;
            // console.log(draft_switch, draft_clock_end, on_clock, current_pick);
            // console.log(rookie_info);

            enable_draft_player_button();
            set_clock();
            apply_rookie_info();
        }
    });

    function apply_rookie_info () {
        $('#draft_tbody tr').each(function(index, value) {
            var row = $(this);
            var ps = $(this).find('#player_selected').text();
            var td_position = $('<td>');
            var td_college = $('<td>');
            var td_nflteam = $('<td>');
            $.each(rookie_info, function(i, v) {
                if (v.player == ps) {
                    td_position.text(v.pos);
                    td_college.text(v.college);
                    td_nflteam.text(v.nfl_team);
                }
            });
            row.append(td_position).append(td_college).append(td_nflteam);
        });
    }

    function enable_draft_player_button () {
        if (draft_switch == '0') {
            $('#draft_player_button').prop('disabled', true).fadeTo('fast', 0.5);
        } else {
            if (current_user == on_clock) {
                $('#draft_player_button').prop('disabled', false).fadeTo('fast', 1.0);
            } else {
                $('#draft_player_button').prop('disabled', true).fadeTo('fast', 0.5);
            }
        }
    }

    function set_clock () {
        if (draft_switch == '0') {
            $('#clock_display_all').hide();
        } else {
            $('#clock_display_all').show();
            var now = new Date($.now());
            // console.log(draft_clock_end);
            var clock_end = new Date(draft_clock_end);
            var diff = (clock_end - now) / 1000;
            var diff_min = diff / 60;
            var hours = Math.floor((diff_min / 60));
            var min = Math.floor((diff_min - (hours * 60)));
            // console.log(now, clock_end, diff, diff_min, hours, min);
            if (hours >= 10) {
                $('#draft_clock_hours').text(hours);
            } else {
                $('#draft_clock_hours').text('0' + hours);
            }
            if (min >= 10) {
                $('#draft_clock_minutes').text(min);
            } else {
                $('#draft_clock_minutes').text('0' + min);
            }
        }
    }


    $('#draft_board_tbody td').on('click', function() {
        // console.log($(this).parent().prop('id'));
        if ($(this).parent().prop('id') == 'selected') {
            $(this).parent().prop('id', 'none');
            $(this).parent().css({'color': 'inherit'});
        } else {
            $.each($('#draft_board_tbody tr'), function() {
                $(this).prop('id', 'none');
                $(this).css({'color' : 'inherit'});
            });
            $(this).parent().prop('id', 'selected');
            $(this).parent().css({'color': '#2d99d4'});
            var id = Number($(this).parent().find('.board_player_cell').prop('id'));
            $('#manual_player_select').val(id);
            // console.log(id, $(this).parent().find('.board_player_cell').prop('id'));
        }
    });

    $('#draft_player_button').on('click', function() {
        var player_id = $('#manual_player_select').val();
        if (player_id == '_blank_') {
            return;
        }
        $(this).hide();
        $('#confirmation_div').show();

        $('#confirmation_no').on('click', function() {
            $('#confirmation_div').hide();
            $('#draft_player_button').show();
        });

        $('#confirmation_yes').on('click', function() {
            $(this).prop('disabled', true);
            $('#pending_message').show();
            $('#confirmation_div').hide();
            $('#draft_player_button').hide();
            console.log(player_id);
            $.ajax({
                url : '/process_draft_pick',
                type: "POST",
                data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value,
                    'player_id' : player_id
                },
                dataType: 'json',
                success: function(data){
                    set_clock();
                    location.reload(true);
                }
            });
        });
    });

    window.setInterval(function() {
        $.ajax({
            url : '/check_on_the_clock',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value
            },
            dataType: 'json',
            success: function(data){
                draft_clock_end = data.clock_end;
                var pick_on_clock = data.pick_on_clock;
                // console.log(pick_on_clock);
                if (pick_on_clock != current_pick) {
                    location.reload(true);
                }
            }
        });
        set_clock();
    }, 10000);
});