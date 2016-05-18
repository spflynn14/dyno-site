$(document).ready(function() {
    console.log('ready');

    var draft_picks = [];
    $.ajax({
        url : '/future_draft_pick_data_pull',
        type: "POST",
        data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value
        },
        dataType: 'json',
        success: function(data){
            draft_picks = JSON.parse(data.draft_picks);
            // console.log(draft_picks);
            fill_table(draft_picks);
        }
    });

    $('#rookie_pool_table').tablesorter();

    function fill_table(data) {
        $('#future_pick_tbody').empty();

        $.each(data, function(index, value) {
            var tr = $('<tr>');
            var td_year = $('<td>');
            var td_pick = $('<td>');
            var td_team = $('<td>');

            td_year.text(value.fields.year);
            if (value.fields.round == '1') {
                if (value.fields.original_owner != value.fields.owner) {
                    td_pick.text('1st round pick (' + value.fields.original_owner + ')');
                } else {
                    td_pick.text('1st round pick');
                }
            } else if (value.fields.round == '2') {
                if (value.fields.original_owner != value.fields.owner) {
                    td_pick.text('2nd round pick (' + value.fields.original_owner + ')');
                } else {
                    td_pick.text('2nd round pick');
                }
            } else if (value.fields.round == '3') {
                if (value.fields.original_owner != value.fields.owner) {
                    td_pick.text('3rd round pick (' + value.fields.original_owner + ')');
                } else {
                    td_pick.text('3rd round pick');
                }
            } else {
                if (value.fields.original_owner != value.fields.owner) {
                    td_pick.text(value.fields.round + 'th round pick (' + value.fields.original_owner + ')');
                } else {
                    td_pick.text(value.fields.round + 'th round pick');
                }
            }
            td_team.text(value.fields.owner);

            tr.append(td_year);
            tr.append(td_pick);
            tr.append(td_team);
            tr.appendTo('#future_pick_tbody');
        });
        $('#rookie_pool_table').trigger('update');
    }

    function filter_team (data) {
        var output = [];
        var team_selected = $('#team_select').val();

        if (team_selected == 'All') {
            return data;
        }

        $.each(data, function(index, value) {
            if (value.fields.owner == team_selected) {
                output.push(value);
            }
        });

        return output;
    }

    function filter_year (data) {
        var output = [];
        var year_selected = $('#year_select').val();

        if (year_selected == 'All') {
            return data;
        }

        $.each(data, function(index, value) {
            if (value.fields.year == year_selected) {
                output.push(value);
            }
        });

        return output;
    }

    $('#team_select').on('change', function() {
        var output1 = filter_team(draft_picks);
        var output2 = filter_year(output1);
        fill_table(output2);
    });

    $('#year_select').on('change', function() {
        var output1 = filter_team(draft_picks);
        var output2 = filter_year(output1);
        fill_table(output2);
    });
});
