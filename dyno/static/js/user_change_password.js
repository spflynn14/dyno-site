$(document).ready(function() {
    console.log('ready');

    $old_username = $('#change_username_text').val();

    function verify_password_change () {
        var $old_password = $('#change_password_text_old').val();
        var $new_password = $('#change_password_text_new').val();
        var $new_password_retype = $('#change_password_text_new_retype').val();
        if ($new_password != $new_password_retype) {
            $('#error_message_user_change_password').html('new passwords do not match, please try again');
            $('#change_password_text_new_retype').val('');
            $('#change_password_text_new').val('');
        } else {
            $.ajax({
                url : '/verify_password_change',
                type: "POST",
                data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value, 'old_password': $old_password, 'new_password': $new_password},
                dataType: 'json',
                success: function(data){
                    if (data == false) {
                        $('#error_message_user_change_password').html('current password entered is incorrect, try again');
                        $('#change_password_text_old').val('');
                        $('#change_password_text_new').val('');
                        $('#change_password_text_new_retype').val('');
                    } else {
                        window.location.href = '/login';
                    }
                },
                error: function(data) {
                    console.log(data);
                }
            });
        }

    }

    function verify_username_change () {
        var $new_username = $('#change_username_text').val();
        $('#change_username_wait_message').text('making changes, please wait...');
        $.ajax({
            url : '/verify_username_change',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value, 'old_username': $old_username, 'new_username': $new_username},
            dataType: 'json',
            success: function(data){
                window.location.href = '/team/team_settings';
            },
            error: function(data) {
                console.log(data);
            }
        });
    }



    $('#change_password_submit').click(function() {
        verify_password_change();
    });

    $('#change_password_text_new').keypress(function (e) {
        if (e.keyCode == 13) {
            verify_password_change();
        }
    });

    $('#change_username_submit').click(function() {
        verify_username_change();
    });

    $('#change_username_text').keypress(function (e) {
        if (e.keyCode == 13) {
            verify_username_change();
        }
    });
});