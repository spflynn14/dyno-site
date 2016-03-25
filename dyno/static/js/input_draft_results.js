$(document).ready(function() {
    console.log('ready');

    $('#submit_button').on('click', function() {
        var master = [];
        $('table tbody').find('tr').each(function() {
            var $first_cell = $(this).find('td');
            var overall = $first_cell.find('input').val();
            var pick = $first_cell.next().find('input').val();
            var team = $first_cell.next().next().find('input').val();
            var player_id = $(this).find('.player').val();
            var manual_player = $first_cell.next().next().next().next().find('input').val();
            if (team.length != 0) {
                master.push({'pick': pick, 'team': team, 'player_id': player_id, 'overall' : overall, 'manual_player' : manual_player})
            }
        });
        console.log(master);
        var draft_date = $('#draft_date').val();
        $.each(master, function(index, value) {
            $.ajax({
                url: '/save_draft_input',
                type: 'POST',
                data: {
                    csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                    'pick' : value.pick,
                    'team' : value.team,
                    'player_id' : value.player_id,
                    'overall' : value.overall,
                    'manual_player' : value.manual_player,
                    'draft_date' : draft_date
                },
                dataType: 'json',
                success: function (data) {
                    location.href = '/batch';
                }
            });
        });
    });
});