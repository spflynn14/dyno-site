$(document).ready(function() {
    console.log('ready 4');

    close_card($('#notes_card'));
    close_card($('#trans_history_card'));
    //close_card($('#contract_card'));
    close_card($('#current_stats'));
    close_card($('#career_stats'));
    $('.player_card').hide();

    var team_list = [];
    $('#vw_1').find('p').each(function() {
        team_list.push($(this).text());
        $(this).remove();
    });

    var year_list = [];
    $('#vw_2').find('p').each(function() {
        year_list.push($(this).text());
        $(this).remove();
    });

    var $player_selected = '';

    var cap_hit_yr1 = 0;
    var cap_hit_yr2 = 0;
    var cap_hit_yr3 = 0;
    var cap_hit_yr4 = 0;
    var cap_hit_yr5 = 0;

    var $total = 0;
    var $sb = 0;
    var $sal = 0;
    var $years_remaining = 0;

    var $num_sliders_disabled = 0;

    var $avail_sliders = 5;

    var $bottom_table_data = {'yr1_costs' : 0,
                            'yr2_costs' : 0,
                            'yr3_costs' : 0,
                            'yr4_costs' : 0,
                            'yr5_costs' : 0,
                            'yr1_pen' : 0,
                            'yr2_pen' : 0,
                            'yr3_pen' : 0,
                            'yr4_pen' : 0,
                            'yr5_pen' : 0,
                            'yr1_guar' : 0,
                            'yr2_guar' : 0,
                            'yr3_guar' : 0,
                            'yr4_guar' : 0,
                            'yr5_guar' : 0,
                            'yr1_space' : 0,
                            'yr2_space' : 0,
                            'yr3_space' : 0,
                            'yr4_space' : 0,
                            'yr5_space' : 0,
                            'yr1_total_cost' : 0,
                            'yr2_total_cost' : 0,
                            'yr3_total_cost' : 0,
                            'yr4_total_cost' : 0,
                            'yr5_total_cost' : 0
    };

    var $t = [];
    $('option').each(function() {
        $t.push($(this).val());
        });

    $('#player_interaction_area').hide();

    function open_card ($obj) {
        $obj.find('.text_area').show();
    }

    function close_card ($obj) {
        $obj.find('.text_area').hide();
    }

    function close_all_cards () {
        $('#contract_card').find('.title_bar').prop('id', 'closed');
        $('#contract_card').find('.text_area').hide();
        $('#trans_history_card').find('.title_bar').prop('id', 'closed');
        $('#trans_history_card').find('.text_area').hide();
        $('#notes_card').find('.title_bar').prop('id', 'closed');
        $('#notes_card').find('.text_area').hide();
        $('#current_stats').find('.title_bar').prop('id', 'closed');
        $('#current_stats').find('.text_area').hide();
        $('#career_stats').find('.title_bar').prop('id', 'closed');
        $('#career_stats').find('.text_area').hide();
    }

    $(document).on('click', '.title_bar', function() {
        if ($(this).prop('id') == 'closed') {
            close_all_cards();
            open_card($(this).parent());
            $(this).prop('id', 'open');
        } else {
            $(this).prop('id', 'closed');
            close_card($(this).parent());
        }
    });

    function fill_career_stats_defense (data) {
        $('#career_stats_tbody').empty();
        $('#career_stats_thead').empty();

        var tr0 = $('<tr>');
        var tr1 = $('<tr>');
        var th_year = $('<th>').text('Year');
        var th_ppg = $('<th>').text('Pts/Gm');
        var td_total_yds = $('<th>').text('Yds/Gm');
        var th_rushes = $('<th>').text('Total Att').addClass('border_stat');
        var th_rush_yds = $('<th>').text('Yds/Gm');
        var th_passes = $('<th>').text('Total Att').addClass('border_stat');
        var th_pass_yds = $('<th>').text('Yds/Gm');
        var th_to = $('<th>').text('Total').addClass('border_stat');
        var th_fumbles = $('<th>').text('FR');
        var th_int = $('<th>').text('INT');
        var th_blank1 = $('<th>').prop('colspan', '3');
        var th_group_rush = $('<th>').text('Rushing').prop('colspan', '2').addClass('border_stat');
        var th_group_pass = $('<th>').text('Passing').prop('colspan', '2').addClass('border_stat');
        var th_group_to = $('<th>').text('Turnovers').prop('colspan', '3').addClass('border_stat');

        tr0.append(th_blank1);
        tr0.append(th_group_rush);
        tr0.append(th_group_pass);
        tr0.append(th_group_to);

        tr1.append(th_year);
        tr1.append(th_ppg);
        tr1.append(td_total_yds);
        tr1.append(th_rushes);
        tr1.append(th_rush_yds);
        tr1.append(th_passes);
        tr1.append(th_pass_yds);
        tr1.append(th_to);
        tr1.append(th_fumbles);
        tr1.append(th_int);

        tr0.appendTo('#career_stats_thead');
        tr1.appendTo('#career_stats_thead');
        
        $.each(data, function(index, value) {
            //console.log(value);
            var tr = $('<tr>');
            var td_year = $('<td>');
            var td_ppg = $('<td>');
            var td_total_yds = $('<td>');
            var td_rushes = $('<td>').addClass('border_stat');
            var td_rush_yds = $('<td>');
            var td_passes = $('<td>').addClass('border_stat');
            var td_pass_yds = $('<td>');
            var td_to = $('<td>').addClass('border_stat');
            var td_fumbles = $('<td>');
            var td_int = $('<td>');

            td_year.text(value.fields.year);
            var ppg = Number(value.fields.pts_allowed) / 16;
            td_ppg.text(ppg.toFixed(1));
            var ypg = Number(value.fields.total_yds_allowed) / 16;
            td_total_yds.text(ypg.toFixed(1));
            td_rushes.text(value.fields.rushes_against);
            var rypg = Number(value.fields.rush_yds_allowed) / 16;
            td_rush_yds.text(rypg.toFixed(1));
            td_passes.text(value.fields.passes_against);
            var pypg = Number(value.fields.pass_yds_allowed) / 16;
            td_pass_yds.text(pypg.toFixed(1));
            var to = Number(value.fields.fumbles) + Number(value.fields.int);
            td_to.text(to);
            td_fumbles.text(value.fields.fumbles);
            td_int.text(value.fields.int);

            tr.append(td_year);
            tr.append(td_ppg);
            tr.append(td_total_yds);
            tr.append(td_rushes);
            tr.append(td_rush_yds);
            tr.append(td_passes);
            tr.append(td_pass_yds);
            tr.append(td_to);
            tr.append(td_fumbles);
            tr.append(td_int);

            tr.appendTo('#career_stats_tbody');
        });
    }

    function fill_career_stats_kicker (data) {
        $('#career_stats_tbody').empty();
        $('#career_stats_thead').empty();

        var tr0 = $('<tr>');
        var tr1 = $('<tr>');
        var th_year = $('<th>').text('Year');
        var th_team = $('<th>').text('Team');
        var th_g = $('<th>').text('G');
        var th_fgm = $('<th>').text('FGM').addClass('border_stat');
        var th_fga = $('<th>').text('FGA');
        var th_fgpercent = $('<th>').text('FG%');
        var th_fgm40 = $('<th>').text('FGM').addClass('border_stat');
        var th_fga40 = $('<th>').text('FGA');
        var th_fgpercent40 = $('<th>').text('FG%');
        var th_fgm50 = $('<th>').text('FGM').addClass('border_stat');
        var th_fga50 = $('<th>').text('FGA');
        var th_fgpercent50 = $('<th>').text('FG%');
        var th_xpm = $('<th>').text('XPM').addClass('border_stat');
        var th_xpa = $('<th>').text('XPA');
        var th_xppercent = $('<th>').text('XP%');
        var th_blank1 = $('<th>').prop('colspan', '3');
        var th_group_all = $('<th>').text('All').prop('colspan', '3').addClass('border_stat');
        var th_group_40 = $('<th>').text('40-49 yds').prop('colspan', '3').addClass('border_stat');
        var th_group_50 = $('<th>').text('50+ yds').prop('colspan', '3').addClass('border_stat');
        var th_blank2 = $('<th>').prop('colspan', '3').addClass('border_stat');

        tr0.append(th_blank1);
        tr0.append(th_group_all);
        tr0.append(th_group_40);
        tr0.append(th_group_50);
        tr0.append(th_blank2);
        
        tr1.append(th_year);
        tr1.append(th_team);
        tr1.append(th_g);
        tr1.append(th_fgm);
        tr1.append(th_fga);
        tr1.append(th_fgpercent);
        tr1.append(th_fgm40);
        tr1.append(th_fga40);
        tr1.append(th_fgpercent40);
        tr1.append(th_fgm50);
        tr1.append(th_fga50);
        tr1.append(th_fgpercent50);
        tr1.append(th_xpm);
        tr1.append(th_xpa);
        tr1.append(th_xppercent);

        tr0.appendTo('#career_stats_thead');
        tr1.appendTo('#career_stats_thead');
        
        $.each(data, function(index, value) {
            //console.log(value);
            var tr = $('<tr>');
            var td_year = $('<td>');
            var td_team = $('<td>');
            var td_g = $('<td>');
            var td_fgm = $('<td>').addClass('border_stat');
            var td_fga = $('<td>');
            var td_fgpercent = $('<td>');
            var td_fgm40 = $('<td>').addClass('border_stat');
            var td_fga40 = $('<td>');
            var td_fgpercent40 = $('<td>');
            var td_fgm50 = $('<td>').addClass('border_stat');
            var td_fga50 = $('<td>');
            var td_fgpercent50 = $('<td>');
            var td_xpm = $('<td>').addClass('border_stat');
            var td_xpa = $('<td>');
            var td_xppercent = $('<td>');

            td_year.text(value.fields.year);
            td_team.text(value.fields.team);
            td_g.text(value.fields.g);
            var fgm = Number(value.fields.fg_made_0) + Number(value.fields.fg_made_20) + Number(value.fields.fg_made_30) + Number(value.fields.fg_made_40) + Number(value.fields.fg_made_50);
            var fga = Number(value.fields.fg_att_0) + Number(value.fields.fg_att_20) + Number(value.fields.fg_att_30) + Number(value.fields.fg_att_40) + Number(value.fields.fg_att_50);
            var fgperc = fgm/fga * 100;
            if (fga == 0) {
                fgperc = 0;
            }
            td_fgm.text(fgm);
            td_fga.text(fga);
            td_fgpercent.text(fgperc.toFixed(1) + '%');
            td_fgm40.text(value.fields.fg_made_40);
            td_fga40.text(value.fields.fg_att_40);
            var fgperc40 = Number(value.fields.fg_made_40) / Number(value.fields.fg_att_40) * 100;
            if (Number(value.fields.fg_att_40) == 0) {
                fgperc40 = 0;
            }
            td_fgpercent40.text(fgperc40.toFixed(1) + '%');
            td_fgm50.text(value.fields.fg_made_50);
            td_fga50.text(value.fields.fg_att_50);
            var fgperc50 = Number(value.fields.fg_made_50) / Number(value.fields.fg_att_50) * 100;
            if (Number(value.fields.fg_att_50) == 0) {
                fgperc50 = 0;
            }
            td_fgpercent50.text(fgperc50.toFixed(1) + '%');
            td_xpm.text(value.fields.xp_made);
            td_xpa.text(value.fields.xp_att);
            var xpperc = Number(value.fields.xp_made) / Number(value.fields.xp_att) * 100;
            if (Number(value.fields.xp_att) == 0) {
                xpperc = 0;
            }
            td_xppercent.text(xpperc.toFixed(1) + '%');

            tr.append(td_year);
            tr.append(td_team);
            tr.append(td_g);
            tr.append(td_fgm);
            tr.append(td_fga);
            tr.append(td_fgpercent);
            tr.append(td_fgm40);
            tr.append(td_fga40);
            tr.append(td_fgpercent40);
            tr.append(td_fgm50);
            tr.append(td_fga50);
            tr.append(td_fgpercent50);
            tr.append(td_xpm);
            tr.append(td_xpa);
            tr.append(td_xppercent);

            tr.appendTo('#career_stats_tbody');
        });
    }

    function fill_career_stats (data, pos) {
        $('#career_stats_tbody').empty();
        $('#career_stats_thead').empty();

        var tr0 = $('<tr>');
        var tr1 = $('<tr>');
        var th_year = $('<th>').text('Year');
        var th_team = $('<th>').text('Team');
        var th_g = $('<th>').text('G');
        var th_gs = $('<th>').text('GS');
        var th0_pass = $('<th>').addClass('pass_stat').text('Passing').prop('colspan', '8').addClass('border_stat');
        var th_pass_comp = $('<th>').addClass('pass_stat').text('Cmp').addClass('border_stat');
        var th_pass_att = $('<th>').addClass('pass_stat').text('Att');
        var th_comp_percent = $('<th>').addClass('pass_stat').text('Cmp%');
        var th_pass_yds = $('<th>').addClass('pass_stat').text('Yds');
        var th_pass_td = $('<th>').addClass('pass_stat').text('TD');
        var th_pass_int = $('<th>').addClass('pass_stat').text('INT');
        var th_pass_aypa = $('<th>').addClass('pass_stat').text('AY/A');
        var th_pass_rating = $('<th>').addClass('pass_stat').text('Rtng');
        var th0_rush = $('<th>').addClass('rush_stat').text('Rushing').prop('colspan', '4').addClass('border_stat');
        var th_rush_att = $('<th>').addClass('rush_stat').text('Att').addClass('border_stat');
        var th_rush_yds = $('<th>').addClass('rush_stat').text('Yds');
        var th_rush_ypc = $('<th>').addClass('rush_stat').text('Y/A');
        var th_rush_td = $('<th>').addClass('rush_stat').text('TD');
        var th0_rec = $('<th>').addClass('rec_stat').text('Receiving').prop('colspan', '7').addClass('border_stat');
        var th_targets = $('<th>').addClass('rec_stat').text('Tgts').addClass('border_stat');
        var th_rec = $('<th>').addClass('rec_stat').text('Rec');
        var th_rec_yds = $('<th>').addClass('rec_stat').text('Yds');
        var th_rec_td = $('<th>').addClass('rec_stat').text('TD');
        var th_tpg = $('<th>').addClass('rec_stat').text('Tgts/g');
        var th_rec_ypc = $('<th>').addClass('rec_stat').text('Y/R');
        var th_catch_percent = $('<th>').addClass('rec_stat').text('Ctch%');
        var th_fumbles = $('<th>').text('Fum').addClass('border_stat');
        var th_blank1 = $('<th>');
        var th_blank2 = $('<th>');
        var th_blank3 = $('<th>');
        var th_blank4 = $('<th>');
        var th_blank5 = $('<th>').addClass('border_stat');

        tr0.append(th_blank1); //year
        tr0.append(th_blank2); //team
        tr0.append(th_blank3); //g
        tr0.append(th_blank4); //gs
        tr0.append(th0_pass); //passing = 8
        tr0.append(th0_rush); //rushing = 4
        tr0.append(th0_rec); //receiving = 7
        tr0.append(th_blank5);

        tr1.append(th_year);
        tr1.append(th_team);
        tr1.append(th_g);
        tr1.append(th_gs);
        tr1.append(th_pass_comp);
        tr1.append(th_pass_att);
        tr1.append(th_comp_percent);
        tr1.append(th_pass_yds);
        tr1.append(th_pass_td);
        tr1.append(th_pass_int);
        tr1.append(th_pass_aypa);
        tr1.append(th_pass_rating);
        tr1.append(th_rush_att);
        tr1.append(th_rush_yds);
        tr1.append(th_rush_ypc);
        tr1.append(th_rush_td);
        tr1.append(th_targets);
        tr1.append(th_rec);
        tr1.append(th_rec_yds);
        tr1.append(th_rec_td);
        tr1.append(th_tpg);
        tr1.append(th_rec_ypc);
        tr1.append(th_catch_percent);
        tr1.append(th_fumbles);

        tr0.appendTo('#career_stats_thead');
        tr1.appendTo('#career_stats_thead');

        $.each(data, function(index, value) {
            //console.log(value);
            var tr = $('<tr>');
            var td_year = $('<td>');
            var td_team = $('<td>');
            var td_g = $('<td>');
            var td_gs = $('<td>');
            var td_pass_comp = $('<td>').addClass('pass_stat').addClass('border_stat');
            var td_pass_att = $('<td>').addClass('pass_stat');
            var td_comp_percent = $('<td>').addClass('pass_stat');
            var td_pass_yds = $('<td>').addClass('pass_stat');
            var td_pass_td = $('<td>').addClass('pass_stat');
            var td_pass_int = $('<td>').addClass('pass_stat');
            var td_pass_aypa = $('<td>').addClass('pass_stat');
            var td_pass_rating = $('<td>').addClass('pass_stat');
            var td_rush_att = $('<td>').addClass('rush_stat').addClass('border_stat');
            var td_rush_yds = $('<td>').addClass('rush_stat');
            var td_rush_ypc = $('<td>').addClass('rush_stat');
            var td_rush_td = $('<td>').addClass('rush_stat');
            var td_targets = $('<td>').addClass('rec_stat').addClass('border_stat');
            var td_rec = $('<td>').addClass('rec_stat');
            var td_rec_yds = $('<td>').addClass('rec_stat');
            var td_rec_td = $('<td>').addClass('rec_stat');
            var td_tpg = $('<td>').addClass('rec_stat');
            var td_rec_ypc = $('<td>').addClass('rec_stat');
            var td_catch_percent = $('<td>').addClass('rec_stat');
            var td_fumbles = $('<td>').addClass('border_stat');

            td_year.text(value.fields.year);
            td_team.text(value.fields.team);
            td_g.text(value.fields.g);
            td_gs.text(value.fields.gs);
            td_pass_comp.text(value.fields.pass_comp);
            td_pass_att.text(value.fields.pass_att);
            var comp_per = Number(value.fields.pass_comp) / Number(value.fields.pass_att) * 100;
            if (Number(value.fields.pass_att) == 0) {
                comp_per = 0;
            }
            td_comp_percent.text(comp_per.toFixed(1) + '%');
            td_pass_yds.text(value.fields.pass_yds);
            td_pass_td.text(value.fields.pass_td);
            td_pass_int.text(value.fields.pass_int);
            var apya = (Number(value.fields.pass_yds) + (20 * Number(value.fields.pass_td)) - (45 * Number(value.fields.pass_int))) / Number(value.fields.pass_att);
            if (Number(value.fields.pass_att) == 0) {
                apya = 0;
            }
            td_pass_aypa.text(apya.toFixed(1));
            var pa = ((comp_per / 100) - 0.3) * 5;
            var pb = ((Number(value.fields.pass_yds) / Number(value.fields.pass_att)) - 3) * 0.25;
            var pc = (Number(value.fields.pass_td) / Number(value.fields.pass_att)) * 20;
            var pd = 2.375 - ((Number(value.fields.pass_int) / Number(value.fields.pass_att)) * 25);
            var pass_rating = ((pa + pb + pc + pd) / 6) * 100;
            td_pass_rating.text(pass_rating.toFixed(1));
            td_rush_att.text(value.fields.rush_att);
            td_rush_yds.text(value.fields.rush_yds);
            var rush_ypc = Number(value.fields.rush_yds) / Number(value.fields.rush_att);
            if (Number(value.fields.rush_att) == 0) {
                rush_ypc = 0;
            }
            td_rush_ypc.text(rush_ypc.toFixed(2));
            td_rush_td.text(value.fields.rush_td);
            td_targets.text(value.fields.rec_targets);
            td_rec.text(value.fields.rec);
            td_rec_yds.text(value.fields.rec_yds);
            td_rec_td.text(value.fields.rec_td);
            var tpg = Number(value.fields.rec_targets) / Number(value.fields.g);
            if (Number(value.fields.g) == 0) {
                tpg = 0;
            }
            td_tpg.text(tpg.toFixed(1));
            var rec_ypc = Number(value.fields.rec_yds) / Number(value.fields.rec);
            if (Number(value.fields.rec) == 0) {
                rec_ypc = 0;
            }
            td_rec_ypc.text(rec_ypc.toFixed(1));
            var catch_per = Number(value.fields.rec) / Number(value.fields.rec_targets) * 100;
            if (Number(value.fields.rec_targets) == 0) {
                catch_per = 0;
            }
            td_catch_percent.text(catch_per.toFixed(1) + '%');
            td_fumbles.text(value.fields.fumbles);

            tr.append(td_year);
            tr.append(td_team);
            tr.append(td_g);
            tr.append(td_gs);
            tr.append(td_pass_comp);
            tr.append(td_pass_att);
            tr.append(td_comp_percent);
            tr.append(td_pass_yds);
            tr.append(td_pass_td);
            tr.append(td_pass_int);
            tr.append(td_pass_aypa);
            tr.append(td_pass_rating);
            tr.append(td_rush_att);
            tr.append(td_rush_yds);
            tr.append(td_rush_ypc);
            tr.append(td_rush_td);
            tr.append(td_targets);
            tr.append(td_rec);
            tr.append(td_rec_yds);
            tr.append(td_rec_td);
            tr.append(td_tpg);
            tr.append(td_rec_ypc);
            tr.append(td_catch_percent);
            tr.append(td_fumbles);

            tr.appendTo('#career_stats_tbody');
        });
        if (pos == 'QB') {
            $('.rec_stat').each(function() {
                $(this).hide();
            });
        } else {
            $('.pass_stat').each(function() {
                $(this).hide();
            });
        }
    }

    function fill_notes_card (notes, player_id, shortlists) {
        $('#shortlists_tbody').empty();
        $('#notes_label').text(notes);
        $('#notes_text').val(notes);

        $.each(shortlists, function(index, value) {
            var tr = $('<tr>');
            var td_checkbox = $('<td>').css({'width' : '15%'});
            var td_shortlist = $('<td>').css({'width' : '85%'});

            var checkbox = $('<input>').prop('type', 'checkbox').prop('id', value.pk).addClass('shortlist_checkbox');
            td_checkbox.append(checkbox);
            td_shortlist.text(value.fields.title);

            tr.append(td_checkbox);
            tr.append(td_shortlist);

            tr.appendTo('#shortlists_tbody');

            var members = value.fields.members.split(',');
            if ($.inArray(player_id.toString(), members) != -1) {
                checkbox.prop('checked', true);
            }
        });
    }

    $(document).on('click', '.edit_button', function() {
        $(this).hide();
        $('.cancel_button').show();
        $('.save_button').show();
        $('#notes_label').hide();
        $('#notes_text').show();

        $('.cancel_button').on('click', function () {
            $(this).hide();
            $('.edit_button').show();
            $('.save_button').hide();
            $('#notes_label').show();
            $('#notes_text').hide().val($('#notes_label').text());
        });

        $('.save_button').on('click', function() {
            $(this).hide();
            $('.edit_button').show();
            $('.cancel_button').hide();
            $('#notes_label').show().text($('#notes_text').val());
            $('#notes_text').hide();
            $.ajax({
                url: '/save_player_notes',
                type: 'POST',
                data: {
                    csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                    'player' : $player_selected,
                    'notes_text' : $('#notes_text').val()
                },
                dataType: 'json',
                success: function (data) {
                    //do nothing;
                }
            });
        });
    });

    $(document).on('click', '.shortlist_checkbox', function() {
        var shortlist_id = $(this).prop('id');
        var which = '';
        if ($(this).prop('checked') == true) {
            which = 'add';
        } else {
            which = 'remove';
        }

        $.ajax({
            url : '/save_player_shortlist_assignments',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player' : $player_selected,
                'shortlist_id' : shortlist_id,
                'which' : which
            },
            dataType: 'json',
            success: function(data){
                //do nothing
            }
        });
    });

    function fill_trans_log_card (data) {
        $('#trans_history_table').empty();

        if (data.length == 0) {
            var tr = $('<tr>');
            var td = $('<td>');
            td.text('no history');
            tr.append(td);
            tr.appendTo('#trans_history_table');
        }

        $.each(data, function(index, value) {
            var tr = $('<tr>');
            var td_date = $('<td>').css({'width' : '15%'});
            var td_details = $('<td>').css({'width' : '85%'});

            var d = new Date(value.fields.date);
            td_date.text(d.getMonth()+1 + '/' + d.getDate() + '/' + d.getFullYear());
            var details = get_details(value);
            td_details.text(details);

            tr.append(td_date);
            tr.append(td_details);

            tr.appendTo('#trans_history_table');
        });
    }

    function get_details (data) {
        if (data.fields.transaction_type == 'Contract Processed') {
            if (data.fields.var_t1 == 'Waiver Extension') {
                return 'Signed a waiver extension (' + data.fields.team2 + '); 1 year, $' + data.fields.var_d1;
            } else if (data.fields.var_t1 == 'Franchise Tag') {
                return 'Given Franchise Tag by ' + data.fields.team2 + '; 3 years, $' + data.fields.var_d1 + ' per year';
            } else if (data.fields.var_t1 == 'Transition Tag') {
                return 'Given Franchise Tag by ' + data.fields.team2 + '; 3 years, $' + data.fields.var_d1 + ' per year';
            } else if (data.fields.var_t1 == 'Extension Submitted') {
                if (data.fields.var_i1 > 1) {
                    return 'Signed an extension with ' + data.fields.team2 + '; ' + data.fields.var_i1 + ' years, $' + data.fields.var_d1 + ' per year';
                } else {
                    return 'Signed an extension with ' + data.fields.team2 + '; ' + data.fields.var_i1 + ' year, $' + data.fields.var_d1;
                }
            } else if (data.fields.var_t1 == 'Contract Set') {
                if (data.fields.var_i1 > 1) {
                    return 'Signed free agent contract with ' + data.fields.team2 + '; ' + data.fields.var_i1 + ' years, $' + data.fields.var_d1 + ' per year';
                } else {
                    return 'Signed free agent contract with ' + data.fields.team2 + '; ' + data.fields.var_i1 + ' year, $' + data.fields.var_d1;
                }
            }
        } else if (data.fields.transaction_type == 'Expansion Draft Pick') {
            return "Taken by " + data.fields.team2 + ' with pick ' + data.fields.var_i1 + ' in expansion draft. Previously owned by ' + data.fields.team1 + '.';
        } else if (data.fields.transaction_type == 'Player Cut') {
            return 'Released by ' + data.fields.team2;
        } else if (data.fields.transaction_type == 'Trade Accepted') {
            return 'Traded from ' + data.fields.team1 + ' to ' + data.fields.team2;
        } else if (data.fields.transaction_type == 'Rookie Draft Pick') {
            return 'Taken by ' + data.fields.team2 + ' with pick ' + data.fields.var_d1 + ' in rookie draft.';
        }

        return 'none';
    }

    function display_player () {
        $('#player_interaction_area').hide();
        $('.player_card').show();
        $.ajax({
            url: '/player_processing_2',
            type: 'POST',
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value, 'player_selected':$player_selected},
            dataType: 'json',
            success: function(data){
                //fill header card
                $('#name_text').text(data.name);
                $('#pos_text').text(data.pos);
                if (data.birthdate == '1-1-1900') {
                    $('#age_text').text('N/A');
                } else {
                    $('#age_text').text(data.birthdate + ' (age ' + data.age + ')');
                }
                $('#team_text').text(data.team);

                //fill contract card
                if (data.yr1_total > 0) {
                    $('#yr1_total_text').text('$' + data.yr1_total);
                    $('#yr1_salary_text').text('$' + data.yr1_salary);
                    $('#yr1_sb_text').text('$' + data.yr1_sb);
                } else {
                    $('#yr1_total_text').text('');
                    $('#yr1_salary_text').text('');
                    $('#yr1_sb_text').text('');
                }
                if (data.yr2_total > 0) {
                    $('#yr2_total_text').text('$' + data.yr2_total);
                    $('#yr2_salary_text').text('$' + data.yr2_salary);
                    $('#yr2_sb_text').text('$' + data.yr2_sb);
                } else {
                    $('#yr2_total_text').text('');
                    $('#yr2_salary_text').text('');
                    $('#yr2_sb_text').text('');
                }
                if (data.yr3_total > 0) {
                    $('#yr3_total_text').text('$' + data.yr3_total);
                    $('#yr3_salary_text').text('$' + data.yr3_salary);
                    $('#yr3_sb_text').text('$' + data.yr3_sb);
                } else {
                    $('#yr3_total_text').text('');
                    $('#yr3_salary_text').text('');
                    $('#yr3_sb_text').text('');
                }
                if (data.yr4_total > 0) {
                    $('#yr4_total_text').text('$' + data.yr4_total);
                    $('#yr4_salary_text').text('$' + data.yr4_salary);
                    $('#yr4_sb_text').text('$' + data.yr4_sb);
                } else {
                    $('#yr4_total_text').text('');
                    $('#yr4_salary_text').text('');
                    $('#yr4_sb_text').text('');
                }
                if (data.yr5_total > 0) {
                    $('#yr5_total_text').text('$' + data.yr5_total);
                    $('#yr5_salary_text').text('$' + data.yr5_salary);
                    $('#yr5_sb_text').text('$' + data.yr5_sb);
                } else {
                    $('#yr5_total_text').text('');
                    $('#yr5_salary_text').text('');
                    $('#yr5_sb_text').text('');
                }
                $('#all_total_text').text('$' + data.total_value);
                $('#all_salary_text').text('$' + data.salary);
                $('#all_sb_text').text('$' + data.signing_bonus);
                $('#contract_type_text').text(data.contract_type);

                //fill transaction history card
                var trans_data = JSON.parse(data.trans_list);
                fill_trans_log_card(trans_data);

                //fill notes card
                var notes = data.player_notes;
                var player_id = data.player_id;
                var shortlists = JSON.parse(data.shortlists);
                fill_notes_card(notes, player_id, shortlists);

                //fill career stats card
                var career_stats = JSON.parse(data.career_stats);
                if (data.pos == 'K') {
                    fill_career_stats_kicker(career_stats);
                } else if (data.pos == 'DEF') {
                    fill_career_stats_defense(career_stats);
                } else {
                    fill_career_stats(career_stats, data.pos);
                }

                if ($.inArray(data.team, team_list) != -1) {
                    $('#player_interaction_area').show();
                    $('#player_interaction_display_area').hide();
                }

                if (data.team != data.user_team) {
                    $('#player_cut_player_button').hide();
                    $('#player_restructure_button').hide();
                } else {
                    $('#player_cut_player_button').show();
                    $('#player_restructure_button').show();
                }
            }
        });
    }

    var pre_selected = $('#player_select_listbox').val();
    var in_player_list = ($t.indexOf(pre_selected) > -1);
    if (pre_selected == '') {
        //do nothing
    } else if (in_player_list) {
        $player_selected = pre_selected;
        display_player();
    }



    //EVENTS **************

    $('#search_text').keyup(function() {
        var $search_text = $('#search_text').val();
        $.ajax({
            url : '/player_processing_1',
            type: "POST",
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value, 'search_text':$search_text, 'player_list':$t},
            dataType: 'json',
            success: function(data){
                $('#player_select_listbox')
                    .find('option')
                    .remove()
                    .end();
                $.each(data, function() {
                   $('#player_select_listbox').append($('<option>').attr('value',this).text(this));
                });
            }
        });
    });


    $('#player_select_listbox').click(function() {
        $('#message_area').hide();
        $player_selected = $('#player_select_listbox').val();
        display_player();
    });


    $('#player_cut_eval_button').click(function() {
        $('#player_restructure_area').hide();
        $('#message_area').hide();
        $('#player_cut_area').show();
        var player_team = $('#team_text').text();
        var player = $('#name_text').text();
        $.ajax({
            url: '/player_processing_3',
            type: 'POST',
            data: {csrfmiddlewaretoken:document.getElementsByName('csrfmiddlewaretoken')[0].value, 'player_selected': player, 'team': player_team},
            dataType: 'json',
            success: function(data){
                $('#player_interaction_1').empty();
                //row 1
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[0]).appendTo('#player_interaction_1');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr1_total_cost).appendTo('#player_interaction_1');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr1_guar).appendTo('#player_interaction_1');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$0.00').appendTo('#player_interaction_1');
                if (Number(data.yr2_total_cost) != 0) {
                    //row 2
                    $('<tr>').appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[1]).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr2_total_cost).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr2_guar).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr2_salary).appendTo('#player_interaction_1');
                }
                if (Number(data.yr3_total_cost) != 0) {
                    //row 3
                    $('<tr>').appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[2]).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr3_total_cost).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr3_guar).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr3_salary).appendTo('#player_interaction_1');
                }
                if (Number(data.yr4_total_cost) != 0) {
                    //row 4
                    $('<tr>').appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[3]).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr4_total_cost).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr4_guar).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr4_salary).appendTo('#player_interaction_1');
                }
                if (Number(data.yr5_total_cost) != 0) {
                    //row 5
                    $('<tr>').appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[4]).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr5_total_cost).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr5_guar).appendTo('#player_interaction_1');
                    $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr5_salary).appendTo('#player_interaction_1');
                }
                //row 6
                $('<tr>').css('height', '15px').appendTo('#player_interaction_1');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text('Total').appendTo('#player_interaction_1');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.total_cost).appendTo('#player_interaction_1');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.total_guar).appendTo('#player_interaction_1');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.total_cap_savings).appendTo('#player_interaction_1');


                $('#player_interaction_2').empty();
                //row 1
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[0]).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr1_costs).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'red').text('$'+Number(data.yr1_pen).toFixed(2)).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr1_space).appendTo('#player_interaction_2');
                //row 2
                $('<tr>').appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[1]).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr2_costs).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'red').text('$'+Number(data.yr2_pen).toFixed(2)).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr2_space).appendTo('#player_interaction_2');
                //row 3
                $('<tr>').appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[2]).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr3_costs).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'red').text('$'+Number(data.yr3_pen).toFixed(2)).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr3_space).appendTo('#player_interaction_2');
                //row 4
                $('<tr>').appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[3]).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr4_costs).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'red').text('$'+Number(data.yr4_pen).toFixed(2)).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr4_space).appendTo('#player_interaction_2');
                //row 5
                $('<tr>').appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('font-weight', 'bold').text(year_list[4]).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').text('$'+data.yr5_costs).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'red').text('$'+Number(data.yr5_pen).toFixed(2)).appendTo('#player_interaction_2');
                $('<td>').addClass('player_interaction_cells').attr('align','center').css('color', 'green').text('$'+data.yr5_space).appendTo('#player_interaction_2');

                $('#player_interaction_display_area').show();
            },
            error: function(data) {
                console.log('fail', data);
            }
        });
    });

    function fill_bottom_table_restructure (data) {
        //fill bottom table
        $('#player_interaction_2').empty();

        var yr1_costs = Number(data.yr1_costs) + cap_hit_yr1;
        var yr1_pen = Number(data.yr1_pen) - Number(data.yr1_guar);
        var yr1_space = 200 - yr1_costs - yr1_pen;
        var yr1_space_diff = cap_hit_yr1 - Number(data.yr1_total_cost);
        var yr2_space_diff = cap_hit_yr2 - Number(data.yr2_total_cost);
        var yr3_space_diff = cap_hit_yr3 - Number(data.yr3_total_cost);
        var yr4_space_diff = cap_hit_yr4 - Number(data.yr4_total_cost);
        var yr5_space_diff = cap_hit_yr5 - Number(data.yr5_total_cost);

        if (Number(data.yr2_guar) == 0) {
            var yr2_costs = Number(data.yr2_costs);
            var yr2_pen = Number(data.yr2_pen);
            yr2_space_diff = 0;
        } else {
            var yr2_costs = Number(data.yr2_costs) + cap_hit_yr2;
            var yr2_pen = Number(data.yr2_pen) - Number(data.yr2_guar);
        }
        var yr2_space = 200 - yr2_costs - yr2_pen;

        if (Number(data.yr3_guar) == 0) {
            var yr3_costs = Number(data.yr3_costs);
            var yr3_pen = Number(data.yr3_pen);
            yr3_space_diff = 0;
        } else {
            var yr3_costs = Number(data.yr3_costs) + cap_hit_yr3;
            var yr3_pen = Number(data.yr3_pen) - Number(data.yr3_guar);
        }
        var yr3_space = 200 - yr3_costs - yr3_pen;

        if (Number(data.yr4_guar) == 0) {
            var yr4_costs = Number(data.yr4_costs);
            var yr4_pen = Number(data.yr4_pen);
            yr4_space_diff = 0;
        } else {
            var yr4_costs = Number(data.yr4_costs) + cap_hit_yr4;
            var yr4_pen = Number(data.yr4_pen) - Number(data.yr4_guar);
        }
        var yr4_space = 200 - yr4_costs - yr4_pen;

        if (Number(data.yr5_guar) == 0) {
            var yr5_costs = Number(data.yr5_costs);
            var yr5_pen = Number(data.yr5_pen);
            yr5_space_diff = 0;
        } else {
            var yr5_costs = Number(data.yr5_costs) + cap_hit_yr5;
            var yr5_pen = Number(data.yr5_pen) - Number(data.yr5_guar);
        }
        var yr5_space = 200 - yr5_costs - yr5_pen;



        //row 1
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('font-weight', 'bold').text(year_list[0]).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').text('$' + yr1_costs.toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + Number(yr1_pen).toFixed(2)).appendTo('#player_interaction_2');
        if (yr1_space_diff > 0) {
            $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + yr1_space.toFixed(2) + ' (+' + yr1_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        } else {
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'green').text('$' + yr1_space.toFixed(2) + ' (' + yr1_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        }
        //row 2
        $('<tr>').appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('font-weight', 'bold').text(year_list[1]).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').text('$' + yr2_costs.toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + Number(yr2_pen).toFixed(2)).appendTo('#player_interaction_2');
        if (yr2_space_diff > 0) {
            $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + yr2_space.toFixed(2) + ' (+' + yr2_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        } else {
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'green').text('$' + yr2_space.toFixed(2) + ' (' + yr2_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        }//row 3
        $('<tr>').appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('font-weight', 'bold').text(year_list[2]).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').text('$' + yr3_costs.toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + Number(yr3_pen).toFixed(2)).appendTo('#player_interaction_2');
        if (yr3_space_diff > 0) {
            $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + yr3_space.toFixed(2) + ' (+' + yr3_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        } else {
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'green').text('$' + yr3_space.toFixed(2) + ' (' + yr3_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        }//row 4
        $('<tr>').appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('font-weight', 'bold').text(year_list[3]).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').text('$' + yr4_costs.toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + Number(yr4_pen).toFixed(2)).appendTo('#player_interaction_2');
        if (yr4_space_diff > 0) {
            $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + yr4_space.toFixed(2) + ' (+' + yr4_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        } else {
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'green').text('$' + yr4_space.toFixed(2) + ' (' + yr4_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        }//row 5
        $('<tr>').appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('font-weight', 'bold').text(year_list[4]).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').text('$' + yr5_costs.toFixed(2)).appendTo('#player_interaction_2');
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + Number(yr5_pen).toFixed(2)).appendTo('#player_interaction_2');
        if (yr5_space_diff > 0) {
            $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'red').text('$' + yr5_space.toFixed(2) + ' (+' + yr5_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        } else {
        $('<td>').addClass('player_interaction_cells').attr('align', 'center').css('color', 'green').text('$' + yr5_space.toFixed(2) + ' (' + yr5_space_diff.toFixed(2) + ')').appendTo('#player_interaction_2');
        }
    }

    function fill_total_cost_column () {
        cap_hit_yr1 = ($sb / $years_remaining) + ($('#spinner_1').spinner('value'));
        cap_hit_yr2 = ($sb / $years_remaining) + ($('#spinner_2').spinner('value'));
        cap_hit_yr3 = ($sb / $years_remaining) + ($('#spinner_3').spinner('value'));
        cap_hit_yr4 = ($sb / $years_remaining) + ($('#spinner_4').spinner('value'));
        cap_hit_yr5 = ($sb / $years_remaining) + ($('#spinner_5').spinner('value'));

        $('#cap_hit_1').text('$' + cap_hit_yr1.toFixed(2));
        $('#cap_hit_2').text('$' + cap_hit_yr2.toFixed(2));
        $('#cap_hit_3').text('$' + cap_hit_yr3.toFixed(2));
        $('#cap_hit_4').text('$' + cap_hit_yr4.toFixed(2));
        $('#cap_hit_5').text('$' + cap_hit_yr5.toFixed(2));
    }

    function disable_all_sliders () {
        $('#slider_1').slider('disable', true);
        $('#slider_1').fadeTo('fast', 0.35);
        $('#spinner_1').spinner('disable', true);

        if ($avail_sliders >= 2) {
            $('#slider_2').slider('disable', true);
            $('#slider_2').fadeTo('fast', 0.35);
            $('#spinner_2').spinner('disable', true);
        }

        if ($avail_sliders >= 3) {
            $('#slider_3').slider('disable', true);
            $('#slider_3').fadeTo('fast', 0.35);
            $('#spinner_3').spinner('disable', true);
        }

        if ($avail_sliders >= 4) {
            $('#slider_4').slider('disable', true);
            $('#slider_4').fadeTo('fast', 0.35);
            $('#spinner_4').spinner('disable', true);
        }

        if ($avail_sliders == 5) {
            $('#slider_5').slider('disable', true);
            $('#slider_5').fadeTo('fast', 0.35);
            $('#spinner_5').spinner('disable', true);
        }

        $num_sliders_disabled = $avail_sliders;
    }

    function enable_all_sliders () {
        $('#slider_1').slider('enable', true);
        $('#slider_1').fadeTo('fast', 1);
        $('#spinner_1').spinner('enable', true);

        $('#slider_2').slider('enable', true);
        $('#slider_2').fadeTo('fast', 1);
        $('#spinner_2').spinner('enable', true);

        $('#slider_3').slider('enable', true);
        $('#slider_3').fadeTo('fast', 1);
        $('#spinner_3').spinner('enable', true);

        $('#slider_4').slider('enable', true);
        $('#slider_4').fadeTo('fast', 1);
        $('#spinner_5').spinner('enable', true);

        $('#slider_5').slider('enable', true);
        $('#slider_5').fadeTo('fast', 1);
        $('#spinner_5').spinner('enable', true);

        $num_sliders_disabled = 0;
    }

    function enable_two_sliders () {
        if ($('#slider_1').slider('option', 'disabled') == true) {
            $('#slider_1').slider('enable', true);
            $('#slider_1').fadeTo('fast', 1);
            $('#spinner_1').spinner('enable', true);
            $num_sliders_disabled = $num_sliders_disabled - 1;
        } else {
            $('#slider_2').slider('enable', true);
            $('#slider_2').fadeTo('fast', 1);
            $('#spinner_2').spinner('enable', true);
            $num_sliders_disabled = $num_sliders_disabled - 1;
        }
    }

    function adjust_sliders (ui, ui_source, slider_source) {
        var enabled_sliders = $avail_sliders - $num_sliders_disabled;
        var current_slider_value = 0;
        var disabled_pool = 0;
        var enabled_slider_list = [];

        if (ui_source == 'slider') {
            current_slider_value = ui.value/20;
        } else {
            current_slider_value = ui.value;
        }

        if ($('#slider_1').slider('option','disabled')) {
            console.log('count 1');
            disabled_pool = disabled_pool + Number($('#spinner_1').val());
        } else {
            if (slider_source != 1) {
                enabled_slider_list.push(1);
            }
        }
        if ($('#slider_2').slider('option','disabled')) {
            console.log('count 2');
            disabled_pool = disabled_pool + Number($('#spinner_2').val());
        } else {
            if (slider_source != 2) {
                enabled_slider_list.push(2);
            }
        }
        if ($('#slider_3').slider('option','disabled')) {
            console.log('count 3');
            disabled_pool = disabled_pool + Number($('#spinner_3').val());
        } else {
            if (slider_source != 3) {
                enabled_slider_list.push(3);
            }
        }
        if ($('#slider_4').slider('option','disabled')) {
            console.log('count 4');
            disabled_pool = disabled_pool + Number($('#spinner_4').val());
        } else {
            if (slider_source != 4) {
                enabled_slider_list.push(4);
            }
        }
        if ($('#slider_5').slider('option','disabled')) {
            console.log('count 5');
            disabled_pool = disabled_pool + Number($('#spinner_5').val());
        } else {
            if (slider_source != 5) {
                enabled_slider_list.push(5);
            }
        }

        var max_salary = $sal - disabled_pool - (enabled_sliders - 1);
        if (current_slider_value > max_salary) {
            current_slider_value = max_salary;
            if (slider_source == 1) {
                $('#slider_1').slider('value', current_slider_value*20);
                $('#spinner_1').val(((current_slider_value)).toFixed(2));
            } else if (slider_source == 2) {
                $('#slider_2').slider('value', current_slider_value*20);
                $('#spinner_2').val(((current_slider_value)).toFixed(2));
            }
             else if (slider_source == 3) {
                $('#slider_3').slider('value', current_slider_value*20);
                $('#spinner_3').val(((current_slider_value)).toFixed(2));
            }
             else if (slider_source == 4) {
                $('#slider_4').slider('value', current_slider_value*20);
                $('#spinner_4').val(((current_slider_value)).toFixed(2));
            }
             else if (slider_source == 5) {
                $('#slider_5').slider('value', current_slider_value*20);
                $('#spinner_5').val(((current_slider_value)).toFixed(2));
            }
        }

        //console.log('before = ', total_avail_pool);
        var total_avail_pool = $sal - current_slider_value - disabled_pool;

        var per_year = Math.round(((total_avail_pool / (enabled_sliders-1)) * 100)) / 100;
        if (per_year < 1) {
            per_year = 1
        }
        var last_year = Math.round((total_avail_pool - (per_year * (enabled_sliders - 2))) * 100) / 100;


        //console.log('per_year = ',per_year);
        //console.log('last_year = ',last_year);
        //console.log('total_avail_pool = ',total_avail_pool);
        //console.log('disabled_pool = ',disabled_pool);
        //console.log('enabled_slider_list = ',enabled_slider_list);
        //console.log('current_slider_value = ',current_slider_value);
        //console.log('max_salary = ',max_salary);
        //console.log('spinner_1 = ',$('#spinner_1').val());
        //console.log('spinner_2 = ',$('#spinner_2').val());
        //console.log('spinner_3 = ',$('#spinner_3').val());
        //console.log('spinner_4 = ',$('#spinner_4').val());
        //console.log('spinner_5 = ',$('#spinner_5').val());
        //console.log('**********');




        $.each(enabled_slider_list, function(index, x) {
            if (index == enabled_slider_list.length-1) {
                if (x == 1) {
                    $('#slider_1').slider('value', last_year*20);
                    $('#spinner_1').val(((last_year)).toFixed(2));
                } else if (x == 2) {
                    $('#slider_2').slider('value', last_year*20);
                    $('#spinner_2').val(((last_year)).toFixed(2));
                } else if (x == 3) {
                    $('#slider_3').slider('value', last_year*20);
                    $('#spinner_3').val(((last_year)).toFixed(2));
                } else if (x == 4) {
                    $('#slider_4').slider('value', last_year*20);
                    $('#spinner_4').val(((last_year)).toFixed(2));
                } else if (x == 5) {
                    $('#slider_5').slider('value', last_year*20);
                    $('#spinner_5').val(((last_year)).toFixed(2));
                }
            } else {
                if (x == 1) {
                    $('#slider_1').slider('value', per_year*20);
                    $('#spinner_1').val(((per_year)).toFixed(2));
                } else if (x == 2) {
                    $('#slider_2').slider('value', per_year*20);
                    $('#spinner_2').val(((per_year)).toFixed(2));
                } else if (x == 3) {
                    $('#slider_3').slider('value', per_year*20);
                    $('#spinner_3').val(((per_year)).toFixed(2));
                } else if (x == 4) {
                    $('#slider_4').slider('value', per_year*20);
                    $('#spinner_4').val(((per_year)).toFixed(2));
                } else if (x == 5) {
                    $('#slider_5').slider('value', per_year*20);
                    $('#spinner_5').val(((per_year)).toFixed(2));
                }
            }
        });
    }

    $('#player_restructure_eval_button').click(function() {
        $('#player_cut_area').hide();
        $('#message_area').hide();
        $('#player_restructure_area').show();
        $('#player_interaction_display_area').show();

        var player_team = $('#team_text').text();
        var player = $('#name_text').text();
        $.ajax({
            url: '/player_processing_3',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player_selected': player,
                'team': player_team
            },
            dataType: 'json',
            success: function (data) {

                $total = Number(data.total_cost);
                $sb = Number(data.total_guar);
                $sal = $total - $sb;
                $avail_sliders = 5;

                $('#player_interaction_3').find('tr').eq(1).show();
                $('#player_interaction_3').find('tr').eq(2).show();
                $('#player_interaction_3').find('tr').eq(3).show();
                $('#player_interaction_3').find('tr').eq(4).show();
                $('#player_interaction_3').find('tr').eq(5).show();

                $years_remaining = 0;
                if (Number(data.yr1_total_cost) > 0) {
                    $years_remaining = $years_remaining + 1;
                }
                if (Number(data.yr2_total_cost) > 0) {
                    $years_remaining = $years_remaining + 1;
                }
                if (Number(data.yr3_total_cost) > 0) {
                    $years_remaining = $years_remaining + 1;
                }
                if (Number(data.yr4_total_cost) > 0) {
                    $years_remaining = $years_remaining + 1;
                }
                if (Number(data.yr5_total_cost) > 0) {
                    $years_remaining = $years_remaining + 1;
                }

                var $max_slider = $sal - ($years_remaining - 1);

                var $per_year = Math.round((($sal / $years_remaining) * 100)) / 100;
                var $last_year = Math.round(($sal - ($per_year * ($years_remaining - 1))) * 100) / 100;

                if (data.contract_type == 'Rookie') {
                    $('#player_interaction_display_area').hide();
                    $('#message_area').html("<br><br>Rookie contracts cannot be re-structured");
                    $('#message_area').show();
                    return;
                }
                if ($years_remaining == 1) {
                    $('#player_interaction_display_area').hide();
                    $('#message_area').html("<br><br>This player's contract cannot be re-structured - contract is only for one year");
                    $('#message_area').show();
                    return;
                }
                if ($max_slider == 0) {
                    $('#player_interaction_display_area').hide();
                    $('#message_area').html("<br><br>This player's contract cannot be re-structured - there is no guaranteed money");
                    $('#message_area').show();
                    return;
                }

                //make sliders
                $('#slider_1').slider({
                    min: 20,
                    max: $max_slider * 20,
                    value: $per_year * 20
                });
                $('#slider_2').slider({
                    min: 20,
                    max: $max_slider * 20,
                    value: $per_year * 20
                });
                $('#slider_3').slider({
                    min: 20,
                    max: $max_slider * 20,
                    value: $per_year * 20
                });
                $('#slider_4').slider({
                    min: 20,
                    max: $max_slider * 20,
                    value: $per_year * 20
                });
                $('#slider_5').slider({
                    min: 20,
                    max: $max_slider * 20,
                    value: $last_year * 20
                });
                $('.ui-slider-handle').css('cursor', 'pointer').css('background', '#2d99d4');

                //make spinners
                $('#spinner_1').spinner({
                    min: 1,
                    max: $max_slider,
                    step: 0.01,
                    incremental: false,
                    stop: function (event, ui) {
                        var n = Number($('#spinner_1').spinner('value'));
                        $('#spinner_1').val((n).toFixed(2));
                    }
                });
                $('#spinner_2').spinner({
                    min: 1,
                    max: $max_slider,
                    step: 0.01,
                    incremental: false,
                    stop: function (event, ui) {
                        var n = Number($('#spinner_2').spinner('value'));
                        $('#spinner_2').val((n).toFixed(2));
                    }
                });
                $('#spinner_3').spinner({
                    min: 1,
                    max: $max_slider,
                    step: 0.01,
                    incremental: false,
                    stop: function (event, ui) {
                        var n = Number($('#spinner_3').spinner('value'));
                        $('#spinner_3').val((n).toFixed(2));
                    }
                });
                $('#spinner_4').spinner({
                    min: 1,
                    max: $max_slider,
                    step: 0.01,
                    incremental: false,
                    stop: function (event, ui) {
                        var n = Number($('#spinner_4').spinner('value'));
                        $('#spinner_4').val((n).toFixed(2));
                    }
                });
                $('#spinner_5').spinner({
                    min: 1,
                    max: $max_slider,
                    step: 0.01,
                    incremental: false,
                    stop: function (event, ui) {
                        var n = Number($('#spinner_5').spinner('value'));
                        $('#spinner_5').val((n).toFixed(2));
                    }
                });

                $('#spinner_1').val($per_year);
                $('#spinner_2').val($per_year);
                $('#spinner_3').val($per_year);
                $('#spinner_4').val($per_year);
                $('#spinner_5').val($last_year);

                enable_all_sliders();

                //fill total cost column
                fill_total_cost_column();

                if (Number(data.yr2_total_cost) == 0) {
                    $('#player_interaction_3').find('tr').eq(2).hide();
                    $avail_sliders = $avail_sliders - 1;
                }
                if (Number(data.yr3_total_cost) == 0) {
                    $('#player_interaction_3').find('tr').eq(3).hide();
                    $avail_sliders = $avail_sliders - 1;
                }
                if (Number(data.yr4_total_cost) == 0) {
                    $('#player_interaction_3').find('tr').eq(4).hide();
                    $avail_sliders = $avail_sliders - 1;
                }
                if (Number(data.yr5_total_cost) == 0) {
                    $('#player_interaction_3').find('tr').eq(5).hide();
                    $avail_sliders = $avail_sliders - 1;
                }

                //fill middle table
                $('#restructure_total').text('$' + $total.toFixed(2));
                $('#restructure_salary').text('$' + $sal.toFixed(2));
                $('#restructure_sb').text('$' + $sb.toFixed(2));

                //fill bottom table
                fill_bottom_table_restructure(data);

                $bottom_table_data.yr1_costs = data.yr1_costs;
                $bottom_table_data.yr2_costs = data.yr2_costs;
                $bottom_table_data.yr3_costs = data.yr3_costs;
                $bottom_table_data.yr4_costs = data.yr4_costs;
                $bottom_table_data.yr5_costs = data.yr5_costs;
                $bottom_table_data.yr1_pen = data.yr1_pen;
                $bottom_table_data.yr2_pen = data.yr2_pen;
                $bottom_table_data.yr3_pen = data.yr3_pen;
                $bottom_table_data.yr4_pen = data.yr4_pen;
                $bottom_table_data.yr5_pen = data.yr5_pen;
                $bottom_table_data.yr1_guar = data.yr1_guar;
                $bottom_table_data.yr2_guar = data.yr2_guar;
                $bottom_table_data.yr3_guar = data.yr3_guar;
                $bottom_table_data.yr4_guar = data.yr4_guar;
                $bottom_table_data.yr5_guar = data.yr5_guar;
                $bottom_table_data.yr1_space = data.yr1_space;
                $bottom_table_data.yr2_space = data.yr2_space;
                $bottom_table_data.yr3_space = data.yr3_space;
                $bottom_table_data.yr4_space = data.yr4_space;
                $bottom_table_data.yr5_space = data.yr5_space;
                $bottom_table_data.yr1_total_cost = data.yr1_total_cost;
                $bottom_table_data.yr2_total_cost = data.yr2_total_cost;
                $bottom_table_data.yr3_total_cost = data.yr3_total_cost;
                $bottom_table_data.yr4_total_cost = data.yr4_total_cost;
                $bottom_table_data.yr5_total_cost = data.yr5_total_cost;
            }
        });
    });

    $('#spinner_1').on('spin', function(event, ui) {
        $('#slider_1').slider('value', ui.value*20);
        adjust_sliders(ui, 'spinner', 1);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });
    $('#spinner_2').on('spin', function(event, ui) {
        $('#slider_2').slider('value', ui.value*20);
        adjust_sliders(ui, 'spinner', 2);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });
    $('#spinner_3').on('spin', function(event, ui) {
        $('#slider_3').slider('value', ui.value*20);
        adjust_sliders(ui, 'spinner', 3);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });
    $('#spinner_4').on('spin', function(event, ui) {
        $('#slider_4').slider('value', ui.value*20);
        adjust_sliders(ui, 'spinner', 4);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });
    $('#spinner_5').on('spin', function(event, ui) {
        $('#slider_5').slider('value', ui.value*20);
        adjust_sliders(ui, 'spinner', 5);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });

    $('#slider_1').on('slide', function(event, ui) {
        console.log('called slider 1');
        $('#spinner_1').val(((ui.value/20)).toFixed(2));
        adjust_sliders(ui, 'slider', 1);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });
    $('#slider_2').on('slide', function(event, ui) {
        $('#spinner_2').val(((ui.value/20)).toFixed(2));
         adjust_sliders(ui, 'slider', 2);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });
    $('#slider_3').on('slide', function(event, ui) {
        $('#spinner_3').val(((ui.value/20)).toFixed(2));
         adjust_sliders(ui, 'slider', 3);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });
    $('#slider_4').on('slide', function(event, ui) {
        $('#spinner_4').val(((ui.value/20)).toFixed(2));
         adjust_sliders(ui, 'slider', 4);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });
    $('#slider_5').on('slide', function(event, ui) {
        $('#spinner_5').val(((ui.value/20)).toFixed(2));
         adjust_sliders(ui, 'slider', 5);
        fill_total_cost_column();
        fill_bottom_table_restructure($bottom_table_data);
    });

    $('#freeze_button_1').mousedown(function(e) {
        if ($('#slider_1').slider('option', 'disabled')) {
            $('#slider_1').slider('enable', true);
            $('#slider_1').fadeTo('fast', 1);
            $('#spinner_1').spinner('enable', true);
            $num_sliders_disabled = $num_sliders_disabled - 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                enable_two_sliders();
            }
        } else {
            $('#slider_1').slider('disable', true);
            $('#slider_1').fadeTo('fast', 0.35);
            $('#spinner_1').spinner('disable', true);
            $num_sliders_disabled = $num_sliders_disabled + 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                disable_all_sliders();
            }
        }
        console.log($num_sliders_disabled, $avail_sliders);
    });
    $('#freeze_button_2').mousedown(function(e) {
        if ($('#slider_2').slider('option', 'disabled')) {
            $('#slider_2').slider('enable', true);
            $('#slider_2').fadeTo('fast', 1);
            $('#spinner_2').spinner('enable', true);
            $num_sliders_disabled = $num_sliders_disabled - 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                enable_two_sliders();
            }
        } else {
            $('#slider_2').slider('disable', true);
            $('#slider_2').fadeTo('fast', 0.35);
            $('#spinner_2').spinner('disable', true);
            $num_sliders_disabled = $num_sliders_disabled + 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                disable_all_sliders();
            }
        }
        console.log($num_sliders_disabled, $avail_sliders);
    });
    $('#freeze_button_3').mousedown(function(e) {
        if ($('#slider_3').slider('option', 'disabled')) {
            $('#slider_3').slider('enable', true);
            $('#slider_3').fadeTo('fast', 1);
            $('#spinner_3').spinner('enable', true);
            $num_sliders_disabled = $num_sliders_disabled - 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                enable_two_sliders();
            }
        } else {
            $('#slider_3').slider('disable', true);
            $('#slider_3').fadeTo('fast', 0.35);
            $('#spinner_3').spinner('disable', true);
            $num_sliders_disabled = $num_sliders_disabled + 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                disable_all_sliders();
            }
        }
        console.log($num_sliders_disabled, $avail_sliders);
    });
    $('#freeze_button_4').mousedown(function(e) {
        if ($('#slider_4').slider('option', 'disabled')) {
            $('#slider_4').slider('enable', true);
            $('#slider_4').fadeTo('fast', 1);
            $('#spinner_4').spinner('enable', true);
            $num_sliders_disabled = $num_sliders_disabled - 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                enable_two_sliders();
            }
        } else {
            $('#slider_4').slider('disable', true);
            $('#slider_4').fadeTo('fast', 0.35);
            $('#spinner_4').spinner('disable', true);
            $num_sliders_disabled = $num_sliders_disabled + 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                disable_all_sliders();
            }
        }
        console.log($num_sliders_disabled, $avail_sliders);
    });
    $('#freeze_button_5').mousedown(function(e) {
        if ($('#slider_5').slider('option', 'disabled')) {
            $('#slider_5').slider('enable', true);
            $('#slider_5').fadeTo('fast', 1);
            $('#spinner_5').spinner('enable', true);
            $num_sliders_disabled = $num_sliders_disabled - 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                enable_two_sliders();
            }
        } else {
            $('#slider_5').slider('disable', true);
            $('#slider_5').fadeTo('fast', 0.35);
            $('#spinner_5').spinner('disable', true);
            $num_sliders_disabled = $num_sliders_disabled + 1;
            if ($num_sliders_disabled == $avail_sliders-1) {
                disable_all_sliders();
            }
        }
        console.log($num_sliders_disabled, $avail_sliders);
    });




    $('#player_cut_player_button').on('click', function() {
        var out_player = $('#name_text').text();
        $.ajax({
            url: '/save_data_cut_player',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player' : out_player,
                'from' : 'player'
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/confirm_cut_players';
            }
        });
    });

    $('#player_restructure_button').on('click', function() {
        var out_player = $('#name_text').text();
        var yr1_salary = $('#spinner_1').spinner('value');
        var yr2_salary = $('#spinner_2').spinner('value');
        var yr3_salary = $('#spinner_3').spinner('value');
        var yr4_salary = $('#spinner_4').spinner('value');
        var yr5_salary = $('#spinner_5').spinner('value');
        $.ajax({
            url: '/save_data_restructure_player',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'player' : out_player,
                'yr1_sal' : yr1_salary,
                'yr2_sal' : yr2_salary,
                'yr3_sal' : yr3_salary,
                'yr4_sal' : yr4_salary,
                'yr5_sal' : yr5_salary
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/confirm_restructure';
            }
        });
    });
});

