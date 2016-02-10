from django import forms

from .models import *

class PlayerForm(forms.ModelForm):
    class Meta:
        model = Player
        fields = ['position',
                  'name',
                  'team',
                  'contract_type',
                  'total_value',
                  'signing_bonus',
                  'salary',
                  'yr1_salary',
                  'yr2_salary',
                  'yr3_salary',
                  'yr4_salary',
                  'yr5_salary',
                  'yr1_sb',
                  'yr2_sb',
                  'yr3_sb',
                  'yr4_sb',
                  'yr5_sb',
                  'notes',
                  'yr1_role',
                  'yr2_role',
                  'yr3_role',
                  'yr4_role',
                  'yr5_role']