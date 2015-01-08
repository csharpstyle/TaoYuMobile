var settingsHome = new function() {
    var self = this;
    
    this.init = function() {
        var serverRoot = self.getServerRoot();
        $("#serverRootText").val(serverRoot);
    };
    
    this.saveButton_click = function() {
        var serverRoot = $("#serverRootText").val();
        if ("" === serverRoot) {
            alert("请输入服务地址。");
            return;
        }
        
        localStorage.setItem("ServerRoot", serverRoot);
        app.navigate("views/login.html");
    };
    
    this.logoutButton_click = function() {
        localStorage.removeItem("Token");
        app.navigate("views/login.html");
    };
    
    this.getServerRoot = function() {        
        var serverRoot = localStorage.getItem("ServerRoot");
        if (null === serverRoot) {
            //serverRoot = "http://192.168.1.39/TaoYu/";
            serverRoot = "http://58.241.86.60:82/WebAPIs/";
        }
    
        return serverRoot;
    };
}