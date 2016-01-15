$(document).ready(function() {
    console.log('ready');

    $('#slider-range').slider({
        orientation: 'vertical',
        min: 0,
        max: 100,
        value: 0
    }).css('background', 'red');

    $('#spinner').spinner({
        min: 0,
        max: 5,
        step: 0.05,
        stop: function(event, ui) {
            $('#spinner').val($('#spinner').val());
        }
    });

    $('.ui-slider-handle').css('cursor', 'pointer');

    //$('#slider_value').text('$1.00');

    $('#slider-range').on('slide', function(event, ui) {
        $('#spinner').val(((ui.value)/20).toFixed(2));
    });

    $('#spinner').on('spin', function(event, ui) {
        $('#slider-range').slider('value', ui.value*20);
    });

    $('#freeze_button').mousedown(function(e) {
        if ($('#slider-range').slider('option', 'disabled')) {
            $('#slider-range').slider('enable', true);
            $('#slider-range').fadeTo('fast', 1);
            $('#spinner').spinner('enable', true);
        } else {
            $('#slider-range').slider('disable', true);
            $('#slider-range').fadeTo('fast', 0.35);
            $('#spinner').spinner('disable', true);
        }
    })
});