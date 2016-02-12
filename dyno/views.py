import os
import sqlite3 as sql3
from decimal import *
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse
from django.db.models import Q
from .forms import *
from .models import *

working_local = True
current_league_year = 2015
year_list = [current_league_year, current_league_year + 1, current_league_year + 2, current_league_year + 3, current_league_year + 4]



def extension_calc(x,
                   adp_qb_list, adp_rb_list, adp_wr_list, adp_te_list, adp_def_list, adp_k_list,
                   salary_listing_qb, salary_listing_rb, salary_listing_wr, salary_listing_te, salary_listing_def, salary_listing_k,
                   qb_yr1_list, rb_yr1_list, wr_yr1_list, te_yr1_list, def_yr1_list, k_yr1_list,
                   qb_yr2_list, rb_yr2_list, wr_yr2_list, te_yr2_list, def_yr2_list, k_yr2_list,
                   ):

    num_years = 1
    if x.yr2_salary > 0:
        num_years += 1
    if x.yr3_salary > 0:
        num_years += 1
    if x.yr4_salary > 0:
        num_years += 1
    if x.yr5_salary > 0:
        num_years += 1
    avg_yearly = float((x.yr1_salary + x.yr1_sb + x.yr2_salary + x.yr2_sb + x.yr3_salary + x.yr3_sb + x.yr4_salary + x.yr4_sb + x.yr5_salary + x.yr5_sb)) / num_years

    player_adp = 999
    player_perf1 = 999
    player_perf2 = 999
    if x.position == 'QB':
        for y in adp_qb_list:
            if y.player == x.name:
                player_adp = y.rank
        try:
            adp_cost = salary_listing_qb[player_adp-1]
        except IndexError:
            adp_cost = 1

        for y in qb_yr1_list:
            if y.player == x.name:
                player_perf1 = y.rank
        for y in qb_yr2_list:
            if y.player == x.name:
                player_perf2 = y.rank
        try:
            perf1_cost = salary_listing_qb[player_perf1-1]
        except:
            perf1_cost = 1
        try:
            perf2_cost = salary_listing_qb[player_perf2-1]
        except:
            perf2_cost = 1

        if perf1_cost > perf2_cost:
            perf_cost = perf1_cost
        else:
            perf_cost = perf2_cost

        part_a = (0.25 * adp_cost) + (0.75 * perf_cost)
        if part_a >= avg_yearly:
            base_extension = part_a
        else:
            base_extension = (0.50 * part_a) + (0.50 * avg_yearly)

    elif x.position == 'RB':
        for y in adp_rb_list:
            if y.player == x.name:
                player_adp = y.rank
        try:
            adp_cost = salary_listing_rb[player_adp-1]
        except IndexError:
            adp_cost = 1

        for y in rb_yr1_list:
            if y.player == x.name:
                player_perf1 = y.rank
        for y in rb_yr2_list:
            if y.player == x.name:
                player_perf2 = y.rank
        try:
            perf1_cost = salary_listing_rb[player_perf1-1]
        except:
            perf1_cost = 1
        try:
            perf2_cost = salary_listing_rb[player_perf2-1]
        except:
            perf2_cost = 1

        if perf1_cost > perf2_cost:
            perf_cost = perf1_cost
        else:
            perf_cost = perf2_cost

        part_a = (0.25 * adp_cost) + (0.75 * perf_cost)
        if part_a >= avg_yearly:
            base_extension = part_a
        else:
            base_extension = (0.50 * part_a) + (0.50 * avg_yearly)

    elif x.position == 'WR':
        for y in adp_wr_list:
            if y.player == x.name:
                player_adp = y.rank
        try:
            adp_cost = salary_listing_wr[player_adp-1]
        except IndexError:
            adp_cost = 1

        for y in wr_yr1_list:
            if y.player == x.name:
                player_perf1 = y.rank
        for y in wr_yr2_list:
            if y.player == x.name:
                player_perf2 = y.rank
        try:
            perf1_cost = salary_listing_wr[player_perf1-1]
        except:
            perf1_cost = 1
        try:
            perf2_cost = salary_listing_wr[player_perf2-1]
        except:
            perf2_cost = 1

        if perf1_cost > perf2_cost:
            perf_cost = perf1_cost
        else:
            perf_cost = perf2_cost

        part_a = (0.25 * adp_cost) + (0.75 * perf_cost)
        if part_a >= avg_yearly:
            base_extension = part_a
        else:
            base_extension = (0.50 * part_a) + (0.50 * avg_yearly)

    elif x.position == 'TE':
        for y in adp_te_list:
            if y.player == x.name:
                player_adp = y.rank
        try:
            adp_cost = salary_listing_te[player_adp-1]
        except IndexError:
            adp_cost = 1

        for y in te_yr1_list:
            if y.player == x.name:
                player_perf1 = y.rank
        for y in te_yr2_list:
            if y.player == x.name:
                player_perf2 = y.rank
        try:
            perf1_cost = salary_listing_te[player_perf1-1]
        except:
            perf1_cost = 1
        try:
            perf2_cost = salary_listing_te[player_perf2-1]
        except:
            perf2_cost = 1

        if perf1_cost > perf2_cost:
            perf_cost = perf1_cost
        else:
            perf_cost = perf2_cost

        part_a = (0.25 * adp_cost) + (0.75 * perf_cost)
        if part_a >= avg_yearly:
            base_extension = part_a
        else:
            base_extension = (0.50 * part_a) + (0.50 * avg_yearly)

    elif x.position == 'DEF':
        for y in adp_def_list:
            if y.player == x.name:
                player_adp = y.rank
        try:
            adp_cost = salary_listing_def[player_adp-1]
        except IndexError:
            adp_cost = 1

        for y in def_yr1_list:
            if y.player == x.name:
                player_perf1 = y.rank
        for y in def_yr2_list:
            if y.player == x.name:
                player_perf2 = y.rank
        try:
            perf1_cost = salary_listing_def[player_perf1-1]
        except:
            perf1_cost = 1
        try:
            perf2_cost = salary_listing_def[player_perf2-1]
        except:
            perf2_cost = 1

        if perf1_cost > perf2_cost:
            perf_cost = perf1_cost
        else:
            perf_cost = perf2_cost

        part_a = (0.25 * adp_cost) + (0.75 * perf_cost)
        if part_a >= avg_yearly:
            base_extension = part_a
        else:
            base_extension = (0.50 * part_a) + (0.50 * avg_yearly)

    elif x.position == 'K':
        for y in adp_k_list:
            if y.player == x.name:
                player_adp = y.rank
        try:
            adp_cost = salary_listing_k[player_adp-1]
        except IndexError:
            adp_cost = 1

        for y in k_yr1_list:
            if y.player == x.name:
                player_perf1 = y.rank
        for y in k_yr2_list:
            if y.player == x.name:
                player_perf2 = y.rank
        try:
            perf1_cost = salary_listing_k[player_perf1-1]
        except:
            perf1_cost = 1
        try:
            perf2_cost = salary_listing_k[player_perf2-1]
        except:
            perf2_cost = 1

        if perf1_cost > perf2_cost:
            perf_cost = perf1_cost
        else:
            perf_cost = perf2_cost

        part_a = (0.25 * adp_cost) + (0.75 * perf_cost)
        if part_a >= avg_yearly:
            base_extension = part_a
        else:
            base_extension = (0.50 * part_a) + (0.50 * avg_yearly)

    return base_extension, avg_yearly, num_years



def homepage(request):
    return render(request, 'base.html', {})

def loginpage(request):
    return render(request, 'login.html', {'failed_login': False})

def loginView(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            a = Variable.objects.get(name='team selected')
            try:
                b = Team.objects.get(user=user)
                team_name = b.internal_name
            except:
                team_name = ''

            a.text_variable = team_name
            a.save()
            return HttpResponseRedirect('/')
        else:
            return HttpResponse('Your account is disabled. Please contact the administrator')
    else:
        return HttpResponseRedirect('/login_failed')

def loginfailed(request):
    return render(request, 'login.html', {'failed_login': True})

def logoutView(request):
    logout(request)
    return HttpResponseRedirect('/login')

def mainpage(request):
    a = Message.objects.get(name='Homepage Message')
    welcome_message = a.content
    return render(request, 'main.html', {'welcome_message': welcome_message})

def rulespage(request):
    a = Message.objects.get(name='Rules')
    rules_text = a.content
    return render(request, 'rules.html', {'rules_text': rules_text})

def messageboardpage(request):
    return render(request, 'message_board.html', {})

def draftpage(request):
    return render(request, 'draft.html', {})

def auctionpage(request):
    a = Player.objects.filter(team='Free Agent').order_by('name')
    new_auction_player_list = []
    for x in a:
        new_auction_player_list.append(x.position + ' - ' + x.name)

    b = Auction.objects.all().order_by('clock_reset')

    c = Team.objects.get(user=request.user)
    current_team = c.internal_name

    d = Variable.objects.get(name='New Auction Info')
    d.text_variable = ''
    d.save()

    return render(request, 'auction.html', {'new_auction_player_list' : new_auction_player_list,
                                            'auctions' : b,
                                            'current_team' : current_team})

def auctionbidconfirmationpage(request):
    a = Variable.objects.get(name='New Auction Info')
    b = a.text_variable

    bids_list = []

    if '\n' not in b:
        c = b.strip().split(':')
        bids_list.append({'player' : c[0],
                          'bid' : c[1]})
    else:
        c = b.strip().split('\n')
        for x in c:
            d = x.strip().split(':')
            bids_list.append({'player' : d[0],
                              'bid' : d[1]})

    return render(request, 'auction_bid_confirmation.html', {'bids_list' : bids_list})

def leagueallplayerspage(request):
    #todo: change to sql pull to speed up
    a = Team.objects.all()
    teams = []
    for x in a:
        teams.append(x.internal_name)

    b = Player.objects.order_by('position', '-total_value')
    table_contents = []
    for x in b:
        if x.team in teams:
            table_contents.append(x)

    return render(request, 'league/league_all_players.html', {'table_contents' : table_contents,
                                                              'year_list' : year_list})

def leagueextensions(request):
    a = Player.objects.all()
    b = ADP.objects.all().order_by('rank')
    c = Performance_Yr1.objects.all().order_by('rank')
    d = Performance_Yr2.objects.all().order_by('rank')
    e = SalaryListing.objects.all().order_by('-yearly_cost')

    salary_listing_qb = []
    salary_listing_rb = []
    salary_listing_wr = []
    salary_listing_te = []
    salary_listing_def = []
    salary_listing_k = []
    for x in e:
        if x.position == 'QB':
            salary_listing_qb.append(float(x.yearly_cost))
        elif x.position == 'RB':
            salary_listing_rb.append(float(x.yearly_cost))
        elif x.position == 'WR':
            salary_listing_wr.append(float(x.yearly_cost))
        elif x.position == 'TE':
            salary_listing_te.append(float(x.yearly_cost))
        elif x.position == 'DEF':
            salary_listing_def.append(float(x.yearly_cost))
        elif x.position == 'K':
            salary_listing_k.append(float(x.yearly_cost))
    qb_first = salary_listing_qb[0]*1.05
    salary_listing_qb.insert(0, qb_first)
    rb_first = salary_listing_rb[0]*1.05
    salary_listing_rb.insert(0, rb_first)
    wr_first = salary_listing_wr[0]*1.05
    salary_listing_wr.insert(0, wr_first)
    te_first = salary_listing_te[0]*1.05
    salary_listing_te.insert(0, te_first)
    def_first = salary_listing_def[0]*1.05
    salary_listing_def.insert(0, def_first)
    k_first = salary_listing_k[0]*1.05
    salary_listing_k.insert(0, k_first)

    adp_qb_list = []
    adp_rb_list = []
    adp_wr_list = []
    adp_te_list = []
    adp_def_list = []
    adp_k_list = []

    num_qb = 0
    num_rb = 0
    num_wr = 0
    num_te = 0
    num_def = 0
    num_k = 0

    for x in b:
        if x.position == 'QB':
            num_qb += 1
            x.rank = num_qb
            adp_qb_list.append(x)
        elif x.position == 'RB':
            num_rb += 1
            x.rank = num_rb
            adp_rb_list.append(x)
        elif x.position == 'WR':
            num_wr += 1
            x.rank = num_wr
            adp_wr_list.append(x)
        elif x.position == 'TE':
            num_te += 1
            x.rank = num_te
            adp_te_list.append(x)
        elif x.position == 'Def':
            num_def += 1
            x.rank = num_def
            adp_def_list.append(x)
        elif x.position == 'K':
            num_k += 1
            x.rank = num_k
            adp_k_list.append(x)

    qb_yr1_list = []
    rb_yr1_list = []
    wr_yr1_list = []
    te_yr1_list = []
    def_yr1_list = []
    k_yr1_list = []

    num_yr1_qb = 0
    num_yr1_rb = 0
    num_yr1_wr = 0
    num_yr1_te = 0
    num_yr1_def = 0
    num_yr1_k = 0

    for x in c:
        if x.position == 'QB':
            num_yr1_qb += 1
            x.rank = num_yr1_qb
            qb_yr1_list.append(x)
        elif x.position == 'RB':
            num_yr1_rb += 1
            x.rank = num_yr1_rb
            rb_yr1_list.append(x)
        elif x.position == 'WR':
            num_yr1_wr += 1
            x.rank = num_yr1_wr
            wr_yr1_list.append(x)
        elif x.position == 'TE':
            num_yr1_te += 1
            x.rank = num_yr1_te
            te_yr1_list.append(x)
        elif x.position == 'DEF':
            num_yr1_def += 1
            x.rank = num_yr1_def
            def_yr1_list.append(x)
        elif x.position == 'K':
            num_yr1_k += 1
            x.rank = num_yr1_k
            k_yr1_list.append(x)

    qb_yr2_list = []
    rb_yr2_list = []
    wr_yr2_list = []
    te_yr2_list = []
    def_yr2_list = []
    k_yr2_list = []

    num_yr2_qb = 0
    num_yr2_rb = 0
    num_yr2_wr = 0
    num_yr2_te = 0
    num_yr2_def = 0
    num_yr2_k = 0

    for x in d:
        if x.position == 'QB':
            num_yr2_qb += 1
            x.rank = num_yr2_qb
            qb_yr2_list.append(x)
        elif x.position == 'RB':
            num_yr2_rb += 1
            x.rank = num_yr2_rb
            rb_yr2_list.append(x)
        elif x.position == 'WR':
            num_yr2_wr += 1
            x.rank = num_yr2_wr
            wr_yr2_list.append(x)
        elif x.position == 'TE':
            num_yr2_te += 1
            x.rank = num_yr2_te
            te_yr2_list.append(x)
        elif x.position == 'Def':
            num_yr2_def += 1
            x.rank = num_yr2_def
            def_yr2_list.append(x)
        elif x.position == 'K':
            num_yr2_k += 1
            x.rank = num_yr2_k
            k_yr2_list.append(x)

    list1 = []
    for x in a:
        if x.yr1_salary > 0:
            base_extension, avg_yearly, num_years = extension_calc(x,
                                                                   adp_qb_list, adp_rb_list, adp_wr_list, adp_te_list, adp_def_list, adp_k_list,
                                                                   salary_listing_qb, salary_listing_rb, salary_listing_wr, salary_listing_te, salary_listing_def, salary_listing_k,
                                                                   qb_yr1_list, rb_yr1_list, wr_yr1_list, te_yr1_list, def_yr1_list, k_yr1_list,
                                                                   qb_yr2_list, rb_yr2_list, wr_yr2_list, te_yr2_list, def_yr2_list, k_yr2_list,
                                                                   )

            if x.position == 'QB':
                if base_extension > salary_listing_qb[8]:
                    max_years = 4
                elif base_extension > salary_listing_qb[15]:
                    max_years = 3
                else:
                    max_years = 2
            elif x.position == 'RB':
                if base_extension > salary_listing_rb[15]:
                    max_years = 4
                elif base_extension > salary_listing_rb[30]:
                    max_years = 3
                else:
                    max_years = 2
            elif x.position == 'WR':
                if base_extension > salary_listing_wr[20]:
                    max_years = 4
                elif base_extension > salary_listing_wr[40]:
                    max_years = 3
                else:
                    max_years = 2
            elif x.position == 'TE':
                if base_extension > salary_listing_te[8]:
                    max_years = 4
                elif base_extension > salary_listing_te[15]:
                    max_years = 3
                else:
                    max_years = 2
            else:
                max_years = 4

            if num_years + max_years > 5:
                max_years = 5 - num_years

            if num_years > 1:
                if (avg_yearly * 1.2) > base_extension:
                    base_extension = avg_yearly * 1.2

            if max_years > 0:
                yr1_extension = base_extension * 1.1
            else:
                yr1_extension = '-'
            if max_years > 1:
                yr2_extension = base_extension
            else:
                yr2_extension = '-'
            if max_years > 2:
                yr3_extension = base_extension * 0.95
            else:
                yr3_extension = '-'
            if max_years > 3:
                yr4_extension = base_extension * 0.90
            else:
                yr4_extension = '-'

            try:
                if yr1_extension < 1:
                    yr1_extension = 1
            except:
                pass
            try:
                if yr2_extension < 1:
                    yr2_extension = 1
            except:
                pass
            try:
                if yr3_extension < 1:
                    yr3_extension = 1
            except:
                pass
            try:
                if yr4_extension < 1:
                    yr4_extension = 1
            except:
                pass


            list1.append({'pos' : x.position,
                          'player' : x.name,
                          'team' : x.team,
                          'avg_yearly_cost' : avg_yearly,
                          'years_left' : num_years,
                          'base_extension_value' : base_extension,
                          'max_extension_length' : max_years,
                          '1yr_extension' : yr1_extension,
                          '2yr_extension' : yr2_extension,
                          '3yr_extension' : yr3_extension,
                          '4yr_extension' : yr4_extension,
                          })


    e = Team.objects.get(user=request.user)
    user_team = e.internal_name

    f = Variable.objects.get(name='Extensions Switch')
    ext_switch = f.int_variable

    g = Transaction.objects.filter(transaction_type='Extension Submitted').filter(var_t1='Pending')

    return render(request, 'league/league_extensions.html', {'player_list' : list1,
                                                             'user_team' : user_team,
                                                             'ext_switch' : ext_switch,
                                                             'submitted_extensions_list' : g})

def leaguesalarylists(request):
    #todo: change to sql pull to speed up
    qb_contents = SalaryListing.objects.filter(position='QB').order_by('position', '-yearly_cost')
    qb_first = (qb_contents[0].yearly_cost)*Decimal(1.05)

    rb_contents = SalaryListing.objects.filter(position='RB').order_by('position', '-yearly_cost')
    rb_first = (rb_contents[0].yearly_cost)*Decimal(1.05)

    wr_contents = SalaryListing.objects.filter(position='WR').order_by('position', '-yearly_cost')
    wr_first = (wr_contents[0].yearly_cost)*Decimal(1.05)

    te_contents = SalaryListing.objects.filter(position='TE').order_by('position', '-yearly_cost')
    te_first = (te_contents[0].yearly_cost)*Decimal(1.05)

    def_contents = SalaryListing.objects.filter(position='DEF').order_by('position', '-yearly_cost')
    def_first = (def_contents[0].yearly_cost)*Decimal(1.05)

    k_contents = SalaryListing.objects.filter(position='K').order_by('position', '-yearly_cost')
    k_first = (k_contents[0].yearly_cost)*Decimal(1.05)

    return render(request, 'league/league_salary_lists.html', {'qb_contents' : qb_contents,
                                                               'qb_zero_salary' : qb_first,
                                                               'rb_contents' : rb_contents,
                                                               'rb_zero_salary' : rb_first,
                                                               'wr_contents' : wr_contents,
                                                               'wr_zero_salary' : wr_first,
                                                               'te_contents' : te_contents,
                                                               'te_zero_salary' : te_first,
                                                               'def_contents' : def_contents,
                                                               'def_zero_salary' : def_first,
                                                               'k_contents' : k_contents,
                                                               'k_zero_salary' : k_first,})

def leagueadp(request):
    a = ADP.objects.all().order_by('rank')
    qb_list = []
    rb_list = []
    wr_list = []
    te_list = []
    def_list = []
    k_list = []

    num_qb = 0
    num_rb = 0
    num_wr = 0
    num_te = 0
    num_def = 0
    num_k = 0

    for x in a:
        if x.position == 'QB':
            num_qb += 1
            x.rank = num_qb
            qb_list.append(x)
        elif x.position == 'RB':
            num_rb += 1
            x.rank = num_rb
            rb_list.append(x)
        elif x.position == 'WR':
            num_wr += 1
            x.rank = num_wr
            wr_list.append(x)
        elif x.position == 'TE':
            num_te += 1
            x.rank = num_te
            te_list.append(x)
        elif x.position == 'Def':
            num_def += 1
            x.rank = num_def
            def_list.append(x)
        elif x.position == 'K':
            num_k += 1
            x.rank = num_k
            k_list.append(x)

    return render(request, 'league/league_adp.html', {'qb_list' : qb_list,
                                                      'rb_list' : rb_list,
                                                      'wr_list' : wr_list,
                                                      'te_list' : te_list,
                                                      'def_list' : def_list,
                                                      'k_list' : k_list})

def performancepage(request):
    a = Performance_Yr1.objects.all().order_by('rank')
    qb_yr1_list = []
    rb_yr1_list = []
    wr_yr1_list = []
    te_yr1_list = []
    def_yr1_list = []
    k_yr1_list = []

    num_yr1_qb = 0
    num_yr1_rb = 0
    num_yr1_wr = 0
    num_yr1_te = 0
    num_yr1_def = 0
    num_yr1_k = 0

    for x in a:
        if x.position == 'QB':
            num_yr1_qb += 1
            x.rank = num_yr1_qb
            qb_yr1_list.append(x)
        elif x.position == 'RB':
            num_yr1_rb += 1
            x.rank = num_yr1_rb
            rb_yr1_list.append(x)
        elif x.position == 'WR':
            num_yr1_wr += 1
            x.rank = num_yr1_wr
            wr_yr1_list.append(x)
        elif x.position == 'TE':
            num_yr1_te += 1
            x.rank = num_yr1_te
            te_yr1_list.append(x)
        elif x.position == 'DEF':
            num_yr1_def += 1
            x.rank = num_yr1_def
            def_yr1_list.append(x)
        elif x.position == 'K':
            num_yr1_k += 1
            x.rank = num_yr1_k
            k_yr1_list.append(x)
            
            
    b = Performance_Yr2.objects.all().order_by('rank')
    qb_yr2_list = []
    rb_yr2_list = []
    wr_yr2_list = []
    te_yr2_list = []
    def_yr2_list = []
    k_yr2_list = []

    num_yr2_qb = 0
    num_yr2_rb = 0
    num_yr2_wr = 0
    num_yr2_te = 0
    num_yr2_def = 0
    num_yr2_k = 0

    for x in b:
        if x.position == 'QB':
            num_yr2_qb += 1
            x.rank = num_yr2_qb
            qb_yr2_list.append(x)
        elif x.position == 'RB':
            num_yr2_rb += 1
            x.rank = num_yr2_rb
            rb_yr2_list.append(x)
        elif x.position == 'WR':
            num_yr2_wr += 1
            x.rank = num_yr2_wr
            wr_yr2_list.append(x)
        elif x.position == 'TE':
            num_yr2_te += 1
            x.rank = num_yr2_te
            te_yr2_list.append(x)
        elif x.position == 'Def':
            num_yr2_def += 1
            x.rank = num_yr2_def
            def_yr2_list.append(x)
        elif x.position == 'K':
            num_yr2_k += 1
            x.rank = num_yr2_k
            k_yr2_list.append(x)        
            
    return render(request, 'league/league_performance.html', {'qb_yr1_list' : qb_yr1_list,
                                                              'rb_yr1_list' : rb_yr1_list,
                                                              'wr_yr1_list' : wr_yr1_list,
                                                              'te_yr1_list' : te_yr1_list,
                                                              'def_yr1_list' : def_yr1_list,
                                                              'k_yr1_list' : k_yr1_list,
                                                              'qb_yr2_list' : qb_yr2_list,
                                                              'rb_yr2_list' : rb_yr2_list,
                                                              'wr_yr2_list' : wr_yr2_list,
                                                              'te_yr2_list' : te_yr2_list,
                                                              'def_yr2_list' : def_yr2_list,
                                                              'k_yr2_list' : k_yr2_list})

def leaguefuturedraftpicks(request):
    return render(request, 'league/league_future_draft_picks.html', {})

def leaguecapsummary(request):
    a = Player.objects.all()
    b = Team.objects.all()

    team_list = []
    salary_list = []
    current_cap_penalty = []
    cap_space = []

    for x in b:
        team_list.append(x.internal_name)

    for x in range(len(team_list)):
        salary_list.append(Decimal(0))
        current_cap_penalty.append(Decimal(0))
        cap_space.append(Decimal(0))

    for x in a:
        for y in range(len(team_list)):
            if x.team == team_list[y]:
                salary_list[y] += (Decimal(x.yr1_salary)+Decimal(x.yr1_sb))

    for x in b:
        for y in range(len(team_list)):
            if x.internal_name == team_list[y]:
                current_cap_penalty[y] += Decimal(x.yr1_cap_penalty)

    for x in range(len(team_list)):
        cap_space[x] = Decimal(200) - salary_list[x] - current_cap_penalty[x]

    summary_data = []
    for x in range(len(team_list)):
        summary_data.append([team_list[x], salary_list[x], current_cap_penalty[x], cap_space[x]])

    return render(request, 'league/league_cap_summary.html', {'summary_data' : summary_data})

def teamorganizationpage(request):
    def years_remaining(yr1_salary, yr2_salary, yr3_salary, yr4_salary, yr5_salary):
        year_count = 0
        if yr1_salary == 0:
            pass
        else:
            year_count += 1
        if yr2_salary == 0:
            pass
        else:
            year_count += 1
        if yr3_salary == 0:
            pass
        else:
            year_count += 1
        if yr4_salary == 0:
            pass
        else:
            year_count += 1
        if yr5_salary == 0:
            pass
        else:
            year_count += 1

        return year_count

    def average_yearly_cost(total_value, years_remaining):
        return total_value/years_remaining

    def current_year_cap_hit(yr1_salary, yr1_sb):
        return yr1_salary+yr1_sb

    def avail_roles(con, cur, team, position, name, yr1_role):

        avail_roles = []

        cur.execute('SELECT user FROM dyno_team WHERE internal_name=?', [team])
        selected_user = cur.fetchone()[0]

        cur.execute('SELECT role, unique_role, applies_to_QB, applies_to_RB, applies_to_WR, applies_to_TE, applies_to_DEF, applies_to_K FROM dyno_availablerole WHERE user=?', [selected_user])
        a = cur.fetchall()

        unique_list = []
        general_list = []

        #get two lists: unique roles avail to pos, general roles avail to pos
        if position == 'QB':
            for x in range(len(a)):
                if a[x][2] == 1:
                    if a[x][1] == 1:
                        unique_list.append(a[x][0])
                    else:
                        if a[x][0] != '--':
                            general_list.append(a[x][0])
        elif position == 'RB':
            for x in range(len(a)):
                if a[x][3] == 1:
                    if a[x][1] == 1:
                        unique_list.append(a[x][0])
                    else:
                        if a[x][0] != '--':
                            general_list.append(a[x][0])
        elif position == 'WR':
            for x in range(len(a)):
                if a[x][4] == 1:
                    if a[x][1] == 1:
                        unique_list.append(a[x][0])
                    else:
                        if a[x][0] != '--':
                            general_list.append(a[x][0])
        elif position == 'TE':
            for x in range(len(a)):
                if a[x][5] == 1:
                    if a[x][1] == 1:
                        unique_list.append(a[x][0])
                    else:
                        if a[x][0] != '--':
                            general_list.append(a[x][0])
        elif position == 'DEF':
            for x in range(len(a)):
                if a[x][6] == 1:
                    if a[x][1] == 1:
                        unique_list.append(a[x][0])
                    else:
                        if a[x][0] != '--':
                            general_list.append(a[x][0])
        elif position == 'K':
            for x in range(len(a)):
                if a[x][7] == 1:
                    if a[x][1] == 1:
                        unique_list.append(a[x][0])
                    else:
                        if a[x][0] != '--':
                            general_list.append(a[x][0])

        #for unique list:
        #pull list of players from team, remove this player

        #iterate thru players, check if player's role is in unique list, remove if so
        cur.execute('SELECT name, yr1_role FROM dyno_player WHERE team=?', [team])
        c = cur.fetchall()

        c_to_remove = ''
        for x in range(len(c)):
            if c[x][0] == name:
                c_to_remove = x
        if c_to_remove == '':
            print('Error')
        else:
            c.pop(c_to_remove)

        uniques_to_remove = []
        for x in range(len(c)):
            if c[x][1] in unique_list:
                uniques_to_remove.append(c[x][1])
        final_uniques_list = []
        for x in range(len(unique_list)):
            if unique_list[x] in uniques_to_remove:
                pass
            else:
                final_uniques_list.append(unique_list[x])

        #join unique list and general list
        avail_roles = ['--'] + final_uniques_list + general_list

        return avail_roles

    if working_local == True:
        con = sql3.connect('db.sqlite3')
    else:
        con = sql3.connect('/home/spflynn/dyno-site/db.sqlite3')
    cur = con.cursor()

    a = TeamVariable.objects.filter(name='TeamSelectedForOrg').get(user=request.user)
    team_selected = a.text_variable
    a.text_variable = ''
    a.save()

    aa = Team.objects.get(user=request.user)
    user_team = aa.internal_name

    if team_selected == '' or team_selected is None:
        team_selected = user_team

    if user_team == team_selected:
        f_t = aa.filtered_tags
        filtered_tags = f_t.strip().split(',')[:-1]
    else:
        filtered_tags = []

    cur.execute('SELECT team_org_view_selected FROM dyno_team WHERE internal_name=?', [user_team])
    b1 = cur.fetchone()
    team_view = b1[0]
    if team_view == '':
        team_view = 'default'

    cur.execute('SELECT internal_name FROM dyno_team')
    c = cur.fetchall()
    team_list = []
    for x in range(0,len(c)):
        team_list.append(c[x][0])

    cur.execute('SELECT nickname, user, flex_1, flex_2, yr1_cap_penalty FROM dyno_team WHERE internal_name=?', [team_selected])
    d = cur.fetchone()
    nickname = d[0]
    selected_user = d[1]
    flex_1 = d[2]
    flex_2 = d[3]
    cap_penalty = d[4]

    cur.execute('SELECT name, position, yr1_role, total_value FROM dyno_player WHERE team=?', [team_selected])
    e = cur.fetchall()

    player_list = []
    total_cost = 0

    for x in range(len(e)):
        cur.execute('SELECT yr1_role, position, total_value, yr1_salary, yr2_salary, yr3_salary, yr4_salary, yr5_salary, yr1_sb, team FROM dyno_player WHERE name=?', [e[x][0]])
        p_list = cur.fetchone()

        years_rem = years_remaining(p_list[3], p_list[4], p_list[5], p_list[6], p_list[7])
        avg_yearly = average_yearly_cost(p_list[2], years_rem)
        curr_cap_hit = current_year_cap_hit(p_list[3], p_list[8])
        avail_ro = avail_roles(con, cur, p_list[9], p_list[1], e[x][0], p_list[0])

        player_list.append({'name': e[x][0],
                            'pos': e[x][1],
                            'role' : e[x][2],
                            'total_value': e[x][3],
                            'yrs_left': years_rem,
                            'avg_yearly': avg_yearly,
                            'cap_hit': curr_cap_hit,
                            'avail_roles': avail_ro,})

        total_cost += (p_list[3] + p_list[8])

    cur.execute('SELECT role, unique_role, applies_to_QB, applies_to_RB, applies_to_WR, applies_to_TE, applies_to_DEF, applies_to_K FROM dyno_availablerole WHERE user=?', [selected_user])
    f = cur.fetchall()

    avail_roles_all = []
    for x in range(len(f)):
        avail_roles_all.append({'role': f[x][0],
                                'unique_role': f[x][1],
                                'applies_to_QB': f[x][2],
                                'applies_to_RB': f[x][3],
                                'applies_to_WR': f[x][4],
                                'applies_to_TE': f[x][5],
                                'applies_to_DEF': f[x][6],
                                'applies_to_K': f[x][7],})

    g = Team.objects.all()
    for x in g:
        if x.internal_name == user_team:
            user_team_index = x.id

    cap_space = Decimal(200) - Decimal(total_cost) - Decimal(cap_penalty)

    cur.close()
    con.close()

    return render(request, 'team/team_organization.html', {'team_selected' : team_selected,
                                                           'user_team' : user_team,
                                                           'team_view' : team_view,
                                                           'team_list' : team_list,
                                                           'nickname' : nickname,
                                                           'flex_1' : flex_1,
                                                           'flex_2' : flex_2,
                                                           'player_list' : player_list,
                                                           'current_user' : selected_user,
                                                           'avail_roles' : avail_roles_all,
                                                           'user_team_index': user_team_index,
                                                           'cap_penalty' : cap_penalty,
                                                           'total_cost' : total_cost,
                                                           'cap_space' : cap_space,
                                                           'filtered_tags' : filtered_tags})

def teamcapsituationpage(request):
    def avail_roles(con, cur, team, position, name, which_year):

        avail_roles = []

        cur.execute('SELECT user FROM dyno_team WHERE internal_name=?', [team])
        selected_user = cur.fetchone()[0]

        cur.execute('SELECT role, unique_role, applies_to_QB, applies_to_RB, applies_to_WR, applies_to_TE, applies_to_DEF, applies_to_K FROM dyno_availablerole WHERE user=?', [selected_user])
        a = cur.fetchall()

        unique_list = []
        general_list = []

        #get two lists: unique roles avail to pos, general roles avail to pos
        if position == 'QB':
            for x in range(len(a)):
                if a[x][2] == 1:
                    if a[x][1] == 1:
                        unique_list.append(a[x][0])
                    else:
                        if a[x][0] != '--':
                            general_list.append(a[x][0])
        elif position == 'RB':
            for x in range(len(a)):
                if a[x][3] == 1:
                    if a[x][1] == 1:
                        unique_list.append(a[x][0])
                    else:
                        if a[x][0] != '--':
                            general_list.append(a[x][0])
        elif position == 'WR':
            for x in range(len(a)):
                if a[x][4] == 1:
                    if a[x][1] == 1:
                        unique_list.append(a[x][0])
                    else:
                        if a[x][0] != '--':
                            general_list.append(a[x][0])
        elif position == 'TE':
            for x in range(len(a)):
                if a[x][5] == 1:
                    if a[x][1] == 1:
                        unique_list.append(a[x][0])
                    else:
                        if a[x][0] != '--':
                            general_list.append(a[x][0])
        elif position == 'DEF':
            for x in range(len(a)):
                if a[x][6] == 1:
                    if a[x][1] == 1:
                        unique_list.append(a[x][0])
                    else:
                        if a[x][0] != '--':
                            general_list.append(a[x][0])
        elif position == 'K':
            for x in range(len(a)):
                if a[x][7] == 1:
                    if a[x][1] == 1:
                        unique_list.append(a[x][0])
                    else:
                        if a[x][0] != '--':
                            general_list.append(a[x][0])

        #for unique list:
        #pull list of players from team, remove this player

        #iterate thru players, check if player's role is in unique list, remove if so
        if which_year == 1:
            cur.execute('SELECT name, yr1_role FROM dyno_player WHERE team=?', [team])
        elif which_year == 2:
            cur.execute('SELECT name, yr2_role FROM dyno_player WHERE team=?', [team])
        elif which_year == 3:
            cur.execute('SELECT name, yr3_role FROM dyno_player WHERE team=?', [team])
        elif which_year == 4:
            cur.execute('SELECT name, yr4_role FROM dyno_player WHERE team=?', [team])
        elif which_year == 5:
            cur.execute('SELECT name, yr5_role FROM dyno_player WHERE team=?', [team])

        c = cur.fetchall()

        c_to_remove = ''
        for x in range(len(c)):
            if c[x][0] == name:
                c_to_remove = x
        if c_to_remove == '':
            print('Error')
        else:
            c.pop(c_to_remove)

        uniques_to_remove = []
        for x in range(len(c)):
            if c[x][1] in unique_list:
                uniques_to_remove.append(c[x][1])
        final_uniques_list = []
        for x in range(len(unique_list)):
            if unique_list[x] in uniques_to_remove:
                pass
            else:
                final_uniques_list.append(unique_list[x])

        #join unique list and general list
        avail_roles = ['--'] + final_uniques_list + general_list

        return avail_roles

    if working_local == True:
        con = sql3.connect('db.sqlite3')
    else:
        con = sql3.connect('/home/spflynn/dyno-site/db.sqlite3')
    cur = con.cursor()

    a = Team.objects.get(user=request.user)
    team = a.internal_name
    cap_pen_yr1 = a.yr1_cap_penalty
    cap_pen_yr2 = a.yr2_cap_penalty
    cap_pen_yr3 = a.yr3_cap_penalty
    cap_pen_yr4 = a.yr4_cap_penalty
    cap_pen_yr5 = a.yr5_cap_penalty
    f_t = a.filtered_tags
    filtered_tags = f_t.strip().split(',')[:-1]


    cur.execute('SELECT * FROM dyno_player WHERE team=?', [team])
    b1 = cur.fetchall()

    team_json1 = []

    for x in b1:
        avail_ro_1 = avail_roles(con, cur, team, x[1], x[2], 1)
        avail_ro_2 = avail_roles(con, cur, team, x[1], x[2], 2)
        avail_ro_3 = avail_roles(con, cur, team, x[1], x[2], 3)
        avail_ro_4 = avail_roles(con, cur, team, x[1], x[2], 4)
        avail_ro_5 = avail_roles(con, cur, team, x[1], x[2], 5)
        team_json1.append({'yr1_role': x[19],
                         'yr2_role' : x[20],
                         'yr3_role' : x[21],
                         'yr4_role' : x[22],
                         'yr5_role' : x[23],
                          'pos' : x[1],
                          'name' : x[2],
                          'contract_type' : x[4],
                          'yr1_salary' : x[8],
                          'yr2_salary' : x[9],
                          'yr3_salary' : x[10],
                          'yr4_salary' : x[11],
                          'yr5_salary' : x[12],
                          'yr1_sb' : x[13],
                          'yr2_sb' : x[14],
                          'yr3_sb' : x[15],
                          'yr4_sb' : x[16],
                          'yr5_sb' : x[17],
                          'notes' : x[18],
                          'avail_roles_yr1' : avail_ro_1,
                          'avail_roles_yr2' : avail_ro_2,
                          'avail_roles_yr3' : avail_ro_3,
                          'avail_roles_yr4' : avail_ro_4,
                          'avail_roles_yr5' : avail_ro_5,})

    cur.execute('SELECT role, unique_role, applies_to_QB, applies_to_RB, applies_to_WR, applies_to_TE, applies_to_DEF, applies_to_K FROM dyno_availablerole WHERE user=?', [str(request.user)])
    c = cur.fetchall()

    avail_roles_all = []
    for x in range(len(c)):
        avail_roles_all.append({'role': c[x][0],
                                'unique_role': c[x][1],
                                'applies_to_QB': c[x][2],
                                'applies_to_RB': c[x][3],
                                'applies_to_WR': c[x][4],
                                'applies_to_TE': c[x][5],
                                'applies_to_DEF': c[x][6],
                                'applies_to_K': c[x][7],})

    cur.close()
    con.close()

    return render(request, 'team/team_cap_situation.html', {'team_json' : team_json1,
                                                            'avail_roles' : avail_roles_all,
                                                            'cap_pen_yr1' : cap_pen_yr1,
                                                            'cap_pen_yr2' : cap_pen_yr2,
                                                            'cap_pen_yr3' : cap_pen_yr3,
                                                            'cap_pen_yr4' : cap_pen_yr4,
                                                            'cap_pen_yr5' : cap_pen_yr5,
                                                            'filtered_tags' : filtered_tags,
                                                            'year_list' : year_list})

def teamsettingspage(request):
    a = Team.objects.get(user=request.user)

    team_name = a.nickname
    user_email = a.email
    yr1_balance = a.yr1_balance
    yr2_balance = a.yr2_balance
    yr3_balance = a.yr3_balance
    yr1_bonuses = a.yr1_bonuses
    yr2_bonuses = a.yr2_bonuses
    yr3_bonuses = a.yr3_bonuses
    current_balance = a.current_balance

    f = a.filtered_tags
    filtered_tags = f.strip().split(',')[:-1]

    b = AvailableRole.objects.filter(user=request.user).order_by('role')
    roles_list = []
    for x in b:
        roles_list.append({'role' : x.role,
                           'description' : x.description})

    return render(request, 'team/team_settings.html', {'team_name' : team_name,
                                                       'user_email' : user_email,
                                                       'yr1_balance' : yr1_balance,
                                                       'yr2_balance' : yr2_balance,
                                                       'yr3_balance' : yr3_balance,
                                                       'yr1_bonuses' : yr1_bonuses,
                                                       'yr2_bonuses' : yr2_bonuses,
                                                       'yr3_bonuses' : yr3_bonuses,
                                                       'current_balance' : current_balance,
                                                       'filtered_tags' : filtered_tags,
                                                       'role_list' : roles_list})

def teampendingtransactionspage(request):
    a = Team.objects.get(user=request.user)
    team = a.internal_name
    b = Transaction.objects.filter(var_t1='Pending').filter(team2=team)
    return render(request, 'team/team_pending_transactions.html', {'transactions' : b})

def teamtransactionspage(request):
    #a = Transaction.objects.filter().order_by('-date')
    team = Team.objects.get(user=request.user)
    a = Transaction.objects.filter(Q(team1=team) | Q(team2=team)).order_by('-date')
    trans_list = []
    for x in a:
        trans_list.append(x.transaction_type)
    trans_list = list(set(trans_list))
    trans_list = sorted(trans_list)
    return render(request, 'team/team_transactions.html', {'transactions' : a,
                                                           'trans_list' : trans_list})

def teamreleaseplayerspage(request):
    current_user = str(request.user)
    a = Team.objects.get(user=current_user)
    team = a.internal_name
    cap_pen_yr1 = a.yr1_cap_penalty
    cap_pen_yr2 = a.yr2_cap_penalty
    cap_pen_yr3 = a.yr3_cap_penalty
    cap_pen_yr4 = a.yr4_cap_penalty
    cap_pen_yr5 = a.yr5_cap_penalty

    b = Player.objects.filter(team=team).order_by('-total_value')
    QB_list = []
    RB_list = []
    WR_list = []
    TE_list = []
    DEF_K_list = []
    for x in b:
        if x.position == 'QB':
            QB_list.append({'pos' : x.position,
                               'name' : x.name,
                                'contract_type' : x.contract_type,
                                'yr1_salary' : x.yr1_salary,
                                'yr2_salary' : x.yr2_salary,
                                'yr3_salary' : x.yr3_salary,
                                'yr4_salary' : x.yr4_salary,
                                'yr5_salary' : x.yr5_salary,
                                'yr1_sb' : x.yr1_sb,
                                'yr2_sb' : x.yr2_sb,
                                'yr3_sb' : x.yr3_sb,
                                'yr4_sb' : x.yr4_sb,
                                'yr5_sb' : x.yr5_sb,})
        elif x.position == 'RB':
            RB_list.append({'pos' : x.position,
                               'name' : x.name,
                                'contract_type' : x.contract_type,
                                'yr1_salary' : x.yr1_salary,
                                'yr2_salary' : x.yr2_salary,
                                'yr3_salary' : x.yr3_salary,
                                'yr4_salary' : x.yr4_salary,
                                'yr5_salary' : x.yr5_salary,
                                'yr1_sb' : x.yr1_sb,
                                'yr2_sb' : x.yr2_sb,
                                'yr3_sb' : x.yr3_sb,
                                'yr4_sb' : x.yr4_sb,
                                'yr5_sb' : x.yr5_sb,})
        elif x.position == 'WR':
            WR_list.append({'pos' : x.position,
                               'name' : x.name,
                                'contract_type' : x.contract_type,
                                'yr1_salary' : x.yr1_salary,
                                'yr2_salary' : x.yr2_salary,
                                'yr3_salary' : x.yr3_salary,
                                'yr4_salary' : x.yr4_salary,
                                'yr5_salary' : x.yr5_salary,
                                'yr1_sb' : x.yr1_sb,
                                'yr2_sb' : x.yr2_sb,
                                'yr3_sb' : x.yr3_sb,
                                'yr4_sb' : x.yr4_sb,
                                'yr5_sb' : x.yr5_sb,})
        elif x.position == 'TE':
            TE_list.append({'pos' : x.position,
                               'name' : x.name,
                                'contract_type' : x.contract_type,
                                'yr1_salary' : x.yr1_salary,
                                'yr2_salary' : x.yr2_salary,
                                'yr3_salary' : x.yr3_salary,
                                'yr4_salary' : x.yr4_salary,
                                'yr5_salary' : x.yr5_salary,
                                'yr1_sb' : x.yr1_sb,
                                'yr2_sb' : x.yr2_sb,
                                'yr3_sb' : x.yr3_sb,
                                'yr4_sb' : x.yr4_sb,
                                'yr5_sb' : x.yr5_sb,})
        else:
            DEF_K_list.append({'pos' : x.position,
                               'name' : x.name,
                                'contract_type' : x.contract_type,
                                'yr1_salary' : x.yr1_salary,
                                'yr2_salary' : x.yr2_salary,
                                'yr3_salary' : x.yr3_salary,
                                'yr4_salary' : x.yr4_salary,
                                'yr5_salary' : x.yr5_salary,
                                'yr1_sb' : x.yr1_sb,
                                'yr2_sb' : x.yr2_sb,
                                'yr3_sb' : x.yr3_sb,
                                'yr4_sb' : x.yr4_sb,
                                'yr5_sb' : x.yr5_sb,})

    player_list = []

    for x in QB_list:
        player_list.append(x)
    for x in RB_list:
        player_list.append(x)
    for x in WR_list:
        player_list.append(x)
    for x in TE_list:
        player_list.append(x)
    for x in DEF_K_list:
        player_list.append(x)

    team_info = {'yr1_cap_pen' : cap_pen_yr1,
                'yr2_cap_pen' : cap_pen_yr2,
                'yr3_cap_pen' : cap_pen_yr3,
                'yr4_cap_pen' : cap_pen_yr4,
                'yr5_cap_pen' : cap_pen_yr5,}

    return render(request, 'team/team_release_players.html', {'player_list' : player_list,
                                                              'team_info' : team_info,
                                                              'years_list' : year_list})

def teamalertspage(request):
    type_list = ['Auction - Outbid', 'Auction - New Auction', 'Auction - Won']
    a = Alert.objects.filter(user=request.user).order_by('-date')
    b = []
    for x in a:
        if x.alert_type in type_list:
            b.append(x)
    return render(request, 'team/team_alerts.html', {'type_list' : type_list,
                                                     'alerts' : b})

def teammanagealerts(request):
    a = AlertSetting.objects.get(user=request.user)
    return render(request, 'team/team_manage_alerts.html', {'alert_settings' : a})

def playerpage(request):
    a = TeamVariable.objects.filter(user=request.user).get(name='PlayerForPlayerPage')
    player_selected = a.text_variable
    a.text_variable = ''
    a.save()

    b = Player.objects.order_by('name')
    player_list = []
    for x in b:
        player_list.append(x.name)

    c = Team.objects.all()
    team_list = []
    for x in c:
        team_list.append(x.internal_name)

    return render(request, 'player.html', {'player_list' : player_list,
                                           'player_selected' : player_selected,
                                           'team_list' : team_list,
                                           'year_list' : year_list})

def settingspage(request):
    #use commishofficepage instead
    return render(request, 'admin/settings.html', {})

def batchpage(request):
    return render(request, 'admin/batch.html', {})

def processplayercontractsbatch(request):
    c = request.POST['player_contract_text']
    if c == '':
        return HttpResponseRedirect('/batch')
    c_list = c.strip().split('\r\n')
    for x in range(len(c_list)):
        c_list[x] = c_list[x].strip().split(':')

    for x in range(len(c_list)):
        c_list[x][4] = Decimal(c_list[x][4])
        try:
            c_list[x][5] = Decimal(c_list[x][5])
        except:
            c_list[x][5] = 0
        try:
            c_list[x][6] = Decimal(c_list[x][6])
        except:
            c_list[x][6] = 0
        try:
            c_list[x][7] = Decimal(c_list[x][7])
        except:
            c_list[x][7] = 0
        try:
            c_list[x][8] = Decimal(c_list[x][8])
        except:
            c_list[x][8] = 0
        contract_length = 0
        for y in range(4,9):
            if c_list[x][y] == 0:
                pass
            else:
                contract_length += 1
        position = c_list[x][0]
        name = c_list[x][1]
        team = c_list[x][2]
        contract_type = c_list[x][3]
        total_value = c_list[x][4]+c_list[x][5]+c_list[x][6]+c_list[x][7]+c_list[x][8]
        signing_bonus = round((c_list[x][5]+c_list[x][6]+c_list[x][7]+c_list[x][8])*Decimal(0.4),1)
        salary = total_value - signing_bonus
        yr1_sal = c_list[x][4]
        try:
            yr2_sal = ((c_list[x][5])/(total_value-yr1_sal))*(salary-yr1_sal)
        except:
            yr2_sal = 0
        try:
            yr3_sal = ((c_list[x][6])/(total_value-yr1_sal))*(salary-yr1_sal)
        except:
            yr3_sal = 0
        try:
            yr4_sal = ((c_list[x][7])/(total_value-yr1_sal))*(salary-yr1_sal)
        except:
            yr4_sal = 0
        try:
            yr5_sal = ((c_list[x][8])/(total_value-yr1_sal))*(salary-yr1_sal)
        except:
            yr5_sal = 0
        yr1_sb = 0
        if yr2_sal == 0:
            yr2_sb = 0
        else:
            yr2_sb = signing_bonus / (contract_length-1)
        if yr3_sal == 0:
            yr3_sb = 0
        else:
            yr3_sb = signing_bonus / (contract_length-1)
        if yr4_sal == 0:
            yr4_sb = 0
        else:
            yr4_sb = signing_bonus / (contract_length-1)
        if yr5_sal == 0:
            yr5_sb = 0
        else:
            yr5_sb = signing_bonus / (contract_length-1)
        notes = c_list[x][9]
        Player.objects.create(position=position,
                              name=name,
                              team=team,
                              contract_type=contract_type,
                              total_value=total_value,
                              signing_bonus=signing_bonus,
                              salary=salary,
                              yr1_salary=yr1_sal,
                              yr2_salary=yr2_sal,
                              yr3_salary=yr3_sal,
                              yr4_salary=yr4_sal,
                              yr5_salary=yr5_sal,
                              yr1_sb=yr1_sb,
                              yr2_sb=yr2_sb,
                              yr3_sb=yr3_sb,
                              yr4_sb=yr4_sb,
                              yr5_sb=yr5_sb,
                              notes=notes,
                              yr1_role='--',
                              yr2_role='--',
                              yr3_role='--',
                              yr4_role='--',
                              yr5_role='--',)
        print(x)
    return HttpResponseRedirect('/batch')

def processsalarylistsbatch(request):
    c = request.POST['salary_lists_text']
    if c == '':
        return HttpResponseRedirect('/batch')
    c_list = c.strip().split('\r\n')
    for x in range(len(c_list)):
        c_list[x] = c_list[x].strip().split(':')
    print(c_list)
    for x in range(len(c_list)):
        c_list[x][2] = Decimal(c_list[x][2])
        position = c_list[x][0]
        name = c_list[x][1]
        salary = c_list[x][2]
        SalaryListing.objects.create(position=position,
                                     name=name,
                                     yearly_cost=salary)
        print(x)
    return HttpResponseRedirect('/batch')

def resetallroles(request):
    a = Player.objects.all()
    count = 0
    for x in a:
        count += 1
        x.yr1_role = '--'
        x.yr2_role = '--'
        x.yr3_role = '--'
        x.yr4_role = '--'
        x.yr5_role = '--'
        x.save()
        print(count)

    return HttpResponseRedirect('/')

def resetavailableroles(request):
    AvailableRole.objects.all().delete()
    #fields = role, description, applies_to_QB, applies_to_RB, applies_to_WR, applies_to_TE, applies_to_DEF, applies_to_K, unique_role
    default_roles = [['--','no role', True, True, True, True, True, True, False],
                     ['QB 1','', True, False, False, False, False, False, True],
                     ['QB 2','', True, False, False, False, False, False, True],
                     ['QB 3','', True, False, False, False, False, False, True],
                     ['D-QB','Developmental QB', True, False, False, False, False, False, False],
                     ['RB 1','', False, True, False, False, False, False, True],
                     ['RB 2','', False, True, False, False, False, False, True],
                     ['RB 3','', False, True, False, False, False, False, True],
                     ['RB 4','', False, True, False, False, False, False, True],
                     ['RB 5','', False, True, False, False, False, False, True],
                     ['RB 6','', False, True, False, False, False, False, True],
                     ['D-RB','Developmental RB', False, True, False, False, False, False, False],
                     ['WR 1','', False, False, True, False, False, False, True],
                     ['WR 2','', False, False, True, False, False, False, True],
                     ['WR 3','', False, False, True, False, False, False, True],
                     ['WR 4','', False, False, True, False, False, False, True],
                     ['WR 5','', False, False, True, False, False, False, True],
                     ['WR 6','', False, False, True, False, False, False, True],
                     ['D-WR','Developmental WR', False, False, True, False, False, False, False],
                     ['TE 1','', False, False, False, True, False, False, True],
                     ['TE 2','', False, False, False, True, False, False, True],
                     ['TE 3','', False, False, False, True, False, False, True],
                     ['D-TE','Developmental TE', False, False, False, True, False, False, False],
                     ['IR','Player on Injured Reserve', True, True, True, True, True, True, False],
                     ['Trade','Player to be traded', True, True, True, True, True, True, False],
                     ['Release','Player to be released', True, True, True, True, True, True, False]]
    a = Team.objects.all()

    for x in a:
        count = -1
        for y in default_roles:
            count += 1
            AvailableRole.objects.create(user=x.user,
                                         role=y[0],
                                         description=y[1],
                                         applies_to_QB=y[2],
                                         applies_to_RB=y[3],
                                         applies_to_WR=y[4],
                                         applies_to_TE=y[5],
                                         applies_to_DEF=y[6],
                                         applies_to_K=y[7],
                                         unique_role=y[8])
    return HttpResponseRedirect('/')

def testview(request):
    b = Player.objects.order_by('name')
    test_list = []
    for x in b:
        test_list.append(x.name)

    if working_local == True:
        con = sql3.connect('db.sqlite3')
    else:
        con = sql3.connect('/home/spflynn/dyno-site/db.sqlite3')
    cur = con.cursor()

    cur.execute('SELECT name, yr1_role, position, total_value FROM dyno_player WHERE team=?', ['Flynn'])
    e = cur.fetchall()

    player_list = []

    for x in range(len(e)):
        player_list.append({'player': e[x][0],
                            'role': e[x][1],
                            'pos' : e[x][2],})

    cur.close()
    con.close()

    return render(request, 'testing.html', {'test_list' : test_list,
                                            'player_list': player_list})

def user_change_password_page(request):
    a = Team.objects.get(user=request.user)

    username = a.user

    return render(request, 'admin/user_change_password.html', {'username' : username})

def bugtrackingpage(request):
    a = Bug.objects.all()

    bug_list = []

    for x in a:
        bug_list.append({'user' : x.user,
                         'date' : x.date,
                         'os' : x.os,
                         'browser' : x.browser,
                         'resolution' : x.resolution,
                         'other_env' : x.other_envirn,
                         'report' : x.report,
                         'title' : x.title,
                         'category' : x.category,
                         'status' : x.status,
                         'priority' : x.priority,
                         'comments' : x.comments,
                         'id' : x.id})

    return render(request, 'admin/bug_tracking.html', {'bug_list' : bug_list})

def newbugpage(request):
    e = os.environ
    o = request.user_agent.os
    b = request.META['HTTP_USER_AGENT']
    return render(request, 'admin/new_bug.html', {'environ' : e,
                                                  'os' : o,
                                                  'browser' : b})

def featurerequestpage(request):


    return render(request, 'admin/feature_request.html', {})

def featurelistchangelogpage(request):
    a = Message.objects.get(name='Features List')
    features_list = a.content

    b = Message.objects.get(name='Changelog')
    changelog = b.content

    return render(request, 'admin/feature_list.html', {'features_list' : features_list,
                                                       'changelog' : changelog})

def commishofficepage(request):
    a = Variable.objects.get(name='Default AuctionClock')
    default_auction_clock = int(a.int_variable / 60)

    b = Variable.objects.get(name='Extensions Switch')
    ext_switch = int(b.int_variable)

    c = Variable.objects.get(name='CommishPeriodicState')
    commish_periodic = int(c.int_variable)

    return render(request, 'admin/settings.html', {'default_auction_clock' : default_auction_clock,
                                                   'ext_switch' : ext_switch,
                                                   'commish_periodic' : commish_periodic})

def commishviewmodel(request):
    a = Player.objects.all().order_by('name')
    return render(request, 'commish/commish_view_model.html', {'players' : a})

def commisheditmodel(request):
    if request.method == 'POST':
        player = Player.objects.get(name=request.POST['name'])
        form = PlayerForm(request.POST, instance=player)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/commish/view_model')
        else:
            return HttpResponse('form wasnt valid')
    else:
        a = Variable.objects.get(name='player selected')
        get_player = a.text_variable
        player = Player.objects.get(name=get_player)
        form = PlayerForm(instance=player)
        a.text_variable = ''
        a.save()

    return render(request, 'model_edit/model_edit_player.html', {'form' : form})

def commishtransactionpage(request):
    a = Transaction.objects.all().order_by('-date')
    trans_list = []
    for x in a:
        trans_list.append(x.transaction_type)
    trans_list = list(set(trans_list))
    trans_list = sorted(trans_list)
    return render(request, 'commish/commish_transactions.html', {'transactions' : a,
                                                                 'type_list' : trans_list})

def commishpendingtransactionspage(request):
    b = Transaction.objects.filter(var_t1='Pending').filter(var_t2='Confirmed')
    return render(request, 'commish/commish_pending_transactions.html', {'transactions' : b})

def commishpendingalerts(request):
    a = Alert.objects.filter(user='commish').order_by('-date')
    type_list = []
    for x in a:
        type_list.append(x.alert_type)
    type_list = list(set(type_list))
    type_list = sorted(type_list)
    return render(request, 'commish/commish_pending_alerts.html', {'type_list' : type_list,
                                                                    'alerts' : a})

def commishallalerts(request):
    a = Alert.objects.all().order_by('-date')
    type_list = []
    for x in a:
        type_list.append(x.alert_type)
    type_list = list(set(type_list))
    type_list = sorted(type_list)
    return render(request, 'commish/commish_all_alerts.html', {'type_list' : type_list,
                                                               'alerts' : a})

def setcontractstructurepage(request):
    a = TeamVariable.objects.filter(user=request.user).get(name='PlayerForConStr')
    player = a.text_variable
    a.text_variable = ''
    a.save()

    b = Transaction.objects.filter(player=player).get(var_t1='Pending')

    c = Message.objects.get(name='New Con Str Instructions')
    instructions = c.content

    signing_bonus = b.var_d1 * Decimal(0.40)
    signing_bonus = round(signing_bonus*20)/20

    salary = b.var_d1 - Decimal(signing_bonus)

    d = Player.objects.get(name=player)
    pos = d.position

    max_years = 0

    if pos == 'QB':
        qb_contents = SalaryListing.objects.filter(position='QB').order_by('position', '-yearly_cost')
        if b.var_d1 > Decimal(qb_contents[7].yearly_cost):
            max_years = 5
        elif b.var_d1 > Decimal(qb_contents[14].yearly_cost):
            max_years = 4
        else:
            max_years = 3
    elif pos == 'RB':
        rb_contents = SalaryListing.objects.filter(position='RB').order_by('position', '-yearly_cost')
        if b.var_d1 > Decimal(rb_contents[14].yearly_cost):
            max_years = 5
        elif b.var_d1 > Decimal(rb_contents[29].yearly_cost):
            max_years = 4
        else:
            max_years = 3
    elif pos == 'WR':
        wr_contents = SalaryListing.objects.filter(position='WR').order_by('position', '-yearly_cost')
        if b.var_d1 > Decimal(wr_contents[19].yearly_cost):
            max_years = 5
        elif b.var_d1 > Decimal(wr_contents[39].yearly_cost):
            max_years = 4
        else:
            max_years = 3
    elif pos == 'TE':
        te_contents = SalaryListing.objects.filter(position='TE').order_by('position', '-yearly_cost')
        if b.var_d1 > Decimal(te_contents[5].yearly_cost):
            max_years = 5
        elif b.var_d1 > Decimal(te_contents[11].yearly_cost):
            max_years = 4
        else:
            max_years = 3
    elif pos == 'DEF':
        max_years = 5
    elif pos == 'K':
        max_years = 5

    f = Team.objects.get(user=request.user)
    team = f.internal_name

    e = Player.objects.filter(team=team)
    yr1_costs = 0
    yr2_costs = 0
    yr3_costs = 0
    yr4_costs = 0
    yr5_costs = 0

    for x in e:
        yr1_costs += (x.yr1_salary + x.yr1_sb)
        yr2_costs += (x.yr2_salary + x.yr2_sb)
        yr3_costs += (x.yr3_salary + x.yr3_sb)
        yr4_costs += (x.yr4_salary + x.yr4_sb)
        yr5_costs += (x.yr5_salary + x.yr5_sb)

    g = Team.objects.get(internal_name=team)

    yr1_cap_penalty = 0
    yr2_cap_penalty = 0
    yr3_cap_penalty = 0
    yr4_cap_penalty = 0
    yr5_cap_penalty = 0

    if g.yr1_cap_penalty != None:
        yr1_cap_penalty = g.yr1_cap_penalty

    if g.yr2_cap_penalty != None:
        yr2_cap_penalty = g.yr2_cap_penalty

    if g.yr3_cap_penalty != None:
        yr3_cap_penalty = g.yr3_cap_penalty

    if g.yr4_cap_penalty != None:
        yr4_cap_penalty = g.yr4_cap_penalty

    if g.yr5_cap_penalty != None:
        yr5_cap_penalty = g.yr5_cap_penalty

    yr1_space = Decimal(200) - Decimal(yr1_costs) - yr1_cap_penalty
    yr2_space = Decimal(200) - Decimal(yr2_costs) - yr2_cap_penalty
    yr3_space = Decimal(200) - Decimal(yr3_costs) - yr3_cap_penalty
    yr4_space = Decimal(200) - Decimal(yr4_costs) - yr4_cap_penalty
    yr5_space = Decimal(200) - Decimal(yr5_costs) - yr5_cap_penalty


    cap_dict =      {'yr1_costs' : yr1_costs,
                   'yr2_costs' : yr2_costs,
                   'yr3_costs' : yr3_costs,
                   'yr4_costs' : yr4_costs,
                   'yr5_costs' : yr5_costs,
                   'yr1_pen' : yr1_cap_penalty,
                   'yr2_pen' : yr2_cap_penalty,
                   'yr3_pen' : yr3_cap_penalty,
                   'yr4_pen' : yr4_cap_penalty,
                   'yr5_pen' : yr5_cap_penalty,
                   'yr1_space' : yr1_space,
                   'yr2_space' : yr2_space,
                   'yr3_space' : yr3_space,
                   'yr4_space' : yr4_space,
                   'yr5_space' : yr5_space}

    return render(request, 'team/confirm_contract_structure.html', {'player' : b,
                                                                    'instructions' : instructions,
                                                                    'sb' : signing_bonus,
                                                                    'salary' : salary,
                                                                    'max_years' : max_years,
                                                                    'cap_dict' : cap_dict,
                                                                    'year_list' : year_list})

def transactionsingleplayer(request):
    a = Variable.objects.get(name='player selected')
    id_selected = a.int_variable
    a.int_variable = 0
    a.save()

    b = Transaction.objects.get(pk=id_selected)
    player = b.player

    c = Player.objects.get(name=player)

    return render(request, 'commish/transaction_single_player.html', {'transaction' : b,
                                                                      'player' : c})

def tagspage(request):
    aa = Team.objects.get(user=request.user)
    team = aa.internal_name
    waiver_extension_flag = aa.yr1_bonuses.strip().split(',')[1]

    b = ADP.objects.all().order_by('rank')
    c = Performance_Yr1.objects.all().order_by('rank')
    d = Performance_Yr2.objects.all().order_by('rank')
    e = SalaryListing.objects.all().order_by('-yearly_cost')

    salary_listing_qb = []
    salary_listing_rb = []
    salary_listing_wr = []
    salary_listing_te = []
    salary_listing_def = []
    salary_listing_k = []
    for x in e:
        if x.position == 'QB':
            salary_listing_qb.append(float(x.yearly_cost))
        elif x.position == 'RB':
            salary_listing_rb.append(float(x.yearly_cost))
        elif x.position == 'WR':
            salary_listing_wr.append(float(x.yearly_cost))
        elif x.position == 'TE':
            salary_listing_te.append(float(x.yearly_cost))
        elif x.position == 'DEF':
            salary_listing_def.append(float(x.yearly_cost))
        elif x.position == 'K':
            salary_listing_k.append(float(x.yearly_cost))
    qb_first = salary_listing_qb[0]*1.05
    salary_listing_qb.insert(0, qb_first)
    rb_first = salary_listing_rb[0]*1.05
    salary_listing_rb.insert(0, rb_first)
    wr_first = salary_listing_wr[0]*1.05
    salary_listing_wr.insert(0, wr_first)
    te_first = salary_listing_te[0]*1.05
    salary_listing_te.insert(0, te_first)
    def_first = salary_listing_def[0]*1.05
    salary_listing_def.insert(0, def_first)
    k_first = salary_listing_k[0]*1.05
    salary_listing_k.insert(0, k_first)

    adp_qb_list = []
    adp_rb_list = []
    adp_wr_list = []
    adp_te_list = []
    adp_def_list = []
    adp_k_list = []

    num_qb = 0
    num_rb = 0
    num_wr = 0
    num_te = 0
    num_def = 0
    num_k = 0

    for x in b:
        if x.position == 'QB':
            num_qb += 1
            x.rank = num_qb
            adp_qb_list.append(x)
        elif x.position == 'RB':
            num_rb += 1
            x.rank = num_rb
            adp_rb_list.append(x)
        elif x.position == 'WR':
            num_wr += 1
            x.rank = num_wr
            adp_wr_list.append(x)
        elif x.position == 'TE':
            num_te += 1
            x.rank = num_te
            adp_te_list.append(x)
        elif x.position == 'Def':
            num_def += 1
            x.rank = num_def
            adp_def_list.append(x)
        elif x.position == 'K':
            num_k += 1
            x.rank = num_k
            adp_k_list.append(x)

    qb_yr1_list = []
    rb_yr1_list = []
    wr_yr1_list = []
    te_yr1_list = []
    def_yr1_list = []
    k_yr1_list = []

    num_yr1_qb = 0
    num_yr1_rb = 0
    num_yr1_wr = 0
    num_yr1_te = 0
    num_yr1_def = 0
    num_yr1_k = 0

    for x in c:
        if x.position == 'QB':
            num_yr1_qb += 1
            x.rank = num_yr1_qb
            qb_yr1_list.append(x)
        elif x.position == 'RB':
            num_yr1_rb += 1
            x.rank = num_yr1_rb
            rb_yr1_list.append(x)
        elif x.position == 'WR':
            num_yr1_wr += 1
            x.rank = num_yr1_wr
            wr_yr1_list.append(x)
        elif x.position == 'TE':
            num_yr1_te += 1
            x.rank = num_yr1_te
            te_yr1_list.append(x)
        elif x.position == 'DEF':
            num_yr1_def += 1
            x.rank = num_yr1_def
            def_yr1_list.append(x)
        elif x.position == 'K':
            num_yr1_k += 1
            x.rank = num_yr1_k
            k_yr1_list.append(x)

    qb_yr2_list = []
    rb_yr2_list = []
    wr_yr2_list = []
    te_yr2_list = []
    def_yr2_list = []
    k_yr2_list = []

    num_yr2_qb = 0
    num_yr2_rb = 0
    num_yr2_wr = 0
    num_yr2_te = 0
    num_yr2_def = 0
    num_yr2_k = 0

    for x in d:
        if x.position == 'QB':
            num_yr2_qb += 1
            x.rank = num_yr2_qb
            qb_yr2_list.append(x)
        elif x.position == 'RB':
            num_yr2_rb += 1
            x.rank = num_yr2_rb
            rb_yr2_list.append(x)
        elif x.position == 'WR':
            num_yr2_wr += 1
            x.rank = num_yr2_wr
            wr_yr2_list.append(x)
        elif x.position == 'TE':
            num_yr2_te += 1
            x.rank = num_yr2_te
            te_yr2_list.append(x)
        elif x.position == 'Def':
            num_yr2_def += 1
            x.rank = num_yr2_def
            def_yr2_list.append(x)
        elif x.position == 'K':
            num_yr2_k += 1
            x.rank = num_yr2_k
            k_yr2_list.append(x)

    f = Player.objects.filter(team=team).filter(yr2_salary=0).order_by('position', '-yr1_salary')
    player_list = []
    for x in f:
        if (x.position == 'DEF' or x.position == 'K'):
            franchise_tag = 'not eligible'
            transition_tag = 'not eligible'
        elif x.position == 'QB':
            franchise_tag = sum(salary_listing_qb[0:5]) / 6
            transition_tag = sum(salary_listing_qb[0:11]) / 12
        elif x.position == 'RB':
            franchise_tag = sum(salary_listing_rb[0:11]) / 12
            transition_tag = sum(salary_listing_rb[0:23]) / 24
        elif x.position == 'WR':
            franchise_tag = sum(salary_listing_wr[0:11]) / 12
            transition_tag = sum(salary_listing_wr[0:23]) / 24
        elif x.position == 'TE':
            franchise_tag = sum(salary_listing_te[0:5]) / 6
            transition_tag = sum(salary_listing_te[0:11]) / 12

        if transition_tag != 'not eligible':
            twenty_percent = (float(x.yr1_salary) + float(x.yr1_sb)) * 1.20
            if twenty_percent > transition_tag:
                transition_tag = twenty_percent

        if waiver_extension_flag == '1':
            if x.notes != 'In-season pickup':
                waiver_exception = 'not eligible'
            else:
                base_extension, avg_yearly, num_years = extension_calc(x,
                                                                       adp_qb_list, adp_rb_list, adp_wr_list, adp_te_list, adp_def_list, adp_k_list,
                                                                       salary_listing_qb, salary_listing_rb, salary_listing_wr, salary_listing_te, salary_listing_def, salary_listing_k,
                                                                       qb_yr1_list, rb_yr1_list, wr_yr1_list, te_yr1_list, def_yr1_list, k_yr1_list,
                                                                       qb_yr2_list, rb_yr2_list, wr_yr2_list, te_yr2_list, def_yr2_list, k_yr2_list,
                                                                       )

                waiver_exception = base_extension * 0.75

                if waiver_exception < 1:
                    waiver_exception = 1
        else:
            waiver_exception = 'not eligible'


        player_list.append({'position' : x.position,
                            'name' : x.name,
                            'yr1_total' : x.yr1_salary + x.yr1_sb,
                            'yr1_salary' : x.yr1_salary,
                            'yr1_sb' : x.yr1_sb,
                            'notes' : x.notes,
                            'franchise_tag' : franchise_tag,
                            'transition_tag' : transition_tag,
                            'waiver_exception' : waiver_exception})

    g = TeamVariable.objects.filter(name='TagsSubmissions').get(user=request.user)
    has_waiver_ext = 0
    has_fran_tag = 0
    has_trans_tag = 0
    try:
        templist = g.text_variable.strip().split(',')
        if templist[0] == '1':
            has_waiver_ext = 1
        if templist[1] == '1':
            has_fran_tag = 1
        if templist[2] == '1':
            has_trans_tag = 1
    except:
        pass


    return render(request, 'team/tags.html', {'player_list' : player_list,
                                              'has_waiver_ext' : has_waiver_ext,
                                              'has_fran_tag' : has_fran_tag,
                                              'has_trans_tag' : has_trans_tag})

def confirm_tags(request):
    a = TeamVariable.objects.filter(name='PlayerForTags').get(user=request.user)
    temp = a.text_variable.strip().split(':')
    player = temp[0]
    value = float(temp[1].split('$')[1])
    type = a.int_variable

    a.text_variable = ''
    a.int_variable = 999
    a.save()

    sb = round(value * 0.4,1)
    salary = value - sb

    return render(request, 'team/confirm_tags.html', {'player' : player,
                                                      'type' : type,
                                                      'value' : value,
                                                      'sb' : sb,
                                                      'salary' : salary})

def confirmextensionstructure(request):
    a = TeamVariable.objects.filter(user=request.user).get(name='PlayerForExtension')
    temp = a.text_variable
    a.text_variable = ''
    a.save()

    templist = temp.strip().split(':')
    player = templist[0]
    team = templist[1]
    try:
        yr1_ext = float(templist[2])
    except:
        yr1_ext = 0
    try:
        yr2_ext = float(templist[3])
    except:
        yr2_ext = 0
    try:
        yr3_ext = float(templist[4])
    except:
        yr3_ext = 0
    try:
        yr4_ext = float(templist[5])
    except:
        yr4_ext = 0

    b = Player.objects.get(name=player)

    c = Message.objects.get(name='Ext Str Instructions')
    instructions = c.content

    e = Player.objects.filter(team=team)
    yr1_costs = 0
    yr2_costs = 0
    yr3_costs = 0
    yr4_costs = 0
    yr5_costs = 0

    for x in e:
        yr1_costs += (x.yr1_salary + x.yr1_sb)
        yr2_costs += (x.yr2_salary + x.yr2_sb)
        yr3_costs += (x.yr3_salary + x.yr3_sb)
        yr4_costs += (x.yr4_salary + x.yr4_sb)
        yr5_costs += (x.yr5_salary + x.yr5_sb)

    g = Team.objects.get(internal_name=team)

    yr1_cap_penalty = 0
    yr2_cap_penalty = 0
    yr3_cap_penalty = 0
    yr4_cap_penalty = 0
    yr5_cap_penalty = 0

    if g.yr1_cap_penalty != None:
        yr1_cap_penalty = g.yr1_cap_penalty

    if g.yr2_cap_penalty != None:
        yr2_cap_penalty = g.yr2_cap_penalty

    if g.yr3_cap_penalty != None:
        yr3_cap_penalty = g.yr3_cap_penalty

    if g.yr4_cap_penalty != None:
        yr4_cap_penalty = g.yr4_cap_penalty

    if g.yr5_cap_penalty != None:
        yr5_cap_penalty = g.yr5_cap_penalty

    yr1_space = Decimal(200) - Decimal(yr1_costs) - yr1_cap_penalty
    yr2_space = Decimal(200) - Decimal(yr2_costs) - yr2_cap_penalty
    yr3_space = Decimal(200) - Decimal(yr3_costs) - yr3_cap_penalty
    yr4_space = Decimal(200) - Decimal(yr4_costs) - yr4_cap_penalty
    yr5_space = Decimal(200) - Decimal(yr5_costs) - yr5_cap_penalty


    cap_dict =      {'yr1_costs' : yr1_costs,
                   'yr2_costs' : yr2_costs,
                   'yr3_costs' : yr3_costs,
                   'yr4_costs' : yr4_costs,
                   'yr5_costs' : yr5_costs,
                   'yr1_pen' : yr1_cap_penalty,
                   'yr2_pen' : yr2_cap_penalty,
                   'yr3_pen' : yr3_cap_penalty,
                   'yr4_pen' : yr4_cap_penalty,
                   'yr5_pen' : yr5_cap_penalty,
                   'yr1_space' : yr1_space,
                   'yr2_space' : yr2_space,
                   'yr3_space' : yr3_space,
                   'yr4_space' : yr4_space,
                   'yr5_space' : yr5_space}

    return render(request, 'team/confirm_extension_structure.html', {'player' : b,
                                                                     'yr1_ext' : yr1_ext,
                                                                     'yr2_ext' : yr2_ext,
                                                                     'yr3_ext' : yr3_ext,
                                                                     'yr4_ext' : yr4_ext,
                                                                     'cap_dict' : cap_dict,
                                                                     'year_list' : year_list,
                                                                     'instructions' : instructions})

def confirmcutplayers(request):
    a = TeamVariable.objects.filter(name='PlayersForCut').get(user=request.user)
    temp = a.text_variable
    from_int = int(a.int_variable)
    a.text_variable = ''
    a.int_variable = 0
    a.save()

    b = Player.objects.all()

    if from_int == 0:
        player_list = [temp]
    elif from_int == 1:
        player_list = temp.strip().split(',')

    player_dict = []

    for x in player_list:
        for y in b:
            if y.name == x:
                player_dict.append({'name' : x,
                                    'pos' : y.position})

    c = Team.objects.get(user=request.user)
    team = c.internal_name

    d = Asset.objects.filter(team=team).filter(asset_type='Amnesty')

    return render(request, 'team/confirm_cut_players.html', {'player_list' : player_dict,
                                                             'from_int' : from_int,
                                                             'assets' : d})