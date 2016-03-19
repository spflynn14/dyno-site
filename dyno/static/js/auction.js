$(document).ready(function() {
    console.log('ready 3');

    $(".active_auctions_datagrid table").tablesorter();

    var $auction_timeouts = [];
    $('#vw_1').find('p').each(function() {
        $auction_timeouts.push(Number($(this).text()));
        $(this).remove();
    });

    var dup_players_hidden = true;
    $('#dup_players_list').hide();

    var new_auction_area_hidden = true;
    $('#new_auction_interactive').hide();

    var total_auctions = 0;
    $('#active_auctions_body').find($('tr')).each(function() {
        total_auctions = total_auctions + 1;
    });

    var $auction_times = [];

    for (i = 0; i < total_auctions; i++) {
        var t = '#auction_time_left' + i;
        var temp1 = $(t).text();
        var temp2 = new Date(Date.parse(temp1, 'MMM dd, yyyy, hh:mm a'));
        $auction_times.push(temp2);
    }

    var now = new Date($.now());
    var diff = (now - $auction_times[0]) / 1000;
    var diff_min = diff / 60;

    update_time_fields();

    function update_time_fields () {
        //change time remaining fields to minutes left
        for (i = 0; i < total_auctions; i++) {
            var t = '#auction_time_left' + i;
            var now = new Date($.now());
            var diff_min = ((now - $auction_times[i]) / 1000) / 60;
            var total_diff = $auction_timeouts[i] - diff_min;
            var converted_time_text = convert_time(total_diff);
            $(t).text(converted_time_text);
            if (converted_time_text == 'Auction has ended - system is processing...') {
                $(t).next().next().find('.auction_input_textbox').val('').prop('disabled', true);
            }
        }
    }


    function convert_time (data) {
        if (data >= 1440) {
            var hours = Math.floor((data / 60));
            var days = Math.floor((hours / 24));
            hours = hours - (days * 24);
            var min = Math.floor((data - (hours * 60) - (days * 60 * 24)));
            return days + ' days, ' + hours + ' hours, ' + min + ' minutes';
        } else if (data > 60) {
            var hours = Math.floor((data / 60));
            var min = Math.floor(data - (hours * 60));
            return hours + ' hours, ' + min + ' minutes';
        } else if (data >= 2) {
            return Math.floor(data) + ' minutes';
        } else if (data >= 1) {
            return Math.floor(data) + ' minute';
        } else if (data >= 0) {
            return 'less than a minute...'
        } else {
            return 'Auction has ended - system is processing...'
        }
    }

    function pull_data_from_auction_table () {
        var found_data = false;
        var auction_json = [];
        for (i = 0; i < total_auctions; i++) {
            var t = '#auction_player' + i;
            var player = $(t).text();
            t = '#bid_input_text' + i;
            var bid = $(t).val();
            if (bid.charAt(0) == '$') {
                bid = bid.slice(1, bid.length);
            }
            if (bid != '') {
                found_data = true;
            }
            if ($.isNumeric(Number(bid)) == false) {
                return 'no data';
            }
            auction_json.push({'name' : player,
                                'bid' : bid});
        }
        if (found_data == false) {
            auction_json = 'no data';
        }
        return auction_json;
    }


    $('#show_hide_dup_players').on('click', function() {
        if (dup_players_hidden == true) {
            $('#dup_players_list').show();
            dup_players_hidden = false;
        } else {
            $('#dup_players_list').hide();
            dup_players_hidden = true;
        }
    });

    $('#show_hide_new_auction').on('click', function() {
        if (new_auction_area_hidden == true) {
            $('#new_auction_interactive').show();
            new_auction_area_hidden = false;
        } else {
            $('#new_auction_interactive').hide();
            new_auction_area_hidden = true;
        }
    });

    $('#add_new_auction_button').on('click', function() {
        var player = $('#new_auction_player_select').val();

        var found_data = false;
        var bid = $('#new_auction_proxy_bid').val();
        if (bid.charAt(0) == '$') {
            bid = bid.slice(1, bid.length);
        }
        if (bid != '') {
            found_data = true;
        }
        if ($.isNumeric(Number(bid)) == false) {
            found_data = false;
        } else if (Number(bid) < 1) {
            found_data = false;
        }

        if (found_data == false) {
            $('#new_auction_proxy_bid').val('');
            return;
        }

        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        $.ajax({
            url: '/get_new_auction_data',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player' : player,
                'bid' : bid
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/auction_bid_confirmation';
            }
        });
    });

    $('#submit_auction_bids_button').on('click', function() {
        var auction_data = pull_data_from_auction_table();
        if (auction_data == 'no data') {
            return;
        }
        $('button').prop('disabled', true);
        $('input').prop('disabled', true);
        $.ajax({
            url: '/get_existing_auction_data',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'auction_data' : auction_data,
                'total_auctions' : total_auctions
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/auction_bid_confirmation';
            }
        });
    });



    window.setInterval(function() {
        update_time_fields();
    }, 10000);
});

