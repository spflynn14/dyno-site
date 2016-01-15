# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2015-12-30 20:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dyno', '0002_auto_20151230_1532'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='notes',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='yr2_salary',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='yr2_sb',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='yr3_salary',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='yr3_sb',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='yr4_salary',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='yr4_sb',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='yr5_salary',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='yr5_sb',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
    ]
