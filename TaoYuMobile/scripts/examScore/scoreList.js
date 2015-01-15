var scoreList = new function() {
    var self = this;
    this.exam = null;
    
    this.init = function(e) {
    };
    
    this.show = function(e) {
        var examScoreId = e.view.params.examScoreId;
        self.exam = JSLINQ(examList.exams).First(function(item) {
            return item.Id === examScoreId;
        });
        
        $("#navbar11").data("kendoMobileNavBar").title(self.exam.Name);
        
        try {
            self.load();
        } catch (e) {
            alert(e.message);
        }
    };
    
    this.refreshButton_click = function(e) {
        var listView = $('#listView').data('kendoMobileListView');
        listView.dataSource.read();
    };
    
    this.load = function() {
        var examScoreId = self.exam.Id;
                              
        var dataSource = new kendo.data.DataSource({
                                                       transport: {
                read: function(options) {                    
                    // make JSONP request to http://demos.telerik.com/kendo-ui/service/products
                    $.ajax({
                               type: "GET",
                               url: settingsHome.getServerRoot() + "zhihai/ExamScore/Scores?ExamScoreId={0}".format(examScoreId),
                               headers: {"Authorization": "bearer " + login.token},
                               success: function(result) {
                                   console.log(JSON.stringify(result));
                                   options.success(result.Scores);
                               },
                               error: function(result) {
                                   // notify the data source that the request failed
                                   //alert(result.status);
                                   options.error(result);
                               }
                           });
                }
            }
                                                   });
    
        $("#listView11").kendoMobileListView({
                                               dataSource: dataSource,
                                               pullToRefresh: true,            
                                               template: $("#listViewTemplate11").text(),
                                               pullTemplate: "下拉可以更新...",
                                               releaseTemplate: "松开立即更新...",
                                               refreshTemplate: "更新中..."
                                           });
    }
};