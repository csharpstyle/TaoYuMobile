var announcement = new function() {
    var self = this;
    self.content = {};
    
    this.init = function(e){
        
    }
    
    this.show = function(e) {
        var announceId = e.view.params.announceId;
        self.content = JSLINQ(announcements.contents).First(function(item) {
            return item.AnnouncementId === announceId;
        });
        
        $('#IssuedBy').html("通知人："+self.content.IssuedBy);
        $('#Title').html(self.content.Title);
        $('#Body').html(self.content.Body);
        $('#IssuedOn').html(kendo.toString(kendo.parseDate(self.content.IssuedOn),"yyyy年MM月dd日 HH:mm"));
    };
}