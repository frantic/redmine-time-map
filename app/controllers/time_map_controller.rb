class TimeMapController < ApplicationController
  unloadable

  def index
  end

  def records
    sql_period = 20
    @user = User.current
    @entries = TimeEntry.find(:all,
        :conditions => ["#{TimeEntry.table_name}.user_id = ? AND #{TimeEntry.table_name}.spent_on BETWEEN ? AND ?", @user.id, Date.today - sql_period, Date.today],
        :include => [:activity, :project, {:issue => [:tracker, :status]}],
        :order => "#{TimeEntry.table_name}.spent_on DESC, #{Project.table_name}.name ASC, #{Tracker.table_name}.position ASC, #{Issue.table_name}.id ASC")
    @entries_by_day = @entries.group_by(&:spent_on)

    respond_to do |format|
      format.html
      format.json { render :json => {:records => @entries_by_day } }
    end
  end

  def issues
    @issues = Issue.open
    respond_to do |format|
      format.json { render :json => {:issues => @issues } }
    end
  end
end