# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-05 02:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dyno', '0009_role'),
    ]

    operations = [
        migrations.CreateModel(
            name='AvailableRole',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(max_length=20)),
                ('role', models.CharField(max_length=8)),
            ],
        ),
    ]
