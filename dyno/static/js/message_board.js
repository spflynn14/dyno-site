$(document).ready(function() {
    console.log('ready 2');

    close_all_posts();
    hide_all_reply_cards();



    function close_all_posts () {
        $('.text_area').each(function() {
             $(this).hide();
        });

        $('.action_area').each(function() {
             $(this).hide();
        });

        $('.post_card').each(function() {
             $(this).css({'height' : '50px'});
        });

        $('.short_post_card').each(function() {
             $(this).css({'height' : '50px'});
        });

         $('.title_bar').each(function() {
             $(this).css({'height' : '100%'});
             $(this).prop('id', 'closed');
        });
    }

    function hide_all_reply_cards () {
        $('.short_post_card').each(function() {
             $(this).hide();
        });
    }

    function show_replies (parent_id) {
        $('.short_post_card').each(function() {
            if ($(this).find('.location_data').text() == parent_id + '.2') {
                $(this).show();
                open_post($(this));
                $(this).find('.title_bar').prop('id', 'open');
            }
        });
    }

    function add_view_count ($obj) {
        var post_id = $obj.attr('id');
        var views = Number($obj.find('#h_views_td').text().split(':')[1]);
        views = views + 1;
        $obj.find('#h_views_td').text('views: ' + views.toString());

        $.ajax({
            url: '/save_message_board_views',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'post_id' : post_id,
                'views' : views
            },
            dataType: 'json',
            success: function (data) {
                //do nothing
            }
        });
    }

    function open_post ($obj) {
        $obj.find('.text_area').show();
        $obj.find('.action_area').show();
        $obj.find('.title_bar').css({'height' : '50px'});
        $obj.css({'max-height' : '500px', 'height' : 'auto'});
        show_replies($obj.attr('id'));
    }

    function close_post ($obj) {
        $obj.find('.text_area').hide();
        $obj.find('.action_area').hide();
        $obj.find('.title_bar').css({'height' : '50px'});
        $obj.css({'height' : '50px'});
        if ($obj.find('.location_data').text() == '1') {
            hide_all_reply_cards();
        }
    }

    function new_post (title_text, field_text, post_id, reply) {
        var newpost = $('<div>').addClass('post_card_temp');
        var table = $('<table>').css({'table-layout' : 'fixed', 'width' : '95%'});
        var tr1 = $('<tr>').css({'height' : '40px', 'vertical-align' : 'middle'});
        var tr2 = $('<tr>').css({'height' : '400px', 'vertical-align' : 'top'});
        var tr3 = $('<tr>').css({'height' : '40px', 'vertical-align' : 'middle'});
        var title_label = $('<th>').text('Title').css({'width' : '5%'});
        var post_label = $('<th>').text('Post');
        var title_td = $('<td>').css({'width' : '95%'});
        var post_td = $('<td>');
        var blank_td = $('<td>');
        var buttons_td = $('<td>');

        var title_field = $('<textarea>').css({'border-radius' : '8px', 'width' : '50%', 'border' : '1px solid blue'}).prop('rows', '1').prop('maxlength', '60');
        var text_field = $('<textarea>').css({'border-radius' : '8px', 'height' : '100%', 'width' : '100%', 'border' : '1px solid blue'});

        title_field.val(title_text);
        text_field.val(field_text);

        title_td.append(title_field);
        post_td.append(text_field);

        var submit_button = $('<button>').addClass('submit_post').text('Post').css({'margin-left' : '30px', 'width' : '75px'});
        var cancel_button = $('<button>').addClass('cancel_post').text('Cancel').css({'width' : '75px'});

        buttons_td.append(cancel_button).append(submit_button);

        tr1.append(title_label);
        tr1.append(title_td);
        tr2.append(post_label);
        tr2.append(post_td);
        tr3.append(blank_td);
        tr3.append(buttons_td);
        table.append(tr1);
        table.append(tr2);
        table.append(tr3);
        newpost.append(table);

        if (reply == 'no') {
            newpost.insertBefore('#message_board_area');
        } else {
            newpost.css({'margin-left' : '5%', 'width' : '90%'});
            open_post(reply);
            newpost.insertAfter(reply);
            $('html, body').animate({
                scrollTop: newpost.offset().top - 200
            }, 2000);
        }

        cancel_button.on('click', function() {
            newpost.remove();
            $('#create_new_post_button').show();
        });

        submit_button.on('click', function() {
            $('button').prop('disabled', true);
            newpost.removeClass('post_card_temp').addClass('post_card');
            var out_post = 'yes';
            if (reply == 'no') {
                out_post = 'no';
            }
            buttons_td.text('processing your post, just a second.....').css({'color' : 'blue'});
            $.ajax({
                url: '/create_message_board_post',
                type: 'POST',
                data: {
                    csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                    'title' : title_field.val(),
                    'post' : text_field.val(),
                    'id' : post_id,
                    'is_reply' : out_post
                },
                dataType: 'json',
                success: function (data) {
                    location.reload();
                }
            });
        });
    }

    $(document).on('click', '.title_bar', function() {
        if ($(this).parent().attr('class') == 'short_post_card') {
            if ($(this).prop('id') == 'closed') {
                open_post($(this).parent());
                $(this).prop('id', 'open');
            } else {
                $(this).prop('id', 'closed');
                close_post($(this).parent());
            }
        } else {
            if ($(this).prop('id') == 'closed') {
                close_all_posts();
                hide_all_reply_cards();
                open_post($(this).parent());
                $(this).prop('id', 'open');
                add_view_count($(this).parent());
            } else {
                hide_all_reply_cards();
                $(this).prop('id', 'closed');
                close_post($(this).parent());
            }
        }
    });

    $('#create_new_post_button').on('click', function() {
        $(this).hide();
        close_all_posts();
        new_post('', '', 'none', 'no');
    });

    $(document).on('click', '.edit_post', function() {
        $('#create_new_post_button').hide();
        close_all_posts();

        var title = $(this).parent().parent().find('#h_title_td').text();
        var text = $(this).parent().parent().find('.text_area').html().trim();
        text = text.replace(/<p>/g, '');
        text = text.replace(/(<\/p>)/g, '').trim();
        var post_id = $(this).parent().parent().attr('id');

        new_post(title, text, post_id, 'no');
    });

    $(document).on('click', '.reply_to_post', function() {
        $('#create_new_post_button').hide();
        close_all_posts();

        var post_id = $(this).parent().parent().attr('id');
        new_post('', '', post_id, $(this).parent().parent());
    });

    $(document).on('click', '.favorite_post', function() {
        var action = '';
        var temp = $(this).find('i').attr('id');
        if (temp == 'red') {
            $(this).parent().parent().css({'border' : '2px solid #cdcdcd'});
            $(this).find('i').css('color', 'black').attr('id', 'black');
            action = 'remove';
        } else {
            $(this).parent().parent().css({'border' : '2px solid #cd0000'});
            $(this).find('i').css('color', 'red').attr('id', 'red');
            action = 'add';
        }

        var post_id = $(this).parent().parent().attr('id');

        $.ajax({
            url: '/save_message_board_favs',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'post_id' : post_id,
                'action' : action
            },
            dataType: 'json',
            success: function (data) {
                //do nothing
            }
        });
    });

    $(document).on('click', '.sticky_post', function() {
        var action = '';
        var temp = $(this).find('i').attr('id');
        if (temp == 'gold') {
            $(this).parent().parent().css({'border' : '2px solid #cdcdcd'});
            $(this).find('i').css('color', 'black').attr('id', 'black');
            action = 'remove';
        } else {
            $(this).parent().parent().css({'border' : '2px solid goldenrod'});
            $(this).find('i').css('color', 'gold').attr('id', 'gold');
            action = 'add';
        }

        var post_id = $(this).parent().parent().attr('id');

        $.ajax({
            url: '/save_message_board_stickys',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'post_id' : post_id,
                'action' : action
            },
            dataType: 'json',
            success: function (data) {
                //do nothing
            }
        });
    });
});
