from django.core.management.base import BaseCommand, CommandError
from dyno.models import *

class Command(BaseCommand):
    help = "Displays list of players that are in Salary Listing that are not rostered"

    def handle(self, *args, **options):

        a = SalaryListing.objects.all()
        b = Player.objects.all()
        c = Team.objects.all()

        team_list = []
        for x in c:
            team_list.append(x.internal_name)

        player_list = []
        for x in b:
            if x.team in team_list:
                player_list.append(x.name)

        unfound_list = []
        for x in a:
            if x.name in player_list:
                pass
            else:
                unfound_list.append(x.name)

        for x in unfound_list:
            print(x)

        self.stdout.write(self.style.SUCCESS('Successfully ran script'))
