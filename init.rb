require 'redmine'


Redmine::Plugin.register :time_map_plugin do
  name 'Time Map Plugin'
  author 'Alexander Kotlyarskiy'
  description 'This plugin lets you manage your time entries easily'
  author_url 'http://frantic.im/'

  version '0.0.2'
  requires_redmine :version_or_higher => '1.0.0'

  menu(:top_menu,
       :visual_time,
      {:controller => 'time_map', :action => 'index'},
       :caption => :time_map_title,
       :if => Proc.new { User.current.logged? })
end
