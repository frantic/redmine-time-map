require 'redmine'


Redmine::Plugin.register :visual_time_plugin do
  name 'Visual Time Plugin'
  author 'Alexander Kotlyarskiy'
  description 'This plugin lets you manage your time entries easily'
  author_url 'http://frantic.im/'

  version '0.0.1'
  requires_redmine :version_or_higher => '0.8.7'
  
  # settings :default => {'list_size' => '5', 'precision' => '2'}, :partial => 'settings/timesheet_settings'

  # permission :see_project_timesheets, { }, :require => :member

  menu(:top_menu,
       :visual_time,
       {:controller => 'visual_time', :action => 'index'},
       :caption => :visual_time_title,
       :if => Proc.new { User.current.logged? })
end
