from __future__ import unicode_literals
import sqlite3 as sql3

from django.db import models

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
        return self.total_value/self.years_remaining()

    def current_year_cap_hit(self):
        return self.yr1_salary+self.yr1_sb

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

    def __str__(self):
        return self.internal_name

class Variable(models.Model):
    name = models.CharField(max_length=20)
    text_variable = models.TextField(null=True, blank=True)
    int_variable = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name

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
