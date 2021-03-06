from __future__ import unicode_literals

from django.db import models
from django.utils import timezone
from math import floor
from django.conf import settings

class Player(models.Model):
    position = models.CharField(max_length=3)
    name = models.CharField(max_length=60)
    team = models.CharField(max_length=20)
    contract_type = models.CharField(max_length=20)
    total_value = models.DecimalField(max_digits=5, decimal_places=2)
    signing_bonus = models.DecimalField(max_digits=5, decimal_places=2)
    salary = models.DecimalField(max_digits=5, decimal_places=2)
    yr1_salary = models.DecimalField(max_digits=5, decimal_places=2)
    yr2_salary = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    yr3_salary = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    yr4_salary = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    yr5_salary = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    yr1_sb = models.DecimalField(max_digits=5, decimal_places=2)
    yr2_sb = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    yr3_sb = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    yr4_sb = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    yr5_sb = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    yr1_role = models.CharField(max_length=8, null=True, blank=True)
    yr2_role = models.CharField(max_length=8, null=True, blank=True)
    yr3_role = models.CharField(max_length=8, null=True, blank=True)
    yr4_role = models.CharField(max_length=8, null=True, blank=True)
    yr5_role = models.CharField(max_length=8, null=True, blank=True)
    inseason_pickup = models.IntegerField(default=0)
    birthdate = models.DateField(blank=True, default='1900-01-01')
    pfr_id = models.CharField(max_length=20, blank=True, default='')

    def years_remaining(self):
        year_count = 0
        if self.yr1_salary == 0:
            pass
        else:
            year_count += 1
        if self.yr2_salary == 0:
            pass
        else:
            year_count += 1
        if self.yr3_salary == 0:
            pass
        else:
            year_count += 1
        if self.yr4_salary == 0:
            pass
        else:
            year_count += 1
        if self.yr5_salary == 0:
            pass
        else:
            year_count += 1

        return year_count

    def average_yearly_cost(self):
        try:
            return self.total_value/self.years_remaining()
        except:
            return 0

    def current_year_cap_hit(self):
        return self.yr1_salary+self.yr1_sb

    def yr2_cap_hit(self):
        return self.yr2_salary+self.yr2_sb

    def yr3_cap_hit(self):
        return self.yr3_salary+self.yr3_sb

    def yr4_cap_hit(self):
        return self.yr4_salary+self.yr4_sb

    def yr5_cap_hit(self):
        return self.yr5_salary+self.yr5_sb

    def age(self):
        full_age = timezone.now().date() - self.birthdate
        age_days = full_age.days
        age_years = floor(age_days / 364 * 10) / 10
        return age_years

    def __str__(self):
        return self.name

class Message(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField(null=True, blank=True)
    content = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class SalaryListing(models.Model):
    position = models.CharField(max_length=3)
    name = models.CharField(max_length=60)
    yearly_cost =  models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.name

class Team(models.Model):
    user = models.CharField(max_length=20)
    internal_name = models.CharField(max_length=20)
    nickname = models.CharField(max_length=60, null=True, blank=True)
    logo = models.ImageField(null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    yr1_cap_penalty = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    yr2_cap_penalty = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    yr3_cap_penalty = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    yr4_cap_penalty = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    yr5_cap_penalty = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    flex_1 = models.CharField(max_length=8, default='WR 3')
    flex_2 = models.CharField(max_length=8, default='RB 3')
    team_org_view_selected = models.CharField(max_length=30, default='Default')
    yr1_balance = models.DecimalField(max_digits=5, decimal_places=2, default=60.00)
    yr2_balance = models.DecimalField(max_digits=5, decimal_places=2, default=60.00)
    yr3_balance = models.DecimalField(max_digits=5, decimal_places=2, default=60.00)
    yr1_bonuses = models.CommaSeparatedIntegerField(max_length=3, default='0,0')
    yr2_bonuses = models.CommaSeparatedIntegerField(max_length=3, default='0,0')
    yr3_bonuses = models.CommaSeparatedIntegerField(max_length=3, default='0,0')
    current_balance = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    filtered_tags = models.TextField(default='')
    default_shortlist = models.IntegerField(blank=True, default=888888)

    def __str__(self):
        return self.internal_name

class Variable(models.Model):
    name = models.CharField(max_length=20)
    text_variable = models.TextField(null=True, blank=True)
    int_variable = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name

class TeamVariable(models.Model):
    team = models.CharField(max_length=20)
    user = models.CharField(max_length=20)
    name = models.CharField(max_length=20)
    text_variable = models.TextField(null=True, blank=True)
    int_variable = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return_string = self.team + ' - ' + self.name
        return return_string

class Role(models.Model):
    name = models.CharField(max_length=60)
    yr1_role = models.CharField(max_length=8, null=True, blank=True)
    yr2_role = models.CharField(max_length=8, null=True, blank=True)
    yr3_role = models.CharField(max_length=8, null=True, blank=True)
    yr4_role = models.CharField(max_length=8, null=True, blank=True)
    yr5_role = models.CharField(max_length=8, null=True, blank=True)

    def __str__(self):
        return self.name

class AvailableRole(models.Model):
    user = models.CharField(max_length=20)
    role = models.CharField(max_length=8)
    description = models.TextField(null=True, blank=True)
    unique_role = models.BooleanField(default=False)
    applies_to_QB = models.BooleanField(default=False)
    applies_to_RB = models.BooleanField(default=False)
    applies_to_WR = models.BooleanField(default=False)
    applies_to_TE = models.BooleanField(default=False)
    applies_to_DEF = models.BooleanField(default=False)
    applies_to_K = models.BooleanField(default=False)

    def __str__(self):
        return self.role

class Bug(models.Model):
    STATUS_CHOICES = (
        ('Open', 'Open'),
        ('Verified', 'Verified'),
        ('Working', 'Working'),
        ('Testing', 'Testing Solution'),
        ('Fixed', 'Fixed'),
        ('Cannot Replicate', 'Cannot Replicate'),
        ('Unknown', 'Unknown'),
        ('Ignored', 'Ignored')
    )

    PRIORITY_CHOICES = (
        (1, 'Urgent'),
        (2, 'High'),
        (3, 'Medium'),
        (4, 'Low')
    )

    user = models.CharField(max_length=20)
    date = models.DateTimeField()
    os = models.TextField()
    browser = models.TextField()
    resolution = models.CharField(max_length=40)
    other_envirn = models.TextField()
    report = models.TextField()
    title = models.CharField(max_length=40, blank=True)
    category = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=40, choices=STATUS_CHOICES, default='Open')
    priority = models.IntegerField(choices=PRIORITY_CHOICES, default=4)
    comments = models.TextField(blank=True)

    def __str__(self):
        return str(self.id)

class RequestedFeature(models.Model):
    user = models.CharField(max_length=20)
    date = models.DateTimeField()
    feature = models.TextField()

    def __str__(self):
        return str(self.id)

class Auction(models.Model):
    player = models.CharField(max_length=60)
    high_bidder = models.CharField(max_length=20)
    high_bid = models.DecimalField(max_digits=5, decimal_places=2)
    high_bidder_proxy_bid = models.DecimalField(max_digits=5, decimal_places=2)
    clock_reset = models.DateTimeField()
    clock_timeout_minutes = models.IntegerField(default=4320)

    def time_left(self):
        auction_end = self.clock_reset + timezone.timedelta(minutes=self.clock_timeout_minutes)
        time_left = auction_end - timezone.now()
        return time_left

    def __str__(self):
        return self.player

class Transaction(models.Model):
    player = models.CharField(max_length=60)
    team1 = models.CharField(max_length=20, null=True, blank=True)
    team2 = models.CharField(max_length=20, null=True, blank=True)
    transaction_type = models.CharField(max_length=40)
    var_d1 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    var_d2 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    var_d3 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    var_i1 = models.IntegerField(null=True, blank=True)
    var_i2 = models.IntegerField(null=True, blank=True)
    var_t1 = models.TextField(null=True, blank=True)
    var_t2 = models.TextField(null=True, blank=True)
    var_t3 = models.TextField(null=True, blank=True)
    date = models.DateTimeField()

    '''
    Transaction Type Details:

    Auction Created:
        team2 = team starting auction
        var_d1 = proxy bid

    Auction Bid:
        team2 = team bidding
        var_d1 = proxy bid

    Auction End:
        team2 = winning team
        var_d1 = winning bid
        var_d2 = proxy bid of winning team
        var_t1 = status (pending if contract is not set, otherwise blank)
        var_t2 = status (unconfirmed)

    Contract Set:
        team2 = owner
        var_d1 = total cost per year
        var_d2 = signing bonus per year
        var_i1 = total years of contract
        var_t1 = status (pending)
        var_t2 = status (confirmed)
        var_t3 = per year total cost list (split by comma)

    Contract Processed:
        team2 = owner
        var_d1 = total cost per year
        var_d2 = signing bonus per year
        var_i1 = total years of contract
        var_t3 = per year SALARY list (split by comma)

    Waiver Extension:
        team2 = owner
        var_d1 = total cost
        var_d2 = signing bonus
        var_d3 = salary
        var_t1 = status (pending)
        var_t2 = status (confirmed)

    Franchise Tag:
        team2 = owner
        var_d1 = total cost, auction start
        var_t1 = status (pending)
        var_t2 = status (confirmed)

    Transition Tag:
        team2 = owner
        var_d1 = total cost
        var_d2 = signing bonus
        var_d3 = salary
        var_t1 = status (pending)
        var_t2 = status (confirmed)

    Extension Submitted:
        team2 = owner
        var_d1 = extension cost per year
        var_d2 = signing bonus per year
        var_i1 = num_years
        var_t1 = per year SALARY list (split by comma)

    Expansion Draft Pick:
        team1 = old team
        team2 = new team
        var_i1 = pick used

    Player Cut:
        team2 = owner
        var_i1 = id of Amnesty asset used (-1 if none)
        var_t1 = status (pending)
        var_t2 = status (confirmed)

    Player Cut Processed:
        team2 = owner
        var_i1 = id of Amnesty asset used (-1 if none)
        var_t1 = cap penalty list per year (split by comma)

    Trade Offer:
        player = 'trade'
        team1 = proposing team
        team2 = opposing team
        var_i1 = id of Trade object
        var_t1 = status (pending, rejected, accepted, countered, withdrawn)

    Trade Accepted:
        player = 'trade'
        team1 = proposing team
        team2 = opposing team
        var_i1 = id of Trade object
        var_t1 = status (pending, rejected, accepted, countered, withdrawn)
        var_t2 = pro team pieces
        var_t3 = opp team pieces

    Restructure Contract:
        team2 = owner
        var_d1 = total cost per year
        var_d2 = signing bonus per year
        var_i1 = total years of contract
        var_t1 = status (pending)
        var_t2 = status (confirmed)
        var_t3 = per year total cost list (split by comma)

    Rookie Draft Pick:
        team2 = owner
        var_d1 = pick_in_round

    Waiver Add:
        team2 = owner

    '''

    def __str__(self):
        return_string = self.player + ' - ' + self.transaction_type + ' - ' + str(self.date)
        return return_string

class Alert(models.Model):
    user = models.CharField(max_length=20)
    alert_type = models.CharField(max_length=40)
    var_d1 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    var_d2 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    var_d3 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    var_i1 = models.IntegerField(null=True, blank=True)
    var_i2 = models.IntegerField(null=True, blank=True)
    var_t1 = models.TextField(null=True, blank=True)
    var_t2 = models.TextField(null=True, blank=True)
    var_t3 = models.TextField(null=True, blank=True)
    date = models.DateTimeField()

    def __str__(self):
        return_string = str(self.date) + ' - ' + self.user + ' - ' + self.alert_type
        return return_string

class AlertSetting(models.Model):
    user = models.CharField(max_length=20)
    daily_emails = models.IntegerField(default=0)
    daily_emails_time = models.TimeField(default='06:00')
    weekly_emails = models.IntegerField(default=0)
    weekly_emails_day = models.CharField(max_length=20, default='Monday')
    weekly_emails_time = models.TimeField(default='06:00')
    blank_emails = models.IntegerField(default=0)
    instant_alerts = models.CommaSeparatedIntegerField(max_length=50)

    def __str__(self):
        return self.user

class ADP(models.Model):
    rank = models.IntegerField(default=0)
    position = models.CharField(max_length=3)
    player = models.CharField(max_length=60)

    def __str__(self):
        return self.player

class Performance_Yr1(models.Model):
    rank = models.IntegerField(default=0)
    position = models.CharField(max_length=3)
    player = models.CharField(max_length=60)
    points = models.FloatField(default=0)

    def __str__(self):
        return self.player

class Performance_Yr2(models.Model):
    rank = models.IntegerField(default=0)
    position = models.CharField(max_length=3)
    player = models.CharField(max_length=60)
    points = models.FloatField(default=0)

    def __str__(self):
        return self.player

class Asset(models.Model):
    team = models.CharField(max_length=20)
    asset_type = models.CharField(max_length=40)
    var_d1 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    var_d2 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    var_d3 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    var_i1 = models.IntegerField(null=True, blank=True)
    var_i2 = models.IntegerField(null=True, blank=True)
    var_t1 = models.TextField(null=True, blank=True)
    var_t2 = models.TextField(null=True, blank=True)
    var_t3 = models.TextField(null=True, blank=True)
    date = models.DateTimeField()

    def __str__(self):
        return_string = self.team + ' - ' + self.asset_type + ' - ' + str(self.date)
        return return_string

class Draft_Pick(models.Model):
    owner = models.CharField(max_length=20)
    original_owner = models.CharField(max_length=20)
    year = models.IntegerField(default=0)
    round = models.IntegerField(default=0)
    compensatory = models.CharField(max_length=20, default='none')
    pick_in_round = models.IntegerField(default=0)
    pick_overall = models.IntegerField(default=0)
    pick_for_cost = models.IntegerField(default=0)
    yr1_sal = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    yr2_sal = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    yr3_sal = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    yr4_sal = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    player_selected = models.CharField(max_length=60, default='', blank=True)
    pick_used = models.BooleanField(default=False)

    def __str__(self):
        return_string = self.owner + ' - ' + self.original_owner + ' - ' + str(self.pick_overall) + ' - ' + str(self.year)
        return return_string

class Trade(models.Model):
    team1 = models.CharField(max_length=20)
    team2 = models.CharField(max_length=20)
    trade_thread = models.IntegerField(default=0)
    date = models.DateTimeField()
    expiration_date = models.DateTimeField()
    pro_players = models.TextField(blank=True, default='')
    pro_picks = models.TextField(blank=True, default='')
    pro_assets = models.TextField(blank=True, default='')
    pro_cash = models.TextField(blank=True, default='')
    opp_players = models.TextField(blank=True, default='')
    opp_picks = models.TextField(blank=True, default='')
    opp_assets = models.TextField(blank=True, default='')
    opp_cash = models.TextField(blank=True, default='')
    message = models.TextField(blank=True, default='')
    status1 = models.TextField(blank=True, default='')
    status2 = models.TextField(blank=True, default='')
    status3 = models.TextField(blank=True, default='')

    def __str__(self):
        return_string = str(self.trade_thread) + ' - ' + self.team1 + ', ' + self.team2 + ' - ' + str(self.date)
        return return_string

class Cap_Penalty_Entry(models.Model):
    team = models.CharField(max_length=20)
    year = models.IntegerField(default=0)
    penalty = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, blank=True)
    description = models.TextField(blank=True, default='')
    date = models.DateTimeField()

    def __str__(self):
        return_string = self.team + ' - ' + str(self.year) + ' - ' + str(self.penalty) + ' - ' + self.description
        return return_string

class Session(models.Model):
    user = models.CharField(max_length=20)
    date = models.DateTimeField()
    page = models.CharField(max_length=60)

    def __str__(self):
        return self.user + ' - ' + str(self.date)

class Board_Post(models.Model):
    user = models.CharField(max_length=20)
    date = models.DateTimeField()
    options = models.TextField(blank=True, default='0')
    title = models.CharField(max_length=60)
    view_count = models.IntegerField(default=0)
    reply_count = models.IntegerField(default=0)
    location = models.CharField(max_length=20)
    text = models.TextField(blank=True, default='')

    '''
    Current Options:
        0: Is Sticky (1), or Not Sticky (0)

    '''

    def __str__(self):
        return self.user + ' - ' + self.title + ' - ' + str(self.date)

class PlayerNote(models.Model):
    user = models.CharField(max_length=20)
    player_id = models.IntegerField(default=999999)
    notes = models.TextField(blank=True, default='')
    n1 = models.FloatField(blank=True, default=999999)
    n2 = models.FloatField(blank=True, default=999999)
    n3 = models.FloatField(blank=True, default=999999)

    def __str__(self):
        return self.user + ' - ' + str(self.player_id)

class Shortlist(models.Model):
    user = models.CharField(max_length=20)
    title = models.CharField(max_length=80)
    description = models.CharField(max_length=400)
    members = models.TextField(blank=True, default='')

    def __str__(self):
        return self.user + ' - ' + self.title

class YearlyStats(models.Model):
    player_id = models.IntegerField(default=999999)
    year = models.IntegerField(default=0)
    team = models.CharField(max_length=3, blank=True, default='')
    g = models.IntegerField(default=0)
    gs = models.IntegerField(default=0)
    pass_comp = models.IntegerField(default=0)
    pass_att = models.IntegerField(default=0)
    pass_yds = models.IntegerField(default=0)
    pass_td = models.IntegerField(default=0)
    pass_int = models.IntegerField(default=0)
    rush_att = models.IntegerField(default=0)
    rush_yds = models.IntegerField(default=0)
    rush_td = models.IntegerField(default=0)
    rec_targets = models.IntegerField(default=0)
    rec = models.IntegerField(default=0)
    rec_yds = models.IntegerField(default=0)
    rec_td = models.IntegerField(default=0)
    two_pt_conv = models.IntegerField(default=0)
    fumbles = models.IntegerField(default=0)

    def __str__(self):
        return str(self.player_id) + ' - ' + str(self.year)

class YearlyStatsKicker(models.Model):
    player_id = models.IntegerField(default=999999)
    year = models.IntegerField(default=0)
    team = models.CharField(max_length=3, blank=True, default='')
    g = models.IntegerField(default=0)
    fg_made_0 = models.IntegerField(default=0)
    fg_att_0 = models.IntegerField(default=0)
    fg_made_20 = models.IntegerField(default=0)
    fg_att_20 = models.IntegerField(default=0)
    fg_made_30 = models.IntegerField(default=0)
    fg_att_30 = models.IntegerField(default=0)
    fg_made_40 = models.IntegerField(default=0)
    fg_att_40 = models.IntegerField(default=0)
    fg_made_50 = models.IntegerField(default=0)
    fg_att_50 = models.IntegerField(default=0)
    xp_made = models.IntegerField(default=0)
    xp_att = models.IntegerField(default=0)

    def __str__(self):
        return str(self.player_id) + ' - ' + str(self.year)

class YearlyStatsDefense(models.Model):
    player_id = models.IntegerField(default=999999)
    year = models.IntegerField(default=0)
    pts_allowed = models.IntegerField(default=0)
    total_yds_allowed = models.IntegerField(default=0)
    rush_yds_allowed = models.IntegerField(default=0)
    pass_yds_allowed = models.IntegerField(default=0)
    rushes_against = models.IntegerField(default=0)
    passes_against = models.IntegerField(default=0)
    fumbles = models.IntegerField(default=0)
    int = models.IntegerField(default=0)

    def __str__(self):
        return str(self.player_id) + ' - ' + str(self.year)

class AutopickSettings(models.Model):
    AUTOPICK_ACTIONS = (
        (0, 'Pass Pick'),
        (1, 'Take player at top of draft board')
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    pick = models.ForeignKey('Draft_Pick', on_delete=models.CASCADE)
    delay = models.IntegerField(default=999)  # in minutes, 999=when clock expires
    action = models.IntegerField(choices=AUTOPICK_ACTIONS, default=1)

    def __str__(self):
        return str(self.user) + ' - ' + str(self.pick)

class DraftBoard(models.Model):
    team = models.ForeignKey('Team', on_delete=models.CASCADE)
    player = models.ForeignKey('Player', on_delete=models.CASCADE)
    rank = models.DecimalField(decimal_places=2, max_digits=5, default=999.99)

    def __str__(self):
        return str(self.team) + ' - ' + str(self.player) + ' - ' + str(self.rank)