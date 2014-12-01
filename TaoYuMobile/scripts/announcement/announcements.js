var announcements = new function() {
    var self = this;
    this.contents = {};
    var badge;
    
    this.init = function(e) {
        console.log("announcements");
        var dataSource = new kendo.data.DataSource({
                                                       transport: {
                read: function(options) {
                    // make JSONP request to http://demos.telerik.com/kendo-ui/service/products
                    $.ajax({
                               type: "GET",
                               url: settingsHome.getServerRoot() + "zhihai/AnnouncementUsers",
                               headers: {"Authorization": "bearer " + login.token},
                               success: function(result) {
                                   self.contents = result;
                                   options.success(result);
                               },
                               error: function(result) {
                                   // notify the data source that the request failed
                                   alert(result.status);
                                   options.error(result);
                               }
                               
                           });
                }
            },
            pageSize:8,
            sort:{field:"IssuedOn",dir:"desc"}
                                                   });
    
        $("#announcementListView").kendoMobileListView({
                                                      dataSource: dataSource,
                                                      pullToRefresh: true,            
                                                      template: $("#announcementsListViewTemplate").html(),
                                                      filterable:{autoFilter:true,placeholder:"搜索",field:"Body",ignoreCase:true,operator:"contains"},
                                                      pullTemplate: "下拉可以更新...",
                                                      releaseTemplate: "松开立即更新...",
                                                      refreshTemplate: "更新中...",
                                                      click:self.itemClick
                                                  });
    };
    
    this.itemClick = function(e){
        console.log(e);
        if(e.dataItem.IsReaded) return;
        var data = {
            AnnouncementId:e.dataItem.AnnouncementId,
            UserId:e.dataItem.UserId,
            IsReaded:true
        };
        
        console.log(data);
        $.ajax({
            type:"POST",
            url:settingsHome.getServerRoot() + "zhihai/AnnouncementUsers/Send",
            headers: {"Authorization": "bearer " + login.token},
            data: data
            })
            .done(function(data) {                
                var listView = $('#announcementListView').data('kendoMobileListView');
                listView.dataSource.read();
                self.setBadge(e);
            })
            .fail(function(j, textStatus, errorThrown) {
                alert(j + "   " + textStatus + "   " + errorThrown);
            })
            .always(function() {
            });
    };
    
    this.setBadge = function(e){
        if(0 == badge) return;
        var view = e.sender.view();
        var tabstrip = view.footer.find(".km-tabstrip").data("kendoMobileTabStrip");
        badge = tabstrip.badge(3);
        badge--;
        if(0 == badge)
        {
            tabstrip.badge(3, false);
        }
        else
        {
            tabstrip.badge(3, badge);
        }
    };
    
    this.ParseDate = function(e){
        var today = new Date();
        var issuedOn = kendo.parseDate(e);
        if(issuedOn.getYear() == today.getYear() && issuedOn.getMonth() == today.getMonth() && issuedOn.getDay() == today.getDay()){
            return kendo.toString(issuedOn,"HH:mm tt");
        }
        else
        {
            if(issuedOn.getYear() == today.getYear() && issuedOn.getMonth() == today.getMonth() && (today.getDay() - issuedOn.getDay() == 1))
            return "昨天";
            else
            {
                if((today - issuedOn).Days > 7)
                {
                    return kendo.toString(issuedOn,"YY/MM/dd");
                }
                switch(issuedOn.getDay())
                {
                    case 0:
                        return "星期日";
                        break;
                    case 1:
                        return "星期一";
                        break;
                    case 2:
                        return "星期二";
                        break;
                    case 3:
                        return "星期三";
                        break;
                    case 4:
                        return "星期四";
                        break;
                    case 5:
                        return "星期五";
                        break;
                    case 6:
                        return "星期六";
                        break;
                    default:
                        return kendo.toString(issuedOn,"YY/MM/dd");
                }               
            }
        }
    }
    this.GetBodyPreview = function(e){
        var body = kendo.toString(e);
        if(body.length < 38)
        {
            return body;
        }
        else
        {
            return body.substring(0,38)+'...';
        }
    }
}