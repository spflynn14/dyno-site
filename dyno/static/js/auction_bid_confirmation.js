$(document).ready(function() {
    console.log('ready confirm');

    $bid_list = [];

    $('tr').each(function() {
        var temp_name = $(this).find('.auction_confirm_player').text();
        var temp_bid = $(this).find('.auction_confirm_bid').text();
        $bid_list.push({'player' : temp_name,
                        'bid' : temp_bid});
    });

    $('#confirm_bids_button').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        $('#message_text').text('Processing, please wait......');
        $.ajax({
            url: '/process_auction_bids',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/auction';
            }
        });
    });

    $('#confirm_bids_cancel_button').on('click', function() {
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        location.href = '/auction';
    });
});

