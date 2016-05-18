$(document).ready(function() {
    console.log('ready');

    $('#auction_default_clock_message').hide();


    $('#auction_default_clock_submit').on('click', function() {
        var temp = Number($('#auction_default_clock_input').val()) * 60;
        console.log(temp);
        $.ajax({
            url: '/save_default_auction_clock',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'auction_default_clock' : temp
            },
            dataType: 'json',
            success: function (data) {
                $('#auction_default_clock_message').text('save successful').show();
            }
        });
    });

    $(document.body).on('click', 'input[name="new_auctions-onoff"]', function() {
        var new_auctions = 99;
        if ($("input[name='new_auctions-onoff'][value='on']").prop('checked') == true) {
            console.log('new_auctions on');
            new_auctions = 1;
        } else {
            console.log('new_auctions off');
            new_auctions = 0;
        }

        $.ajax({
            url: '/save_new_auctions_switch',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'new_auctions_switch_state' : new_auctions
            },
            dataType: 'json',
            success: function (data) {
                //do nothing
            }
        });
    });

    $(document.body).on('click', 'input[name="extensions-onoff"]', function() {
        var ext_on = 99;
        if ($("input[name='extensions-onoff'][value='on']").prop('checked') == true) {
            console.log('extensions on');
            ext_on = 1;
        } else {
            console.log('extensions off');
            ext_on = 0;
        }

        $.ajax({
            url: '/save_extension_switch',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'extension_switch_state' : ext_on
            },
            dataType: 'json',
            success: function (data) {
                //do nothing
            }
        });
    });

    $(document.body).on('click', 'input[name="commish_periodic-onoff"]', function() {
        var commish_periodic_on = 99;
        if ($("input[name='commish_periodic-onoff'][value='on']").prop('checked') == true) {
            console.log('commish_periodic on');
            commish_periodic_on = 1;
        } else {
            console.log('commish_periodic off');
            commish_periodic_on = 0;
        }

        $.ajax({
            url: '/save_commish_periodic',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'commish_periodic_state' : commish_periodic_on
            },
            dataType: 'json',
            success: function (data) {
                //do nothing
            }
        });
    });

    $(document.body).on('click', 'input[name="cut_season-onoff"]', function() {
        var cut_season = 99;
        if ($("input[name='cut_season-onoff'][value='off']").prop('checked') == true) {
            console.log('cut_season offseason');
            cut_season = 0;
        } else {
            console.log('cut_season in-season');
            cut_season = 1;
        }

        $.ajax({
            url: '/save_cut_season',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'cut_season' : cut_season
            },
            dataType: 'json',
            success: function (data) {
                //do nothing
            }
        });
    });

    $(document.body).on('click', 'input[name="include_impending-onoff"]', function() {
        var include_impending = 99;
        if ($("input[name='include_impending-onoff'][value='on']").prop('checked') == true) {
            console.log('include_impending on');
            include_impending = 1;
        } else {
            console.log('include_impending off');
            include_impending = 0;
        }

        $.ajax({
            url: '/save_include_impending_flag',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'include_impending' : include_impending
            },
            dataType: 'json',
            success: function (data) {
                //do nothing
            }
        });
    });

    $('#configure_draft').on('click', function() {
        $('#auction_default_clock_message').text('processing........').show();
        $.ajax({
            url: '/configure_draft',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value
            },
            dataType: 'json',
            success: function (data) {
                $('#auction_default_clock_message').text('done!');
            }
        });
    });
    
    $(document.body).on('click', 'input[name="draft-onoff"]', function() {
        var draft_switch = 99;
        if ($("input[name='draft-onoff'][value='on']").prop('checked') == true) {
            // console.log('include_impending on');
            draft_switch = 1;
        } else {
            // console.log('include_impending off');
            draft_switch = 0;
        }
        
        $.ajax({
            url: '/save_draft_switch_flag',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'draft_switch' : draft_switch
            },
            dataType: 'json',
            success: function (data) {
                //do nothing
            }
        });
    });
    
    $('#draft_clock_submit').on('click', function() {
        var temp = Number($('#draft_clock_input').val());
        console.log(temp);
        $.ajax({
            url: '/save_default_draft_clock',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'default_draft_clock' : temp
            },
            dataType: 'json',
            success: function (data) {
                $('#auction_default_clock_message').text('save successful').show();
            }
        });
    });
    
    $('#clock_end_submit').on('click', function() {
        var temp = Number($('#clock_end_input').val());
        console.log(temp);
        $.ajax({
            url: '/save_draft_clock_end',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'draft_clock_end' : temp
            },
            dataType: 'json',
            success: function (data) {
                $('#auction_default_clock_message').text('save successful').show();
            }
        });
    });
    
    function save_clock_suspension () {
        var start = $('#clock_suspend_start').val();
        var end = $('#clock_suspend_end').val();
        console.log(start, end);
        $.ajax({
            url: '/save_clock_suspension',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'start' : start,
                'end' : end
            },
            dataType: 'json',
            success: function (data) {
            }
        });
    }
    
    $('#clock_suspend_start').on('change', function() {
        save_clock_suspension();
    });
    
    $('#clock_suspend_end').on('change', function() {
        save_clock_suspension();
    });

    $('#skip_to_pick_submit').on('click', function() {
        var temp = Number($('#skip_to_pick_input').val());
        console.log(temp);
        $.ajax({
            url: '/skip_to_pick',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'pick' : temp
            },
            dataType: 'json',
            success: function (data) {
                $('#auction_default_clock_message').text('DONE!').show();
            }
        });
    });
});