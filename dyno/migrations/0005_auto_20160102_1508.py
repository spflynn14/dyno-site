# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-02 20:08
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dyno', '0004_messages'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Messages',
            new_name='Message',
        ),
    ]
