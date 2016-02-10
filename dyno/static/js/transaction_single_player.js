$(document).ready(function() {
    console.log('ready');

    var $master = {};
    $('#vw_1').find('tr').each(function() {
        $master = {'date': $(this).find('#vw_1-1').text(),
            'player': $(this).find('#vw_1-2').text(),
            'team1': $(this).find('#vw_1-3').text(),
            'team2': $(this).find('#vw_1-4').text(),
            'transaction_type': $(this).find('#vw_1-5').text(),
            'var_d1': $(this).find('#vw_1-6').text(),
            'var_d2': $(this).find('#vw_1-7').text(),
            'var_d3': $(this).find('#vw_1-8').text(),
            'var_i1': $(this).find('#vw_1-9').text(),
            'var_i2': $(this).find('#vw_1-10').text(),
            'var_t1': $(this).find('#vw_1-11').text(),
            'var_t2': $(this).find('#vw_1-12').text(),
            'var_t3': $(this).find('#vw_1-13').text(),
            'iso_date': $(this).find('#vw_1-14').text(),
            'id': $(this).find('#vw_1-15').text()};
        $(this).remove();
    });

    var contract_type = 'Regular';
    if ($master.transaction_type == 'Draft Pick') {
        contract_type = 'Rookie'
    }
    $('#input_4').val(contract_type);

    var temp1 = $master.var_t3;
    var yearly_split = temp1.split(',');
    var total_value = 0;
    $.each(yearly_split, function(index, value) {
        value = Number(value);
        total_value = total_value + value;
    });

    $('#input_5').val(total_value.toFixed(2));

    var signing_bonus = Number($master.var_d2) * Number($master.var_i1);
    $('#input_6').val(signing_bonus.toFixed(2));

    var salary = total_value - signing_bonus;
    $('#input_7').val(salary.toFixed(2));

    var yr1_sal = Number(yearly_split[0]) - Number($master.var_d2);
    var yr2_sal = Number(yearly_split[1]) - Number($master.var_d2);
    var yr3_sal = Number(yearly_split[2]) - Number($master.var_d2);
    var yr4_sal = Number(yearly_split[3]) - Number($master.var_d2);
    var yr5_sal = Number(yearly_split[4]) - Number($master.var_d2);

    $('#input_8').val(yr1_sal.toFixed(2));
    if (Number($master.var_i1) >= 2) {
        $('#input_9').val(yr2_sal.toFixed(2));
    }
    if (Number($master.var_i1) >= 3) {
        $('#input_10').val(yr3_sal.toFixed(2));
    }
    if (Number($master.var_i1) >= 4) {
        $('#input_11').val(yr4_sal.toFixed(2));
    }
    if (Number($master.var_i1) >= 5) {
        $('#input_12').val(yr5_sal.toFixed(2));
    }

    $('#input_13').val(Number($master.var_d2).toFixed(2));
    if (Number($master.var_i1) >= 2) {
        $('#input_14').val(Number($master.var_d2).toFixed(2));
    }
    if (Number($master.var_i1) >= 3) {
        $('#input_15').val(Number($master.var_d2).toFixed(2));
    }
    if (Number($master.var_i1) >= 4) {
        $('#input_16').val(Number($master.var_d2).toFixed(2));
    }
    if (Number($master.var_i1) >= 5) {
        $('#input_17').val(Number($master.var_d2).toFixed(2));
    }

    if ($('#input_19').val() == 'None') {
        $('#input_19').val('--');
    }
    if ($('#input_20').val() == 'None') {
        $('#input_20').val('--');
    }
    if ($('#input_21').val() == 'None') {
        $('#input_21').val('--');
    }
    if ($('#input_22').val() == 'None') {
        $('#input_22').val('--');
    }
    if ($('#input_23').val() == 'None') {
        $('#input_23').val('--');
    }
    
    
    
    $('#trans_single_calc_totals').on('click', function() {
        console.log('click calc');
        var yr1_sal = Number($('#input_8').val());
        var yr2_sal = Number($('#input_9').val());
        var yr3_sal = Number($('#input_10').val());
        var yr4_sal = Number($('#input_11').val());
        var yr5_sal = Number($('#input_12').val());
        var yr1_sb = Number($('#input_13').val());
        var yr2_sb = Number($('#input_14').val());
        var yr3_sb = Number($('#input_15').val());
        var yr4_sb = Number($('#input_16').val());
        var yr5_sb = Number($('#input_17').val());
        var signing_bonus = yr1_sb + yr2_sb + yr3_sb + yr4_sb + yr5_sb;
        var salary = yr1_sal + yr2_sal + yr3_sal + yr4_sal + yr5_sal;
        var total_value = signing_bonus + salary;
        $('#input_5').val(total_value.toFixed(2));
        $('#input_6').val(signing_bonus.toFixed(2));
        $('#input_7').val(salary.toFixed(2));
    });
    
    $('#trans_single_clear_roles').on('click', function() {
        console.log('click clear');
        $('#input_19').val('--');
        $('#input_20').val('--');
        $('#input_21').val('--');
        $('#input_22').val('--');
        $('#input_23').val('--');
    });
    
    
    
    $('#trans_single_submit_button').on('click', function() {
        var pos = $('#input_1').val();
        var name = $('#input_2').val();
        var team = $('#input_3').val();
        var contract_type = $('#input_4').val();
        var total_value = $('#input_5').val();
        var signing_bonus = $('#input_6').val();
        var salary = $('#input_7').val();
        var yr1_sal = $('#input_8').val();
        var yr2_sal = $('#input_9').val();
        var yr3_sal = $('#input_10').val();
        var yr4_sal = $('#input_11').val();
        var yr5_sal = $('#input_12').val();
        var yr1_sb = $('#input_13').val();
        var yr2_sb = $('#input_14').val();
        var yr3_sb = $('#input_15').val();
        var yr4_sb = $('#input_16').val();
        var yr5_sb = $('#input_17').val();
        var notes = $('#input_18').val();
        var yr1_role = $('#input_19').val();
        var yr2_role = $('#input_20').val();
        var yr3_role = $('#input_21').val();
        var yr4_role = $('#input_22').val();
        var yr5_role = $('#input_23').val();
        var id = $master.id;
        $.ajax({
            url: '/save_transaction_single_player',
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                'pos' : pos,
                'name' : name,
                'team' : team,
                'contract_type' : contract_type,
                'total_value' : total_value,
                'signing_bonus' : signing_bonus,
                'salary' : salary,
                'yr1_sal' : yr1_sal,
                'yr2_sal' : yr2_sal,
                'yr3_sal' : yr3_sal,
                'yr4_sal' : yr4_sal,
                'yr5_sal' : yr5_sal,
                'yr1_sb' : yr1_sb,
                'yr2_sb' : yr2_sb,
                'yr3_sb' : yr3_sb,
                'yr4_sb' : yr4_sb,
                'yr5_sb' : yr5_sb,
                'notes' : notes,
                'yr1_role' : yr1_role,
                'yr2_role' : yr2_role,
                'yr3_role' : yr3_role,
                'yr4_role' : yr4_role,
                'yr5_role' : yr5_role,
                'id' : id
            },
            dataType: 'json',
            success: function (data) {
                location.href = '/commish/pending_transactions';
            }
        });
    });
});