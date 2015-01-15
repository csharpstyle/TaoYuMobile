var opinionList = new function() {
    var self = this;
    this.opinions = {};
    
    this.init = function(e) {
        var dataSource = new kendo.data.DataSource({
                                                       transport: {
                read: function(options) {
                    // make JSONP request to http://demos.telerik.com/kendo-ui/service/products
                    $.ajax({
                               type: "GET",
                               url: settingsHome.getServerRoot() + "zhihai/Opinion",
                               headers: {"Authorization": "bearer " + login.token},
                               success: function(result) {
                                   self.opinions = result;
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
    
        $("#opinionList_listView").kendoMobileListView({
                                                         dataSource: dataSource,
                                                         pullToRefresh: true,
                                                         template: $("#opinionList_listViewTemplate").text(),
                                                         pullTemplate: "下拉可以更新...",
                                                         releaseTemplate: "松开立即更新...",
                                                         refreshTemplate: "更新中..."
                                                     });
    };
    
    this.refreshButton_click = function(e) {
        var listView = $('#opinionList_listView').data('kendoMobileListView');
        listView.dataSource.read();
    };
};