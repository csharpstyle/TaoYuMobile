var cardRecord = new function() {
    var self = this;
    var date;
    var dataSource;
    
    this.init = function(e) {
        date = new Date();
        
        dataSource = new kendo.data.DataSource({
                                                       transport: {
                read: function(options) {
                    // make JSONP request to http://demos.telerik.com/kendo-ui/service/products
                    $.ajax({
                               type: "GET",
                               url: settingsHome.getServerRoot() + "zhihai/CardRecord/Student?Date=" + kendo.toString(date, "yyyy/MM/dd"),
                               headers: {"Authorization": "bearer " + login.token},
                               success: function(result) {
                                   $.each(result, function(index, value) {
                                       value["Group"] = kendo.toString(kendo.parseDate(value.RecordedOn), "yyyy/MM/dd");
                                   });
                                   
                                   options.success(result);
                               },
                               fail: function(result) {
                                   // notify the data source that the request failed
                                   //alert(result);
                                   options.error(result);
                               }
                           });
                }
            },
                                                       group: { field: "Group", dir: "desc" }
                                                   });
    
        $("#cardRecordListView").kendoMobileListView({
                                                         dataSource: dataSource,
                                                         pullToRefresh: true,            
                                                         template: $("#cardRecordListViewTemplate").text(),
                                                         headerTemplate: $("#cardRecordListViewHeaderTemplate").text(),
                                                         pullTemplate: "下拉可以更新...",
                                                         releaseTemplate: "松开立即更新...",
                                                         refreshTemplate: "更新中..."
                                                     });
    };
    
    this.getActionTypeString = function(actionType) {
        var actionTypeString = "";
        switch (actionType) {
            case 0:
                actionTypeString = "离校";
                break;
            case 1:
                actionTypeString = "进校";
                break;
        }
        
        return actionTypeString;
    };
    
    this.receiveButton_click = function(e) {
        var listView = $('#cardRecordListView').data('kendoMobileListView');
        listView.dataSource.read();
    };
    
    this.searchButton_click = function(e) {
        var today = new Date();
        $("#cardRecord_searchModalView").data("kendoMobileModalView").open();
        $('#cardRecord_searchModalView_date').val(kendo.toString(today, 'yyyy-MM-dd'));
    };
    
    this.searchModalView_close = function(e) {
        $("#cardRecord_searchModalView").kendoMobileModalView("close");
    }
    
    this.searchModalView_ok = function(e) {
        var searchDate = $("#cardRecord_searchModalView_date").val();
        if ("" === searchDate) {
            alert("请选择考勤日期。");
            return;
        }
        
        $("#cardRecord_searchModalView").kendoMobileModalView("close");
        date = searchDate;
        dataSource.read();
    }
};