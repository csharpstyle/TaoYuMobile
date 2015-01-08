var login = new function() {
    var self = this;
    this.token = "";
    this.userId = "";
    
    this.beforeShow = function(e) {        
        self.token = localStorage.getItem("Token");
        self.userId = localStorage.getItem("UserId");
        if (login.token != null) {
            e.preventDefault();
            app.navigate("views/home.html");
        }
    },
        
    this.loginButton_click = function(e) {
        var userName = $("#userNameText").val();
        var password = $("#password").val();

        if ("" == userName || "" == password) {
            alert("请输入用户名和密码。");
            return;
        }
    
        var jqxhr = $.ajax({
                               type: "POST",
                               url: settingsHome.getServerRoot() + "Token",
                               contentType: "application/x-www-form-urlencoded",
                               data: "grant_type=password&username=" + userName + "&password=" + password
                           })
            .done(function(data) {
                //self.getRegistrationID();
                
                $("#password").val('');
                
                self.token = data.access_token;
                self.userId = data.userId;
                localStorage.setItem("Token", self.token);
                localStorage.setItem("UserId", self.userId);
                app.navigate("views/home.html");
            })
            .fail(function(j, textStatus, errorThrown) {
                //alert(j + "   " + textStatus + "   " + errorThrown);
            })
            .always(function() {
            });
    };
    
    this.getRegistrationID = function() {
        window.plugins.jPushPlugin.getRegistrationID(
            function(data1) {
                var jqxhr = $.ajax({
                                       type: "POST",
                                       url: settingsHome.getServerRoot() + "zhihai/User/Register?notificationId={0}".format(data1),
                                       headers: {"Authorization": "bearer " + login.token}
                                   })
                    .done(function(result) {
                    })
                    .fail(function(j, textStatus, errorThrown) {
                        //alert(j + "   " + textStatus + "   " + errorThrown);
                    })
                    .always(function() {
                    });
            });
    };
};