from django.conf.urls import url
from . import views
from . import processing

urlpatterns = [
    url(r'^$', views.mainpage, name='main page'),
    url(r'^login$', views.loginpage, name='login'),
    url(r'^perform_login$', views.loginView, name='perform login'),
    url(r'^login_failed$', views.loginfailed, name='login failed'),
    url(r'^logout$', views.logoutView, name='logout'),
    url(r'^main$', views.mainpage, name='main page'),
    url(r'^rules$', views.rulespage, name='rules page'),
    url(r'^message_board$', views.messageboardpage, name='message board'),
    url(r'^draft$', views.draftpage, name='draft page'),
    url(r'^auction$', views.auctionpage, name='auction page'),
    url(r'^auction_bid_confirmation$', views.auctionbidconfirmationpage, name='auction bid confirmation page'),
    url(r'^get_new_auction_data$', processing.get_new_auction_data, name='get data for new auction'),
    url(r'^get_existing_auction_data$', processing.get_existing_auction_data, name='get data for existing auction'),
    url(r'^process_auction_bids$', processing.process_auction_bids, name='process auction bid'),
    url(r'^league/all_players$', views.leagueallplayerspage, name='league page - all players'),
    url(r'^league/extensions$', views.leagueextensions, name='league page - extensions'),
    url(r'^league/free_agents$', views.leaguefreeagents, name='league page - free agents'),
    url(r'^league/salary_lists$', views.leaguesalarylists, name='league page - salary lists'),
    url(r'^league/adp_info$', views.leagueadp, name='league page - adp info'),
    url(r'^league/performance_info$', views.performancepage, name='league page - performance info'),
    url(r'^draft/future_draft_picks$', views.leaguefuturedraftpicks, name='draft - future draft picks'),
    url(r'^league/cap_summary$', views.leaguecapsummary, name='league page - cap summary'),
    url(r'^settings$', views.settingspage, name='settings page'),
    url(r'^batch$', views.batchpage, name='batch page'),
    url(r'^process_player_contract_batch$', views.processplayercontractsbatch, name='process player contracts batch'),
    url(r'^process_salary_lists_batch$', views.processsalarylistsbatch, name='process salary lists batch'),
    url(r'^process_adp$', processing.process_adp, name='process adp batch'),
    url(r'^process_performance_yr1$', processing.process_performance_yr1, name='process performance yr1 batch'),
    url(r'^process_performance_yr2$', processing.process_performance_yr2, name='process performance yr2 batch'),
    url(r'^reset_all_roles$', views.resetallroles, name='reset all roles'),
    url(r'^reset_available_roles$', views.resetavailableroles, name='reset available roles'),
    url(r'^create_drafts$', processing.create_drafts, name='create drafts'),
    url(r'^create_team_variable$', processing.create_team_variable, name='create team variable'),
    url(r'^change_team_name$', processing.change_team_name, name='change team name'),
    url(r'^player$', views.playerpage, name='player page'),
    url(r'^player_processing_1$', processing.player_processing_1, name='player processing 1'),
    url(r'^player_processing_2$', processing.player_processing_2, name='player processing 2'),
    url(r'^player_processing_3$', processing.player_processing_3, name='player processing 3'),
    url(r'^team/organization$', views.teamorganizationpage, name='team organization page'),
    url(r'^team_org_processing_save_flex$', processing.team_org_processing_save_flex, name='team org processing - save flex change'),
    url(r'^team_org_processing_save_role_change$', processing.team_org_processing_role_change, name='team org processing - save role change'),
    url(r'^team/cap_situation$', views.teamcapsituationpage, name='team organization page'),
    url(r'^team/team_settings$', views.teamsettingspage, name='team organization page'),
    url(r'^team/pending_transactions$', views.teampendingtransactionspage, name='team pending transactions page'),
    url(r'^team/transactions$', views.teamtransactionspage, name='team transactions page'),
    url(r'^team/release_players$', views.teamreleaseplayerspage, name='team release players page'),
    url(r'^team/alerts$', views.teamalertspage, name='team alerts page'),
    url(r'^team/manage_alerts$', views.teammanagealerts, name='team manage alerts page'),
    url(r'^team/trade$', views.teamtrades, name='team view assets/trades'),
    url(r'^test$', views.testview, name='testing'),
    url(r'^test_function$', processing.test_perform, name='testing performing a function'),
    url(r'^test_function2$', processing.test_perform2, name='testing performing a function #2'),
    url(r'^test_function3$', processing.test_perform3, name='testing performing a function #3'),
    url(r'^store_player_selected_redirect_to_playerpage$', processing.store_player_selected_redirect_to_playerpage, name='store player selected and redirect to player page'),
    url(r'^unload_team_selected_variable$', processing.unload_team_selected_variable, name='unload Variable team_selected'),
    url(r'^team_org_store_view_selected$', processing.team_org_store_view_selected, name='store which team view is selected'),
    url(r'^team/team_org_change_team_\d{1,2}$', processing.team_org_change_team_selected, name='changing which team is selected in team organization page'),
    url(r'^user_change_password$', views.user_change_password_page, name='user change username and password'),
    url(r'^verify_password_change$', processing.verify_password_change, name='verify password change'),
    url(r'^verify_username_change$', processing.verify_username_change, name='verify user change'),
    url(r'^change_team_settings$', processing.change_team_settings, name='verify user change'),
    url(r'^team_cap_save_role_change$', processing.team_cap_save_role_change, name='save role change in team cap situation page'),
    url(r'^bug_tracking$', views.bugtrackingpage, name='bug tracking page'),
    url(r'^new_bug$', views.newbugpage, name='new bug submission'),
    url(r'^save_new_bug$', processing.save_new_bug, name='save new bug submission'),
    url(r'^feature_request$', views.featurerequestpage, name='request new feature'),
    url(r'^process_feature_request$', processing.process_feature_request, name='process feature request'),
    url(r'^save_team_settings_player_filters$', processing.save_team_settings_player_filters, name='save player filter info when leaving team settings'),
    url(r'^feature_list$', views.featurelistchangelogpage, name='feature list and changelog'),
    url(r'^commish_office$', views.commishofficepage, name="commish's office"),
    url(r'^commish/view_model$', views.commishviewmodel, name='view model'),
    url(r'^commish/edit_player$', views.commisheditmodel, name='edit model'),
    url(r'^get_player_for_edit_model$', processing.get_player_for_edit_model, name='get player for edit model player'),
    url(r'^commish/transactions$', views.commishtransactionpage, name='transaction view - commish'),
    url(r'^commish/pending_transactions$', views.commishpendingtransactionspage, name='pending transaction view - commish'),
    url(r'^commish/pending_alerts$', views.commishpendingalerts, name='commish pending alerts'),
    url(r'^commish/all_alerts$', views.commishallalerts, name='commish all alerts'),
    url(r'^set_contract_structure$', views.setcontractstructurepage, name='set contract structure'),
    url(r'^set_player_for_contract_structure$', processing.set_player_for_contract_structure, name='set player for contract structure'),
    url(r'^submit_contract_structure$', processing.submit_contract_structure, name='submit contract structure'),
    url(r'^submit_extension_structure$', processing.submit_extension_structure, name='submit extension structure'),
    url(r'^transaction_single_player$', views.transactionsingleplayer, name='transaction - single player'),
    url(r'^transaction_cut$', views.transactioncut, name='transaction - cut'),
    url(r'^transaction_trade$', views.transactiontrade, name='transaction - trade'),
    url(r'^get_data_for_transaction_single_player$', processing.get_data_for_transaction_single_player, name='get data for transaction - single player'),
    url(r'^save_transaction_single_player$', processing.save_transaction_single_player, name='save for transaction - single player'),
    url(r'^send_test_email$', processing.send_test_email, name='send test email'),
    url(r'^save_team_manage_alerts$', processing.save_team_manage_alerts, name='save team manage alerts'),
    url(r'^save_default_auction_clock$', processing.save_default_auction_clock, name='save default auction clock'),
    url(r'^save_new_auctions_switch$', processing.save_new_auctions_switch, name='save new auction flag'),
    url(r'^save_include_impending_flag$', processing.save_include_impending_flag, name='save include impending free agents flag'),
    url(r'^team/tags$', views.tagspage, name='waiver extensions, franchise tags, transition tags'),
    url(r'^team/confirm_tags$', views.confirm_tags, name='waiver extensions, franchise tags, transition tags - confirm submissions'),
    url(r'^store_tags_selected_player$', processing.store_tags_selected_player, name='store player selected from tags page'),
    url(r'^process_tags$', processing.process_tags, name='process tags submissions'),
    url(r'^get_extension_info$', processing.get_extension_info, name='get extension info'),
    url(r'^confirm_extension_structure$', views.confirmextensionstructure, name='confirm extension structure'),
    url(r'^save_extension_switch$', processing.save_extension_switch, name='save extension switch state'),
    url(r'^save_commish_periodic$', processing.save_commish_periodic, name='save commish periodic alerts state'),
    url(r'^save_cut_season$', processing.save_cut_season, name='save cut season state'),
    url(r'^save_data_cut_player$', processing.save_data_cut_player, name='save data from cut player - player page'),
    url(r'^save_transaction_cut$', processing.save_transaction_cut, name='process transaction - cut player'),
    url(r'^save_transaction_trade$', processing.save_transaction_trade, name='process transaction - trade'),
    url(r'^confirm_cut_players$', views.confirmcutplayers, name='confirm cut players'),
    url(r'^process_cuts$', processing.process_cuts, name='process cut players'),
    url(r'^configure_draft$', processing.configure_draft, name='configure draft'),
    url(r'^load_trade_opp_data$', processing.load_trade_opp_data, name='load opponent data on trade page'),
    url(r'^save_trade_data$', processing.save_trade_data, name='save trade data'),
    url(r'^confirm_trade$', views.confirmtradepage, name='confirm trade'),
    url(r'^process_trade$', processing.process_trade, name='process trade'),
    url(r'^get_trade_data_for_alerts$', processing.get_trade_data_for_alerts, name='ajax request to pull trade data for alert details'),
    url(r'^get_verbose_trade_data$', processing.get_verbose_trade_data, name='ajax request to pull verbose trade data for trade log'),
    url(r'^team/trade_log$', views.teamtradelogpage, name='team trade log page'),
    url(r'^save_redirect_trade_data$', processing.save_redirect_trade_data, name='save redirect info to move to trade confirm screen'),
    url(r'^retrieve_ownership_info_trade_transaction$', processing.retrieve_ownership_info_trade_transaction, name='get ownership info to display after trade processing'),
]