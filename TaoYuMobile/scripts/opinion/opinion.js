var opinion = new function() {
    var self = this;
    this.opinion1 = null;
    
    this.init = function(e) {
    };
    
    this.show = function(e) {
        
        var opinionId = e.view.params.opinionId;
        self.opinion1 = JSLINQ(opinionList.opinions).First(function(item) {
            return item.Id === opinionId;
        });
        
        console.log(self.opinion1);
        
        
        $("#opinion_navbar").data("kendoMobileNavBar").title(self.opinion1.Name);
        
        try {
            self.load();
        } catch (e) {
            alert(e.message);
        }
    };
    
    this.refreshButton_click = function(e) {
        self.load();
    };
    
    this.load = function() {
        var opinionId = self.opinion1.Id;        
        var aj = $.ajax({
                          type:"GET",
                          url: settingsHome.getServerRoot() + "zhihai/Opinion?OpinionId={0}".format(opinionId),
                          headers: {"Authorization": "bearer " + login.token}
                      })
        .done(function(data){
            console.log(data);
            $("#opinion_text").text(data.Opinion);
        })
    }
};