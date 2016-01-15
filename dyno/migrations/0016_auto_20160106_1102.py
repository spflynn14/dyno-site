# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-06 16:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dyno', '0015_availablerole_unique_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='teams',
            field=models.ManyToManyField(to='dyno.Team'),
        ),
        migrations.AddField(
            model_name='player',
            name='variables',
            field=models.ManyToManyField(to='dyno.Variable'),
        ),
    ]
