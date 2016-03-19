$(document).ready(function() {
    console.log('ready');

    $('#submit_button').on('click', function() {
        var master = [];
        $('table tbody').find('tr').each(function() {
            var date = $(this).find('.date').val();
            var trans_type = $(this).find('.trans_type').val();
            var team1 = $(this).find('.team1').val();
            var team2 = $(this).find('.team2').val();
            var player_id = $(this).find('.player_id').val();
            master.push({'date': date, 'trans_type': trans_type, 'team1': team1, 'team2' : team2, 'player_id' : player_id})
        });
        console.log(master);
        $.each(master, function(index, value) {
            $.ajax({
                url: '/save_old_transactions',
                type: 'POST',
                data: {
                    csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                    'date' : value.date,
                    'trans_type' : value.trans_type,
                    'team1' : value.team1,
                    'team2' : value.team2,
                    'player_id' : value.player_id
                },
                dataType: 'json',
                success: function (data) {
                    location.href='/batch';
                }
            });
        });
    });
});
