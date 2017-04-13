from django.core.management.base import BaseCommand, CommandError
from dyno.processing import auction_end_routine, periodic_alerts_routine, commish_pending_transactions_routine, check_expired_trades, check_expired_set_contracts, check_draft_clocks
from django.core.mail import send_mail

debug = True

class Command(BaseCommand):
    help = "This is my 'run every 10 minutes script'"

    def handle(self, *args, **options):

        if debug == False:
            try:
                check_draft_clocks()
                auction_end_routine()
                periodic_alerts_routine()
                commish_pending_transactions_routine()
                check_expired_trades()
                check_expired_set_contracts()
                self.stdout.write(self.style.SUCCESS('Successfully ran script'))
            except:
                target_email = 'spflynn0@gmail.com'
                subject_line = '[Script Failed]'
                email_body = 'The auction end script failed.'
                send_mail(subject_line,
                          email_body,
                          '',
                          [target_email],
                          fail_silently=False)
        else:
            check_draft_clocks()
            auction_end_routine()
            periodic_alerts_routine()
            commish_pending_transactions_routine()
            check_expired_trades()
            #check_expired_set_contracts()
            self.stdout.write(self.style.SUCCESS('Successfully ran script'))
