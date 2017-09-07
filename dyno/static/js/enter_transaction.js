$(document).ready(function() {
    $('#process_button').on('click', function() {
        var process_list = [];
        $('.process').each(function(i, checkbox) {
            var checkbox_td = $(this).parent();
            console.log($(this).prop('checked'));
            if ($(this).prop('checked')) {
                var date = checkbox_td.next().find($("input")).val();
                var team = checkbox_td.next().next().find($("select")).val();
                var adddrop = checkbox_td.next().next().next().find($("select")).val();
                var player = checkbox_td.next().next().next().next().find($("select")).val();
                console.log(date, team, adddrop, player);
                process_list.push({
                    'date': date,
                    'team': team,
                    'adddrop': adddrop,
                    'player': player
                });
            }
        });

        $.ajax({
            url: '/process_manual_transactions',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'data1' : JSON.stringify(process_list)
            },
            dataType: 'json',
            success: function (data) {
                location.href='/commish_office';
            }
        });
    });
});