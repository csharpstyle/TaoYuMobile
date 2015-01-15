var examList = new function() {
    var self = this;
    this.exams = {};
    
    this.init = function(e) {
        var dataSource = new kendo.data.DataSource({
                                                       transport: {
                read: function(options) {
                    // make JSONP request to http://demos.telerik.com/kendo-ui/service/products
                    $.ajax({
                               type: "GET",
                               url: settingsHome.getServerRoot() + "zhihai/ExamScore",
                               headers: {"Authorization": "bearer " + login.token},
                               success: function(result) {
                                   self.exams = result;
                                   options.success(result);
                               },
                               fail: function(result) {
                                   // notify the data source that the request failed
                                   //alert(result);
                                   options.error(result);
                               }
                           });
                }
            }
                                                   });
    
        $("#listView").kendoMobileListView({
                                                         dataSource: dataSource,
                                                         pullToRefresh: true,
                                                         template: $("#listViewTemplate").text(),
                                                         pullTemplate: "下拉可以更新...",
                                                         releaseTemplate: "松开立即更新...",
                                                         refreshTemplate: "更新中..."
                                                     });
    };
    
    this.refreshButton_click = function(e) {
        var listView = $('#listView').data('kendoMobileListView');
        listView.dataSource.read();
    };
};