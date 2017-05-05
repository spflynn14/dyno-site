import sys, traceback, datetime
from decimal import Decimal

from django.utils.dateparse import parse_datetime
from django.utils import timezone
from django.contrib.auth.models import User

from .models import Team, AutopickSettings, Draft_Pick, Variable, DraftBoard, Player, TeamVariable, Transaction, Trade

from .views import year_list, draft_pick_salary_list
from .processing import create_alerts


class ImportPlayer(object):
    def __init__(self, player_json):
        self.name = player_json['player']
        self.college = player_json['college']
        if len(player_json['dob']) == 0:
            self.dob = '1900-01-01'
        else:
            self.dob = player_json['dob']
        self.experience = player_json['experience']
        self.drafted = player_json['drafted']
        self.pos = player_json['pos']
        if player_json['team'] == 'FA':
            self.nfl_team = ''
        else:
            self.nfl_team = player_json['team']
        self.id = -2
        self.draft_position = ''

    def export_json_for_rookie_file(self):
        self.generate_draft_position()
        return {
            'name': self.name,
            'college': self.college,
            'nfl_team': self.nfl_team,
            'draft_position': self.draft_position
        }

    def find_id(self, all_players):
        if self.experience == 'Rookie':
            self.id = -1
        else:
            try:
                player = all_players.get(name=self.name)
                self.id = player.id
            except Exception:
                # traceback.print_exc(file=sys.stdout)
                pass

    def generate_draft_position(self):
        # 2015 / Detroit Lions / Round 2, Pick 22
        try:
            l = self.drafted.split('/')
            round, pick = l[2].strip().split(',')
            # l[0] = year
            # l[1] = nfl_team
            _rnd, round_num = round.strip().split(' ')
            _pck, pick_num = pick.strip().split(' ')
            self.draft_position = 'R' + round_num + ', ' + '#' + pick_num
        except:
            pass


class AutopickSettingsObject(object):
    def __init__(self, request):
        self.request = request
        self.user = request.user
        self.autopick_list = AutopickSettings.objects.filter(user=self.user)

    def save_or_delete_autopick_settings(self):
        save_or_delete = ''

        pick_to_edit = self.request.POST['pick'] #9
        pick = Draft_Pick.objects.filter(year=year_list[0]).get(pick_overall=int(pick_to_edit))

        delay = self.request.POST['delay'] #15
        if delay == '':
            save_or_delete = 'delete'
        elif delay == 'end':
            delay = 999
            save_or_delete = 'save'
        else:
            delay = int(delay)
            save_or_delete = 'save'
        pickorpass = self.request.POST['pickorpass'] #pick
        if pickorpass == 'pick':
            action = 1
        else:
            action = 0

        current_pick = self.request.POST['current_pick'] #1

        if save_or_delete == 'save':
            self.save_autopick_setting(pick, delay, action)
        elif save_or_delete == 'delete':
            self.delete_autopick_setting(pick)

        if pick_to_edit == current_pick:
            draft = Draft()
            draft.save_autopick_end_settings(delay)

    def save_autopick_setting(self, pick, delay, action):
        try:
            autopick = AutopickSettings.objects.get(user=self.user, pick=pick)
            # settings for this user and pick already exists, update settings
            autopick.delay = delay
            autopick.action = action
            autopick.save()
        except:
            # settings for this user and pick do not already exist, create it
            AutopickSettings.objects.create(
                user=self.user,
                pick=pick,
                delay=delay,
                action=action
            )

    def delete_autopick_setting(self, pick):
        try:
            autopick = AutopickSettings.objects.get(user=self.user, pick=pick)
            autopick.delete()
        except:
            pass

    def fix_autopick_clock_end(self):
        old_delay = ''
        new_delay = ''
        autopick_end = Variable.objects.get(name='Autopick End')
        set_date = parse_datetime(autopick_end.text_variable)
        if old_delay == 999:
            clock_start = Variable.objects.get(name='Draft Clock Start')
            old_date = parse_datetime(clock_start.text_variable)
        else:
            old_date = set_date - datetime.timedelta(minutes=int(old_delay))
        if new_delay == 999:
            clock_end = Variable.objects.get(name='Draft Clock End')
            new_date = clock_end.text_variable
        else:
            new_date = old_date + datetime.timedelta(minutes=int(new_delay))
        autopick_end.text_variable = new_date
        autopick_end.save()

    def return_autopick_info(self):
        autopick_info = []

        team = Team.objects.get(user=self.user)
        all_draft_picks = Draft_Pick.objects.filter(year=year_list[0]).filter(owner=team).order_by('pick_overall')

        for pick in all_draft_picks:
            temp_delay = ''
            temp_action = ''
            for autopick in self.autopick_list:
                try:
                    autopick_pick_overall = autopick.pick.pick_overall
                    delay = autopick.delay
                    action = autopick.action
                    if pick.pick_overall == autopick_pick_overall:
                        if delay == 999:
                            temp_delay = 'end'
                        else:
                            temp_delay = delay
                        if action == 0:
                            temp_action = 'pass'
                        else:
                            temp_action = 'pick'
                except:
                    pass
            pick_string = ''
            if pick.pick_in_round >= 10:
                pick_string = str(pick.round) + '.' + str(pick.pick_in_round)
            else:
                pick_string = str(pick.round) + '.0' + str(pick.pick_in_round)

            autopick_info.append({'pick': pick_string,
                                  'pick_overall': pick.pick_overall,
                                  'delay': temp_delay,
                                  'skip_pick_flag': temp_action,
                                  'player_selected': pick.player_selected})

        return autopick_info

class DraftBoardObject(object):
    def __init__(self, request):
        self.request = request
        self.user = request.user
        try:
            self.team = Team.objects.get(user=self.user)
            self.draft_board = DraftBoard.objects.filter(team=self.team).order_by('rank')
        except:
            self.draft_board = []

    def make_draft_board_action_variables(self):
        try:
            self.playername = self.request.POST['player']
        except:
            self.playername = ''
        try:
            self.action = self.request.POST['action']
        except:
            self.action = ''

    def return_draft_board_info(self):
        draft_board_info = []

        from .draft import pull_draft_data_from_file
        draft_info = pull_draft_data_from_file()

        self.draft_board = DraftBoard.objects.filter(team=self.team).order_by('rank')

        for player in self.draft_board:
            college = ''
            nfl_team = ''
            for info in draft_info:
                if info['name'] == player.player.name:
                    college = info['college']
                    nfl_team = info['nfl_team']
            draft_board_info.append({
                'pos': player.player.position,
                'player': player.player.name,
                'college': college,
                'nfl_team': nfl_team
            })

        return draft_board_info

    def add_player_to_draft_board(self):
        try:
            self.team = Team.objects.get(user=self.user)
            player = Player.objects.get(name=self.playername)
            player_on_board = DraftBoard.objects.get(player=player, team=self.team)
            # player exists - do not add to draft board
            return False
        except:
            self.team = Team.objects.get(user=self.user)
            player_to_add = Player.objects.get(name=self.playername)
            try:
                last_rank = len(self.draft_board)
                new_rank = Decimal(last_rank) + Decimal(1.00)
            except:
                new_rank = Decimal(1.00)
            DraftBoard.objects.create(
                team=self.team,
                player=player_to_add,
                rank=new_rank
            )
            return True

    def reorder_draft_board(self):
        self.draft_board = DraftBoard.objects.filter(team=self.team).order_by('rank')
        for count, player in enumerate(self.draft_board, 1):
            player.rank = Decimal(count)
            player.save()

    def clear_draft_board(self):
        for o in self.draft_board:
            o.delete()

    def remove_player_from_draft_board(self):
        player = Player.objects.get(name=self.playername)
        for p in self.draft_board:
            if p.player == player:
                p.delete()
                self.reorder_draft_board()

    def move_player_up_draft_board(self):
        player = Player.objects.get(name=self.playername)
        for p in self.draft_board:
            if p.player == player:
                current_position_in_board = p.rank
                if current_position_in_board == Decimal(1.00):
                    return
                position_above = current_position_in_board - Decimal(1.00)
                new_position = position_above - Decimal(0.01)
                p.rank = new_position
                p.save()
                self.reorder_draft_board()

    def move_player_down_draft_board(self):
        player = Player.objects.get(name=self.playername)
        for p in self.draft_board:
            if p.player == player:
                current_position_in_board = p.rank
                position_below = current_position_in_board + Decimal(1.00)
                new_position = position_below + Decimal(0.01)
                p.rank = new_position
                p.save()
                self.reorder_draft_board()

    def write_player_list_to_draft_board(self, player_list):
        self.clear_draft_board()

        for count, player in enumerate(player_list, 1):
            player_to_add = Player.objects.get(name=player['name'])
            DraftBoard.objects.create(
                team=self.team,
                player=player_to_add,
                rank=Decimal(count)
            )

class TeamOnTheClock(object):
    def __init__(self, pick_overall):
        try:
            self.draft_pick_obj = Draft_Pick.objects.get(year=year_list[0], pick_overall=pick_overall)
            self.team = Team.objects.get(internal_name=self.draft_pick_obj.owner)
            self.user = User.objects.get(username=self.team.user)
            self.draft_board = DraftBoard.objects.filter(team=self.team).order_by('rank')
        except:
            pass
        try:
            self.autopick_settings = AutopickSettings.objects.get(user=self.user, pick=self.draft_pick_obj)
        except:
            self.autopick_settings = None

    def get_next_team_on_the_clock(self):
        try:
            self.next_team_on_the_clock = TeamOnTheClock(self.draft_pick_obj.pick_overall + 1)
        except Exception:
            traceback.print_exc()
            self.next_team_on_the_clock = 'none'

    def disable_autopick(self):
        if self.autopick_settings is not None:
            self.autopick_settings.delete()
            self.autopick_settings = None

    def send_alert(self, type):
        if type == 'Autopick Disabled':
            create_alerts('Autopick Disabled', self.team.user, [self.draft_pick_obj.round, self.draft_pick_obj.pick_in_round, 'blank board'])
        elif type == 'Draft - On The Clock - False':
            create_alerts('Draft - On The Clock', self.team.user, [self.draft_pick_obj.round, self.draft_pick_obj.pick_in_round, False])
        elif type == 'Draft - On The Clock - True':
            try:
                create_alerts('Draft - On The Clock', self.team.user, [self.draft_pick_obj.round, self.draft_pick_obj.pick_in_round, True])
            except:
                pass
        elif type == 'Draft Pick Made':
            x = self.draft_pick_obj
            if self.next_team_on_the_clock == 'none':
                next_team = 'none'
            else:
                try:
                    next_team = self.next_team_on_the_clock.user.username
                except:
                    next_team = 'No one'
                    # draft is over
                    draft_switch = Variable.objects.get(name='Draft Switch')
                    draft_switch.int_variable = 0
                    draft_switch.save()
            create_alerts('Draft Pick Made', self.user.username,
                          [x.round, x.pick_in_round, x.pick_overall, x.player_selected, x.owner, next_team])
        else:
            raise Exception

    def should_send_email_to_user_on_clock_if_on_autopick(self):
        try:
            draft_settings = TeamVariable.objects.filter(user=self.team.user).get(name='DraftSettings')
            _1, _2, set3 = draft_settings.text_variable.split(',')
        except:
            _1 = '1'
            _2 = '1'
            set3 = '0'
        if set3 == '1':
            return True
        return False

    def reconfigure_draft_cost(self, current_pick, total_picks, increment_direction='down'):
        print('reconfiguring draft costs...', current_pick, total_picks)
        for x in range(current_pick + 1, total_picks + 1):
            a = Draft_Pick.objects.get(year=year_list[0], pick_overall=x)
            if increment_direction == 'down':
                a.pick_for_cost -= 1
            else:
                a.pick_for_cost += 1
            a.yr1_sal = 0
            a.yr2_sal = 0
            a.yr3_sal = 0
            a.yr4_sal = 0
            try:
                sal_list = draft_pick_salary_list[a.pick_for_cost]
            except:
                sal_list = [1.00, 1.50]
            for x in range(0, len(sal_list)):
                if x == 0:
                    a.yr1_sal = sal_list[x]
                elif x == 1:
                    a.yr2_sal = sal_list[x]
                elif x == 2:
                    a.yr3_sal = sal_list[x]
                elif x == 3:
                    a.yr4_sal = sal_list[x]
            a.save()

    def make_draft_selection(self, selection):
        # selection will either be Player object, or 'passed'
        if selection == 'passed':
            self.draft_pick_obj.player_selected = 'pick passed'
            self.draft_pick_obj.save()
            self.reconfigure_draft_cost(self.draft_pick_obj.pick_overall, Draft_Pick.objects.filter(year=year_list[0]).count())
        else:
            # save player name to draft pick object
            self.draft_pick_obj.player_selected = selection.name
            self.draft_pick_obj.save()
            
            # save player information
            selection.team = self.team.internal_name
            selection.contract_type = 'Rookie'
            selection.yr1_sb = Decimal(round(self.draft_pick_obj.yr1_sal * Decimal(0.4), 1))
            selection.yr1_salary = self.draft_pick_obj.yr1_sal - selection.yr1_sb
            selection.yr2_sb = Decimal(round(self.draft_pick_obj.yr2_sal * Decimal(0.4), 1))
            selection.yr2_salary = self.draft_pick_obj.yr2_sal - selection.yr2_sb
            selection.yr3_sb = Decimal(round(self.draft_pick_obj.yr3_sal * Decimal(0.4), 1))
            selection.yr3_salary = self.draft_pick_obj.yr3_sal - selection.yr3_sb
            selection.yr4_sb = Decimal(round(self.draft_pick_obj.yr4_sal * Decimal(0.4), 1))
            selection.yr4_salary = self.draft_pick_obj.yr4_sal - selection.yr4_sb
            selection.total_value = self.draft_pick_obj.yr1_sal + self.draft_pick_obj.yr2_sal + self.draft_pick_obj.yr3_sal + self.draft_pick_obj.yr4_sal
            selection.signing_bonus = selection.yr1_sb + selection.yr2_sb + selection.yr3_sb + selection.yr4_sb
            selection.salary = selection.total_value - selection.signing_bonus
            selection.save()

            # create verbose pick for use with transaction
            if self.draft_pick_obj.pick_in_round >= 10:
                verbose_pick = str(self.draft_pick_obj.round) + '.' + str(self.draft_pick_obj.pick_in_round)
            else:
                verbose_pick = str(self.draft_pick_obj.round) + '.0' + str(self.draft_pick_obj.pick_in_round)

            # create transaction for draft pick
            Transaction.objects.create(player=self.draft_pick_obj.player_selected,
                                       team2=self.team.internal_name,
                                       transaction_type='Rookie Draft Pick',
                                       var_d1=Decimal(verbose_pick),
                                       date=timezone.now())

            # remove player from DraftBoards
            DraftBoard.objects.filter(player=selection).delete()

            # check for traded players or assets
            self.check_and_clear_traded_players_assets(selection.id)

        # flip pick_used flag
        self.draft_pick_obj.pick_used = True
        self.draft_pick_obj.save()

        self.get_next_team_on_the_clock()

        # send alert that pick has been made
        self.send_alert('Draft Pick Made')

        if self.next_team_on_the_clock == 'none' or self.next_team_on_the_clock == 'No one':
            # draft is over
            draft_switch = Variable.objects.get(name='Draft Switch')
            draft_switch.int_variable = 0
            draft_switch.save()
        else:
            # draft is not over
            new_draft = Draft()

            return new_draft

    def check_and_clear_traded_players_assets(self, pick_id):
        from .processing import check_trade_for_dup_assets
        # need to check for traded player/assets in other deals and cancel them
        f = Trade.objects.all().exclude(status3='Closed')
        for x in f:
            trade_invalid = check_trade_for_dup_assets(x, [], [str(pick_id)], [], [], [str(pick_id)], [])
            # trade, pro_players, pro_picks, pro_assets, opp_players, opp_picks, opp_assets
            if trade_invalid:
                x.status3 = 'Closed'
                x.status2 = 'Invalid'
                x.save()
                g = Transaction.objects.filter(player='trade').get(var_i1=x.id)
                g.var_t1 = 'Invalid'
                g.save()


class Draft(object):
    def __init__(self):
        self.set_current_pick()
        self.set_team_on_the_clock()

    def set_current_pick(self):
        picks_not_used = Draft_Pick.objects.filter(year=year_list[0], pick_used=False).order_by('pick_overall')
        try:
            self.current_pick = picks_not_used[0].pick_overall
        except:
            self.current_pick = 0

    def set_team_on_the_clock(self):
        self.team_on_the_clock = TeamOnTheClock(self.current_pick)

    def new_draft_pick_loop(self):
        # clear autopick end
        autopick_end = Variable.objects.get(name='Autopick End')
        autopick_end.text_variable = ''
        autopick_end.save()

        # save draft clock start and end
        self.save_draft_clock_start_and_end()

        # determine if there is an active autopick setting for this pick
        if self.team_on_the_clock.autopick_settings is not None:
            # is active autopick
            # if delay is greater than zero, need to set autopick end
            if self.team_on_the_clock.autopick_settings.delay > 0:
                self.save_autopick_end_settings(self.team_on_the_clock.autopick_settings.delay)

            # is draft_board blank
            if len(self.team_on_the_clock.draft_board) > 0:
                # usable draft board
                # are we sending an alert?
                if self.team_on_the_clock.should_send_email_to_user_on_clock_if_on_autopick():
                    self.team_on_the_clock.send_alert('Draft - On The Clock - True')

                # if action is pick, make selection
                if self.team_on_the_clock.autopick_settings.action == 1 and self.team_on_the_clock.autopick_settings.delay == 0:
                    player_selected = self.team_on_the_clock.draft_board[0].player
                    new_draft = self.team_on_the_clock.make_draft_selection(player_selected)
                    new_draft.new_draft_pick_loop()
                elif self.team_on_the_clock.autopick_settings.action == 0 and self.team_on_the_clock.autopick_settings.delay == 0:
                    new_draft = self.team_on_the_clock.make_draft_selection('passed')
                    new_draft.new_draft_pick_loop()
            else:
                # blank draft board
                # clear autopick end
                autopick_end = Variable.objects.get(name='Autopick End')
                autopick_end.text_variable = ''
                autopick_end.save()

                # if pick is passed
                if self.team_on_the_clock.autopick_settings.action == 0:
                    new_draft = self.team_on_the_clock.make_draft_selection('passed')
                    new_draft.new_draft_pick_loop()
                else:
                    # disable autopick
                    self.team_on_the_clock.disable_autopick()

                    # send alert that autopick is disabled
                    self.team_on_the_clock.send_alert('Autopick Disabled')

                    # send alert that user is on the clock
                    self.team_on_the_clock.send_alert('Draft - On The Clock - False')
        else:
            # no autopick
            # send alert that user is on the clock
            self.team_on_the_clock.send_alert('Draft - On The Clock - True')

    def save_draft_clock_start_and_end(self):
        # get default draft clock settings
        default_draft_clock_setting = Variable.objects.get(name='Default Draft Clock')
        default_draft_clock = default_draft_clock_setting.int_variable

        # get clock suspension settings
        suspension_setting = Variable.objects.get(name='Draft Suspension')
        suspend_start, suspend_end = suspension_setting.text_variable.split(',')
        if suspend_start == '12':
            suspend_start = 0
        else:
            suspend_start = int(suspend_start) + 12
        suspend_end = int(suspend_end)

        # step thru minutes using suspension to get draft clock end
        current_time = datetime.datetime.now()
        for x in range(0,9999):
            current_time += datetime.timedelta(minutes=1)
            hour = current_time.hour
            if hour >= suspend_start or hour < suspend_end:
                pass
            else:
                default_draft_clock -= 1
                if default_draft_clock <= 0:
                    break

        # save draft clock start and end
        draft_clock_end_setting = Variable.objects.get(name='Draft Clock End')
        draft_clock_end_setting.text_variable = timezone.make_aware(current_time)
        draft_clock_end_setting.save()

        draft_clock_start_setting = Variable.objects.get(name='Draft Clock Start')
        draft_clock_start_setting.text_variable = datetime.datetime.now()
        draft_clock_start_setting.save()

    def save_autopick_end_settings(self, delay):
        autopick_end_setting = Variable.objects.get(name='Autopick End')
        if delay == 999:
            draft_clock_end_setting = Variable.objects.get(name='Draft Clock End')
            autopick_end_setting.text_variable = draft_clock_end_setting.text_variable
        else:
            draft_clock_end_setting = Variable.objects.get(name='Draft Clock Start')
            end_time = parse_datetime(draft_clock_end_setting.text_variable) + timezone.timedelta(minutes=delay)
            autopick_end_setting.text_variable = timezone.make_aware(end_time)
        autopick_end_setting.save()