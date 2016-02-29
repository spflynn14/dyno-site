import os, platform
import sqlite3 as sql3
from django.utils import timezone
from django.db.models import Sum
from decimal import *
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.core import serializers
import datetime
from .forms import *
from .views import working_local, year_list, draft_pick_salary_list, get_verbose_trade_info


def check_trade_for_dup_assets(trade, pro_players, pro_picks, pro_assets, opp_players, opp_picks, opp_assets):
        trade_invalid = False
        
        trade_pro_players = trade.pro_players.split(':')
        trade_pro_picks = trade.pro_picks.split(':')
        trade_pro_assets = trade.pro_assets.split(':')
        trade_opp_players = trade.opp_players.split(':')
        trade_opp_picks = trade.opp_picks.split(':')
        trade_opp_assets = trade.opp_assets.split(':')

        if trade_pro_players[0] == '':
            trade_pro_players = []
        if trade_opp_players[0] == '':
            trade_opp_players = []
        if trade_pro_picks[0] == '':
            trade_pro_picks = []
        if trade_opp_picks[0] == '':
            trade_opp_picks = []
        if trade_pro_assets[0] == '':
            trade_pro_assets = []
        if trade_opp_assets[0] == '':
            trade_opp_assets = []

        for x in trade_pro_players:
            if x in pro_players:
                trade_invalid = True
                break
        for x in trade_pro_picks:
            if x in pro_picks:
                trade_invalid = True
                break
        for x in trade_pro_assets:
            if x in pro_assets:
                trade_invalid = True
                break
        for x in trade_opp_players:
            if x in opp_players:
                trade_invalid = True
                break
        for x in trade_opp_picks:
            if x in opp_picks:
                trade_invalid = True
                break
        for x in trade_opp_assets:
            if x in opp_assets:
                trade_invalid = True
                break

        return trade_invalid

def pull_strings_from_trade(trade_id):
    a = Trade.objects.get(pk=trade_id)
    pro_team = a.team1
    pro_players = a.pro_players.strip().split(':')
    pro_picks = a.pro_picks.strip().split(':')
    pro_assets = a.pro_assets.strip().split(':')
    pro_cash = a.pro_cash.strip().split(':')
    opp_team = a.team2
    opp_players = a.opp_players.strip().split(':')
    opp_picks = a.opp_picks.strip().split(':')
    opp_assets = a.opp_assets.strip().split(':')
    opp_cash = a.opp_cash.strip().split(':')
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

    pro_string = ''
    for x in pro_players:
        pro_string = pro_string + x + '\n'
    for x in pro_picks_verbose:
        pro_string = pro_string + x + '\n'
    for x in pro_assets_verbose:
        pro_string = pro_string + x + '\n'
    for x in pro_cash_verbose:
        pro_string = pro_string + x + '\n'

    opp_string = ''
    for x in opp_players:
        opp_string = opp_string + x + '\n'
    for x in opp_picks_verbose:
        opp_string = opp_string + x + '\n'
    for x in opp_assets_verbose:
        opp_string = opp_string + x + '\n'
    for x in opp_cash_verbose:
        opp_string = opp_string + x + '\n'

    return pro_team, opp_team, pro_string, opp_string

def generate_alert_email_line(source_info, alert_type, var_list):

    if alert_type == 'Auction - New Auction':
        #var_list = player, team, bid
        if source_info == 'direct':
            return 'A new auction was started:  ' + var_list[0] + ' by ' + var_list[1]
        elif source_info == 'alert object':
            return 'A new auction was started:  ' + var_list.var_t1 + ' by ' + var_list.var_t2
    elif alert_type == 'Auction - Outbid':
        #var_list = old_team, new_team, player, current high bid
        if source_info == 'direct':
            return 'You have been outbid:  ' + var_list[2] + ' by ' + var_list[1] + '. New high bid was $' + str(var_list[3]) + '.'
        elif source_info == 'alert object':
            return 'You have been outbid:  ' + var_list.var_t2 + ' by ' + var_list.var_t1 + '. New high bid was $' + str(var_list.var_d1) + '.'
    elif alert_type == 'Auction - Won':
        #var_list = player, winning_team, winning_bid
        if source_info == 'direct':
            return 'An auction has ended:  ' + var_list[0] + ' has been won by ' + var_list[1] + '. The winning bid was $' + str(var_list[2]) + '.'
        elif source_info == 'alert object':
            return 'An auction has ended:  ' + var_list.var_t1 + ' has been won by ' + var_list.var_t2 + '. The winning bid was $' + str(var_list.var_d1) + '.'
    elif alert_type == 'Contract Submitted For Approval':
        #var_list = player, team
        if source_info == 'direct':
            return 'A contract has been submitted for your approval by ' + var_list[1] + ' on ' + var_list[0] + '.'
        elif source_info == 'alert object':
            return 'There is no email line for alert objects'
    elif alert_type == 'Player Cut':
        #var_list = player
        if source_info == 'direct':
            return var_list[0] + ' has been released.'
        elif source_info == 'alert object':
            return var_list.var_t1 + ' has been released.'
    elif alert_type == 'Trade Offer':
        #var_list = current_user, trade_id, comments
        if source_info == 'direct':
            pro_team, opp_team, pro_string, opp_string = pull_strings_from_trade(var_list[1])
            return pro_team + ' has sent the following trade offer:\n\n\n\n' + pro_string + '\nfor\n\n' + opp_string + '\n\nComments: ' + var_list[2] + '\n\n\nPlease respond to all trade offers. You may view and act on trades by clicking on Trade Log under Quick Links'
        elif source_info == 'alert object':
            pro_team, opp_team, pro_string, opp_string = pull_strings_from_trade(var_list.var_i1)
            return pro_team + ' sent a trade offer.'
    elif alert_type == 'Counter Offer':
        #var_list = current_user, trade_id, comments
        if source_info == 'direct':
            pro_team, opp_team, pro_string, opp_string = pull_strings_from_trade(var_list[1])
            return pro_team + ' has sent the following counter offer:\n\n\n\n' + pro_string + '\nfor\n\n' + opp_string + '\n\nComments: ' + var_list[2] + '\n\n\nPlease respond to all trade offers. You may view and act on trades by clicking on Trade Log under Quick Links'
        elif source_info == 'alert object':
            pro_team, opp_team, pro_string, opp_string = pull_strings_from_trade(var_list.var_i1)
            return pro_team + ' has sent a counter offer.'
    elif alert_type == 'Trade Rejected':
        #var_list = current_user, trade_id, comments
        if source_info == 'direct':
            pro_team, opp_team, pro_string, opp_string = pull_strings_from_trade(var_list[1])
            return opp_team + ' has rejected the following trade:\n\n\n\n' + pro_string + '\nfor\n\n' + opp_string + '\n\nComments: ' + var_list[2]
        elif source_info == 'alert object':
            pro_team, opp_team, pro_string, opp_string = pull_strings_from_trade(var_list.var_i1)
            return opp_team + ' has rejected a trade offer.'
    elif alert_type == 'Trade Accepted':
        #var_list = trade_id, comments
        if source_info == 'direct':
            pro_team, opp_team, pro_string, opp_string = pull_strings_from_trade(var_list[0])
            return 'A trade has been agreed to between ' + pro_team + ' and ' + opp_team + '.\n\n\n\n' + pro_team + ' gives up: \n' + pro_string + '\n' + opp_team + ' gives up: \n' + opp_string + '\n\nComments: ' + var_list[1]
        elif source_info == 'alert object':
            pro_team, opp_team, pro_string, opp_string = pull_strings_from_trade(var_list.var_i1)
            return 'A trade has been agreed to between ' + pro_team + ' and ' + opp_team + '.'
    elif alert_type == 'Trade Processed':
        #var_list = trade_id
        if source_info == 'direct':
            pro_team, opp_team, pro_string, opp_string = pull_strings_from_trade(var_list[0])
            return 'The following trade has been processed:\n\n\n\n' + pro_team + ' gives up: \n' + pro_string + '\n' + opp_team + ' gives up: \n' + opp_string
        elif source_info == 'alert object':
            pro_team, opp_team, pro_string, opp_string = pull_strings_from_trade(var_list.var_i1)
            return 'A trade between ' + pro_team + ' and ' + opp_team + ' has been processed.'
    elif alert_type == 'Trade Withdrawn':
        #var_list = current_user, trade_id
        if source_info == 'direct':
            pro_team, opp_team, pro_string, opp_string = pull_strings_from_trade(var_list[1])
            return pro_team + ' has withdrawn the following trade:\n\n\n\n' + pro_string + '\nfor\n\n' + opp_string
        elif source_info == 'alert object':
            pro_team, opp_team, pro_string, opp_string = pull_strings_from_trade(var_list.var_i1)
            return pro_team + ' has withdrawn their trade offer.'

def send_instant_alert(alert_type, user, email, var_list):
    if user != 'commish':
        alset = AlertSetting.objects.get(user=user)
        instant_alerts = alset.instant_alerts.split(',')

    date_time = timezone.now()

    alert_settings_message = '\n\n\n\nYou can change your alert settings under the Team->Alerts->Manage Alerts tab.'
    email_footer = "\n\n\n\n\n\n\n**This email was sent from an unmonitored account. Do not reply to this email.**\n" + str(date_time)

    if alert_type == 'Auction - New Auction':
        #var_list = player, team, bid
        if instant_alerts[0] == '1':
            target_email = email
            subject_line = '[Dynasty League] New Auction'
            email_body = generate_alert_email_line('direct', alert_type, var_list)
            send_mail(subject_line,
                      email_body + alert_settings_message + email_footer,
                      '',
                      [target_email],
                      fail_silently=False)
    elif alert_type == 'Auction - Outbid':
        #var_list = old_team, new_team, player, current high bid
        if instant_alerts[1] == '1':
            target_email = email
            subject_line = '[Dynasty League] You Have Been Outbid'
            email_body = generate_alert_email_line('direct', alert_type, var_list)
            send_mail(subject_line,
                      email_body + alert_settings_message + email_footer,
                      '',
                      [target_email],
                      fail_silently=False)
    elif alert_type == 'Auction - Won':
        #var_list = player, winning_team, winning_bid
        if instant_alerts[2] == '1':
            target_email = email
            subject_line = '[Dynasty League] Auction Ended'
            email_body = generate_alert_email_line('direct', alert_type, var_list)
            send_mail(subject_line,
                      email_body + alert_settings_message + email_footer,
                      '',
                      [target_email],
                      fail_silently=False)
    elif alert_type == 'Contract Submitted For Approval':
        #var_list = player, team
        target_email = email
        subject_line = '[Dynasty League] COMMISH ALERT - Contract Submitted For Approval'
        email_body = generate_alert_email_line('direct', alert_type, var_list)
        send_mail(subject_line,
                  email_body + alert_settings_message + email_footer,
                  '',
                  [target_email],
                  fail_silently=False)
    elif alert_type == 'Player Cut':
        #var_list = player
        if user == 'commish':
            target_email = email
            subject_line = '[Dynasty League] COMMISH ALERT - Player Cuts to Process'
            email_body = generate_alert_email_line('direct', alert_type, var_list)
            send_mail(subject_line,
                      email_body + alert_settings_message + email_footer,
                      '',
                      [target_email],
                      fail_silently=False)
        else:
            if instant_alerts[3] == '1':
                target_email = email
                subject_line = '[Dynasty League] Player Cut'
                email_body = generate_alert_email_line('direct', alert_type, var_list)
                send_mail(subject_line,
                          email_body + alert_settings_message + email_footer,
                          '',
                          [target_email],
                          fail_silently=False)
    elif alert_type == 'Trade Offer':
        #var_list = current_user, trade_id, comments
        target_email = email
        subject_line = '[Dynasty League] TRADE PROPOSAL'
        email_body = generate_alert_email_line('direct', alert_type, var_list)
        send_mail(subject_line,
                  email_body + email_footer,
                  '',
                  [target_email],
                  fail_silently=False)
    elif alert_type == 'Counter Offer':
        #var_list = current_user, trade_id, comments
        target_email = email
        subject_line = '[Dynasty League] TRADE COUNTER OFFER'
        email_body = generate_alert_email_line('direct', alert_type, var_list)
        send_mail(subject_line,
                  email_body + email_footer,
                  '',
                  [target_email],
                  fail_silently=False)
    elif alert_type == 'Trade Rejected':
        #var_list = current_user, trade_id, comments
        target_email = email
        subject_line = '[Dynasty League] TRADE REJECTED'
        email_body = generate_alert_email_line('direct', alert_type, var_list)
        send_mail(subject_line,
                  email_body + email_footer,
                  '',
                  [target_email],
                  fail_silently=False)
    elif alert_type == 'Trade Accepted':
        #var_list = trade_id, comments
        if user == 'commish':
            target_email = email
            subject_line = '[Dynasty League] COMMISH ALERT - Trade Accepted'
            email_body = generate_alert_email_line('direct', alert_type, var_list)
            send_mail(subject_line,
                      email_body + email_footer,
                      '',
                      [target_email],
                      fail_silently=False)
        else:
            if instant_alerts[4] == '1':
                target_email = email
                subject_line = '[Dynasty League] Trade Accepted'
                email_body = generate_alert_email_line('direct', alert_type, var_list)
                send_mail(subject_line,
                          email_body + email_footer,
                          '',
                          [target_email],
                          fail_silently=False)
    elif alert_type == 'Trade Processed':
        #var_list = trade_id
        target_email = email
        subject_line = '[Dynasty League] Trade Processed'
        email_body = generate_alert_email_line('direct', alert_type, var_list)
        send_mail(subject_line,
                  email_body + email_footer,
                  '',
                  [target_email],
                  fail_silently=False)
    elif alert_type == 'Trade Withdrawn':
        #var_list = current_user, trade_id
        target_email = email
        subject_line = '[Dynasty League] Trade Offer Withdrawn'
        email_body = generate_alert_email_line('direct', alert_type, var_list)
        send_mail(subject_line,
                  email_body + email_footer,
                  '',
                  [target_email],
                  fail_silently=False)

def create_alerts(alert_type, current_user, var_list):
    date_time = timezone.now()

    if alert_type == 'Auction - New Auction':
        #var_list = player, team, bid
        a = Team.objects.all().exclude(user=current_user)
        for x in a:
            Alert.objects.create(user=x.user,
                                 alert_type=alert_type,
                                 date=date_time,
                                 var_t1=var_list[0],
                                 var_t2=var_list[1],
                                 var_d1=var_list[2])
            send_instant_alert(alert_type, x.user, x.email, var_list)
    elif alert_type == 'Auction - Outbid':
        #var_list = old_team, new_team, player, current high bid
        #this alert goes to the user of the old_team, so need to find that user
        b = Team.objects.get(internal_name=var_list[0])
        old_team_user = b.user
        Alert.objects.create(user=old_team_user,
                             alert_type=alert_type,
                             date=date_time,
                             var_t1=var_list[1],
                             var_t2=var_list[2],
                             var_d1=var_list[3])
        send_instant_alert(alert_type, old_team_user, b.email, var_list)
    elif alert_type == 'Auction - Won':
        #current_user will be blank, because script doesn't record it, must find user for each alert created
        #var_list = player, winning_team, winning_bid
        c = Team.objects.all()
        for x in c:
            Alert.objects.create(user=x.user,
                                 alert_type=alert_type,
                                 date=date_time,
                                 var_t1=var_list[0],
                                 var_t2=var_list[1],
                                 var_d1=var_list[2])
            send_instant_alert(alert_type, x.user, x.email, var_list)
    elif alert_type == 'Contract Submitted For Approval':
        #var_list = player, team
        Alert.objects.create(user='commish',
                             alert_type=alert_type,
                             date=date_time,
                             var_t1=var_list[0],
                             var_t2=var_list[1])
        send_instant_alert(alert_type, 'commish', 'spflynn0@gmail.com', var_list)
    elif alert_type == 'Player Cut':
        #var_list = player
        Alert.objects.create(user='commish',
                             alert_type=alert_type,
                             date=date_time,
                             var_t1=var_list[0])
        send_instant_alert(alert_type, 'commish', 'spflynn0@gmail.com', var_list)
        c = Team.objects.all().exclude(user=current_user)
        for x in c:
            Alert.objects.create(user=x.user,
                                 alert_type=alert_type,
                                 date=date_time,
                                 var_t1=var_list[0])
            send_instant_alert(alert_type, x.user, x.email, var_list)
    elif alert_type == 'Trade Offer' or alert_type == 'Counter Offer':
        #var_list = opp_user, trade_id, comments
        c = Team.objects.get(user=current_user)
        Alert.objects.create(user=current_user,
                             alert_type=alert_type,
                             date=date_time,
                             var_i1=var_list[1])

        c = Team.objects.get(user=var_list[0])
        Alert.objects.create(user=var_list[0],
                             alert_type=alert_type,
                             date=date_time,
                             var_i1=var_list[1])
        send_instant_alert(alert_type, current_user, c.email, [current_user, var_list[1], var_list[2]])
    elif alert_type == 'Trade Rejected':
        #var_list = opp_user, trade_id, comments
        c = Team.objects.get(user=var_list[0])
        Alert.objects.create(user=var_list[0],
                             alert_type=alert_type,
                             date=date_time,
                             var_i1=var_list[1])
        send_instant_alert(alert_type, current_user, c.email, [current_user, var_list[1], var_list[2]])
    elif alert_type == 'Trade Accepted':
        #var_list = trade_id, comments
        a = Team.objects.all().exclude(user=current_user)
        for x in a:
            Alert.objects.create(user=x.user,
                                 alert_type=alert_type,
                                 date=date_time,
                                 var_i1=var_list[0])
            send_instant_alert(alert_type, x.user, x.email, var_list)
        Alert.objects.create(user='commish',
                             alert_type=alert_type,
                             date=date_time,
                             var_i1=var_list[0])
        send_instant_alert(alert_type, 'commish', 'spflynn0@gmail.com', var_list)
    elif alert_type == 'Trade Processed':
        #var_list = opp_user, trade_id
        a = Team.objects.get(user=current_user)
        b = Team.objects.get(user=var_list[0])
        Alert.objects.create(user=current_user,
                             alert_type=alert_type,
                             date=date_time,
                             var_i1=var_list[1])
        send_instant_alert(alert_type, current_user, a.email, [var_list[1]])
        Alert.objects.create(user=var_list[0],
                             alert_type=alert_type,
                             date=date_time,
                             var_i1=var_list[1])
        send_instant_alert(alert_type, var_list[0], b.email, [var_list[1]])
    elif alert_type == 'Trade Withdrawn':
        #var_list = opp_user, trade_id
        c = Team.objects.get(user=var_list[0])
        Alert.objects.create(user=var_list[0],
                             alert_type=alert_type,
                             date=date_time,
                             var_i1=var_list[1])
        send_instant_alert(alert_type, current_user, c.email, [current_user, var_list[1]])


def auction_end_routine():
    def strptime(val):
        if '.' not in val:
            return datetime.datetime.strptime(val, '%Y-%m-%d %H:%M:%S')

        nofrag, frag = val.split(".")
        date = datetime.datetime.strptime(nofrag, '%Y-%m-%d %H:%M:%S')

        frag = frag[:6]  # truncate to microseconds
        frag += (6 - len(frag)) * '0'  # add 0s
        return date.replace(microsecond=int(frag))

    if working_local == True:
        con = sql3.connect('db.sqlite3')
    else:
        con = sql3.connect('/home/spflynn/dyno-site/db.sqlite3')
    cur = con.cursor()

    cur.execute('SELECT * FROM dyno_auction')
    e = cur.fetchall()

    finished_auctions = []
    time_now = datetime.datetime.now()
    export_time = time_now + datetime.timedelta(hours=5)

    for x in e:
        auction_start = strptime(x[5]) - datetime.timedelta(hours=5)
        auction_end = auction_start + datetime.timedelta(minutes=x[6])

        if time_now > auction_end:
            finished_auctions.append(x)

    c = cur.execute('SELECT max(id) FROM dyno_transaction')
    max_id = c.fetchone()[0]

    alert_data_list = []

    loop_counter = 0
    for x in finished_auctions:
        loop_counter += 1
        cur.execute('DELETE FROM dyno_auction WHERE player=?', [x[1]])
        cur.execute('INSERT INTO dyno_transaction VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [max_id+loop_counter,
                                                                                          x[1],
                                                                                          '',
                                                                                          x[2],
                                                                                          'Auction End',
                                                                                          x[3],
                                                                                          x[4],
                                                                                          '',
                                                                                          '',
                                                                                          '',
                                                                                          'Pending',
                                                                                          'Unconfirmed',
                                                                                          '',
                                                                                          export_time])
        alert_data_list.append([x[1], x[2], x[3]])

    con.commit()

    cur.close()
    con.close()

    for x in alert_data_list:
        create_alerts('Auction - Won', '', [x[0], x[1], x[2]])

def periodic_alerts_routine():
    date_time = datetime.datetime.now()
    time_now = date_time.time()
    today = datetime.datetime.today().weekday()
    days_list = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    today_string = days_list[today]

    alert_settings_message = '\n\n\n\nYou can change your alert settings under the Team->Alerts->Manage Alerts tab.'
    email_footer = "\n\n\n\n\n\n\n**This email was sent from an unmonitored account. Do not reply to this email.**\n" + str(date_time)

    a = AlertSetting.objects.all()
    for x in a:
        if x.daily_emails == 1:
            #user gets daily emails
            daily_time = x.daily_emails_time
            #check to see if time_now is between daily_time -5 and daily_time +10 min
            d = datetime.datetime.today()
            full_daily = datetime.datetime.combine(d, daily_time)
            d1 = full_daily - datetime.timedelta(minutes=5)
            d2 = full_daily + datetime.timedelta(minutes=10)
            start = d1.time()
            end = d2.time()
            if time_now > start and time_now < end:
                #gather alerts
                day_ago = date_time - datetime.timedelta(days=1)
                alert_list = []
                b = Alert.objects.filter(user=x.user).order_by('alert_type')
                for y in b:
                    check_date = y.date.replace(tzinfo=None)
                    if check_date > day_ago:
                        alert_list.append(y)
                #send email
                email_body = ''
                for z in alert_list:
                    email_body = email_body + generate_alert_email_line('alert object', z.alert_type, z) + '\n'

                c = Team.objects.get(user=x.user)

                if email_body == '':
                    if x.blank_emails == 1:
                        email_body = 'You have no alerts.'
                        target_email = c.email
                        subject_line = '[Dynasty League] Daily Alerts - ' + today_string
                        send_mail(subject_line,
                                  email_body + alert_settings_message + email_footer,
                                  '',
                                  [target_email],
                                  fail_silently=False)
                else:
                    target_email = c.email
                    subject_line = '[Dynasty League] Daily Alerts - ' + today_string
                    send_mail(subject_line,
                              email_body + alert_settings_message + email_footer,
                              '',
                              [target_email],
                              fail_silently=False)
        if x.weekly_emails == 1:
            #user gets weekly emails
            weekly_day = x.weekly_emails_day
            weekly_time = x.weekly_emails_time
            #check to see if today is same as weekly_day
            if weekly_day == today_string:
                #same day, check to see if time_now is between weekly_time -1 and weekly_time +10 min
                d = datetime.datetime.today()
                full_weekly = datetime.datetime.combine(d, weekly_time)
                d1 = full_weekly - datetime.timedelta(minutes=1)
                d2 = full_weekly + datetime.timedelta(minutes=10)
                start = d1.time()
                end = d2.time()
                if time_now > start and time_now < end:
                    #gather alerts
                    week_ago = date_time - datetime.timedelta(days=7)
                    alert_list = []
                    b = Alert.objects.filter(user=x.user).order_by('alert_type')
                    for y in b:
                        check_date = y.date.replace(tzinfo=None)
                        if check_date > week_ago:
                            alert_list.append(y)
                    #send email
                    email_body = ''
                    for z in alert_list:
                        email_body = email_body + generate_alert_email_line('alert object', z.alert_type, z) + '\n'

                    c = Team.objects.get(user=x.user)

                    if email_body == '':
                        if x.blank_emails == '1':
                            email_body = 'You have no alerts.'
                            target_email = c.email
                            subject_line = '[Dynasty League] Weekly Alerts'
                            send_mail(subject_line,
                                      email_body + alert_settings_message + email_footer,
                                      '',
                                      [target_email],
                                      fail_silently=False)
                    else:
                        target_email = c.email
                        subject_line = '[Dynasty League] Weekly Alerts'
                        send_mail(subject_line,
                                  email_body + alert_settings_message + email_footer,
                                  '',
                                  [target_email],
                                  fail_silently=False)

def commish_pending_transactions_routine():
    d = Variable.objects.get(name='CommishPeriodicState')
    commish_periodic_state = int(d.int_variable)
    if commish_periodic_state == 0:
        return

    a = Transaction.objects.filter(var_t1='Pending').filter(var_t2='Confirmed')
    num_trans = len(a)
    if num_trans == 0:
        return
    date_time = datetime.datetime.now()
    c = date_time.minute

    alert_settings_message = '\n\n\n\nYou can change your alert settings under the Team->Alerts->Manage Alerts tab.'
    email_footer = "\n\n\n\n\n\n\n**This email was sent from an unmonitored account. Do not reply to this email.**\n" + str(date_time)

    time_list = [55,56,57,58,59,0,1,2,3,4,5,25,26,27,28,29,30,31,32,33,34,35]
    if c in time_list:
        email_body = 'You have ' + str(num_trans) + ' pending transactions.'
        target_email = 'spflynn0@gmail.com'
        subject_line = '[Dynasty League] COMMISH ALERT - You have old pending transactions'
        send_mail(subject_line,
                  email_body + alert_settings_message + email_footer,
                  '',
                  [target_email],
                  fail_silently=False)

def check_expired_trades():
    time_now = timezone.now()

    a = Trade.objects.all()

    for x in a:
        if x.expiration_date < time_now and x.status3 != 'Closed':
            x.status2 = 'Expired'
            x.status3 = 'Closed'
            x.save()
            b = Transaction.objects.filter(player='trade').get(var_i1=x.id)
            b.var_t1 = 'Expired'
            b.save()

def check_expired_set_contracts():
    a = Transaction.objects.filter(var_t1='Pending', var_t2='Unconfirmed')
    for x in a:
        exp_date = x.date + timezone.timedelta(days=2)
        if timezone.now() > exp_date:
            print(x)
            x.var_i1 = 0
            x.var_i2 = 0
            x.var_t1 = ''
            x.save()

            b = Team.objects.get(internal_name=x.team2)
            u = b.user

            sb = round(x.var_d1 * Decimal(0.4), 1)

            Transaction.objects.create(player=x.player,
                                       date=timezone.now(),
                                       team1=x.team1,
                                       team2=x.team2,
                                       transaction_type='Contract Set',
                                       var_d1 = x.var_d1,
                                       var_d2 = Decimal(sb),
                                       var_i1 = 1,
                                       var_i2 = 0,
                                       var_t1 = 'Pending',
                                       var_t2 = 'Confirmed',
                                       var_t3 = x.var_d2 - Decimal(sb))

            create_alerts('Contract Submitted For Approval', u, [x.player, x.team2])





def test_perform(request):
    player_list = request.POST.getlist('player_list[]')
    search_text = request.POST['search_text']

    return_list = []

    for x in range(len(player_list)):
        if player_list[x].startswith(search_text):
            return_list.append(player_list[x])
        elif player_list[x].lower().startswith(search_text):
            return_list.append(player_list[x])

    return JsonResponse(return_list, safe=False)

def test_perform2(request):
    player_selected = request.POST['player_selected']
    a = Player.objects.get(name=player_selected)
    return_data = {'name' : a.name,
                   'pos' : a.position,
                   'team' : a.team,
                   'total_value' : a.total_value,
                   'signing_bonus' : a.signing_bonus,
                   'salary' : a.salary,
                   'notes' : a.notes}

    return JsonResponse(return_data)

def test_perform3(request):
    print(request.POST)
    return JsonResponse('test', safe=False)



def player_processing_1(request):
    player_list = request.POST.getlist('player_list[]')
    search_text = request.POST['search_text']

    return_list = []

    for x in range(len(player_list)):
        if player_list[x].startswith(search_text):
            return_list.append(player_list[x])
        elif player_list[x].lower().startswith(search_text):
            return_list.append(player_list[x])

    return JsonResponse(return_list, safe=False)

def player_processing_2(request):
    player_selected = request.POST['player_selected']
    a = Player.objects.get(name=player_selected)
    b = Team.objects.get(user=request.user)
    user_team = b.internal_name
    return_data = {'name' : a.name,
                   'pos' : a.position,
                   'team' : a.team,
                   'contract_type' : a.contract_type,
                   'total_value' : a.total_value,
                   'signing_bonus' : a.signing_bonus,
                   'salary' : a.salary,
                   'yr1_salary' : a.yr1_salary,
                   'yr2_salary' : a.yr2_salary,
                   'yr3_salary' : a.yr3_salary,
                   'yr4_salary' : a.yr4_salary,
                   'yr5_salary' : a.yr5_salary,
                   'yr1_sb' : a.yr1_sb,
                   'yr2_sb' : a.yr2_sb,
                   'yr3_sb' : a.yr3_sb,
                   'yr4_sb' : a.yr4_sb,
                   'yr5_sb' : a.yr5_sb,
                   'yr1_total' : a.yr1_salary+a.yr1_sb,
                   'yr2_total' : a.yr2_salary+a.yr2_sb,
                   'yr3_total' : a.yr3_salary+a.yr3_sb,
                   'yr4_total' : a.yr4_salary+a.yr4_sb,
                   'yr5_total' : a.yr5_salary+a.yr5_sb,
                   'notes' : a.notes,
                   'user_team' : user_team}

    return JsonResponse(return_data)

def player_processing_3(request):
    player_selected = request.POST['player_selected']
    team = request.POST['team']

    a = Player.objects.get(name=player_selected)
    yr1_guar = (a.yr1_salary + a.yr1_sb)
    total_guar = (a.signing_bonus + a.yr1_salary)
    total_cap_savings = (a.total_value - total_guar)
    contract_type = a.contract_type

    yr1_total_cost = a.yr1_salary + a.yr1_sb
    yr2_total_cost = a.yr2_salary + a.yr2_sb
    yr3_total_cost = a.yr3_salary + a.yr3_sb
    yr4_total_cost = a.yr4_salary + a.yr4_sb
    yr5_total_cost = a.yr5_salary + a.yr5_sb

    b = Player.objects.filter(team=team)
    yr1_costs = 0
    yr2_costs = 0
    yr3_costs = 0
    yr4_costs = 0
    yr5_costs = 0

    for x in b:
        yr1_costs += (x.yr1_salary + x.yr1_sb)
        yr2_costs += (x.yr2_salary + x.yr2_sb)
        yr3_costs += (x.yr3_salary + x.yr3_sb)
        yr4_costs += (x.yr4_salary + x.yr4_sb)
        yr5_costs += (x.yr5_salary + x.yr5_sb)

    c = Team.objects.get(internal_name=team)

    yr1_cap_penalty = 0
    yr2_cap_penalty = 0
    yr3_cap_penalty = 0
    yr4_cap_penalty = 0
    yr5_cap_penalty = 0

    if c.yr1_cap_penalty != None:
        yr1_cap_penalty = c.yr1_cap_penalty

    if c.yr2_cap_penalty != None:
        yr2_cap_penalty = c.yr2_cap_penalty

    if c.yr3_cap_penalty != None:
        yr3_cap_penalty = c.yr3_cap_penalty

    if c.yr4_cap_penalty != None:
        yr4_cap_penalty = c.yr4_cap_penalty

    if c.yr5_cap_penalty != None:
        yr5_cap_penalty = c.yr5_cap_penalty

    yr1_costs -= yr1_total_cost
    yr2_costs -= yr2_total_cost
    yr3_costs -= yr3_total_cost
    yr4_costs -= yr4_total_cost
    yr5_costs -= yr5_total_cost

    yr1_cap_penalty += yr1_guar
    yr2_cap_penalty += a.yr2_sb
    yr3_cap_penalty += a.yr3_sb
    yr4_cap_penalty += a.yr4_sb
    yr5_cap_penalty += a.yr5_sb

    yr1_space = Decimal(200) - Decimal(yr1_costs) - yr1_cap_penalty
    yr2_space = Decimal(200) - Decimal(yr2_costs) - yr2_cap_penalty
    yr3_space = Decimal(200) - Decimal(yr3_costs) - yr3_cap_penalty
    yr4_space = Decimal(200) - Decimal(yr4_costs) - yr4_cap_penalty
    yr5_space = Decimal(200) - Decimal(yr5_costs) - yr5_cap_penalty


    player_dict = {'yr2_guar' : a.yr2_sb,
                   'yr3_guar' : a.yr3_sb,
                   'yr4_guar' : a.yr4_sb,
                   'yr5_guar' : a.yr5_sb,
                   'yr1_guar' : yr1_guar,
                   'total_cost': a.total_value,
                   'total_guar' : total_guar,
                   'total_cap_savings' : total_cap_savings,
                   'yr1_total_cost' : yr1_total_cost,
                   'yr2_total_cost' : yr2_total_cost,
                   'yr3_total_cost' : yr3_total_cost,
                   'yr4_total_cost' : yr4_total_cost,
                   'yr5_total_cost' : yr5_total_cost,
                   'yr1_salary' : a.yr1_salary,
                   'yr2_salary' : a.yr2_salary,
                   'yr3_salary' : a.yr3_salary,
                   'yr4_salary' : a.yr4_salary,
                   'yr5_salary' : a.yr5_salary,
                   'yr1_costs' : yr1_costs,
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
                   'yr5_space' : yr5_space,
                   'contract_type' : contract_type}

    return JsonResponse(player_dict)


def loginView(request):
    username = request.POST['username']
    password = request.POST['password']
    redirect = request.POST['redirect']
    if len(redirect) == 0:
        redirect = '/'
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
            return HttpResponseRedirect(redirect)
        else:
            return HttpResponse('Your account is disabled. Please contact the administrator')
    else:
        return HttpResponseRedirect('/login_failed')

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

def team_org_processing_save_flex(request):
    which_flex = request.POST['which']
    new_flex = request.POST['flex']
    team = request.POST['team']

    a = Team.objects.get(internal_name=team)

    if which_flex == 'flex_1':
        a.flex_1 = new_flex
        a.save()
    elif which_flex == 'flex_2':
        a.flex_2 = new_flex
        a.save()

    return JsonResponse(new_flex, safe=False)

def team_org_processing_role_change(request):
    new_role = request.POST['new_role']
    name = request.POST['name']

    a = Player.objects.get(name=name)
    a.yr1_role = new_role
    a.save()

    return JsonResponse(new_role, safe=False)

def team_cap_save_role_change(request):
    new_role = request.POST['new_role']
    name = request.POST['name']
    year = request.POST['year']

    a = Player.objects.get(name=name)
    if year == 'yr1':
        a.yr1_role = new_role
    elif year == 'yr2':
        a.yr2_role = new_role
    elif year == 'yr3':
        a.yr3_role = new_role
    elif year == 'yr4':
        a.yr4_role = new_role
    elif year == 'yr5':
        a.yr5_role = new_role

    a.save()

    return JsonResponse('test', safe=False)

def store_player_selected_redirect_to_playerpage(request):
    player_clicked = request.POST['player']

    a = TeamVariable.objects.filter(user=request.user).get(name='PlayerForPlayerPage')

    a.text_variable = player_clicked
    a.save()

    return JsonResponse(player_clicked, safe=False)

def unload_team_selected_variable(request):
    a = Variable.objects.get(name='team selected')
    current_user = request.user
    b = Team.objects.get(user=current_user)
    team_name = b.internal_name

    a.text_variable = team_name
    a.save()

    return JsonResponse('test', safe=False)

def team_org_store_view_selected(request):
    new_view = request.POST['new_view']
    current_user = request.user

    a = Team.objects.get(user=current_user)
    a.team_org_view_selected = new_view
    a.save()

    return JsonResponse(new_view, safe=False)

def team_org_change_team_selected(request):
    a = request.path_info.strip().split('_')
    team_number = int(a[4])

    b = Team.objects.all()
    for x in b:
        if x.id == team_number:
            selected_team = x.internal_name

    c = TeamVariable.objects.filter(name='TeamSelectedForOrg').get(user=request.user)
    c.text_variable = selected_team
    c.save()

    return HttpResponseRedirect('/team/organization')

def verify_password_change(request):
    old_password = request.POST['old_password']
    new_password = request.POST['new_password']

    print(old_password, new_password, request.user)

    user = authenticate(username=request.user, password=old_password)
    if user is not None:
        valid = True
        a = User.objects.get(username=request.user)
        a.set_password(new_password)
        a.save()
    else:
        valid = False

    return JsonResponse(valid, safe=False)

def verify_username_change(request):
    old_username = request.POST['old_username']
    new_username = request.POST['new_username']

    a = Team.objects.get(user=old_username)
    a.user = new_username
    a.save()

    b = AvailableRole.objects.all()
    for x in b:
        if x.user == old_username:
            x.user = new_username
            x.save()

    c = User.objects.get(username=old_username)
    c.username = new_username
    c.save()

    d = AlertSetting.objects.get(user=old_username)
    d.user = new_username
    d.save()

    e = TeamVariable.objects.filter(user=old_username)
    for x in e:
        x.user = new_username
        x.save()

    f = Alert.objects.filter(user=old_username)
    for x in f:
        x.user = new_username
        x.save()

    return JsonResponse('test', safe=False)

def change_team_settings(request):
    new_team_name = request.POST['new_team_name']
    new_email = request.POST['new_email']

    a = Team.objects.get(user=request.user)
    a.nickname = new_team_name
    a.email = new_email
    a.save()

    return JsonResponse('test', safe=False)

def save_new_bug(request):
    user = request.user
    date = timezone.now()
    current_os = platform.platform()
    browser = request.META['HTTP_USER_AGENT']
    resolution = request.POST['resolution']
    other_e = os.environ
    report = request.POST['report']

    Bug.objects.create(user=user,
                       date=date,
                       os=current_os,
                       browser=browser,
                       resolution=resolution,
                       other_envirn = other_e,
                       report=report)

    return JsonResponse('done', safe=False)

def process_feature_request(request):
    feature_request = request.POST['feature_request']
    user = request.user
    date = timezone.now()

    RequestedFeature.objects.create(user=user,
                                    date=date,
                                    feature=feature_request)

    return HttpResponseRedirect('/')

def save_team_settings_player_filters(request):
    filters_text = request.POST['tags_to_filter']

    a = Team.objects.get(user=request.user)
    a.filtered_tags = filters_text
    a.save()

    return JsonResponse('done', safe=False)

def get_new_auction_data(request):
    player = request.POST['player']
    bid = float(request.POST['bid'])

    bid = round(bid*4)/4

    a = Variable.objects.get(name='New Auction Info')
    a.text_variable = player + ':' + str(bid)
    a.save()

    return JsonResponse('test', safe=False)

def get_existing_auction_data(request):
    total_auctions = int(request.POST['total_auctions'])

    l = []
    for x in range(0,total_auctions):
        t1 = 'auction_data[' + str(x) + '][name]'
        t2 = 'auction_data[' + str(x) + '][bid]'
        a = request.POST.getlist(t1)
        b = request.POST.getlist(t2)
        try:
            bid = round(float(b[0]) * 4) / 4
            l.append({'player' : a[0],
                    'bid' : bid})
        except:
            pass

    a = Variable.objects.get(name='New Auction Info')
    for x in l:
        a.text_variable = a.text_variable + '\n' + x['player'] + ':' + str(x['bid'])

    a.save()

    return JsonResponse('test', safe=False)

def process_auction_bids(request):
    def process_existing_bid(player, bid, auctions, team):
        Transaction.objects.create(player=player,
                                   team2=team,
                                   transaction_type='Auction Bid',
                                   var_d1=bid,
                                   date=timezone.now())

        for x in auctions:
            if player == x.player:
                if Decimal(bid) > x.high_bidder_proxy_bid:
                    if team != x.high_bidder:
                        x.high_bid = Decimal(x.high_bidder_proxy_bid) + Decimal(0.25)
                        create_alerts('Auction - Outbid', request.user, [x.high_bidder, team, x.player, x.high_bid])
                        x.high_bidder_proxy_bid = Decimal(bid)
                        x.high_bidder = team
                        x.clock_reset = timezone.now()
                    else:
                        x.high_bidder_proxy_bid = Decimal(bid)
                else:
                    if team != x.high_bidder:
                        if Decimal(bid) > x.high_bid:
                            x.high_bid = Decimal(bid)
            x.save()

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

    e = Auction.objects.all()
    match_list = []
    new_list = []
    for x in bids_list:
        found_match = False
        for y in e:
            if x['player'] == y.player:
                found_match = True
        if found_match == False:
            new_list.append(x)
        else:
            match_list.append(x)

    f = Team.objects.get(user=request.user)
    team = f.internal_name

    for x in new_list:
        player = x['player']
        player = x['player'].split('-')[1].strip()
        bid = x['bid']
        time_date = timezone.now()
        Transaction.objects.create(player=player,
                                   team2=team,
                                   transaction_type='Auction Created',
                                   var_d1=bid,
                                   date=time_date)
        get_var = Variable.objects.get(name='Default AuctionClock')
        default_clock = int(get_var.int_variable)
        Auction.objects.create(player=player,
                           high_bidder=team,
                           high_bid=1,
                           high_bidder_proxy_bid=bid,
                           clock_reset=time_date,
                           clock_timeout_minutes=default_clock)
        create_alerts('Auction - New Auction', request.user, [player, team, bid])
        g = Player.objects.get(name=player)
        g.team = 'Auction'
        g.save()

    for x in match_list:
        process_existing_bid(x['player'], x['bid'], e, team)

    return JsonResponse('test', safe=False)

def get_player_for_edit_model(request):
    player = request.POST['player']
    a = Variable.objects.get(name='player selected')
    a.text_variable = player
    a.save()
    return JsonResponse(player, safe=False)

def set_player_for_contract_structure(request):
    player = request.POST['player']
    a = TeamVariable.objects.filter(user=request.user).get(name='PlayerForConStr')
    a.text_variable = player
    a.save()
    return JsonResponse('test', safe=False)

def submit_contract_structure(request):
    player = request.POST['player']
    num_years = request.POST['num_years']
    yearly_sb = request.POST['yearly_sb']
    yr1_total = round(float(request.POST['yr1_total']),2)
    yr2_total = round(float(request.POST['yr2_total']),2)
    yr3_total = round(float(request.POST['yr3_total']),2)
    yr4_total = round(float(request.POST['yr4_total']),2)
    yr5_total = round(float(request.POST['yr5_total']),2)
    salary_string = str(yr1_total) + ',' + str(yr2_total) + ',' + str(yr3_total) + ',' + str(yr4_total) + ',' + str(yr5_total)

    a = Transaction.objects.filter(var_t1="Pending").get(player=player)
    a.var_i1 = 0
    a.var_i2 = 0
    a.var_t1 = ''
    a.save()

    date_time = timezone.now()

    Transaction.objects.create(player=player,
                               date=date_time,
                               team1=a.team1,
                               team2=a.team2,
                               transaction_type='Contract Set',
                               var_d1 = a.var_d1,
                               var_d2 = yearly_sb,
                               var_d3 = a.var_d3,
                               var_i1 = num_years,
                               var_i2 = 0,
                               var_t1 = 'Pending',
                               var_t2 = 'Confirmed',
                               var_t3 = salary_string)
    create_alerts('Contract Submitted For Approval', request.user, [player, a.team2])

    return JsonResponse('test', safe=False)

def submit_extension_structure(request):
    player = request.POST['player']
    num_years = request.POST['num_years']
    team = request.POST['team']
    signing_bonus = round(float(request.POST['signing_bonus']),2)
    extension_cost = request.POST['extension_cost']
    yr1_total = round(float(request.POST['yr1_total']),2)
    yr2_total = round(float(request.POST['yr2_total']),2)
    yr3_total = round(float(request.POST['yr3_total']),2)
    yr4_total = round(float(request.POST['yr4_total']),2)
    yr5_total = round(float(request.POST['yr5_total']),2)

    if yr1_total == 0:
        yr1_string = '0'
    else:
        yr1_string = str(yr1_total-signing_bonus)
    if yr2_total == 0:
        yr2_string = '0'
    else:
        yr2_string = str(yr2_total-signing_bonus)
    if yr3_total == 0:
        yr3_string = '0'
    else:
        yr3_string = str(yr3_total-signing_bonus)
    if yr4_total == 0:
        yr4_string = '0'
    else:
        yr4_string = str(yr4_total-signing_bonus)
    if yr5_total == 0:
        yr5_string = '0'
    else:
        yr5_string = str(yr5_total-signing_bonus)

    salary_string = yr1_string + ',' + yr2_string + ',' + yr3_string + ',' + yr4_string + ',' + yr5_string

    date_time = timezone.now()

    Transaction.objects.create(player=player,
                               date=date_time,
                               team2=team,
                               transaction_type='Extension Submitted',
                               var_d1 = extension_cost,
                               var_d2 = signing_bonus,
                               var_i1 = num_years,
                               var_i2 = 0,
                               var_t1 = 'Pending',
                               var_t2 = 'Confirmed',
                               var_t3 = salary_string)
    create_alerts('Contract Submitted For Approval', request.user, [player, team])

    return JsonResponse('test', safe=False)

def get_data_for_transaction_single_player(request):
    id_selected = int(request.POST['id'])
    a = Variable.objects.get(name='player selected')
    a.int_variable = id_selected
    a.save()

    return JsonResponse('test', safe=False)

def save_transaction_single_player(request):
    pos = request.POST['pos']
    name = request.POST['name']
    team = request.POST['team']
    contract_type = request.POST['contract_type']
    total_value = request.POST['total_value']
    signing_bonus = request.POST['signing_bonus']
    salary = request.POST['salary']
    yr1_sal = request.POST['yr1_sal']
    yr2_sal = request.POST['yr2_sal']
    yr3_sal = request.POST['yr3_sal']
    yr4_sal = request.POST['yr4_sal']
    yr5_sal = request.POST['yr5_sal']
    yr1_sb = request.POST['yr1_sb']
    yr2_sb = request.POST['yr2_sb']
    yr3_sb = request.POST['yr3_sb']
    yr4_sb = request.POST['yr4_sb']
    yr5_sb = request.POST['yr5_sb']
    notes = request.POST['notes']
    yr1_role = request.POST['yr1_role']
    yr2_role = request.POST['yr2_role']
    yr3_role = request.POST['yr3_role']
    yr4_role = request.POST['yr4_role']
    yr5_role = request.POST['yr5_role']
    id = int(request.POST['id'])

    if yr2_sal == '':
        yr2_sal = 0
    if yr3_sal == '':
        yr3_sal = 0
    if yr4_sal == '':
        yr4_sal = 0
    if yr5_sal == '':
        yr5_sal = 0
    if yr2_sb == '':
        yr2_sb = 0
    if yr3_sb == '':
        yr3_sb = 0
    if yr4_sb == '':
        yr4_sb = 0
    if yr5_sb == '':
        yr5_sb = 0

    a = Transaction.objects.get(pk=id)
    a.var_t1 = ''
    a.save()
    
    date_time = timezone.now()
    
    salary_string = str(yr1_sal) + ',' + str(yr2_sal) + ',' + str(yr3_sal) + ',' + str(yr4_sal) + ',' + str(yr5_sal)
    
    Transaction.objects.create(player=name,
                               date=date_time,
                               team1=a.team1,
                               team2=a.team2,
                               transaction_type='Contract Processed',
                               var_d1 = a.var_d1,
                               var_d2 = a.var_d2,
                               var_d3 = a.var_d3,
                               var_i1 = a.var_i1,
                               var_i2 = a.var_i2,
                               var_t1 = a.transaction_type,
                               var_t2 = '',
                               var_t3 = '')

    num_years = 0
    if float(yr1_sal) > 0:
        num_years += 1
    if float(yr2_sal) > 0:
        num_years += 1
    if float(yr3_sal) > 0:
        num_years += 1
    if float(yr4_sal) > 0:
        num_years += 1
    if float(yr5_sal) > 0:
        num_years += 1

    try:
        c = SalaryListing.objects.get(name=name)
        c.yearly_cost = float(total_value) / num_years
        c.save()
    except:
        SalaryListing.objects.create(position=pos,
                                     name=name,
                                     yearly_cost=float(total_value) / num_years)

    b = Player.objects.get(name=name)

    if b.position != pos:
        b.position = pos
    if b.team != team:
        b.team = team
    if b.contract_type != contract_type:
        b.contract_type = contract_type
    if b.total_value != total_value:
        b.total_value = total_value
    if b.signing_bonus != signing_bonus:
        b.signing_bonus = signing_bonus
    if b.salary != salary:
        b.salary = salary
    if b.yr1_salary != yr1_sal:
        b.yr1_salary = yr1_sal
    if b.yr2_salary != yr2_sal:
        b.yr2_salary = yr2_sal
    if b.yr3_salary != yr3_sal:
        b.yr3_salary = yr3_sal
    if b.yr4_salary != yr4_sal:
        b.yr4_salary = yr4_sal
    if b.yr5_salary != yr5_sal:
        b.yr5_salary = yr5_sal
    if b.yr1_sb != yr1_sb:
        b.yr1_sb = yr1_sb
    if b.yr2_sb != yr2_sb:
        b.yr2_sb = yr2_sb
    if b.yr3_sb != yr3_sb:
        b.yr3_sb = yr3_sb
    if b.yr4_sb != yr4_sb:
        b.yr4_sb = yr4_sb
    if b.yr5_sb != yr5_sb:
        b.yr5_sb = yr5_sb
    if b.notes != notes:
        b.notes = notes
    if b.yr1_role != yr1_role:
        b.yr1_role = yr1_role
    if b.yr2_role != yr2_role:
        b.yr2_role = yr2_role
    if b.yr3_role != yr3_role:
        b.yr3_role = yr3_role
    if b.yr4_role != yr4_role:
        b.yr4_role = yr4_role
    if b.yr5_role != yr5_role:
        b.yr5_role = yr5_role

    b.save()

    return JsonResponse('done', safe=False)

def save_transaction_cut(request):
    yr1_pen = request.POST['yr1_pen']
    yr2_pen = request.POST['yr2_pen']
    yr3_pen = request.POST['yr3_pen']
    yr4_pen = request.POST['yr4_pen']
    yr5_pen = request.POST['yr5_pen']
    cut_season = int(request.POST['cut_season'])
    trans_id = int(request.POST['trans_id'])
    amnesty_id = int(request.POST['amnesty_id'])
    amnesty_percentage = int(request.POST['amnesty_percentage'])

    a = Transaction.objects.get(pk=trans_id)
    player = a.player
    team = a.team2
    a.var_t1 = ''
    a.save()

    date_time = timezone.now()

    penalty_string = yr1_pen + ',' + yr2_pen + ',' + yr3_pen + ',' + yr4_pen + ',' + yr5_pen

    Transaction.objects.create(player=player,
                               date=date_time,
                               team1=a.team1,
                               team2=a.team2,
                               transaction_type='Player Cut Processed',
                               var_d1 = a.var_d1,
                               var_d2 = a.var_d2,
                               var_d3 = a.var_d3,
                               var_i1 = a.var_i1,
                               var_i2 = a.var_i2,
                               var_t1 = penalty_string,
                               var_t2 = '',
                               var_t3 = '')

    b = Player.objects.get(name=player)

    b.team = 'Free Agent'
    b.contract_type = 'none'
    b.notes = ''
    b.yr1_role = '--'
    b.yr2_role = '--'
    b.yr3_role = '--'
    b.yr4_role = '--'
    b.yr5_role = '--'

    if cut_season == 0:
        b.total_value = 0.00
        b.signing_bonus = 0.00
        b.salary = 0.00
        b.yr1_salary = 0.00
        b.yr2_salary = 0.00
        b.yr3_salary = 0.00
        b.yr4_salary = 0.00
        b.yr5_salary = 0.00
        b.yr1_sb = 0.00
        b.yr2_sb = 0.00
        b.yr3_sb = 0.00
        b.yr4_sb = 0.00
        b.yr5_sb = 0.00

    b.save()

    if amnesty_id != -1:
        c = Asset.objects.get(id=amnesty_id)
        c.delete()

    d = Team.objects.get(internal_name=team)
    try:
        d.yr1_cap_penalty += Decimal(yr1_pen)
    except:
        d.yr1_cap_penalty = Decimal(yr1_pen)
    try:
        d.yr2_cap_penalty += Decimal(yr2_pen)
    except:
        d.yr2_cap_penalty = Decimal(yr2_pen)
    try:
        d.yr3_cap_penalty += Decimal(yr3_pen)
    except:
        d.yr3_cap_penalty = Decimal(yr3_pen)
    try:
        d.yr4_cap_penalty += Decimal(yr4_pen)
    except:
        d.yr4_cap_penalty = Decimal(yr4_pen)
    try:
        d.yr5_cap_penalty += Decimal(yr5_pen)
    except:
        d.yr5_cap_penalty = Decimal(yr5_pen)
    d.save()

    penalties = []
    try:
        penalties.append(Decimal(yr1_pen))
    except:
        penalties.append(Decimal(0))
    try:
        penalties.append(Decimal(yr2_pen))
    except:
        penalties.append(Decimal(0))
    try:
        penalties.append(Decimal(yr3_pen))
    except:
        penalties.append(Decimal(0))
    try:
        penalties.append(Decimal(yr4_pen))
    except:
        penalties.append(Decimal(0))
    try:
        penalties.append(Decimal(yr5_pen))
    except:
        penalties.append(Decimal(0))

    for x in range(0,len(penalties)):
        if penalties[x] != 0:
            Cap_Penalty_Entry.objects.create(team=team,
                                             year=year_list[x],
                                             penalty=penalties[x],
                                             description='Penalty for cutting ' + player,
                                             date=timezone.now())

    #need to check for traded player/assets in other deals and cancel them
    f = Trade.objects.all().exclude(status3='Closed')
    for x in f:
        trade_invalid = check_trade_for_dup_assets(x, player, [], [], player, [], [])
        if trade_invalid:
            x.status3='Closed'
            x.status2='Invalid'
            x.save()
            g = Transaction.objects.filter(player='trade').get(var_i1=x.id)
            g.var_t1 = 'Invalid'
            g.save()

    return JsonResponse('done', safe=False)

def send_test_email(request):
    u = request.user
    a = Team.objects.get(user=u)
    target_email = a.email
    subject_line = '[Dynasty League] Test Email'
    email_body = "This is a test email. If you requested this, the email system works! If you didn't, sorry about that; please contact the commish."
    email_footer = "\n\n\n\n\n\n\n**This email was sent from an unmonitored account. Do not reply to this email.**"
    send_mail(subject_line,
              email_body + email_footer,
              '',
              [target_email],
              fail_silently=False)
    return JsonResponse('test', safe=False)

def save_team_manage_alerts(request):
    daily_emails = request.POST['daily_emails']
    daily_email_time = request.POST['daily_email_time']
    weekly_emails = request.POST['weekly_emails']
    weekly_emails_day = request.POST['weekly_emails_day']
    weekly_emails_time = request.POST['weekly_emails_time']
    blank_emails = request.POST['blank_emails']
    instant_alerts = request.POST.getlist('instant_alerts[]')

    daily_email_time = datetime.datetime.strptime(daily_email_time, '%I:%M %p').time()
    weekly_emails_time = datetime.datetime.strptime(weekly_emails_time, '%I:%M %p').time()

    instant_alerts_output = ''
    for x in range(0,len(instant_alerts)):
        instant_alerts_output = instant_alerts_output + instant_alerts[x] + ','
    instant_alerts_output = instant_alerts_output[:-1]

    a = AlertSetting.objects.get(user=request.user)
    a.daily_emails = daily_emails
    a.daily_emails_time = daily_email_time
    a.weekly_emails = weekly_emails
    a.weekly_emails_time = weekly_emails_time
    a.weekly_emails_day = weekly_emails_day
    a.blank_emails = blank_emails
    a.instant_alerts = instant_alerts_output
    a.save()

    return JsonResponse('test', safe=False)

def save_default_auction_clock(request):
    default_auction_clock = request.POST['auction_default_clock']
    a = Variable.objects.get(name='Default AuctionClock')
    a.int_variable = int(default_auction_clock)
    a.save()
    return JsonResponse('test', safe=False)

def create_team_variable(request):
    var_name = request.POST['team_variable_text']
    a = Team.objects.all()
    for x in a:
        TeamVariable.objects.create(team=x.internal_name,
                                    user=x.user,
                                    name=var_name)
    return HttpResponseRedirect('/')

def change_team_name(request):
    old_name = request.POST['change_team_before']
    new_name = request.POST['change_team_after']
    a = Player.objects.filter(team=old_name)
    b = TeamVariable.objects.filter(team=old_name)
    c = Team.objects.get(internal_name=old_name)
    d = Transaction.objects.filter(team1=old_name)
    e = Transaction.objects.filter(team2=old_name)
    f = Asset.objects.filter(team=old_name)
    g = Trade.objects.filter(team1=old_name)
    h = Trade.objects.filter(team2=old_name)
    i = Cap_Penalty_Entry.objects.filter(team=old_name)

    for x in a:
        x.team = new_name
        x.save()

    for x in b:
        x.team = new_name
        x.save()

    c.internal_name = new_name
    c.save()

    for x in d:
        x.team1 = new_name
        x.save()

    for x in e:
        x.team2 = new_name
        x.save()

    for x in f:
        x.team = new_name
        x.save()

    for x in g:
        x.team1 = new_name
        x.save()

    for x in h:
        x.team2 = new_name
        x.save()

    for x in i:
        x.team = new_name
        x.save()

    return HttpResponseRedirect('/')

def process_adp(request):
    adp_data = request.POST['adp_text']
    list1 = adp_data.split('\r\n')
    list2 = []
    for x in list1:
        temp = x.split(':')
        list2.append(temp)
    for x in list2:
        if x[1] == 'Def':
            temp = x[2].split(',')
            x[2] = temp[0]
        elif x[1] == 'PK':
            x[1] = 'K'

    fix_list = [{'import_name' : 'Griffin, Robert', 'database_name' : 'Griffin III, Robert'},
                {'import_name' : 'Anderson, C.J.', 'database_name' : 'Anderson, CJ'},
                {'import_name' : 'Yeldon, T.J.', 'database_name' : 'Yeldon, TJ'},
                {'import_name' : 'Spiller, C.J.', 'database_name' : 'Spiller, CJ'},
                {'import_name' : 'Bernard, Giovani', 'database_name' : 'Bernard, Giovanni'},
                {'import_name' : "Bell, Le'Veon", 'database_name' : "Bell, Le'veon"},
                {'import_name' : 'Blount, LeGarrette', 'database_name' : 'Blount, LaGarrette'},
                {'import_name' : 'Beckham, Odell', 'database_name' : 'Beckham, Jr, Odell'},
                {'import_name' : 'Green, A.J.', 'database_name' : 'Green, AJ'},
                {'import_name' : 'Hilton, T.Y.', 'database_name' : 'Hilton, TY'},
                {'import_name' : 'Cooks, Brandin', 'database_name' : 'Cooks, Brandon'},
                ]

    for x in list2:
        for y in fix_list:
            if x[2] == y['import_name']:
                x[2] = y['database_name']

    unfound_list = []

    a = Player.objects.all()
    for x in list2:
        found_name = False
        for y in a:
            if y.name == x[2]:
                found_name = True
        if found_name == False:
            unfound_list.append(x[2])

    if len(unfound_list) == 0:
        for x in list2:
            ADP.objects.create(rank=x[0],
                               position=x[1],
                               player=x[2])
        return HttpResponseRedirect('/')
    else:
        print(unfound_list)
        return HttpResponseRedirect('/batch')

def process_performance_yr1(request):
    #this will be parsing ESPN data
    perf_data = request.POST['perf_text']
    list1 = perf_data.split('\r\n')
    list2 = []
    for x in list1:
        temp = x.split(':')
        list2.append(temp)

    #print(list2)

    for x in list2:
        if x[1] == 'D/ST':
            x[1] = 'DEF'
        elif x[1] == 'PK':
            x[1] = 'K'

    fix_list = [{'import_name' : 'Griffin, Robert', 'database_name' : 'Griffin III, Robert'},
                {'import_name' : 'Anderson, C.J.', 'database_name' : 'Anderson, CJ'},
                {'import_name' : 'Yeldon, T.J.', 'database_name' : 'Yeldon, TJ'},
                {'import_name' : 'Spiller, C.J.', 'database_name' : 'Spiller, CJ'},
                {'import_name' : 'Bernard, Giovani', 'database_name' : 'Bernard, Giovanni'},
                {'import_name' : "Bell, Le'Veon", 'database_name' : "Bell, Le'veon"},
                {'import_name' : 'Blount, LeGarrette', 'database_name' : 'Blount, LaGarrette'},
                {'import_name' : 'Beckham Jr., Odell', 'database_name' : 'Beckham, Jr, Odell'},
                {'import_name' : 'Green, A.J.', 'database_name' : 'Green, AJ'},
                {'import_name' : 'Hilton, T.Y.', 'database_name' : 'Hilton, TY'},
                {'import_name' : 'Cooks, Brandin', 'database_name' : 'Cooks, Brandon'},
                {'import_name' : 'Ginn Jr., Ted', 'database_name' : 'Ginn, Jr, Ted'},
                {'import_name' : 'Johnson Jr., Duke', 'database_name' : 'Johnson, Duke'},
                {'import_name' : 'Smith Sr., Steve', 'database_name' : 'Smith, Steve'},
                {'import_name' : 'Shorts III, Cecil', 'database_name' : 'Shorts, Cecil'},
                {'import_name' : 'Buccaneers', 'database_name' : 'Bucs'},
                {'import_name' : 'Reece, Marcel', 'database_name' : 'Reese, Marcel'},
                {'import_name' : 'McCarron, AJ', 'database_name' : 'McCarron, A.J.'},
                {'import_name' : 'Cunningham, Benjamin', 'database_name' : 'Cunningham, Benny'},
                {'import_name' : 'Griffin, Ryan', 'database_name' : 'Griffin, Ryan (HOU)'},
                {'import_name' : 'Vick, Mike', 'database_name' : 'Vick, Michael'},
                ]

    for x in list2:
        for y in fix_list:
            if x[2] == y['import_name']:
                x[2] = y['database_name']

    unfound_list = []

    a = Player.objects.all()
    for x in list2:
        found_name = False
        for y in a:
            if y.name == x[2]:
                found_name = True
        if found_name == False:
            unfound_list.append(x[2])

    print(unfound_list)

    if len(unfound_list) == 0:
        for x in list2:
            Performance_Yr1.objects.create(rank=x[0],
                                           position=x[1],
                                           player=x[2],
                                           points=x[3])
        return HttpResponseRedirect('/')
    else:
        print(unfound_list)
        return HttpResponseRedirect('/batch')

def process_performance_yr2(request):
    #this will be parsing MFL data
    #this will be parsing ESPN data
    perf_data = request.POST['perf_text']
    list1 = perf_data.split('\r\n')
    list2 = []
    for x in list1:
        temp = x.split(':')
        list2.append(temp)
    for x in list2:
        if x[1] == 'Def':
            temp = x[2].split(',')
            x[2] = temp[0]
        elif x[1] == 'PK':
            x[1] = 'K'

    #print(list2)

    fix_list = [{'import_name' : 'Griffin Robert', 'database_name' : 'Griffin III, Robert'},
                {'import_name' : 'Buccaneers', 'database_name' : 'Bucs'},
                {'import_name' : 'Manuel, E.J.', 'database_name' : 'Manuel, EJ'},
                {'import_name' : 'Anderson, C.J.', 'database_name' : 'Anderson, CJ'},
                {'import_name' : 'Yeldon, T.J.', 'database_name' : 'Yeldon, TJ'},
                {'import_name' : 'Spiller, C.J.', 'database_name' : 'Spiller, CJ'},
                {'import_name' : 'Bernard, Giovani', 'database_name' : 'Bernard, Giovanni'},
                {'import_name' : "Bell, Le'Veon", 'database_name' : "Bell, Le'veon"},
                {'import_name' : 'Blount, LeGarrette', 'database_name' : 'Blount, LaGarrette'},
                {'import_name' : 'Beckham, Odell', 'database_name' : 'Beckham, Jr, Odell'},
                {'import_name' : 'Green, A.J.', 'database_name' : 'Green, AJ'},
                {'import_name' : 'Hilton, T.Y.', 'database_name' : 'Hilton, TY'},
                {'import_name' : 'Cooks, Brandin', 'database_name' : 'Cooks, Brandon'},
                {'import_name' : 'Reece, Marcel', 'database_name' : 'Reese, Marcel'},
                {'import_name' : 'Watson, Ben', 'database_name' : 'Watson, Benjamin'},
                {'import_name' : 'Griffin, Ryan', 'database_name' : 'Griffin, Ryan (HOU)'},
                {'import_name' : 'Ginn Ted', 'database_name' : 'Ginn, Jr, Ted'},
                {'import_name' : 'Brown, Philly', 'database_name' : 'Brown, Corey'},
                ]

    for x in list2:
        for y in fix_list:
            if x[2] == y['import_name']:
                x[2] = y['database_name']

    unfound_list = []

    a = Player.objects.all()
    for x in list2:
        found_name = False
        for y in a:
            if y.name == x[2]:
                found_name = True
        if found_name == False:
            unfound_list.append(x[2])

    print(unfound_list)

    if len(unfound_list) == 0:
        for x in list2:
            Performance_Yr2.objects.create(rank=x[0],
                                           position=x[1],
                                           player=x[2],
                                           points=x[3])
        return HttpResponseRedirect('/')
    else:
        print(unfound_list)
        return HttpResponseRedirect('/batch')

def store_tags_selected_player(request):
    player = request.POST['player']
    type = request.POST['type']
    value = request.POST['value']

    if player == '':
        return HttpResponseRedirect('/team/tags')

    a = TeamVariable.objects.filter(name='PlayerForTags').get(user=request.user)
    a.text_variable = player + ':' + value
    if type == 'waiver extension':
        a.int_variable = 0
    elif type == 'franchise tag':
        a.int_variable = 1
    elif type == 'transition tag':
        a.int_variable = 2
    a.save()

    return JsonResponse('test', safe=False)

def process_tags(request):
    player = request.POST['player']
    type = request.POST['type']
    value = request.POST['value']
    sb = request.POST['sb']
    salary = request.POST['salary']

    a = Team.objects.get(user=request.user)
    team = a.internal_name

    b = TeamVariable.objects.filter(name='TagsSubmissions').get(user=request.user)
    try:
        tags_flags = b.text_variable.strip().split(',')
    except:
        tags_flags = [0,0,0]

    time_date = timezone.now()

    if type == '0':
        Transaction.objects.create(player=player,
                                   team2=team,
                                   transaction_type='Waiver Extension',
                                   var_d1=Decimal(value),
                                   var_d2=Decimal(sb),
                                   var_d3=Decimal(salary),
                                   var_t1='Pending',
                                   var_t2='Confirmed',
                                   date=time_date)
        create_alerts('Contract Submitted For Approval', request.user, [player, team])
        tags_flags[0] = 1
    elif type == '1':
        Transaction.objects.create(player=player,
                                   team2=team,
                                   transaction_type='Franchise Tag',
                                   var_d1=Decimal(value),
                                   var_t1='Pending',
                                   var_t2='Confirmed',
                                   date=time_date)
        create_alerts('Contract Submitted For Approval', request.user, [player, team])
        tags_flags[1] = 1
    elif type == '2':
        Transaction.objects.create(player=player,
                                   team2=team,
                                   transaction_type='Transition Tag',
                                   var_d1=Decimal(value),
                                   var_d2=Decimal(sb),
                                   var_d3=Decimal(salary),
                                   var_t1='Pending',
                                   var_t2='Confirmed',
                                   date=time_date)
        create_alerts('Contract Submitted For Approval', request.user, [player, team])
        tags_flags[2] = 1

    tags_string = str(tags_flags[0]) + ',' + str(tags_flags[1]) + ',' + str(tags_flags[2])
    b.text_variable = tags_string
    b.save()

    return JsonResponse('test', safe=False)

def get_extension_info(request):
    player = request.POST['player']
    team = request.POST['team']
    ext_string = request.POST['ext_string']

    ext_list = ext_string.strip().split(',')

    try:
        yr1_ext = ext_list[0][1:]
    except:
        yr1_ext = '0'
    try:
        yr2_ext = ext_list[1][1:]
    except:
        yr2_ext = '0'
    try:
        yr3_ext = ext_list[2][1:]
    except:
        yr3_ext = '0'
    try:
        yr4_ext = ext_list[3][1:]
    except:
        yr4_ext = '0'

    export = player + ':' + team + ':' + yr1_ext + ':' + yr2_ext + ':' + yr3_ext + ':' + yr4_ext

    a = TeamVariable.objects.filter(name='PlayerForExtension').get(user=request.user)
    a.text_variable = export
    a.save()

    return JsonResponse('test', safe=False)

def save_new_auctions_switch(request):
    new_auctions_switch_state = int(request.POST['new_auctions_switch_state'])

    if new_auctions_switch_state != 99:
        a = Variable.objects.get(name='New Auction Flag')
        a.int_variable = new_auctions_switch_state
        a.save()

    return JsonResponse('test', safe=False)

def save_extension_switch(request):
    ext_switch = int(request.POST['extension_switch_state'])

    if ext_switch != 99:
        a = Variable.objects.get(name='Extensions Switch')
        a.int_variable = ext_switch
        a.save()

    return JsonResponse('test', safe=False)

def save_commish_periodic(request):
    commish_periodic_state = int(request.POST['commish_periodic_state'])

    if commish_periodic_state != 99:
        a = Variable.objects.get(name='CommishPeriodicState')
        a.int_variable = commish_periodic_state
        a.save()

    return JsonResponse('test', safe=False)

def save_include_impending_flag(request):
    include_impending = int(request.POST['include_impending'])

    if include_impending != 99:
        a = Variable.objects.get(name='Include Impending')
        a.int_variable = include_impending
        a.save()

    return JsonResponse('test', safe=False)

def save_cut_season(request):
    cut_season = int(request.POST['cut_season'])

    if cut_season != 99:
        a = Variable.objects.get(name='Cut Season')
        a.int_variable = cut_season
        a.save()

    return JsonResponse('test', safe=False)

def save_data_cut_player(request):
    try:
        player = request.POST['player']
    except:
        player_list = request.POST.getlist('player_list[]')
    from_page = request.POST['from']

    if from_page == 'player':
        a = TeamVariable.objects.filter(name='PlayersForCut').get(user=request.user)
        a.text_variable = player
        a.int_variable = 0
        a.save()
    elif from_page == 'team':
        a = TeamVariable.objects.filter(name='PlayersForCut').get(user=request.user)
        list_string = ''
        for x in player_list:
            list_string = list_string + x + ':'
        list_string = list_string[:-1]
        a.text_variable = list_string
        a.int_variable = 1
        a.save()

    return JsonResponse('test', safe=False)

def process_cuts(request):
    total_players = int(request.POST['total_players'])

    l = []
    for x in range(0,total_players):
        t1 = 'cut_list[' + str(x) + '][name]'
        t2 = 'cut_list[' + str(x) + '][current_selection]'
        a = request.POST.getlist(t1)
        b = request.POST.getlist(t2)
        try:
            l.append({'player' : a[0],
                    'current_selection' : int(b[0])})
        except:
            pass

    for x in l:
        a = Player.objects.get(name=x['player'])
        Transaction.objects.create(player=x['player'],
                                   team2=a.team,
                                   transaction_type='Player Cut',
                                   var_i1=x['current_selection'],
                                   var_t1 = 'Pending',
                                   var_t2 = 'Confirmed',
                                   date=timezone.now())
        create_alerts('Player Cut', request.user, [x['player']])

    return JsonResponse('test', safe=False)

def create_drafts(request):
    a = Team.objects.all()
    for year in range(year_list[1],year_list[4]):
        for round in range(1,6):
            for x in a:
                Draft_Pick.objects.create(owner=x.internal_name,
                                          original_owner=x.internal_name,
                                          year=year,
                                          round=round)
    return HttpResponseRedirect('/')

def configure_draft(request):
    num_teams = Team.objects.count()
    a = Variable.objects.get(name='Draft Order')
    draft_order = a.text_variable.strip().split(',')
    b = Draft_Pick.objects.all()

    pick_list = []
    comp_list = []
    for pick in b:
        if pick.year == year_list[0]:
            if pick.compensatory == 'none':
                pick_list.append(pick)
            else:
                comp_list.append(pick)
    if len(pick_list) == 0:
        for pick in b:
            if pick.year == year_list[1]:
                if pick.compensatory == 'none':
                    pick_list.append(pick)
                else:
                    comp_list.append(pick)

    for pick in pick_list:
        for o in draft_order:
            if pick.original_owner == o:
                pick.pick_in_round = draft_order.index(o) + 1
        if pick.round <= 3:
            pick.pick_overall = ((pick.round - 1) * num_teams) + pick.pick_in_round
        else:
            pick.pick_overall = ((pick.round - 1) * num_teams) + pick.pick_in_round + len(comp_list)
        try:
            sal_list = draft_pick_salary_list[pick.pick_overall]
        except:
            sal_list = [1.00, 1.50]
        for x in range(0,len(sal_list)):
            if x == 0:
                pick.yr1_sal = sal_list[x]
            elif x == 1:
                pick.yr2_sal = sal_list[x]
            elif x == 2:
                pick.yr3_sal = sal_list[x]
            elif x == 3:
                pick.yr4_sal = sal_list[x]

    franchise_comps = []
    dues_comps = []
    for pick in comp_list:
        if pick.compensatory == 'franchise tag':
            franchise_comps.append(pick)
        elif pick.compensatory == 'league dues':
            dues_comps.append(pick)

    ordered_franchise_comps = []
    ordered_dues_comps = []
    for o in draft_order:
        for pick in franchise_comps:
            if o == pick.original_owner:
                ordered_franchise_comps.append(pick)
        for pick in dues_comps:
            if o == pick.original_owner:
                ordered_dues_comps.append(pick)

    pick_index = 0
    for pick in ordered_franchise_comps:
        pick_index += 1
        pick.round = 3
        pick.pick_in_round = 12 + pick_index
        pick.pick_overall = 24 + pick.pick_in_round
        try:
            sal_list = draft_pick_salary_list[pick.pick_overall]
        except:
            sal_list = [1.00, 1.50]
        for x in range(0,len(sal_list)):
            if x == 0:
                pick.yr1_sal = sal_list[x]
            elif x == 1:
                pick.yr2_sal = sal_list[x]
            elif x == 2:
                pick.yr3_sal = sal_list[x]
            elif x == 3:
                pick.yr4_sal = sal_list[x]

    pick_index = 0
    for pick in ordered_dues_comps:
        pick_index += 1
        pick.round = 3
        pick.pick_in_round = 12 + pick_index + len(ordered_franchise_comps)
        pick.pick_overall = 24 + pick.pick_in_round
        try:
            sal_list = draft_pick_salary_list[pick.pick_overall]
        except:
            sal_list = [1.00, 1.50]
        for x in range(0,len(sal_list)):
            if x == 0:
                pick.yr1_sal = sal_list[x]
            elif x == 1:
                pick.yr2_sal = sal_list[x]
            elif x == 2:
                pick.yr3_sal = sal_list[x]
            elif x == 3:
                pick.yr4_sal = sal_list[x]

    for pick in pick_list:
        for x in b:
            if x.id == pick.id:
                x.round = pick.round
                x.pick_in_round = pick.pick_in_round
                x.pick_overall = pick.pick_overall
                x.yr1_sal = pick.yr1_sal
                x.yr2_sal = pick.yr2_sal
                x.yr3_sal = pick.yr3_sal
                x.yr4_sal = pick.yr4_sal
                x.save()

    for pick in ordered_franchise_comps:
        for x in b:
            if x.id == pick.id:
                x.round = pick.round
                x.pick_in_round = pick.pick_in_round
                x.pick_overall = pick.pick_overall
                x.yr1_sal = pick.yr1_sal
                x.yr2_sal = pick.yr2_sal
                x.yr3_sal = pick.yr3_sal
                x.yr4_sal = pick.yr4_sal
                x.save()

    for pick in ordered_dues_comps:
        for x in b:
            if x.id == pick.id:
                x.round = pick.round
                x.pick_in_round = pick.pick_in_round
                x.pick_overall = pick.pick_overall
                x.yr1_sal = pick.yr1_sal
                x.yr2_sal = pick.yr2_sal
                x.yr3_sal = pick.yr3_sal
                x.yr4_sal = pick.yr4_sal
                x.save()

    return JsonResponse('test', safe=False)

def load_trade_opp_data(request):
    team = request.POST['team_selected']
    a = Team.objects.get(internal_name=team)

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

    return JsonResponse({'draft_picks': serializers.serialize('json', b),
                         'assets' : serializers.serialize('json', c),
                         'cap_space' : cap_space,
                         'player_list' : serializers.serialize('json', player_list),
                         },
                         safe=False)

def save_trade_data(request):
    team_selected = request.POST['team_selected']
    left_players = request.POST.getlist('left_players[]')
    left_picks = request.POST.getlist('left_picks[]')
    left_assets = request.POST.getlist('left_assets[]')
    left_cash = request.POST.getlist('left_cash[]')
    right_players = request.POST.getlist('right_players[]')
    right_picks = request.POST.getlist('right_picks[]')
    right_assets = request.POST.getlist('right_assets[]')
    right_cash = request.POST.getlist('right_cash[]')
    view_flag_text = request.POST['view_flag_text']
    is_proposing_team = request.POST['is_proposing_team']
    view_flag_trade_id = request.POST['view_flag_trade_id']

    save_string = team_selected + '\n'

    if len(left_players) == 0:
        save_string = save_string + '\n'
    else:
        for x in left_players:
            save_string = save_string + x + ':'
        save_string = save_string[:-1] + '\n'

    if len(left_picks) == 0:
        save_string = save_string + '\n'
    else:
        for x in left_picks:
            save_string = save_string + x + ':'
        save_string = save_string[:-1] + '\n'

    if len(left_assets) == 0:
        save_string = save_string + '\n'
    else:
        for x in left_assets:
            save_string = save_string + x + ':'
        save_string = save_string[:-1] + '\n'

    if len(left_cash) == 0:
        save_string = save_string + '\n'
    else:
        for x in left_cash:
            save_string = save_string + x + ':'
        save_string = save_string[:-1] + '\n'

    if len(right_players) == 0:
        save_string = save_string + '\n'
    else:
        for x in right_players:
            save_string = save_string + x + ':'
        save_string = save_string[:-1] + '\n'

    if len(right_picks) == 0:
        save_string = save_string + '\n'
    else:
        for x in right_picks:
            save_string = save_string + x + ':'
        save_string = save_string[:-1] + '\n'

    if len(right_assets) == 0:
        save_string = save_string + '\n'
    else:
        for x in right_assets:
            save_string = save_string + x + ':'
        save_string = save_string[:-1] + '\n'

    if len(right_cash) == 0:
        save_string = save_string + '\n'
    else:
        for x in right_cash:
            save_string = save_string + x + ':'
        save_string = save_string[:-1]

    a = TeamVariable.objects.filter(name='TradeData').get(user=request.user)
    a.text_variable = save_string
    a.save()

    b = TeamVariable.objects.filter(name='TradeViewFlags').get(user=request.user)
    b.text_variable = view_flag_text + ',' + is_proposing_team
    b.int_variable = int(view_flag_trade_id)
    b.save()
    
    return JsonResponse('test', safe=False)

def create_trade_string_for_display(pro_players, pro_picks_verbose, pro_assets_verbose, pro_cash_verbose, opp_players, opp_picks_verbose, opp_assets_verbose, opp_cash_verbose):
    pro_string = ''
    for x in pro_players:
        pro_string = pro_string + x + '; '
    for x in pro_picks_verbose:
        pro_string = pro_string + x + '; '
    for x in pro_assets_verbose:
        pro_string = pro_string + x + '; '
    for x in pro_cash_verbose:
        pro_string = pro_string + x + '; '
    pro_string = pro_string[0:-1]

    opp_string = ''
    for x in opp_players:
        opp_string = opp_string + x + '; '
    for x in opp_picks_verbose:
        opp_string = opp_string + x + '; '
    for x in opp_assets_verbose:
        opp_string = opp_string + x + '; '
    for x in opp_cash_verbose:
        opp_string = opp_string + x + '; '
    opp_string = opp_string[0:-1]

    return pro_string, opp_string

def process_trade(request):
    def confirm(request, is_counter):
        expiration_time = request.POST['expiration_time']
        comments = request.POST['comments']

        a = TeamVariable.objects.filter(name='TradeData').get(user=request.user)
        trade_data = a.text_variable
        trade_thread = a.int_variable
        a.text_variable = ''
        a.int_variable = 999999
        a.save()

        temp1 = trade_data.split('\n')
        opp_team = temp1[0]
        pro_players = temp1[1]
        pro_picks = temp1[2]
        pro_assets = temp1[3]
        pro_cash = temp1[4]
        opp_players = temp1[5]
        opp_picks = temp1[6]
        opp_assets = temp1[7]
        opp_cash = temp1[8]

        b = Team.objects.get(user=request.user)
        pro_team = b.internal_name

        if trade_thread == 999999:
            c = Trade.objects.all()
            thread_list = []
            for x in c:
                thread_list.append(x.trade_thread)
            try:
                last_thread = sorted(thread_list)[-1]
            except:
                last_thread = 0

            trade_thread = last_thread + 1

        date_now = timezone.now()
        expiration_date = date_now + timezone.timedelta(days=int(expiration_time))

        if (is_counter == True):
            trade_status = 'Counter'
            trans_type = 'Counter Offer'
        else:
            trade_status = 'Offer'
            trans_type = 'Trade Offer'

        Trade.objects.create(team1=pro_team,
                             team2=opp_team,
                             trade_thread=trade_thread,
                             date=date_now,
                             expiration_date=expiration_date,
                             pro_players=pro_players,
                             pro_picks=pro_picks,
                             pro_assets=pro_assets,
                             pro_cash=pro_cash,
                             opp_players=opp_players,
                             opp_picks=opp_picks,
                             opp_assets=opp_assets,
                             opp_cash=opp_cash,
                             message=comments,
                             status1=trade_status)

        pro_players = pro_players.split(':')
        pro_picks = pro_picks.split(':')
        pro_assets = pro_assets.split(':')
        pro_cash = pro_cash.split(':')
        opp_players = opp_players.split(':')
        opp_picks = opp_picks.split(':')
        opp_assets = opp_assets.split(':')
        opp_cash = opp_cash.split(':')

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

        pro_string, opp_string = create_trade_string_for_display(pro_players, pro_picks_verbose, pro_assets_verbose, pro_cash_verbose, opp_players, opp_picks_verbose, opp_assets_verbose, opp_cash_verbose)

        d = Trade.objects.last()
        last_id = d.id

        Transaction.objects.create(player='trade',
                                   team1=pro_team,
                                   team2=opp_team,
                                   transaction_type=trans_type,
                                   var_i1=last_id,
                                   var_t1='Pending',
                                   var_t2=pro_string,
                                   var_t3=opp_string,
                                   date=date_now)

        e = Team.objects.get(internal_name=opp_team)
        opp_user = e.user

        if (is_counter == True):
            create_alerts('Counter Offer', request.user, [opp_user, last_id, comments])
        else:
            create_alerts('Trade Offer', request.user, [opp_user, last_id, comments])

    def reject(request, comments):
        trade_id = int(request.POST['trade_id'])
        a = Transaction.objects.filter(player='trade').get(var_i1=trade_id)
        a.var_t1 = 'Rejected'
        a.save()
        b = Trade.objects.get(pk=trade_id)
        b.status3 = 'Closed'
        b.save()
        Trade.objects.create(team1=b.team1,
                             team2=b.team2,
                             trade_thread=b.trade_thread,
                             date=timezone.now(),
                             expiration_date=b.expiration_date,
                             pro_players=b.pro_players,
                             pro_picks=b.pro_picks,
                             pro_assets=b.pro_assets,
                             pro_cash=b.pro_cash,
                             opp_players=b.opp_players,
                             opp_picks=b.opp_picks,
                             opp_assets=b.opp_assets,
                             opp_cash=b.opp_cash,
                             message=comments,
                             status1='Rejection',
                             status3='Closed')
        e = Team.objects.get(internal_name=b.team1)
        opp_user = e.user
        create_alerts('Trade Rejected', request.user, [opp_user, b.id, comments])

    def accept(request):
        trade_id = int(request.POST['trade_id'])
        comments = request.POST['comments']
        
        a = Transaction.objects.filter(player='trade').get(var_i1=trade_id)
        a.var_t1 = 'Accepted'
        a.save()
        
        b = Trade.objects.get(pk=trade_id)
        b.status3 = 'Closed'
        b.save()
        
        Trade.objects.create(team1=b.team1,
                             team2=b.team2,
                             trade_thread=b.trade_thread,
                             date=timezone.now(),
                             expiration_date=b.expiration_date,
                             pro_players=b.pro_players,
                             pro_picks=b.pro_picks,
                             pro_assets=b.pro_assets,
                             pro_cash=b.pro_cash,
                             opp_players=b.opp_players,
                             opp_picks=b.opp_picks,
                             opp_assets=b.opp_assets,
                             opp_cash=b.opp_cash,
                             message=comments,
                             status1='Accepted',
                             status3='Closed')
        
        pro_players = b.pro_players.split(':')
        pro_picks = b.pro_picks.split(':')
        pro_assets = b.pro_assets.split(':')
        pro_cash = b.pro_cash.split(':')
        opp_players = b.opp_players.split(':')
        opp_picks = b.opp_picks.split(':')
        opp_assets = b.opp_assets.split(':')
        opp_cash = b.opp_cash.split(':')
    
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
        
        pro_string, opp_string = create_trade_string_for_display(pro_players, pro_picks_verbose, pro_assets_verbose, pro_cash_verbose, opp_players, opp_picks_verbose, opp_assets_verbose, opp_cash_verbose)

        d = Trade.objects.last()
        last_id = d.id
        
        Transaction.objects.create(player='trade',
                                   team1=b.team1,
                                   team2=b.team2,
                                   transaction_type='Trade Accepted',
                                   var_i1=last_id,
                                   var_t1='Pending',
                                   var_t2=pro_string,
                                   var_t3=opp_string,
                                   date=timezone.now())
        
        e = Team.objects.get(internal_name=b.team1)
        opp_user = e.user
        
        create_alerts('Trade Accepted', request.user, [trade_id, comments])

    def withdraw(request):
        trade_id = int(request.POST['trade_id'])
        a = Transaction.objects.filter(player='trade').get(var_i1=trade_id)
        a.var_t1 = 'Withdrawn'
        a.save()
        b = Trade.objects.get(pk=trade_id)
        b.status2 = 'Withdrawn'
        b.status3 = 'Closed'
        b.save()
        e = Team.objects.get(internal_name=b.team2)
        opp_user = e.user
        create_alerts('Trade Withdrawn', request.user, [opp_user, b.id])


    #end functions
    

    process_instruction = request.POST['process_instruction']

    if process_instruction == 'confirm initial offer':
        confirm(request, False)
    elif process_instruction == 'reject offer':
        comments = request.POST['comments']
        reject(request, comments)
    elif process_instruction == 'accept offer':
        accept(request)
    elif process_instruction == 'counter offer':
        trade_id = int(request.POST['trade_id'])
        f = TeamVariable.objects.filter(name='TradeViewFlags').get(user=request.user)
        f.text_variable = 'counter offer, 1'
        f.int_variable = trade_id
        f.save()
    elif process_instruction == 'finish counter offer':
        reject(request, '')
        confirm(request, True)
    elif process_instruction == 'withdraw':
        withdraw(request)


    return JsonResponse('test', safe=False)

def get_trade_data_for_alerts(request):
    trade_id = request.POST['trade_id']
    a = Trade.objects.filter(pk=int(trade_id))

    return JsonResponse({'trade_data': serializers.serialize('json', a)},
                         safe=False)

def get_verbose_trade_data(request):
    trade_id = request.POST['trade_id']
    a = Trade.objects.get(pk=int(trade_id))

    pro_players = a.pro_players.split(':')
    pro_picks = a.pro_picks.split(':')
    pro_assets = a.pro_assets.split(':')
    pro_cash = a.pro_cash.split(':')
    opp_players = a.opp_players.split(':')
    opp_picks = a.opp_picks.split(':')
    opp_assets = a.opp_assets.split(':')
    opp_cash = a.opp_cash.split(':')

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

    return JsonResponse({'pro_players' : pro_players,
                         'pro_picks' : pro_picks_verbose,
                         'pro_assets' : pro_assets_verbose,
                         'pro_cash' : pro_cash_verbose,
                         'opp_players' : opp_players,
                         'opp_picks' : opp_picks_verbose,
                         'opp_assets' : opp_assets_verbose,
                         'opp_cash' : opp_cash_verbose,
                         }, safe=False)

def save_redirect_trade_data(request):
    trade_id = request.POST['trade_id']
    aa = Team.objects.get(user=request.user)
    user_team = aa.internal_name

    a = Trade.objects.get(pk=int(trade_id))

    is_proposing_team = 1
    if user_team == a.team1:
        team_selected = a.team2
        left_players = a.pro_players.split(':')
        left_picks = a.pro_picks.split(':')
        left_assets = a.pro_assets.split(':')
        left_cash = a.pro_cash.split(':')
        right_players = a.opp_players.split(':')
        right_picks = a.opp_picks.split(':')
        right_assets = a.opp_assets.split(':')
        right_cash = a.opp_cash.split(':')
    else:
        team_selected = a.team1
        left_players = a.opp_players.split(':')
        left_picks = a.opp_picks.split(':')
        left_assets = a.opp_assets.split(':')
        left_cash = a.opp_cash.split(':')
        right_players = a.pro_players.split(':')
        right_picks = a.pro_picks.split(':')
        right_assets = a.pro_assets.split(':')
        right_cash = a.pro_cash.split(':')
        is_proposing_team = 0

    save_string = team_selected + '\n'

    if len(left_players) == 0:
        save_string = save_string + '\n'
    else:
        for x in left_players:
            save_string = save_string + x + ':'
        save_string = save_string[:-1] + '\n'

    if len(left_picks) == 0:
        save_string = save_string + '\n'
    else:
        for x in left_picks:
            save_string = save_string + x + ':'
        save_string = save_string[:-1] + '\n'

    if len(left_assets) == 0:
        save_string = save_string + '\n'
    else:
        for x in left_assets:
            save_string = save_string + x + ':'
        save_string = save_string[:-1] + '\n'

    if len(left_cash) == 0:
        save_string = save_string + '\n'
    else:
        for x in left_cash:
            save_string = save_string + x + ':'
        save_string = save_string[:-1] + '\n'

    if len(right_players) == 0:
        save_string = save_string + '\n'
    else:
        for x in right_players:
            save_string = save_string + x + ':'
        save_string = save_string[:-1] + '\n'

    if len(right_picks) == 0:
        save_string = save_string + '\n'
    else:
        for x in right_picks:
            save_string = save_string + x + ':'
        save_string = save_string[:-1] + '\n'

    if len(right_assets) == 0:
        save_string = save_string + '\n'
    else:
        for x in right_assets:
            save_string = save_string + x + ':'
        save_string = save_string[:-1] + '\n'

    if len(right_cash) == 0:
        save_string = save_string + '\n'
    else:
        for x in right_cash:
            save_string = save_string + x + ':'
        save_string = save_string[:-1]

    b = TeamVariable.objects.filter(name='TradeData').get(user=request.user)
    b.text_variable = save_string
    b.int_variable = a.trade_thread
    b.save()

    redirect_from = request.POST['from']
    c = TeamVariable.objects.filter(name='TradeViewFlags').get(user=request.user)
    c.text_variable = redirect_from + ',' + str(is_proposing_team)
    c.int_variable = a.id
    c.save()

    return JsonResponse('done', safe=False)

def save_transaction_trade(request):
    trade_id = int(request.POST['trade_id'])
    trans_id = int(request.POST['trans_id'])
    
    a = Trade.objects.get(pk=trade_id)
    pro_team = a.team1
    pro_players = a.pro_players.strip().split(':')
    pro_picks = a.pro_picks.strip().split(':')
    pro_assets = a.pro_assets.strip().split(':')
    pro_cash = a.pro_cash.strip().split(':')
    opp_team = a.team2
    opp_players = a.opp_players.strip().split(':')
    opp_picks = a.opp_picks.strip().split(':')
    opp_assets = a.opp_assets.strip().split(':')
    opp_cash = a.opp_cash.strip().split(':')

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

    for player in pro_players:
        b = Player.objects.get(name=player)
        b.team = opp_team
        b.save()
    for player in opp_players:
        b = Player.objects.get(name=player)
        b.team = pro_team
        b.save()

    for pick in pro_picks:
        c = Draft_Pick.objects.get(pk=int(pick))
        c.owner = opp_team
        c.save()
    for pick in opp_picks:
        c = Draft_Pick.objects.get(pk=int(pick))
        c.owner = pro_team
        c.save()

    for asset in pro_assets:
        d = Asset.objects.get(pk=int(asset))
        d.team = opp_team
        d.save()
    for asset in opp_assets:
        d = Asset.objects.get(pk=int(asset))
        d.team = pro_team
        d.save()
        
    e = Team.objects.get(internal_name=pro_team)
    e.yr1_cap_penalty = e.yr1_cap_penalty + Decimal(pro_cash[0]) - Decimal(opp_cash[0])
    e.yr2_cap_penalty = e.yr2_cap_penalty + Decimal(pro_cash[1]) - Decimal(opp_cash[1])
    e.yr3_cap_penalty = e.yr3_cap_penalty + Decimal(pro_cash[2]) - Decimal(opp_cash[2])
    e.yr4_cap_penalty = e.yr4_cap_penalty + Decimal(pro_cash[3]) - Decimal(opp_cash[3])
    e.yr5_cap_penalty = e.yr5_cap_penalty + Decimal(pro_cash[4]) - Decimal(opp_cash[4])
    e.save()
    
    f = Team.objects.get(internal_name=opp_team)
    f.yr1_cap_penalty = f.yr1_cap_penalty + Decimal(opp_cash[0]) - Decimal(pro_cash[0])
    f.yr2_cap_penalty = f.yr2_cap_penalty + Decimal(opp_cash[1]) - Decimal(pro_cash[1])
    f.yr3_cap_penalty = f.yr3_cap_penalty + Decimal(opp_cash[2]) - Decimal(pro_cash[2])
    f.yr4_cap_penalty = f.yr4_cap_penalty + Decimal(opp_cash[3]) - Decimal(pro_cash[3])
    f.yr5_cap_penalty = f.yr5_cap_penalty + Decimal(opp_cash[4]) - Decimal(pro_cash[4])
    f.save()

    for x in range(0,len(pro_cash)):
        if Decimal(pro_cash[x]) != 0:
            Cap_Penalty_Entry.objects.create(team=pro_team,
                                             year=year_list[x],
                                             penalty=Decimal(pro_cash[x]),
                                             description='Cash traded to ' + opp_team,
                                             date=timezone.now())
            Cap_Penalty_Entry.objects.create(team=opp_team,
                                             year=year_list[x],
                                             penalty=Decimal(pro_cash[x]),
                                             description='Cash acquired from ' + pro_team + ' in trade',
                                             date=timezone.now())

    for x in range(0,len(opp_cash)):
        if Decimal(opp_cash[x]) != 0:
            Cap_Penalty_Entry.objects.create(team=opp_team,
                                             year=year_list[x],
                                             penalty=Decimal(opp_cash[x]),
                                             description='Cash traded to ' + pro_team,
                                             date=timezone.now())
            Cap_Penalty_Entry.objects.create(team=pro_team,
                                             year=year_list[x],
                                             penalty=Decimal(opp_cash[x]),
                                             description='Cash acquired from ' + opp_team + ' in trade',
                                             date=timezone.now())

    h = Team.objects.get(internal_name=opp_team)
    opp_user = h.user

    create_alerts('Trade Processed', request.user, [opp_user, trade_id])

    k = Transaction.objects.get(pk=trans_id)
    k.var_t1 = ''
    k.save()

    #need to check for traded player/assets in other deals and cancel them
    i = Trade.objects.all().exclude(status3='Closed')
    for x in i:
        trade_invalid = check_trade_for_dup_assets(x, pro_players, pro_picks, pro_assets, opp_players, opp_picks, opp_assets)
        if trade_invalid == False:
            trade_invalid = check_trade_for_dup_assets(x, opp_players, opp_picks, opp_assets, pro_players, pro_picks, pro_assets)
        if trade_invalid:
            x.status3='Closed'
            x.status2='Invalid'
            x.save()
            j = Transaction.objects.filter(player='trade').get(var_i1=x.id)
            j.var_t1='Invalid'
            j.save()
    
    return JsonResponse('done', safe=False)

def retrieve_ownership_info_trade_transaction(request):
    trade_id = int(request.POST['trade_id'])

    a = Trade.objects.get(pk=trade_id)
    pro_team = a.team1
    pro_players = a.pro_players.strip().split(':')
    pro_picks = a.pro_picks.strip().split(':')
    pro_assets = a.pro_assets.strip().split(':')
    pro_cash = a.pro_cash.strip().split(':')
    opp_team = a.team2
    opp_players = a.opp_players.strip().split(':')
    opp_picks = a.opp_picks.strip().split(':')
    opp_assets = a.opp_assets.strip().split(':')
    opp_cash = a.opp_cash.strip().split(':')

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


    team1_players = []
    team1_picks = []
    team1_assets = []
    team1_cap_pen = [0,0,0,0,0]
    team2_players = []
    team2_picks = []
    team2_assets = []
    team2_cap_pen = [0,0,0,0,0]

    for player in pro_players:
        b = Player.objects.get(name=player)
        team1_players.append({'player' : player, 'owner' : b.team})
    for pick in pro_picks:
        c = Draft_Pick.objects.get(pk=int(pick))
        team1_picks.append({'pick' : pick, 'owner' : c.owner})
    for asset in pro_assets:
        d = Asset.objects.get(pk=int(asset))
        team1_assets.append({'asset' : asset, 'owner' : d.team})
        
    for player in opp_players:
        b = Player.objects.get(name=player)
        team2_players.append({'player' : player, 'owner' : b.team})
    for pick in opp_picks:
        c = Draft_Pick.objects.get(pk=int(pick))
        team2_picks.append({'pick' : pick, 'owner' : c.owner})
    for asset in opp_assets:
        d = Asset.objects.get(pk=int(asset))
        team2_assets.append({'asset' : asset, 'owner' : d.team})
        
    e = Team.objects.get(internal_name=pro_team)
    team1_cap_pen[0] = e.yr1_cap_penalty
    team1_cap_pen[1] = e.yr2_cap_penalty
    team1_cap_pen[2] = e.yr3_cap_penalty
    team1_cap_pen[3] = e.yr4_cap_penalty
    team1_cap_pen[4] = e.yr5_cap_penalty
    
    f = Team.objects.get(internal_name=opp_team)
    team2_cap_pen[0] = f.yr1_cap_penalty
    team2_cap_pen[1] = f.yr2_cap_penalty
    team2_cap_pen[2] = f.yr3_cap_penalty
    team2_cap_pen[3] = f.yr4_cap_penalty
    team2_cap_pen[4] = f.yr5_cap_penalty
    

    return JsonResponse({'team1_players': team1_players,
                         'team1_picks': team1_picks,
                         'team1_assets': team1_assets,
                         'team1_cap_pen': team1_cap_pen,
                         'team2_players': team2_players,
                         'team2_picks': team2_picks,
                         'team2_assets': team2_assets,
                         'team2_cap_pen': team2_cap_pen,
                         },
                         safe=False)

def league_year_transition(request):
    a = Player.objects.all()

    for x in a:
        if x.total_value != 0:
            x.yr1_salary = x.yr2_salary
            x.yr2_salary = x.yr3_salary
            x.yr3_salary = x.yr4_salary
            x.yr4_salary = x.yr5_salary
            x.yr5_salary = 0
            x.salary = x.yr1_salary + x.yr2_salary + x.yr3_salary + x.yr4_salary

            x.yr1_sb = x.yr2_sb
            x.yr2_sb = x.yr3_sb
            x.yr3_sb = x.yr4_sb
            x.yr4_sb = x.yr5_sb
            x.yr5_sb = 0
            x.signing_bonus = x.yr1_sb + x.yr2_sb + x.yr3_sb + x.yr4_sb
            x.total_value = x.salary + x.signing_bonus

            if x.total_value == 0:
                x.team = 'Free Agent'
                x.contract_type = 'none'
                x.yr1_role = '--'
                x.yr2_role = '--'
                x.yr3_role = '--'
                x.yr4_role = '--'
                x.yr5_role = '--'
            else:
                x.yr1_role = x.yr2_role
                x.yr2_role = x.yr3_role
                x.yr3_role = x.yr4_role
                x.yr4_role = x.yr5_role
                x.yr5_role = '--'

            x.save()

    b = Team.objects.all()

    for x in b:
        x.yr1_cap_penalty = x.yr2_cap_penalty
        x.yr2_cap_penalty = x.yr3_cap_penalty
        x.yr3_cap_penalty = x.yr4_cap_penalty
        x.yr4_cap_penalty = x.yr5_cap_penalty
        x.yr5_cap_penalty = 0

        x.yr1_balance = x.yr2_balance
        x.yr2_balance = x.yr3_balance
        x.yr3_balance = 60.00

        x.yr1_bonuses = x.yr2_bonuses
        x.yr2_bonuses = x.yr3_bonuses
        x.yr3_bonuses = '0,0'

        x.save()

    return HttpResponseRedirect('/')

def save_data_restructure_player(request):
    player = request.POST['player']
    yr1_sal = request.POST['yr1_sal']
    yr2_sal = request.POST['yr2_sal']
    yr3_sal = request.POST['yr3_sal']
    yr4_sal = request.POST['yr4_sal']
    yr5_sal = request.POST['yr5_sal']

    a = TeamVariable.objects.filter(name='PlayerForRestructure').get(user=request.user)
    save_string = player + ':' + yr1_sal + ':' + yr2_sal + ':' + yr3_sal + ':' + yr4_sal + ':' + yr5_sal
    a.text_variable = save_string
    a.save()

    return JsonResponse('test', safe=False)

def process_restructure(request):
    a = TeamVariable.objects.filter(name='PlayerForRestructure').get(user=request.user)
    temp = a.text_variable.split(':')
    a.text_variable = ''
    a.save()

    b = TeamVariable.objects.filter(name='PlayerForPlayerPage').get(user=request.user)
    b.text_variable = ''
    b.save()

    player = temp[0]
    yr1_sal = Decimal(temp[1])
    yr2_sal = Decimal(temp[2])
    yr3_sal = Decimal(temp[3])
    yr4_sal = Decimal(temp[4])
    yr5_sal = Decimal(temp[5])

    c = Player.objects.get(name=player)
    total_guar = (c.signing_bonus + c.yr1_salary)
    if c.years_remaining() == 2:
        salary_list = [yr1_sal, yr2_sal, 0, 0, 0]
    elif c.years_remaining() == 3:
        salary_list = [yr1_sal, yr2_sal, yr3_sal, 0, 0]
    elif c.years_remaining() == 4:
        salary_list = [yr1_sal, yr2_sal, yr3_sal, yr4_sal, 0]
    elif c.years_remaining() == 5:
        salary_list = [yr1_sal, yr2_sal, yr3_sal, yr4_sal, yr5_sal]

    yearly_sb = round(total_guar / c.years_remaining() * 100) / 100
    total_sb = yearly_sb * c.years_remaining()
    
    yr1_total = yr1_sal + Decimal(yearly_sb)
    yr2_total = yr2_sal + Decimal(yearly_sb)
    yr3_total = yr3_sal + Decimal(yearly_sb)
    yr4_total = yr4_sal + Decimal(yearly_sb)
    yr5_total = yr5_sal + Decimal(yearly_sb)

    yr1_total = round(float(yr1_total) * 100) / 100
    yr2_total = round(float(yr2_total) * 100) / 100
    yr3_total = round(float(yr3_total) * 100) / 100
    yr4_total = round(float(yr4_total) * 100) / 100
    yr5_total = round(float(yr5_total) * 100) / 100

    missed_money = int((c.total_value - sum(salary_list) - Decimal(total_sb))*100)
    count = 5
    while missed_money > 0:
        count -= 1
        if count < 0:
            count = 4
        if salary_list[count] != 0:
            missed_money -= 1
            salary_list[count] += Decimal(.01)
    
    salary_string = str(salary_list[0]) + ',' + str(salary_list[1]) + ',' + str(salary_list[2]) + ',' + str(salary_list[3]) + ',' + str(salary_list[4])

    Transaction.objects.create(player=player,
                               date=timezone.now(),
                               team2=c.team,
                               transaction_type='Restructure Contract',
                               var_d1 = c.total_value,
                               var_d2 = yearly_sb,
                               var_i1 = c.years_remaining(),
                               var_i2 = 0,
                               var_t1 = 'Pending',
                               var_t2 = 'Confirmed',
                               var_t3 = salary_string)

    create_alerts('Contract Submitted For Approval', request.user, [player, c.team])

    return JsonResponse('test', safe=False)