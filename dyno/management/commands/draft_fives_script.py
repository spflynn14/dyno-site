from django.core.management.base import BaseCommand, CommandError
from dyno.processing import check_draft_clocks
from django.core.mail import send_mail

debug = True

class Command(BaseCommand):
    help = "This is my 'run every 10 minutes script'"

    def handle(self, *args, **options):

        if debug == False:
            try:
                check_draft_clocks()
                self.stdout.write(self.style.SUCCESS('Successfully ran script'))
            except:
                target_email = 'spflynn0@gmail.com'
                subject_line = '[Script Failed]'
                email_body = 'The draft fives script failed.'
                send_mail(subject_line,
                          email_body,
                          '',
                          [target_email],
                          fail_silently=False)
        else:
            check_draft_clocks()
            self.stdout.write(self.style.SUCCESS('Successfully ran script'))
