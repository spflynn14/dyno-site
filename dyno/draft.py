import json
from decimal import Decimal

from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.utils.dateparse import parse_datetime
from django.db.models import Q, Sum

from .classes import ImportPlayer, AutopickSettingsObject, DraftBoardObject

from .models import Player, Shortlist, Draft_Pick, TeamVariable, Variable, Team, Transaction, DraftBoard
from .views import working_local, year_list


def pull_draft_data_from_file():
    ipath = static('content/2017_rookies.json')
    if working_local == True:
        full_path = 'dyno/' + ipath
    else:
        full_path = '/home/spflynn/dyno-site/dyno' + ipath

    with open(full_path) as f:
        info_list = json.loads(f.read())
    return info_list

def get_allpicks_and_current_pick():
    all_picks = Draft_Pick.objects.filter(year=year_list[0]).order_by('pick_overall')
    on_clock = -1
    for pick in all_picks:
        if not pick.pick_used:
            on_clock = pick.owner
            break
    try:
        team = Team.objects.get(internal_name=on_clock)
        on_clock = team.user
    except:
        pass
    return all_picks, on_clock

def create_player_list():
    # must use ipath
    ipath = static('content/test_players.json')
    if working_local == True:
        full_path = 'dyno/' + ipath
    else:
        full_path = '/home/spflynn/dyno-site/dyno' + ipath
    with open(full_path) as f:
        data = json.loads(f.read())

    all_players = Player.objects.all()
    player_list = []
    for p in data:
        player = ImportPlayer(p)
        player.find_id(all_players)
        player_list.append(player)
    return player_list


def create_import_player_id(request):
    player_list = create_player_list()

    print('***** Rookie List')
    for player in player_list:
        if player.id == -1:
            print(player.name)

    print('***** Not Found List')
    for player in player_list:
        if player.id == -2:
            print(player.name)

    return HttpResponseRedirect('/batch')

def create_import_player_all(request):
    player_list = create_player_list()
    write_to_file_list = []
    for player in player_list:
        if player.id == -1:
            # create player in Player model
            try:
                p = Player.objects.get(name=player.name,
                                       position=player.pos,
                                       team='Rookie')
                p.dob = player.dob
                p.save()
            except:
                Player.objects.create(
                    position=player.pos,
                    name=player.name,
                    team='Rookie',
                    contract_type='none',
                    birthdate=player.dob,
                    pfr_id='',
                    total_value=0,
                    signing_bonus=0,
                    salary=0,
                    yr1_salary=0,
                    yr2_salary=0,
                    yr3_salary=0,
                    yr4_salary=0,
                    yr5_salary=0,
                    yr1_sb=0,
                    yr2_sb=0,
                    yr3_sb=0,
                    yr4_sb=0,
                    yr5_sb=0,
                    notes='',
                    yr1_role='--',
                    yr2_role='--',
                    yr3_role='--',
                    yr4_role='--',
                    yr5_role='--',
                )
                print('**New Player', player.name, ',', player.pos)
            # add to list for creating rookie file
            write_to_file_list.append(player.export_json_for_rookie_file())

    # write rookie file
    ipath = static('content/2017_rookies.json')
    if working_local == True:
        full_path = 'dyno/' + ipath
    else:
        full_path = '/home/spflynn/dyno-site/dyno' + ipath
    with open(full_path, 'w') as f:
        json.dump(write_to_file_list, f)
    return HttpResponseRedirect('/')

def get_info_for_draft_pool_page(request):
    info_list = pull_draft_data_from_file()

    a = Player.objects.filter(team='Rookie')
    rookies = []
    for x in a:
        for y in info_list:
            if y['name'] == x.name:
                rookies.append({'pos': x.position, 'name': x.name, 'college': y['college'], 'nfl_team': y['nfl_team'],
                                'pick': y['draft_position']})

    rookies = sorted(rookies, key=lambda b: b['name'])

    b = Shortlist.objects.filter(user=request.user)

    return rookies, b

def get_info_for_draftpage(request):
    all_picks, on_clock = get_allpicks_and_current_pick()

    rookies = Player.objects.filter(team='Rookie').order_by('name')

    draft_board_info = []

    team = Team.objects.get(user=request.user)
    draft_board_players = DraftBoard.objects.filter(team=team).order_by('rank')
    info_list = pull_draft_data_from_file()

    for player in draft_board_players:
        for draftee in info_list:
            if player.player.name == draftee['name']:
                draft_board_info.append({'pos': player.player.position,
                                         'player': player.player.name,
                                         'college': draftee['college'],
                                         'nfl_team': draftee['nfl_team'],
                                         'id': player.player.id})

    ####################
    # draft_board_team_var = TeamVariable.objects.filter(user=request.user).get(name='DraftBoard')
    # draft_board = draft_board_team_var.text_variable
    #
    # playername_list = []
    # try:
    #     board_list = draft_board.split(',')
    # except:
    #     board_list = []
    # print(board_list)
    # if len(board_list) > 0 and len(board_list[0]) > 0:
    #     for x in board_list:
    #         d = Player.objects.get(id=int(x))
    #         if d.team == 'Rookie':
    #             playername_list.append({'name': d.name,
    #                                     'pos': d.position,
    #                                     'id': d.id})
    #     info_list = pull_draft_data_from_file()
    #
    # draft_board_info = []
    # for x in playername_list:
    #     for y in info_list:
    #         if y['name'] == x['name']:
    #             draft_board_info.append({'pos': x['pos'],
    #                                      'player': x['name'],
    #                                      'college': y['college'],
    #                                      'nfl_team': y['nfl_team'],
    #                                      'id': x['id']})
    ####################
    return all_picks, on_clock, rookies, draft_board_info

def get_info_for_draftdatapull(request):
    a = Variable.objects.get(name='Draft Switch')
    draft_switch = a.int_variable

    b = Variable.objects.get(name='Draft Clock End')
    draft_clock_end = parse_datetime(b.text_variable)
    # draft_clock_end = timezone.make_naive(draft_clock_end)

    all_picks, on_clock = get_allpicks_and_current_pick()

    info_list = pull_draft_data_from_file()
    player_list = []
    for pick in all_picks:
        try:
            player = Player.objects.get(name=pick.player_selected)
            for entry in info_list:
                if player.name == entry['name']:
                    player_list.append({
                        'player': player.name,
                        'pos': player.position,
                        'college': entry['college'],
                        'nfl_team': entry['nfl_team']
                    })
        except:
            pass

    return draft_switch, draft_clock_end, on_clock, player_list, on_clock

def get_info_draft_info_settings_data(request):
    # a = Draft_Pick.objects.filter(
    #     Q(year=year_list[1]) | Q(year=year_list[2]) | Q(year=year_list[3]) | Q(year=year_list[4]))

    current_user = str(request.user)
    a = Team.objects.get(user=current_user)
    team = a.internal_name
    cap_pen_by_year = [
        a.yr1_cap_penalty,
        a.yr2_cap_penalty,
        a.yr3_cap_penalty,
        a.yr4_cap_penalty,
        a.yr5_cap_penalty
    ]

    b = Player.objects.filter(team=team)
    cost_yr1 = 0
    cost_yr2 = 0
    cost_yr3 = 0
    cost_yr4 = 0
    cost_yr5 = 0
    for x in b:
        cost_yr1 += x.yr1_salary
        cost_yr1 += x.yr1_sb
        cost_yr2 += x.yr2_salary
        cost_yr2 += x.yr2_sb
        cost_yr3 += x.yr3_salary
        cost_yr3 += x.yr3_sb
        cost_yr4 += x.yr4_salary
        cost_yr4 += x.yr4_sb
        cost_yr5 += x.yr5_salary
        cost_yr5 += x.yr5_sb
    cost_by_year = [
        cost_yr1,
        cost_yr2,
        cost_yr3,
        cost_yr4,
        cost_yr5
    ]

    dpo = DraftBoardObject(request)
    draft_board_info = dpo.return_draft_board_info()
    ############################
    # c = TeamVariable.objects.filter(user=request.user).get(name='DraftBoard')
    # draft_board = c.text_variable
    #
    # playername_list = []
    # try:
    #     board_list = draft_board.split(',')
    # except:
    #     board_list = []
    # print(board_list)
    # if len(board_list) > 0 and len(board_list[0]) > 0:
    #     for x in board_list:
    #         d = Player.objects.get(id=int(x))
    #         if d.team == 'Rookie':
    #             playername_list.append({'name': d.name,
    #                                     'pos': d.position})
    #
    #     info_list = pull_draft_data_from_file()
    #
    # draft_board_info = []
    # for x in playername_list:
    #     for y in info_list:
    #         if y['name'] == x['name']:
    #             draft_board_info.append({'pos': x['pos'],
    #                                      'player': x['name'],
    #                                      'college': y['college'],
    #                                      'nfl_team': y['nfl_team']})
    #############################

    apo = AutopickSettingsObject(request)
    autopick_info = apo.return_autopick_info()

    f = TeamVariable.objects.filter(user=request.user).get(name='DraftSettings')
    settings_code = f.text_variable
    try:
        set1, set2, set3 = settings_code.strip().split(',')
    except:
        set1 = '1'
        set2 = '1'
        set3 = '0'
    draft_settings = [set1, set2, set3]

    g = Draft_Pick.objects.filter(year=year_list[0]).order_by('pick_overall')
    current_pick = 0
    for x in g:
        if len(x.player_selected) == 0:
            current_pick = x.pick_overall
            break
    draft_switch = Variable.objects.get(name='Draft Switch')
    if draft_switch.int_variable == 0:
        current_pick = 0

    return cost_by_year, cap_pen_by_year, draft_board_info, autopick_info, draft_settings, current_pick

def get_info_add_player_to_draft_board(request):
    dbo = DraftBoardObject(request)
    dbo.make_draft_board_action_variables()

    add_player_bool = dbo.add_player_to_draft_board()

    draft_board_info = dbo.return_draft_board_info()

    # playername = request.POST['player']
    # a = Player.objects.get(name=playername)
    # playerid = a.id
    #
    # b = TeamVariable.objects.filter(user=request.user).get(name='DraftBoard')
    # if b.text_variable is None:
    #     b.text_variable = ''
    #     b.save()
    # if str(playerid) in b.text_variable:
    #     add_player_bool = False
    #     draft_board_info = ''
    # else:
    #     if len(b.text_variable) == 0:
    #         b.text_variable = playerid
    #     else:
    #         b.text_variable = b.text_variable + ',' + str(playerid)
    #     b.save()
    #
    #     info_list = pull_draft_data_from_file()
    #
    #     draft_board_info = {}
    #     for y in info_list:
    #         if y['name'] == playername:
    #             draft_board_info = {'pos': a.position,
    #                                 'player': a.name,
    #                                 'college': y['college'],
    #                                 'nfl_team': y['nfl_team']}
    #     add_player_bool = True

    return draft_board_info, add_player_bool

def add_draft_year(request):
    year = request.POST['year']

    all_teams = Team.objects.all()

    for team in all_teams:
        for round in range(1,6):
            Draft_Pick.objects.create(
                owner=team,
                original_owner=team,
                year=int(year),
                round=round
            )

    return HttpResponseRedirect('/batch')

def manual_draft_pick(request):
    player_id = request.POST['player_id']

    # get player_id
    player_id = request.POST['player_id']
    if player_id == '_pass_':
        player = 'passed'
    else:
        player = Player.objects.get(pk=int(player_id))

    from .classes import Draft
    draft = Draft()
    new_draft = draft.team_on_the_clock.make_draft_selection(player)

    # if draft isn't over, run new pick loop
    if new_draft is not None:
        new_draft.new_draft_pick_loop()

    return JsonResponse('done', safe=False)

def revert_draft_pick(request):
    pick_id = request.POST['pick_id']
    
    # reset Draft_pick
    draft_pick = Draft_Pick.objects.get(year=year_list[0], pick_overall=int(pick_id))
    old_pick = draft_pick.player_selected
    draft_pick.player_selected = ''
    draft_pick.pick_used = False
    draft_pick.save()
    
    # reset Player
    if old_pick != 'pick passed':
        player = Player.objects.get(name=old_pick)
        old_team = player.team
        player.team = 'Rookie'
        player.contract_type = 'none'
        player.yr1_sb = Decimal(0.00)
        player.yr1_salary = Decimal(0.00)
        player.yr2_sb = Decimal(0.00)
        player.yr2_salary = Decimal(0.00)
        player.yr3_sb = Decimal(0.00)
        player.yr3_salary = Decimal(0.00)
        player.yr4_sb = Decimal(0.00)
        player.yr4_salary = Decimal(0.00)
        player.total_value = Decimal(0.00)
        player.signing_bonus = Decimal(0.00)
        player.salary = Decimal(0.00)
        player.save()
    
    # delete Transaction
    try:
        trans = Transaction.objects.get(player=old_pick,
                                        team2=old_team,
                                        transaction_type='Rookie Draft Pick').delete()
    except:
        pass

    from .classes import Draft
    draft = Draft()

    # set clocks
    draft.save_draft_clock_start_and_end()
    
    # if pick was passed, reconfigure pick costs
    if old_pick == 'pick passed':
        total_picks = Draft_Pick.objects.filter(year=year_list[0]).count()
        prev_pick = int(pick_id) - 1
        draft.team_on_the_clock.reconfigure_draft_cost(int(pick_id), total_picks, increment_direction='up')

    return JsonResponse('', safe=False)