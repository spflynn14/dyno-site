$(document).ready(function() {
    var $team_name = $('#vw_1').find('p').text();
    $('#vw_1').remove();
    var $user_email = $('#vw_2').find('p').text();
    $('#vw_2').remove();

    var filters_list = [];
    $('.display_filter_checkbox').each(function() {
        if ($(this).prop('checked') == true) {
            filters_list.push($(this).val());
        }
    });

    var account_details_hidden = true;
    $('#account_balance_details_div').hide();

    $('#team_name_input').val($team_name);
    $('#email_input').val($user_email);


    function save_filters () {
        console.log('triggered');
        var filters_text = '';
        $.each(filters_list, function(index, value) {
            var t = value.toString();
            filters_text = filters_text + t + ',';
        });

        $.ajax({
            url : '/save_team_settings_player_filters',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value, 'tags_to_filter' : filters_text},
            dataType: 'json',
            success: function(data){
                //do nothing
            }
        });
    }



    $('#go_to_change_password_button').click(function() {
        window.location.href = '/user_change_password';
    });

    $('#team_settings_save_changes').click(function() {
        var $new_team_name = $('#team_name_input').val();
        var $new_email = $('#email_input').val();
        $.ajax({
            url : '/change_team_settings',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value, 'new_team_name': $new_team_name, 'new_email': $new_email},
            dataType: 'json',
            success: function(data){
                console.log(data);
                $('#team_settings_message').text('Changes Saved!')
            },
            error: function(data) {
                console.log(data);
            }
        });
    });

    $('#show_hide_account_details').on('click', function() {
        if (account_details_hidden == true) {
            $('#account_balance_details_div').show();
            account_details_hidden = false;
        } else {
            $('#account_balance_details_div').hide();
            account_details_hidden = true;
        }
    });

    $(document.body).on('click', '.display_filter_checkbox', function() {
        if ($.inArray($(this).val(), filters_list) > -1) {
            var i = ($(this).val());
            var temp_list = [];
            $.each(filters_list, function(index, value) {
                if (value != i) {
                    temp_list.push(value);
                }
            });
            filters_list = temp_list;
        } else {
            filters_list.push($(this).val());
        }
        save_filters();
    });
});