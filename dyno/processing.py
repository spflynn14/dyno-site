import os, sys, platform
from django.utils import timezone
from decimal import *
from django.shortcuts import render, redirect, render_to_response
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.template import RequestContext, loader
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, update_session_auth_hash
from .models import *
from .forms import *

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
                   'notes' : a.notes}

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

    a = Variable.objects.get(name='player selected')

    a.text_variable = player_clicked
    a.save()

    return JsonResponse(player_clicked, safe=False)

def unload_player_selected_variable(request):
    a = Variable.objects.get(name='player selected')

    a.text_variable = ''
    a.save()

    return JsonResponse('test', safe=False)

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

    return JsonResponse('test', safe=False)

def team_org_change_team_selected(request):
    a = request.path_info.strip().split('_')
    team_number = int(a[4])

    b = Team.objects.all()
    for x in b:
        if x.id == team_number:
            selected_team = x.internal_name

    c = Variable.objects.get(name='team selected')
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