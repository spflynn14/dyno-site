from django import forms

from .models import *

class BugTrackingForm(forms.ModelForm):

    class Meta:
        model = Bug
        fields = ('user', 'date', 'os', 'browser', 'resolution', 'other_envirn', 'report')
