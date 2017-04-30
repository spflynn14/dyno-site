import sys, traceback, datetime
from decimal import Decimal

from django.utils.dateparse import parse_datetime

from .models import Team, AutopickSettings, Draft_Pick, Variable, DraftBoard, Player, Shortlist

from .views import year_list


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
            # self.fix_autopick_clock_end()
            pass

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