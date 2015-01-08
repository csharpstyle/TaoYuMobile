var index = new function() {
    var self = this;
    
    this.showMessage = function(message) {
        $("#messageModalView_message").text(message);
        $("#messageModalView").data("kendoMobileModalView").open();
        setTimeout(function() {
            $("#messageModalView").data("kendoMobileModalView").close();
        }, 3000);
    }
}