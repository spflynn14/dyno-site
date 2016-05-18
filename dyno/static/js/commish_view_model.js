$(document).ready(function() {
    console.log('ready');

    $('#model_table').tablesorter();

    $('#message_text').hide();
    get_model_data();
    $('#message_text').show();

    function get_model_data () {
        $('#message_text').text('Loading.......');
        var model = $('#model_select').val();
        $.ajax({
            url: '/get_model',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'model' : model
            },
            dataType: 'json',
            success: function (data) {
                // console.log(data);
                fill_table(data);
            }
        });
    }

    function fill_table (data) {
        $('#table_header').empty();
        $('#table_body').empty();

        if (data.data.length != 0) {
            var tr = $('<tr>');
            $.each(data.column_headers, function (index, value) {
                var th = $('<th>').text(value).addClass('header_cell');
                tr.append(th);
            });
            $('#table_header').append(tr);

            $.each(data.data, function (index, value) {
                var tr = $('<tr>');
                $.each(value, function (i, v) {
                    var td = $('<td>').text(v).addClass('data_cell').prop('id', i);
                    tr.append(td);
                });
                $('#table_body').append(tr);
            });
        }

        $('#model_table').trigger('update');
        $('#message_text').text('');
    }

    $('#model_select').on('change', function() {
        get_model_data();
    });

    $(document).on('dblclick', '.data_cell', function() {
        $('#message_text').text('');
        var $cell = $(this);
        var cell_ref = $cell.prop('id');
        if (cell_ref == 0) {
            $('#message_text').text('cannot edit id......');
            return;
        }
        var input = $('<textarea>');
        var text = $(this).text();
        input.val(text);
        $(this).text('').append(input);

        input.keypress(function(e) {
            var key = e.which;
            if (key == 13) {
                text = input.val();
                input.remove();
                $cell.text(text);

                var id = $cell.parent().find('td').first().text();
                $.ajax({
                    url: '/save_model_cell',
                    type: 'POST',
                    data: {
                        csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                        'model' : $('#model_select').val(),
                        'id' : id,
                        'cell_ref' : cell_ref,
                        'cell_data' : input.val()
                    },
                    dataType: 'json',
                    success: function (data) {

                    }
                });
            }
        });
    });
});

