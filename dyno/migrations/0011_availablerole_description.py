# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-05 02:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dyno', '0010_availablerole'),
    ]

    operations = [
        migrations.AddField(
            model_name='availablerole',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
