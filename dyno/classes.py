import sys, traceback


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
        self.nfl_team = player_json['team']
        self.id = -2
        self.draft_position = 0

    def export_json_for_rookie_file(self):
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