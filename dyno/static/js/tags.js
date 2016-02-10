$(document).ready(function() {
    console.log('ready');

    $('table').tablesorter();

    $('#submit_waiver_extension').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        var player = $('#waiver_extension_select').val();
        var value = '';
        $('.tags_name_cell').each(function() {
            if ($(this).text() == player) {
                value = $(this).next().next().next().text();
            }
        });

        $.ajax({
            url: '/store_tags_selected_player',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player' : player,
                'type' : 'waiver extension',
                'value' : value
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/team/confirm_tags';
            }
        });
    });

    $('#submit_franchise_tag').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        var player = $('#franchise_tag_select').val();
        var value = '';
        $('.tags_name_cell').each(function() {
            if ($(this).text() == player) {
                value = $(this).next().next().next().next().text();
            }
        });

        $.ajax({
            url: '/store_tags_selected_player',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player' : player,
                'type' : 'franchise tag',
                'value' : value
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/team/confirm_tags';
            }
        });
    });

    $('#submit_transition_tag').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        var player = $('#transition_tag_select').val();
        var value = '';
        $('.tags_name_cell').each(function() {
            if ($(this).text() == player) {
                value = $(this).next().next().next().next().next().text();
            }
        });

        $.ajax({
            url: '/store_tags_selected_player',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player' : player,
                'type' : 'transition tag',
                'value' : value
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/team/confirm_tags';
            }
        });
    });
});