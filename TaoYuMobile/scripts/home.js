var home = new function() {
    var self = this;
    
    this.init = function() {
        $("#cardRecord").kendoTouch({
                                        tap: function(e) {
                                            app.navigate("views/cardRecord/cardRecord.html");
                                        }
                                    });
        
        $("#message").kendoTouch({
                                     tap: function(e) {
                                         app.navigate("views/message/contacts.html");
                                     }
                                 });
        
        $("#announcement").kendoTouch({
                                          tap: function(e) {
                                              app.navigate("views/announcement/announcements.html");
                                          }
                                      });
    };
    
    this.show = function() {
        var jqxhr = $.ajax({
                               type: "Get",
                               url: settingsHome.getServerRoot() + "zhihai/User/Info",
                               headers: {"Authorization": "bearer " + login.token},
                           })
            .done(function(data) {
                console.log(data);
                $("#nameSpan").text(data.Name);
                $("#classFullNameSpan").text(data.GradeName + data.ClassName);
                $("#schoolNameSpan").text(data.SchoolName);
            })
            .fail(function(j, textStatus, errorThrown) {
                alert(j + "   " + textStatus + "   " + errorThrown);
            })
            .always(function() {
            });
    };

    this.getAnnouncementBadge = function(e){
        console.log("Badge");
         var aj = $.ajax({
                          type:"GET",
                          url:settingsHome.getServerRoot() + "zhihai/AnnouncementUsers/Badge",
                          headers: {"Authorization": "bearer " + login.token}
                      })
        .done(function(data){
            console.log(data);
            var view = e.sender.view();
            var tabstrip = view.footer.find(".km-tabstrip").data("kendoMobileTabStrip");
            if(0 == data)
            {
                tabstrip.badge(3, false);
            }
            else
            {
                //$("#announcementTab").kendoMobileButton({ badge: data })
                tabstrip.badge(3, data);
            }
        })
    };

}