/*

<div class="stack-column">
  <ul class="ticket-list">
    <% @issues.each do |issue| %>
    <li class="ticket"><%=h link_to_issue(issue, :truncate => 50) if issue %></li>
    <% end %>
  </ul>
</div>

<% @entries_by_day.keys.sort.each do |day| %>
<div class="day-column">
  <div class="day-header"><%= day %><div><%= html_hours("%.2f" % @entries_by_day[day].sum(&:hours).to_f) %></div></div>
  <ul class="ticket-list">
    <% @entries_by_day[day].each do |entry| %>
    <li class="ticket" style="height: <%= (entry.hours * 60).floor %>px">
        <%=h link_to_issue(entry.issue, :truncate => 50) if entry.issue %> «<%= entry.comments %>» 
        (<span class="time"><%= html_hours("%.2f" % entry.hours) %></span>)
    </li>
    <% end -%>
  </ul>
</div>
<% end -%>


        $(".ticket-list").sortable({
            connectWith: ".ticket-list"
        });

        $(".ticket").resizable({
            grid: 15,
            maxWidth: 200,
            minWidth: 200,
            resize: function(event, ui) {
                var h = ui.element.height() / 60.0;
                ui.element.children('.time').text(h);
            }
        }).disableSelection();

*/

(function($, undefined) {

    function createRecordUI(record) {
        return $("<li class='time-record'></li>").height(record.hours * 60).text(record.comments).data('record', record).resizable({
            grid: 15,
            maxWidth: 200,
            minWidth: 200,
            resize: function(event, ui) {
                var h = ui.element.height() / 60.0;
                ui.element.children('.time').text(h);
            }
        }).disableSelection();
    }

    function createIssueUI(issue) {
        return $("<li class='time-record'></li>").text(issue.subject).draggable({
            connectToSortable: '.time-record-list',
            helper: 'clone',
            revert: 'invalid'
        }).disableSelection();
    }

    function formatDate(date, f){
        var gsMonthNames = new Array(
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        );

        var gsDayNames = new Array(
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        );

        if (!date.valueOf())
            return ' ';

        var d = date;

        return f.replace(/(yyyy|mmmm|mmm|mm|dddd|ddd|dd|hh|nn|ss|a\/p)/gi,
            function($1)
            {
                switch ($1.toLowerCase())
                {
                case 'yyyy': return d.getFullYear();
                case 'mmmm': return gsMonthNames[d.getMonth()];
                case 'mmm':  return gsMonthNames[d.getMonth()].substr(0, 3);
                case 'mm':   return (d.getMonth() + 1);
                case 'dddd': return gsDayNames[d.getDay()];
                case 'ddd':  return gsDayNames[d.getDay()].substr(0, 3);
                case 'dd':   return d.getDate();
                case 'hh':   return ((h = d.getHours() % 12) ? h : 12);
                case 'nn':   return d.getMinutes();
                case 'ss':   return d.getSeconds();
                case 'a/p':  return d.getHours() < 12 ? 'a' : 'p';
                }
            }
        );
    }

    $(document).ready(function() {
        var content = $("#visual_time_content").html("Loading...");
        $.ajax({
            url: '/visual_time/records.json',
            success: function(data) {
                console.log(data);
                content.html("");
                for (var date_str in data.records) {
                    var date = new Date(date_str);
                    var day_column_div = $("<div class='day-column'></div>");
                    var day_column_hdr = $("<div class='day-header'>" + formatDate(date, 'dddd, mmmm dd') + "</div>");
                    var day_column_ul  = $("<ul class='time-record-list'></div>");
                    content.prepend(day_column_div.append(day_column_hdr).append(day_column_ul));

                    var records_for_day = data.records[date_str];
                    records_for_day.each(function (record) {
                        var record_li = createRecordUI(record);
                        day_column_ul.append(record_li);
                    });
                }

                $(".time-record-list").sortable({
                    connectWith: ".time-record-list"
                });
            }
        });
        $.ajax({
            url: '/visual_time/issues.json',
            success: function(data) {
                console.log(data);
                var day_column_div = $("<div class='day-column'></div>");
                var day_column_ul  = $("<ul class='time-record-list'></div>");
                content.prepend(day_column_div);
                data.issues.each(function (issue) {
                    var issue_ui = createIssueUI(issue);
                    day_column_div.append(issue_ui);
                });

            }
        });
    });
})(jQuery);
