# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-09 16:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dyno', '0017_auto_20160106_1110'),
    ]

    operations = [
        migrations.AddField(
            model_name='team',
            name='team_org_view_selected',
            field=models.CharField(default='Default', max_length=30),
        ),
    ]
