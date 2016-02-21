$(document).ready(function() {
    console.log('ready 2');

    $('#trans_trade_proceed_button').hide();

    var $master = {};
    $('#vw_1').find('tr').each(function() {
        $master = {'date': $(this).find('#vw_1-1').text(),
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
            'iso_date': $(this).find('#vw_1-14').text(),
            'id': $(this).find('#vw_1-15').text()};
        $(this).remove();
    });

    function retrieve_trade_info_post_submit () {
        $.ajax({
            url: '/retrieve_ownership_info_trade_transaction',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'trade_id' : $master.var_i1
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);

                $.each(data.team1_players, function(index, value) {
                    var tr = $('<tr>');
                    var td1 = $('<td>');
                    var td2 = $('<td>');
                    td1.text(value.player);
                    td2.text(value.owner);
                    td1.appendTo(tr);
                    td2.appendTo(tr);
                    tr.appendTo('#pro_team_results_body');
                });
                $.each(data.team1_picks, function(index, value) {
                    var tr = $('<tr>');
                    var td1 = $('<td>');
                    var td2 = $('<td>');
                    td1.text(value.pick);
                    td2.text(value.owner);
                    td1.appendTo(tr);
                    td2.appendTo(tr);
                    tr.appendTo('#pro_team_results_body');
                });
                $.each(data.team1_assets, function(index, value) {
                    var tr = $('<tr>');
                    var td1 = $('<td>');
                    var td2 = $('<td>');
                    td1.text(value.asset);
                    td2.text(value.owner);
                    td1.appendTo(tr);
                    td2.appendTo(tr);
                    tr.appendTo('#pro_team_results_body');
                });
                var tr = $('<tr>');
                var td1 = $('<td>');
                td1.text('Cap Pen: ' + data.team1_cap_pen[0] + ', ' + data.team1_cap_pen[1] + ', ' + data.team1_cap_pen[2] + ', ' + data.team1_cap_pen[3] + ', ' + data.team1_cap_pen[4]);
                td1.appendTo(tr);
                tr.appendTo('#pro_team_results_body');
                
                $.each(data.team2_players, function(index, value) {
                    var tr = $('<tr>');
                    var td1 = $('<td>');
                    var td2 = $('<td>');
                    td1.text(value.player);
                    td2.text(value.owner);
                    td1.appendTo(tr);
                    td2.appendTo(tr);
                    tr.appendTo('#opp_team_results_body');
                });
                $.each(data.team2_picks, function(index, value) {
                    var tr = $('<tr>');
                    var td1 = $('<td>');
                    var td2 = $('<td>');
                    td1.text(value.pick);
                    td2.text(value.owner);
                    td1.appendTo(tr);
                    td2.appendTo(tr);
                    tr.appendTo('#opp_team_results_body');
                });
                $.each(data.team2_assets, function(index, value) {
                    var tr = $('<tr>');
                    var td1 = $('<td>');
                    var td2 = $('<td>');
                    td1.text(value.asset);
                    td2.text(value.owner);
                    td1.appendTo(tr);
                    td2.appendTo(tr);
                    tr.appendTo('#opp_team_results_body');
                });
                var tr = $('<tr>');
                var td1 = $('<td>');
                td1.text('Cap Pen: ' + data.team2_cap_pen[0] + ', ' + data.team2_cap_pen[1] + ', ' + data.team2_cap_pen[2] + ', ' + data.team2_cap_pen[3] + ', ' + data.team2_cap_pen[4]);
                td1.appendTo(tr);
                tr.appendTo('#opp_team_results_body');
            }
        });
    }

    $('#trans_trade_submit_button').on('click', function() {
        $.ajax({
            url: '/save_transaction_trade',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'trade_id' : $master.var_i1,
                'trans_id' : $master.id
            },
            dataType: 'json',
            success: function (data) {
                $('#trans_trade_proceed_button').show();
                $('#trans_trade_submit_button').hide();
                retrieve_trade_info_post_submit();
            }
        });
    });

    $('#trans_trade_proceed_button').on('click', function() {
        location.href = '/commish/pending_transactions';
    });
});