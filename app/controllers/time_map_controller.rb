class TimeMapController < ApplicationController
  unloadable

  def index
  end

  def records
    sql_period = 40
    @user = User.current
    @entries = TimeEntry.find(:all,
        :conditions => ["#{TimeEntry.table_name}.user_id = ? AND #{TimeEntry.table_name}.spent_on BETWEEN ? AND ?", @user.id, Date.today - sql_period, Date.today],
        :include => [:activity, :project, {:issue => [:tracker, :status]}],
        :order => "#{TimeEntry.table_name}.spent_on DESC, #{Project.table_name}.name ASC, #{Tracker.table_name}.position ASC, #{Issue.table_name}.id ASC")

    respond_to do |format|
      format.html
      format.json { render :json => @entries }
    end
  end

  def issues
    @issues = Issue.open
    respond_to do |format|
      format.json { render :json => {:issues => @issues } }
    end
  end
end