$(document).ready(function() {
    $('#draft_top_tab_dropdown').hover(function () {
        $(this).find('.dropdown-menu').hide().delay(200).fadeIn(250);
    }, function () {
        $(this).find('.dropdown-menu').fadeOut(0);
    });

    $('#league_top_tab_dropdown').hover(function () {
        $(this).find('.dropdown-menu').hide().delay(200).fadeIn(250);
    }, function () {
        $(this).find('.dropdown-menu').fadeOut(0);
    });

    $('#team_top_tab_dropdown').hover(function () {
        $(this).find('.dropdown-menu').hide().delay(200).fadeIn(250);
    }, function () {
        $(this).find('.dropdown-menu').fadeOut(0);
    });
});