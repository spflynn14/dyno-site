import os, sys, platform
from decimal import *
from django.shortcuts import render, redirect, render_to_response
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.template import RequestContext, loader
from .models import *
from .forms import *

working_local = True

def homepage(request):
    return render(request, 'base.html', {})

def loginpage(request):
    print('***login page : ', request.user)
    return render(request, 'login.html', {'failed_login': False})

def loginView(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            a = Variable.objects.get(name='team selected')
            b = Team.objects.get(user=user)
            team_name = b.internal_name

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
    return render(request, 'auction.html', {})

def leagueallplayerspage(request):
    #todo: change to sql pull to speed up
    table_contents = Player.objects.order_by('position', '-total_value')
    return render(request, 'league/league_all_players.html', {'table_contents' : table_contents})

def leagueextensions(request):
    return render(request, 'league/league_extensions.html', {})

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

def leaguefuturedraftpicks(request):
    return render(request, 'league/league_future_draft_picks.html', {})

def leaguecapsummary(request):
    a = Player.objects.all()
    team_list = []
    salary_list = []
    current_cap_penalty = []
    cap_space = []
    for x in a:
        team_list.append(x.team)
    team_list = list(set(team_list))
    team_list = sorted(team_list)

    for x in range(len(team_list)):
        salary_list.append(Decimal(0))
        current_cap_penalty.append(Decimal(0))
        cap_space.append(Decimal(0))

    for x in a:
        for y in range(len(team_list)):
            if x.team == team_list[y]:
                salary_list[y] += (Decimal(x.yr1_salary)+Decimal(x.yr1_sb))

    b = Team.objects.all()
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

    cur.execute('SELECT text_variable FROM dyno_variable WHERE name=?', ['team selected'])
    a = cur.fetchone()
    team_selected = a[0]

    aa = Team.objects.get(user=request.user)
    user_team = aa.internal_name
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

    cur.execute('SELECT team FROM dyno_player')
    c = cur.fetchall()
    team_list = []
    for x in range(len(c)):
        team_list.append(c[x][0])
    team_list = list(set(team_list))
    team_list = sorted(team_list)

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

    b = Player.objects.filter(team=team)
    team_json = []

    for x in b:
        avail_ro_1 = avail_roles(con, cur, team, x.position, x.name, 1)
        avail_ro_2 = avail_roles(con, cur, team, x.position, x.name, 2)
        avail_ro_3 = avail_roles(con, cur, team, x.position, x.name, 3)
        avail_ro_4 = avail_roles(con, cur, team, x.position, x.name, 4)
        avail_ro_5 = avail_roles(con, cur, team, x.position, x.name, 5)
        team_json.append({'yr1_role': x.yr1_role,
                         'yr2_role' : x.yr2_role,
                         'yr3_role' : x.yr3_role,
                         'yr4_role' : x.yr4_role,
                         'yr5_role' : x.yr5_role,
                          'pos' : x.position,
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
                          'yr5_sb' : x.yr5_sb,
                          'notes' : x.notes,
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

    return render(request, 'team/team_cap_situation.html', {'team_json' : team_json,
                                                            'avail_roles' : avail_roles_all,
                                                            'cap_pen_yr1' : cap_pen_yr1,
                                                            'cap_pen_yr2' : cap_pen_yr2,
                                                            'cap_pen_yr3' : cap_pen_yr3,
                                                            'cap_pen_yr4' : cap_pen_yr4,
                                                            'cap_pen_yr5' : cap_pen_yr5,
                                                            'filtered_tags' : filtered_tags})

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
                                                              'team_info' : team_info})

def playerpage(request):
    a = Variable.objects.get(name='player selected')
    player_selected = a.text_variable

    b = Player.objects.order_by('name')
    player_list = []
    for x in b:
        player_list.append(x.name)

    return render(request, 'player.html', {'player_list' : player_list,
                                           'player_selected' : player_selected})

def settingspage(request):
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
                              notes=notes)
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
    o = platform.platform()
    b = request.META['HTTP_USER_AGENT']
    return render(request, 'admin/new_bug.html', {'environ' : e,
                                                  'os' : o,
                                                  'browser' : b})

def featurerequestpage(request):


    return render(request, 'admin/feature_request.html', {})