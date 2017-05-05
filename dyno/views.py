import os
import sqlite3 as sql3
from decimal import *
from django.utils import timezone
from django.utils.dateparse import parse_date
from django.shortcuts import render
from django.contrib.auth import logout
from django.http import HttpResponseRedirect, HttpResponse
from django.db.models import Q, Sum
from django.contrib.staticfiles.templatetags.staticfiles import static
import django.apps
from .forms import *
from .models import *

working_local = True
current_league_year = 2017
year_list = [current_league_year, current_league_year + 1, current_league_year + 2, current_league_year + 3, current_league_year + 4]
acceptable_trans_list = ['Auction End', 'Waiver Extension', 'Franchise Tag', 'Transition Tag', 'Extension Submitted', 'Expansion Draft Pick',
                 'Player Cut', 'Trade Accepted', 'Rookie Draft Pick']

draft_pick_salary_list = {1 : [9.00, 10.80, 12.95, 15.55],
                           2 : [8.50, 10.20, 12.25, 14.70],
                           3 : [8.00, 9.60, 11.50, 13.80],
                           4 : [7.50, 9.00, 10.80, 12.95],
                           5 : [7.05, 8.45, 10.15, 12.20],
                           6 : [6.65, 8.00, 9.60, 11.50],
                           7 : [6.25, 7.50, 9.00, 10.80],
                           8 : [5.85, 7.00, 8.40, 10.10],
                           9 : [5.50, 6.60, 7.90, 9.50],
                           10 : [5.15, 6.20, 7.40, 8.90],
                           11 : [4.85, 5.80, 7.00, 8.40],
                           12 : [4.60, 5.50, 6.60, 7.95],
                           13 : [4.30, 5.15, 6.20],
                           14 : [4.05, 4.85, 5.85],
                           15 : [3.80, 4.55, 5.50],
                           16 : [3.55, 4.25, 5.10],
                           17 : [3.35, 4.00, 4.80],
                           18 : [3.15, 3.80, 4.55],
                           19 : [2.95, 3.55, 4.25],
                           20 : [2.80, 3.35, 4.00],
                           21 : [2.60, 3.10, 3.75],
                           22 : [2.45, 2.95, 3.50],
                           23 : [2.30, 2.75, 3.30],
                           24 : [2.15, 2.60, 3.10],
                           25 : [2.00, 2.50],
                           26 : [2.00, 2.50],
                           27 : [2.00, 2.50],
                           28 : [2.00, 2.50],
                           29 : [2.00, 2.50],
                           30 : [2.00, 2.50],
                           31 : [2.00, 2.50],
                           32 : [2.00, 2.50],
                           33 : [2.00, 2.50],
                           34 : [2.00, 2.50],
                           35 : [2.00, 2.50],
                           36 : [2.00, 2.50],
                           37 : [1.50, 2.00],
                           38 : [1.50, 2.00],
                           39 : [1.50, 2.00],
                           40 : [1.50, 2.00],
                           41 : [1.50, 2.00],
                           42 : [1.50, 2.00],
                           43 : [1.50, 2.00],
                           44 : [1.50, 2.00],
                           45 : [1.50, 2.00],
                           46 : [1.50, 2.00],
                           47 : [1.50, 2.00],
                           48 : [1.50, 2.00],
                           }



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

def get_verbose_trade_info(pro_picks, pro_assets, pro_cash, opp_picks, opp_assets, opp_cash):

    pro_picks_verbose = []
    for pick in pro_picks:
        try:
            c = Draft_Pick.objects.get(pk=int(pick))
            if c.pick_overall == 0:
                if c.original_owner != c.owner:
                    pro_picks_verbose.append(str(c.year) + ' round ' + str(c.round) + ' pick (' + c.original_owner + ')')
                else:
                    pro_picks_verbose.append(str(c.year) + ' round ' + str(c.round) + ' pick')
            elif c.pick_in_round > 9:
                pro_picks_verbose.append(str(c.year) + ' ' + str(c.round) + '.' + str(c.pick_in_round) + ' pick')
            else:
                pro_picks_verbose.append(str(c.year) + ' ' + str(c.round) + '.0' + str(c.pick_in_round) + ' pick')
        except:
            pass

    pro_assets_verbose = []
    for asset in pro_assets:
        try:
            d = Asset.objects.get(pk=int(asset))
            if d.asset_type == 'Amnesty':
                pro_assets_verbose.append(d.asset_type + ' (' + str(d.var_i1) + '%)')
            elif d.asset_type == 'Salary Cap Boon':
                pro_assets_verbose.append(d.asset_type + ' ($' + str(d.var_d1) + ')')
        except:
            pass

    pro_cash_verbose = []
    for x in range(0,len(pro_cash)):
        if float(pro_cash[x]) != 0:
            pro_cash_verbose.append(str(year_list[x]) + ' cash: $%.2f' % float(pro_cash[x]))

    opp_picks_verbose = []
    for pick in opp_picks:
        try:
            c = Draft_Pick.objects.get(pk=int(pick))
            if c.pick_overall == 0:
                if c.original_owner != c.owner:
                    opp_picks_verbose.append(str(c.year) + ' round ' + str(c.round) + ' pick (' + c.original_owner + ')')
                else:
                    opp_picks_verbose.append(str(c.year) + ' round ' + str(c.round) + ' pick')
            elif c.pick_in_round > 9:
                opp_picks_verbose.append(str(c.year) + ' ' + str(c.round) + '.' + str(c.pick_in_round) + ' pick')
            else:
                opp_picks_verbose.append(str(c.year) + ' ' + str(c.round) + '.0' + str(c.pick_in_round) + ' pick')
        except:
            pass

    opp_assets_verbose = []
    for asset in opp_assets:
        try:
            d = Asset.objects.get(pk=int(asset))
            if d.asset_type == 'Amnesty':
                opp_assets_verbose.append(d.asset_type + ' (' + str(d.var_i1) + '%)')
            elif d.asset_type == 'Salary Cap Boon':
                opp_assets_verbose.append(d.asset_type + ' ($' + str(d.var_d1) + ')')
        except:
            pass

    opp_cash_verbose = []
    for x in range(0,len(opp_cash)):
        if float(opp_cash[x]) != 0:
            opp_cash_verbose.append(str(year_list[x]) + ' cash: $%.2f' % float(opp_cash[x]))

    return pro_picks_verbose, pro_assets_verbose, pro_cash_verbose, opp_picks_verbose, opp_assets_verbose, opp_cash_verbose

def login_redirect(request):
    if request.user.is_anonymous():
        return 'redirect'

def create_session(user, page):
    if working_local == True:
        con = sql3.connect('db.sqlite3')
    else:
        con = sql3.connect('/home/spflynn/dyno-site/db.sqlite3')
    cur = con.cursor()

    date_now = timezone.now()

    try:
        cur.execute('INSERT INTO dyno_session(user, date, page) VALUES (?, ?, ?)', [str(user), date_now, page])

        con.commit()

        cur.close()
        con.close()
    except:
        pass




def homepage(request):
    create_session(request.user, 'homepage')
    return render(request, 'base.html', {})

def loginpage(request):
    create_session(request.user, 'login')
    return render(request, 'login.html', {'failed_login': False})

def loginfailed(request):
    create_session(request.user, 'loginfailed')
    return render(request, 'login.html', {'failed_login': True})

def logoutView(request):
    create_session(request.user, 'logout')
    logout(request)
    return HttpResponseRedirect('/login')

def mainpage(request):
    create_session(request.user, 'mainpage')
    a = Message.objects.get(name='Homepage Message')
    welcome_message = a.content
    current_time = timezone.now()
    return render(request, 'main.html', {'welcome_message': welcome_message, 'current_time' : current_time})

def rulespage(request):
    create_session(request.user, 'rulespage')
    a = Message.objects.get(name='Rules')
    rules_text = a.content
    return render(request, 'rules.html', {'rules_text': rules_text})

def messageboardpage(request):
    create_session(request.user, 'messageboard')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/message_board'})

    b = TeamVariable.objects.filter(name='MessageBoardFavs').get(user=request.user)
    try:
        favs_list = b.text_variable.strip().split(',')
    except:
        favs_list = []
    for x in range(0,len(favs_list)):
        favs_list[x] = int(favs_list[x])

    a = Board_Post.objects.filter(location='1').order_by('-date')
    aa = Board_Post.objects.all().exclude(location='1').order_by('date')

    top_level_group = []
    reply_group = []
    sticky_group = []
    favorite_group = []

    for post in a:
        try:
            options_list = post.options.strip().split(',')
        except:
            options_list = []

        if options_list[0] == '1':
            sticky_group.append(post)
        elif post.id in favs_list:
            favorite_group.append(post)
        elif post.location == '1':
            top_level_group.append(post)

    for post in aa:
        reply_group.append(post)

    output = []
    for post in sticky_group:
        output.append(post)
        for x in reply_group:
            if x.location == str(post.id) + '.2':
                output.append(x)
    for post in favorite_group:
        output.append(post)
        for x in reply_group:
            if x.location == str(post.id) + '.2':
                output.append(x)
    for post in top_level_group:
        output.append(post)
        for x in reply_group:
            if x.location == str(post.id) + '.2':
                output.append(x)

    return render(request, 'message_board.html', {'posts' : output,
                                                  'current_user' : request.user.username,
                                                  'favs_list' : favs_list})

def draftpage(request):
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/draft'})

    from .draft import get_info_for_draftpage

    draft_order, on_clock, players, draft_board_info = get_info_for_draftpage(request)
    from .classes import Draft
    draft = Draft()
    current_pick = draft.current_pick

    return render(request, 'draft/draft_draft.html', {'draft_order' : draft_order,
                                                      'on_clock' : on_clock,
                                                      'players' : players,
                                                      'draft_board' : draft_board_info,
                                                      'current_pick': current_pick})

def draftinfoandsettings(request):
    create_session(request.user, 'draftinfo')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/draft/settings'})

    team = Team.objects.get(user=request.user)
    a = Draft_Pick.objects.filter(owner=team).filter(year=year_list[0]).order_by('round','pick_in_round')

    num_teams = Team.objects.all().count()
    pick_dict = []
    for x in a:
        if len(x.player_selected) == 0:
            if x.pick_overall > 48:
                yr1 = 1.00
                yr2 = 1.50
                yr3 = 0
                yr4 = 0
            else:
                yr1 = draft_pick_salary_list[x.pick_overall][0]
                yr2 = draft_pick_salary_list[x.pick_overall][1]
                try:
                    yr3 = draft_pick_salary_list[x.pick_overall][2]
                except:
                    yr3 = 0
                try:
                    yr4 = draft_pick_salary_list[x.pick_overall][3]
                except:
                    yr4 = 0

            pick_string = ''
            if x.pick_in_round >= 10:
                pick_string = str(x.round) + '.' + str(x.pick_in_round)
            else:
                pick_string = str(x.round) + '.0' + str(x.pick_in_round)

            pick_dict.append({'pick' : pick_string,
                              'yr1': yr1,
                              'yr2': yr2,
                              'yr3': yr3,
                              'yr4': yr4,})

    draft_picks_cost_list = [0,0,0,0]
    for x in pick_dict:
        draft_picks_cost_list[0] += x['yr1']
        draft_picks_cost_list[1] += x['yr2']
        draft_picks_cost_list[2] += x['yr3']
        draft_picks_cost_list[3] += x['yr4']

    b = Player.objects.filter(team='Rookie').order_by('name')

    c = Shortlist.objects.filter(user=request.user)

    return render(request, 'draft/draft_info_settings.html', {'draft_picks' : pick_dict,
                                                              'year_list' : year_list,
                                                              'draft_picks_cost_list' : draft_picks_cost_list,
                                                              'rookies' : b,
                                                              'shortlists' : c})

def auctionpage(request):
    create_session(request.user, 'auction')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/auction'})

    a = Player.objects.filter(team='Free Agent').order_by('name')
    new_auction_player_list = []
    for x in a:
        new_auction_player_list.append(x.position + ' - ' + x.name)

    #b = Auction.objects.all()
    b = sorted(Auction.objects.all(), key=lambda a: a.time_left())

    c = Team.objects.get(user=request.user)
    current_team = c.internal_name

    d = TeamVariable.objects.filter(user=request.user).get(name='AuctionBids')
    d.text_variable = ''
    d.save()

    e = Variable.objects.get(name='New Auction Flag')
    new_auctions = e.int_variable

    f = Player.objects.filter(team='Auction')

    return render(request, 'auction.html', {'new_auction_player_list' : new_auction_player_list,
                                            'auctions' : b,
                                            'current_team' : current_team,
                                            'new_auctions' : new_auctions,
                                            'auction_players' : f})

def auctionbidconfirmationpage(request):
    create_session(request.user, 'auctionbidconfirm')
    a = TeamVariable.objects.filter(user=request.user).get(name='AuctionBids')
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
    create_session(request.user, 'leagueallplayers')
    #todo: change to sql pull to speed up
    a = Team.objects.all()
    teams = []
    for x in a:
        teams.append(x.internal_name)

    b = Player.objects.all().exclude(name='Deactivated').order_by('position', '-total_value')
    table_contents = []
    for x in b:
        if x.team in teams:
            table_contents.append(x)

    return render(request, 'league/league_all_players.html', {'table_contents' : table_contents,
                                                              'year_list' : year_list})

def leagueextensions(request):
    create_session(request.user, 'extensions')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/league/extensions'})

    a = Player.objects.all().exclude(name='Deactivated')
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

            if num_years > 1:
                if (avg_yearly * 1.2) > base_extension:
                    base_extension = avg_yearly * 1.2

            if x.position == 'QB':
                if base_extension >= salary_listing_qb[8]:
                    max_years = 5
                elif base_extension >= salary_listing_qb[15]:
                    max_years = 4
                else:
                    max_years = 3
            elif x.position == 'RB':
                if base_extension >= salary_listing_rb[15]:
                    max_years = 5
                elif base_extension >= salary_listing_rb[30]:
                    max_years = 4
                else:
                    max_years = 3
            elif x.position == 'WR':
                if base_extension >= salary_listing_wr[20]:
                    max_years = 5
                elif base_extension >= salary_listing_wr[40]:
                    max_years = 4
                else:
                    max_years = 3
            elif x.position == 'TE':
                if base_extension >= salary_listing_te[6]:
                    max_years = 5
                elif base_extension >= salary_listing_te[12]:
                    max_years = 4
                else:
                    max_years = 3
            else:
                max_years = 5

            max_years = max_years - num_years
            if max_years < 0:
                max_years = 0

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
                          'age' : x.age()
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

def leaguetransactionlog(request):
    create_session(request.user, 'leaguetranslog')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/league/league_transaction_log'})

    a = Transaction.objects.all().order_by('-date')
    b = []
    for x in a:
        if x.transaction_type in acceptable_trans_list:
            b.append(x)

    c = Team.objects.all()

    return render(request, 'league/league_transaction_log.html', {'transactions' : b,
                                                                  'trans_list' : sorted(acceptable_trans_list),
                                                                  'team_list' : c})

def leaguefreeagents(request):
    create_session(request.user, 'freeagentlist')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/league/free_agents'})

    aa = Variable.objects.get(name='Include Impending')
    include_impending = aa.int_variable

    if include_impending == 0:
        a = Player.objects.filter(team='Free Agent').order_by('position', 'name')
    else:
        a = Player.objects.filter(Q(team='Free Agent') | Q(yr2_salary=0)).order_by('position', 'name').exclude(team='Deactivated')

    free_agent_list = []

    for x in a:
        try:
            b = Performance_Yr1.objects.get(player=x.name)
            points = b.points
        except:
            points = 0
        free_agent_list.append({'pos' : x.position,
                                'player' : x.name,
                                'team' : x.team,
                                'salary' : x.yr1_salary + x.yr1_sb,
                                'perf' : points})

    return render(request, 'league/league_free_agents.html', {'free_agents' : free_agent_list,
                                                              'year_list' : year_list})

def leaguesalarylists(request):
    create_session(request.user, 'salarylists')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/league/salary_lists'})

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
    create_session(request.user, 'adp')
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
    create_session(request.user, 'perfpage')
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
    create_session(request.user, 'futuredraftpicks')

    a = Draft_Pick.objects.filter(Q(year=year_list[1]) | Q(year=year_list[2]) | Q(year=year_list[3]) | Q(year=year_list[4]))
    draft_years = []
    for x in a:
        if x.year not in draft_years:
            draft_years.append(x.year)

    b = Team.objects.all()
    team_list = []
    for x in b:
        team_list.append(x.internal_name)

    return render(request, 'draft/league_future_draft_picks.html', {'team_list' : team_list,
                                                                    'year_list' : draft_years})

def leaguecapsummary(request):
    create_session(request.user, 'capsummary')
    a = Player.objects.all().exclude(name='Deactivated')
    b = Team.objects.all()

    team_list = []
    num_players_list = []
    salary_list = []
    current_cap_penalty = []
    cap_space = []

    for x in b:
        team_list.append(x.internal_name)

    for x in range(len(team_list)):
        num_players_list.append(0)
        salary_list.append(Decimal(0))
        current_cap_penalty.append(Decimal(0))
        cap_space.append(Decimal(0))

    for x in a:
        for y in range(len(team_list)):
            if x.team == team_list[y]:
                num_players_list[y] += 1
                salary_list[y] += (Decimal(x.yr1_salary)+Decimal(x.yr1_sb))

    for x in b:
        for y in range(len(team_list)):
            if x.internal_name == team_list[y]:
                current_cap_penalty[y] += Decimal(x.yr1_cap_penalty)

    for x in range(len(team_list)):
        cap_space[x] = Decimal(200) - salary_list[x] - current_cap_penalty[x]

    summary_data = []
    for x in range(len(team_list)):
        summary_data.append([team_list[x], num_players_list[x], salary_list[x], current_cap_penalty[x], cap_space[x]])

    return render(request, 'league/league_cap_summary.html', {'summary_data' : summary_data})

def teamorganizationpage(request):
    create_session(request.user, 'teamorg')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/team/organization'})

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
    create_session(request.user, 'teamcapsit')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/team/cap_situation'})

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
        print(x)
        try:
            d = PlayerNote.objects.filter(user=request.user).get(player_id=int(x[0]))
            notes = d.notes
            n1 = d.n1
            n2 = d.n2
            n3 = d.n3
            if int(n1) == n1:
                n1 = int(n1)
            if int(n2) == n2:
                n2 = int(n2)
            if int(n3) == n3:
                n3 = int(n3)
        except:
            notes = ''
            n1 = ''
            n2 = ''
            n3 = ''
        avail_ro_1 = avail_roles(con, cur, team, x[1], x[2], 1)
        avail_ro_2 = avail_roles(con, cur, team, x[1], x[2], 2)
        avail_ro_3 = avail_roles(con, cur, team, x[1], x[2], 3)
        avail_ro_4 = avail_roles(con, cur, team, x[1], x[2], 4)
        avail_ro_5 = avail_roles(con, cur, team, x[1], x[2], 5)
        full_age = timezone.now().date() - parse_date(x[24])
        age_days = full_age.days
        age_years = floor(age_days / 364 * 10) / 10
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
                          'avail_roles_yr5' : avail_ro_5,
                           'age' : age_years,
                           'n1' : n1,
                           'n2' : n2,
                           'n3' : n3,
                           'player_notes' : notes})

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
    create_session(request.user, 'teamsettings')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/team/team_settings'})

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

    c = Shortlist.objects.filter(user=request.user)

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
                                                       'role_list' : roles_list,
                                                       'year_list' : year_list,
                                                       'shortlists' : c})

def teampendingtransactionspage(request):
    create_session(request.user, 'teampendingtrans')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/team/pending_transactions'})

    a = Team.objects.get(user=request.user)
    team = a.internal_name
    b = Transaction.objects.filter(var_t1='Pending').filter(Q(team1=team) | Q(team2=team)).order_by('date')
    return render(request, 'team/team_pending_transactions.html', {'transactions' : b,
                                                                   'user_team_2' : team})

def teamtransactionspage(request):
    create_session(request.user, 'teamtranslog')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/team/transactions'})

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
    create_session(request.user, 'teamrelease')
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
    create_session(request.user, 'teamalerts')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/team/alerts'})

    type_list = ['Auction - Outbid', 'Auction - New Auction', 'Auction - Won', 'Trade Offer', 'Trade Rejected', 'Trade Accepted',
                 'Trade Withdrawn', 'New Board Post', 'Draft Pick Made']
    a = Alert.objects.filter(user=request.user).order_by('-date')
    b = []
    for x in a:
        if x.alert_type in type_list:
            b.append(x)
    return render(request, 'team/team_alerts.html', {'type_list' : type_list,
                                                     'alerts' : b})

def teammanagealerts(request):
    create_session(request.user, 'managealerts')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/team/manage_alerts'})

    a = AlertSetting.objects.get(user=request.user)
    return render(request, 'team/team_manage_alerts.html', {'alert_settings' : a})

def teamtrades(request):
    create_session(request.user, 'teamtradepage')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/team/trade'})

    opp_team = ''
    pro_players = []
    pro_picks = []
    pro_assets = []
    pro_cash = []
    opp_players = []
    opp_picks = []
    opp_assets = []
    opp_cash = []

    var_test = TeamVariable.objects.filter(name='TradeData').get(user=request.user)
    temp = var_test.text_variable
    if temp != '' and temp is not None:
        temp1 = temp.split('\n')
        opp_team = temp1[0]
        pro_players = temp1[1].strip().split(':')
        pro_picks = temp1[2].strip().split(':')
        pro_assets = temp1[3].strip().split(':')
        pro_cash = temp1[4].strip().split(':')
        opp_players = temp1[5]
        opp_picks = temp1[6]
        opp_assets = temp1[7]
        opp_cash = temp1[8]

        try:
            if pro_players[0] == '':
                pro_players = []
        except:
            pro_players = []
        try:
            if opp_players[0] == '':
                opp_players = []
        except:
            opp_players = []

        var_test.text_variable = ''
        var_test.save()

    a = Team.objects.get(user=request.user)
    team = a.internal_name
    aa = Team.objects.all().exclude(user=request.user)
    team_list = []
    for x in aa:
        team_list.append(x.internal_name)

    yr1_salary = Player.objects.filter(team=team).aggregate(yr1_total=Sum('yr1_salary')+Sum('yr1_sb'))['yr1_total']
    yr2_salary = Player.objects.filter(team=team).aggregate(yr1_total=Sum('yr2_salary')+Sum('yr2_sb'))['yr1_total']
    yr3_salary = Player.objects.filter(team=team).aggregate(yr1_total=Sum('yr3_salary')+Sum('yr3_sb'))['yr1_total']
    yr4_salary = Player.objects.filter(team=team).aggregate(yr1_total=Sum('yr4_salary')+Sum('yr4_sb'))['yr1_total']
    yr5_salary = Player.objects.filter(team=team).aggregate(yr1_total=Sum('yr5_salary')+Sum('yr5_sb'))['yr1_total']

    try:
        yr1_cap_pen = Decimal(a.yr1_cap_penalty)
    except:
        yr1_cap_pen = Decimal(0)
    try:
        yr2_cap_pen = Decimal(a.yr2_cap_penalty)
    except:
        yr2_cap_pen = Decimal(0)
    try:
        yr3_cap_pen = Decimal(a.yr3_cap_penalty)
    except:
        yr3_cap_pen = Decimal(0)
    try:
        yr4_cap_pen = Decimal(a.yr4_cap_penalty)
    except:
        yr4_cap_pen = Decimal(0)
    try:
        yr5_cap_pen = Decimal(a.yr5_cap_penalty)
    except:
        yr5_cap_pen = Decimal(0)

    cap_space = [Decimal(200) - yr1_cap_pen - yr1_salary,
                 Decimal(200) - yr2_cap_pen - yr2_salary,
                 Decimal(200) - yr3_cap_pen - yr3_salary,
                 Decimal(200) - yr4_cap_pen - yr4_salary,
                 Decimal(200) - yr5_cap_pen - yr5_salary,]

    b = Draft_Pick.objects.filter(owner=team).order_by('year', 'round', 'pick_in_round')
    draft_picks = []
    for x in b:
        if x.year in year_list and x.player_selected == '':
            draft_picks.append(x)

    c = Asset.objects.filter(team=team).order_by('asset_type', 'date')

    d = Player.objects.filter(team=team).order_by('-total_value')
    QB_list = []
    RB_list = []
    WR_list = []
    TE_list = []
    DEF_list = []
    K_list = []

    for player in d:
        if player.position == 'QB':
            QB_list.append(player)
        elif player.position == 'RB':
            RB_list.append(player)
        elif player.position == 'WR':
            WR_list.append(player)
        elif player.position == 'TE':
            TE_list.append(player)
        elif player.position == 'DEF':
            DEF_list.append(player)
        else:
            K_list.append(player)

    player_list = []
    for player in QB_list:
        player_list.append(player)
    for player in RB_list:
        player_list.append(player)
    for player in WR_list:
        player_list.append(player)
    for player in TE_list:
        player_list.append(player)
    for player in K_list:
        player_list.append(player)
    for player in DEF_list:
        player_list.append(player)

    e = TeamVariable.objects.filter(name='TradeViewFlags').get(user=request.user)
    try:
        temp2 = e.text_variable.split(',')
        view_flag_text = temp2[0]
    except:
        view_flag_text = ''
    try:
        is_proposing_team = int(temp2[1])
    except:
        is_proposing_team = 999999
    view_flag_trade_id = e.int_variable
    e.text_variable = ''
    e.int_variable = 999999
    e.save()


    return render(request, 'team/team_trade.html', {'year_list' : year_list,
                                                    'draft_picks' : draft_picks,
                                                    'assets' : c,
                                                    'cap_space' : cap_space,
                                                    'team_list' : team_list,
                                                    'player_list' : player_list,
                                                    'opp_team' : opp_team,
                                                    'pro_players' : pro_players,
                                                    'pro_picks' : pro_picks,
                                                    'pro_assets' : pro_assets,
                                                    'pro_cash' : pro_cash,
                                                    'opp_players' : opp_players,
                                                    'opp_picks' : opp_picks,
                                                    'opp_assets' : opp_assets,
                                                    'opp_cash' : opp_cash,
                                                    'view_flag_text' : view_flag_text,
                                                    'is_proposing_team' : is_proposing_team,
                                                    'view_flag_trade_id' : view_flag_trade_id})

def playerpage(request):
    create_session(request.user, 'player')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/player'})

    a = TeamVariable.objects.filter(user=request.user).get(name='PlayerForPlayerPage')
    player_selected = a.text_variable
    a.text_variable = ''
    a.save()

    b = Player.objects.all().exclude(name='Deactivated').order_by('name')
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
    create_session(request.user, 'settings')
    #use commishofficepage instead
    return render(request, 'admin/settings.html', {})

def batchpage(request):
    create_session(request.user, 'batch')
    return render(request, 'admin/batch.html', {})

def testview(request):
    create_session(request.user, 'testview')
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
    create_session(request.user, 'userchangepassword')
    a = Team.objects.get(user=request.user)

    username = a.user

    return render(request, 'admin/user_change_password.html', {'username' : username})

def bugtrackingpage(request):
    create_session(request.user, 'bugtracking')
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
    create_session(request.user, 'newbug')
    e = os.environ
    o = request.user_agent.os
    b = request.META['HTTP_USER_AGENT']
    return render(request, 'admin/new_bug.html', {'environ' : e,
                                                  'os' : o,
                                                  'browser' : b})

def featurerequestpage(request):
    create_session(request.user, 'featurerequest')

    return render(request, 'admin/feature_request.html', {})

def featurelistchangelogpage(request):
    create_session(request.user, 'featurelistchangelog')
    a = Message.objects.get(name='Features List')
    features_list = a.content

    b = Message.objects.get(name='Changelog')
    changelog = b.content

    return render(request, 'admin/feature_list.html', {'features_list' : features_list,
                                                       'changelog' : changelog})

def commishofficepage(request):
    create_session(request.user, 'commishoffice')
    a = Variable.objects.get(name='Default AuctionClock')
    default_auction_clock = int(a.int_variable / 60)

    b = Variable.objects.get(name='Extensions Switch')
    ext_switch = int(b.int_variable)

    c = Variable.objects.get(name='CommishPeriodicState')
    commish_periodic = int(c.int_variable)

    d = Variable.objects.get(name='Cut Season')
    cut_season = int(d.int_variable)

    e = Variable.objects.get(name='New Auction Flag')
    new_auctions = int(e.int_variable)

    f = Variable.objects.get(name='Include Impending')
    include_impending = int(f.int_variable)

    g = Team.objects.all()
    user_list = []
    for x in g:
        user_list.append(x.user)
    last_action_list = []
    for user in user_list:
        try:
            h = Session.objects.filter(user=user).order_by('-date')[0]
            last_action_list.append({'user' : user,
                                     'last_action' : h.date})
        except:
            last_action_list.append({'user' : user,
                                     'last_action' : 'none'})

    h = Variable.objects.get(name='Draft Switch')
    draft_switch = h.int_variable

    i = Variable.objects.get(name='Default Draft Clock')
    default_draft_clock = i.int_variable

    j = Variable.objects.get(name='Draft Clock End')
    draft_clock_end = j.text_variable

    k = Variable.objects.get(name='Draft Suspension')
    suspension_start, suspension_end = k.text_variable.split(',')

    all_players = Player.objects.all().order_by('name')

    all_draft_picks_with_autopick_settings = []
    all_draft_picks = Draft_Pick.objects.filter(year=year_list[0]).order_by('pick_overall')
    for pick in all_draft_picks:
        try:
            autopick = AutopickSettings.objects.get(pick=pick)
            all_draft_picks_with_autopick_settings.append({
                'pick_overall': pick.pick_overall,
                'owner': pick.owner,
                'player_selected': pick.player_selected,
                'autopick_delay': autopick.delay,
                'autopick_action': autopick.action
            })
        except:
            all_draft_picks_with_autopick_settings.append({
                'pick_overall': pick.pick_overall,
                'owner': pick.owner,
                'player_selected': pick.player_selected,
                'autopick_delay': '',
                'autopick_action': ''
            })


    return render(request, 'admin/settings.html', {'default_auction_clock' : default_auction_clock,
                                                   'ext_switch' : ext_switch,
                                                   'commish_periodic' : commish_periodic,
                                                   'cut_season' : cut_season,
                                                   'new_auctions' : new_auctions,
                                                   'include_impending' : include_impending,
                                                   'last_action_list' : last_action_list,
                                                   'draft_switch' : draft_switch,
                                                   'default_draft_clock' : default_draft_clock,
                                                   'draft_clock_end' : draft_clock_end,
                                                   'suspension_start' : suspension_start,
                                                   'suspension_end' : suspension_end,
                                                   'all_players': all_players,
                                                   'all_draft_picks_with_autopick_settings': all_draft_picks_with_autopick_settings})

def commishviewmodel(request):
    create_session(request.user, 'commishviewmodel')

    a = django.apps.apps.get_models()
    model_list = []
    for x in a:
        model_list.append(x.__name__)
        # print(x.__name__)
    model_list = sorted(model_list)

    return render(request, 'commish/commish_view_model.html', {'model_list' : model_list})

def commisheditmodel(request):
    create_session(request.user, 'commisheditmodel')
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
    create_session(request.user, 'commishtranspage')
    a = Transaction.objects.all().order_by('-date')
    trans_list = []
    for x in a:
        trans_list.append(x.transaction_type)
    trans_list = list(set(trans_list))
    trans_list = sorted(trans_list)
    return render(request, 'commish/commish_transactions.html', {'transactions' : a,
                                                                 'type_list' : trans_list})

def commishpendingtransactionspage(request):
    create_session(request.user, 'commishpendingtrans')
    b = Transaction.objects.filter(var_t1='Pending').filter(Q(var_t2='Confirmed') | Q(player='trade')).exclude(Q(transaction_type='Trade Offer') | Q(transaction_type='Counter Offer'))
    return render(request, 'commish/commish_pending_transactions.html', {'transactions' : b})

def commishpendingalerts(request):
    create_session(request.user, 'commishpendingalerts')
    a = Alert.objects.filter(user='commish').order_by('-date')
    type_list = []
    for x in a:
        type_list.append(x.alert_type)
    type_list = list(set(type_list))
    type_list = sorted(type_list)
    return render(request, 'commish/commish_pending_alerts.html', {'type_list' : type_list,
                                                                    'alerts' : a})

def commishallalerts(request):
    create_session(request.user, 'commishalerts')
    a = Alert.objects.all().order_by('-date')
    type_list = []
    for x in a:
        type_list.append(x.alert_type)
    type_list = list(set(type_list))
    type_list = sorted(type_list)
    return render(request, 'commish/commish_all_alerts.html', {'type_list' : type_list,
                                                               'alerts' : a})

def setcontractstructurepage(request):
    create_session(request.user, 'setcontractstructure')
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

def confirmrestructurepage(request):
    create_session(request.user, 'confirmstructure')
    a = TeamVariable.objects.filter(name='PlayerForRestructure').get(user=request.user)
    temp = a.text_variable.split(':')

    c = TeamVariable.objects.filter(name='PlayerForPlayerPage').get(user=request.user)
    c.text_variable = temp[0]
    c.save()

    player = temp[0]
    yr1_sal = Decimal(temp[1])
    yr2_sal = Decimal(temp[2])
    yr3_sal = Decimal(temp[3])
    yr4_sal = Decimal(temp[4])
    yr5_sal = Decimal(temp[5])

    b = Player.objects.get(name=player)
    total_guar = (b.signing_bonus + b.yr1_salary)
    #total_guar = 36.44

    if b.years_remaining() == 2:
        salary_list = [yr1_sal, yr2_sal, 0, 0, 0]
    elif b.years_remaining() == 3:
        salary_list = [yr1_sal, yr2_sal, yr3_sal, 0, 0]
    elif b.years_remaining() == 4:
        salary_list = [yr1_sal, yr2_sal, yr3_sal, yr4_sal, 0]
    elif b.years_remaining() == 5:
        salary_list = [yr1_sal, yr2_sal, yr3_sal, yr4_sal, yr5_sal]

    yearly_sb = round(total_guar / b.years_remaining() * 100) / 100
    total_sb = yearly_sb * b.years_remaining()

    yr1_total = yr1_sal + Decimal(yearly_sb)
    yr2_total = yr2_sal + Decimal(yearly_sb)
    yr3_total = yr3_sal + Decimal(yearly_sb)
    yr4_total = yr4_sal + Decimal(yearly_sb)
    yr5_total = yr5_sal + Decimal(yearly_sb)

    missed_money = int((b.total_value - sum(salary_list) - Decimal(total_sb))*100)
    count = 5
    while missed_money > 0:
        count -= 1
        if count < 0:
            count = 4
        if salary_list[count] != 0:
            missed_money -= 1
            salary_list[count] += Decimal(.01)

    totals = [yr1_total, yr2_total, yr3_total, yr4_total, yr5_total]

    total_sal = round(sum(salary_list)*100) / 100


    return render(request, 'team/confirm_restructure.html', {'year_list' : year_list,
                                                             'player' : b,
                                                             'sb' : total_sb,
                                                             'yearly_sb' : yearly_sb,
                                                             'total_sal' : total_sal,
                                                             'yearly_totals' : totals,
                                                             'salary_list' : salary_list})

def transactionsingleplayer(request):
    create_session(request.user, 'transsingleplayer')
    a = Variable.objects.get(name='player selected')
    id_selected = a.int_variable
    a.int_variable = 0
    a.save()

    b = Transaction.objects.get(pk=id_selected)
    player = b.player

    c = Player.objects.get(name=player)

    return render(request, 'commish/transaction_single_player.html', {'transaction' : b,
                                                                      'player' : c})

def transactioncut(request):
    create_session(request.user, 'transcut')
    a = Variable.objects.get(name='player selected')
    id_selected = a.int_variable
    a.int_variable = 0
    a.save()

    b = Transaction.objects.get(pk=id_selected)
    player = b.player

    c = Player.objects.get(name=player)

    d = Variable.objects.get(name='Cut Season')
    type_of_cut = int(d.int_variable)

    if int(b.var_i1) != -1:
        e = Asset.objects.get(id=int(b.var_i1))
    else:
        e = 'none'

    return render(request, 'commish/transaction_cut.html', {'transaction' : b,
                                                            'player' : c,
                                                            'type_of_cut' : type_of_cut,
                                                            'amnesty' : e})

def transactiontrade(request):
    create_session(request.user, 'transtrade')
    a = Variable.objects.get(name='player selected')
    id_selected = a.int_variable
    a.int_variable = 0
    a.save()

    b = Transaction.objects.get(pk=id_selected)

    c = Trade.objects.get(pk=int(b.var_i1))
    pro_team = c.team1
    pro_players = c.pro_players.strip().split(':')
    pro_picks = c.pro_picks.strip().split(':')
    pro_assets = c.pro_assets.strip().split(':')
    pro_cash = c.pro_cash.strip().split(':')
    opp_team = c.team2
    opp_players = c.opp_players.strip().split(':')
    opp_picks = c.opp_picks.strip().split(':')
    opp_assets = c.opp_assets.strip().split(':')
    opp_cash = c.opp_cash.strip().split(':')
    if pro_players[0] == '':
        pro_players = []
    if opp_players[0] == '':
        opp_players = []
    if pro_picks[0] == '':
        pro_picks = []
    if opp_picks[0] == '':
        opp_picks = []
    if pro_assets[0] == '':
        pro_assets = []
    if opp_assets[0] == '':
        opp_assets = []

    pro_picks_verbose, pro_assets_verbose, pro_cash_verbose, opp_picks_verbose, opp_assets_verbose, opp_cash_verbose = get_verbose_trade_info(pro_picks, pro_assets, pro_cash, opp_picks, opp_assets, opp_cash)

    pro_cap_pen = [0,0,0,0,0]
    opp_cap_pen = [0,0,0,0,0]

    d = Team.objects.get(internal_name=pro_team)
    pro_cap_pen[0] = d.yr1_cap_penalty
    pro_cap_pen[1] = d.yr2_cap_penalty
    pro_cap_pen[2] = d.yr3_cap_penalty
    pro_cap_pen[3] = d.yr4_cap_penalty
    pro_cap_pen[4] = d.yr5_cap_penalty

    e = Team.objects.get(internal_name=opp_team)
    opp_cap_pen[0] = e.yr1_cap_penalty
    opp_cap_pen[1] = e.yr2_cap_penalty
    opp_cap_pen[2] = e.yr3_cap_penalty
    opp_cap_pen[3] = e.yr4_cap_penalty
    opp_cap_pen[4] = e.yr5_cap_penalty

    return render(request, 'commish/transaction_trade.html', {'transaction' : b,
                                                              'trade_data' : c,
                                                              'pro_players' : pro_players,
                                                              'pro_picks' : pro_picks_verbose,
                                                              'pro_assets' : pro_assets_verbose,
                                                              'pro_cash' : pro_cash_verbose,
                                                              'opp_players' : opp_players,
                                                              'opp_picks' : opp_picks_verbose,
                                                              'opp_assets' : opp_assets_verbose,
                                                              'opp_cash' : opp_cash_verbose,
                                                              'pro_cap_pen' : pro_cap_pen,
                                                              'opp_cap_pen' : opp_cap_pen})

def tagspage(request):
    create_session(request.user, 'tagspage')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/team/tags'})

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
            if x.inseason_pickup != 1:
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
    create_session(request.user, 'confirmtags')
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
    create_session(request.user, 'confirmextensionstructure')
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
    create_session(request.user, 'confirmcut')
    a = TeamVariable.objects.filter(name='PlayersForCut').get(user=request.user)
    temp = a.text_variable
    from_int = int(a.int_variable)
    a.text_variable = ''
    a.int_variable = 0
    a.save()

    b = Player.objects.all().exclude(name='Deactivated')

    if from_int == 0:
        player_list = [temp]
    elif from_int == 1:
        player_list = temp.strip().split(':')

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
                                                             'assets' : d,
                                                             'current_year' : current_league_year})

def confirmtradepage(request):
    create_session(request.user, 'confirmtrade')
    a = TeamVariable.objects.filter(name='TradeData').get(user=request.user)
    temp = a.text_variable

    temp1 = temp.split('\n')
    opp_team = temp1[0]
    pro_players = temp1[1].strip().split(':')
    pro_picks = temp1[2].strip().split(':')
    pro_assets = temp1[3].strip().split(':')
    pro_cash = temp1[4].strip().split(':')
    opp_players = temp1[5].strip().split(':')
    opp_picks = temp1[6].strip().split(':')
    opp_assets = temp1[7].strip().split(':')
    opp_cash = temp1[8].strip().split(':')

    if pro_players[0] == '':
        pro_players = []
    if opp_players[0] == '':
        opp_players = []
    if pro_picks[0] == '':
        pro_picks = []
    if opp_picks[0] == '':
        opp_picks = []
    if pro_assets[0] == '':
        pro_assets = []
    if opp_assets[0] == '':
        opp_assets = []

    b = Team.objects.get(user=request.user)
    pro_team = b.internal_name

    pro_picks_verbose, pro_assets_verbose, pro_cash_verbose, opp_picks_verbose, opp_assets_verbose, opp_cash_verbose = get_verbose_trade_info(pro_picks, pro_assets, pro_cash, opp_picks, opp_assets, opp_cash)

    pro_cap = [0,0,0,0,0]
    opp_cap = [0,0,0,0,0]
    diff_cap = [0,0,0,0,0]

    for player in pro_players:
        try:
            e = Player.objects.get(name=player)
            pro_cap[0] += float(e.yr1_salary) + float(e.yr1_sb)
            pro_cap[1] += float(e.yr2_salary) + float(e.yr2_sb)
            pro_cap[2] += float(e.yr3_salary) + float(e.yr3_sb)
            pro_cap[3] += float(e.yr4_salary) + float(e.yr4_sb)
            pro_cap[4] += float(e.yr5_salary) + float(e.yr5_sb)
        except:
            pass

    for player in opp_players:
        try:
            e = Player.objects.get(name=player)
            opp_cap[0] += float(e.yr1_salary) + float(e.yr1_sb)
            opp_cap[1] += float(e.yr2_salary) + float(e.yr2_sb)
            opp_cap[2] += float(e.yr3_salary) + float(e.yr3_sb)
            opp_cap[3] += float(e.yr4_salary) + float(e.yr4_sb)
            opp_cap[4] += float(e.yr5_salary) + float(e.yr5_sb)
        except:
            pass

    num_teams = Team.objects.all().count()

    for pick in pro_picks:
        try:
            f = Draft_Pick.objects.get(pk=int(pick))
            start_year = year_list.index(f.year)

            if f.pick_overall == 0:
                start_pick = ((f.round - 1) * num_teams) + 1
                yr1_total = 0
                yr2_total = 0
                yr3_total = 0
                yr4_total = 0
                for x in range(start_pick, start_pick + 12):
                    yr1_total += draft_pick_salary_list[x][0]
                    yr2_total += draft_pick_salary_list[x][1]
                    try:
                        yr3_total += draft_pick_salary_list[x][2]
                    except:
                        pass
                    try:
                        yr4_total += draft_pick_salary_list[x][3]
                    except:
                        pass
                yr1_avg = yr1_total / num_teams
                yr2_avg = yr2_total / num_teams
                yr3_avg = yr3_total / num_teams
                yr4_avg = yr4_total / num_teams
            else:
                yr1_avg = float(f.yr1_sal)
                yr2_avg = float(f.yr2_sal)
                yr3_avg = float(f.yr3_sal)
                yr4_avg = float(f.yr4_sal)

            pro_cap[start_year] += yr1_avg
            try:
                pro_cap[start_year+1] += yr2_avg
            except:
                pass
            try:
                pro_cap[start_year+2] += yr3_avg
            except:
                pass
            try:
                pro_cap[start_year+3] += yr4_avg
            except:
                pass
        except:
            pass

    for pick in opp_picks:
        try:
            f = Draft_Pick.objects.get(pk=int(pick))
            start_year = year_list.index(f.year)

            if f.pick_overall == 0:
                start_pick = ((f.round - 1) * num_teams) + 1
                yr1_total = 0
                yr2_total = 0
                yr3_total = 0
                yr4_total = 0
                for x in range(start_pick, start_pick + 12):
                    yr1_total += draft_pick_salary_list[x][0]
                    yr2_total += draft_pick_salary_list[x][1]
                    try:
                        yr3_total += draft_pick_salary_list[x][2]
                    except:
                        pass
                    try:
                        yr4_total += draft_pick_salary_list[x][3]
                    except:
                        pass
                yr1_avg = yr1_total / num_teams
                yr2_avg = yr2_total / num_teams
                yr3_avg = yr3_total / num_teams
                yr4_avg = yr4_total / num_teams
            else:
                yr1_avg = float(f.yr1_sal)
                yr2_avg = float(f.yr2_sal)
                yr3_avg = float(f.yr3_sal)
                yr4_avg = float(f.yr4_sal)

            opp_cap[start_year] += yr1_avg
            try:
                opp_cap[start_year+1] += yr2_avg
            except:
                pass
            try:
                opp_cap[start_year+2] += yr3_avg
            except:
                pass
            try:
                opp_cap[start_year+3] += yr4_avg
            except:
                pass
        except:
            pass

    for x in range(0,len(pro_cap)):
        pro_cap[x] -= float(pro_cash[x])

    for x in range(0,len(opp_cap)):
        opp_cap[x] -= float(opp_cash[x])

    for x in range(0,len(diff_cap)):
        diff_cap[x] = pro_cap[x] - opp_cap[x]

    g = TeamVariable.objects.filter(name='TradeViewFlags').get(user=request.user)
    try:
        temp2 = g.text_variable.split(',')
        view_flag_text = temp2[0]
    except:
        view_flag_text = ''
    try:
        is_proposing_team = int(temp2[1])
    except:
        is_proposing_team = 999999
    view_flag_trade_id = g.int_variable

    return render (request, 'team/confirm_trade.html', {'year_list' : year_list,
                                                        'pro_team' : pro_team,
                                                        'opp_team' : opp_team,
                                                        'pro_players' : pro_players,
                                                        'pro_picks' : pro_picks_verbose,
                                                        'pro_assets' : pro_assets_verbose,
                                                        'pro_cash' : pro_cash_verbose,
                                                        'opp_players' : opp_players,
                                                        'opp_picks' : opp_picks_verbose,
                                                        'opp_assets' : opp_assets_verbose,
                                                        'opp_cash' : opp_cash_verbose,
                                                        'pro_cap' : pro_cap,
                                                        'opp_cap' : opp_cap,
                                                        'diff_cap' : diff_cap,
                                                        'view_flag_text' : view_flag_text,
                                                        'view_flag_trade_id' : view_flag_trade_id,
                                                        'is_proposing_team' : is_proposing_team})

def teamtradelogpage(request):
    create_session(request.user, 'teamtradelog')
    if login_redirect(request) == 'redirect':
        return render(request, 'login.html', {'failed_login': False,
                                              'redirect' : '/team/trade_log'})

    a = Team.objects.get(user=request.user)
    team = a.internal_name

    b = Trade.objects.filter(Q(team1=team) | Q(team2=team)).order_by('-date')

    c = TeamVariable.objects.filter(name='TradeData').get(user=request.user)
    c.text_variable = ''
    c.int_variable = 999999
    c.save()

    d = TeamVariable.objects.filter(name='TradeViewFlags').get(user=request.user)
    d.text_variable = ''
    d.int_variable = 999999
    d.save()

    return render (request, 'team/team_trade_log.html', {'trade_list' : b,
                                                         'user_team_2' : team})

def teamnotesandshortlists(request):
    a = Shortlist.objects.filter(user=request.user)

    b = Team.objects.get(user=request.user)
    default_shortlist = b.default_shortlist

    if default_shortlist == 888888:
        default_shortlist = 'all'

    return render (request, 'team/team_notes_shortlists.html', {'shortlists' : a,
                                                                'year_list' : year_list,
                                                                'default_shortlist' : default_shortlist,
                                                                })

def input_draft_results(request):
    num_picks = []
    for x in range(1,73):
        num_picks.append(x)

    a = Player.objects.all().order_by('name')
    player_list = []
    for x in a:
        player_list.append({'name' : x.name, 'id' : x.id})

    return render (request, 'batch/input_draft_results.html', {'num_picks' : num_picks,
                                                                 'player_list' : player_list})

def input_old_transactions(request):
    transaction_data = request.POST['trans_data']

    line_list = transaction_data.split('\r\n')

    trans_list = []
    for x in line_list:
        date, trans_type, team1, team2, player1, player2, pfr1, pfr2 = x.strip().split('@')
        try:
            a = Player.objects.get(pfr_id=pfr1)
            player_id = a.id
        except:
            player_id = ''
        cut = player1[:-4].strip()
        if player1[-4:] == 'D/ST':
            if cut == 'Buccaneers':
                cut = 'Bucs'
            a = Player.objects.get(name=cut)
            player_id = a.id
        trans_list.append({'date' : date,
                           'trans_type' : trans_type,
                           'team1' : team1,
                           'team2' : team2,
                           'player' : player1,
                           'pfr' : pfr1,
                           'player_id' : player_id})

    return render (request, 'batch/input_old_transactions.html', {'trans_list' : trans_list})

def draftrookiepool(request):
    from .draft import get_info_for_draft_pool_page

    rookies, shortlists = get_info_for_draft_pool_page(request)
    return render (request, 'draft/draft_rookie_pool.html', {'rookies' : rookies,
                                                             'shortlists' : shortlists})