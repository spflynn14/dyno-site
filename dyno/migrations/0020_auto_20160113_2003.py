# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-14 01:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dyno', '0019_bug_requestedfeature'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bug',
            name='browser',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='bug',
            name='os',
            field=models.TextField(),
        ),
    ]
