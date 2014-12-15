var messageContacts = new function() {
    var self = this;
    this.contacts = {};
    
    this.init = function(e) {
        var dataSource = new kendo.data.DataSource({
                                                       transport: {
                read: function(options) {
                    // make JSONP request to http://demos.telerik.com/kendo-ui/service/products
                    $.ajax({
                               type: "GET",
                               url: settingsHome.getServerRoot() + "zhihai/MessageContacts",
                               headers: {"Authorization": "bearer " + login.token},
                               success: function(result) {
                                   self.contacts = result;
                                   options.success(result);
                               },
                               error: function(result) {
                                   // notify the data source that the request failed
                                   alert(result);
                                   console.log(result);
                                   options.error(result);
                               }
                               
                           });
                }
            }
                                                   });
    
        $("#contactListView").kendoMobileListView({
                                                      dataSource: dataSource,
                                                      pullToRefresh: true,            
                                                      template: $("#contactListViewTemplate").text(),
                                                      pullTemplate: "下拉可以更新...",
                                                      releaseTemplate: "松开立即更新...",
                                                      refreshTemplate: "更新中..."
                                                  });
        //setTimeout(self.aaa, 3000);
    };
    
    this.getContactTypeString = function(contactType) {
        var result;
        switch (contactType) {
            case 0:
                result = "家长";
                break;
            case 1:
                result = "老师";
                break;
            default:
                result = "";
        }
        return result;
    };
    
    this.aaa = function() {
        alert("aaa");
        var bbb = $('#contactListView').data('kendoMobileListView');
        bbb.dataSource.read();   // added line
        //bbb.refresh();
    };
}