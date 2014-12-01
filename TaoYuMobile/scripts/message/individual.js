var messageIndividual = new function() {
    var self = this;
    this.contact = null;
    this.messages = [];
    
    this.init = function(e) {
    };
    
    this.show = function(e) {
        self.messages = [];
        var contactId = e.view.params.contactId;     
        self.contact = JSLINQ(messageContacts.contacts).First(function(item) {
            return item.UserId === contactId;
        });
        
        $("#navbar").data("kendoMobileNavBar").title(self.contact.Name);
        
        try {
            self.loadMessages();
        }
        catch (e) {
            alert(e.message);
        }
    };
    
    this.sendButton_click = function(e) {        
        var contactId = self.contact.UserId;
        var messageContent = $("#messageText").val();
        
        var data = {
            ReceivedBy:contactId,
            MessageContent:messageContent
        };
              
        var jqxhr = $.ajax({
                               type: "POST",
                               url: settingsHome.getServerRoot() + "zhihai/MessageIndividual/Send",
                               headers: {"Authorization": "bearer " + login.token},
                               data: data
                           })
            .done(function(data) {                
                var listView = $('#messageListView').data('kendoMobileListView');
                listView.dataSource.read();
                
                $("#messageText").val("");
            })
            .fail(function(j, textStatus, errorThrown) {
                alert(j + "   " + textStatus + "   " + errorThrown);
            })
            .always(function() {
            });
    };
    
    this.receiveButton_click = function(e) {
        var listView = $('#messageListView').data('kendoMobileListView');
        listView.dataSource.read();
    };
    
    this.loadMessages = function() {
        var db = sqlite.db;
        db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM Message_Individual WHERE (SentBy=? and ReceivedBy=?) or (SentBy=? and ReceivedBy=?) ORDER BY SentOn desc LIMIT 100",
                          [login.userId, self.contact.UserId, self.contact.UserId, login.userId],
                          function(tx, res) {
                              console.log(res.rows.length + " rows in db");
                              
                              for (var i = 0; i < res.rows.length; i++) { 
                                  self.messages.push(res.rows.item(i)); 
                              } 
                              
                              var dataSource = new kendo.data.DataSource({
                                                                             transport: {
                                      read: function(options) {
                                          var messageId = "";
                                          if (self.messages.length > 0) {
                                              messageId = self.messages[0].Id;
                                          }
                                          
                                          console.log("client message id:" + messageId);
                    
                                          // make JSONP request to http://demos.telerik.com/kendo-ui/service/products
                                          $.ajax({
                                                     type: "GET",
                                                     url: settingsHome.getServerRoot() + "zhihai/MessageIndividual?contactId={0}&messageId={1}".format(self.contact.UserId, messageId),
                                                     headers: {"Authorization": "bearer " + login.token},
                                                     success: function(result) {
                                                         console.log(JSON.stringify(result));
                                                         
                                                         if (result.length > 0) {
                                                             var db = sqlite.db;
                                                             db.transaction(function(tx) {
                                                                 $.each(result, function(index, value) {
                                                                     tx.executeSql("INSERT INTO Message_Individual (Id, SentBy, SentOn, ReceivedBy, MessageContent) VALUES (?,?,?,?,?)",
                                                                                   [value.Id, value.SentBy, value.SentOn, value.ReceivedBy, value.MessageContent]);
                                                                 });
                                                             }, function(e) {
                                                                 console.log("ERROR: " + e.message);
                                                             });

                                                             console.log(JSON.stringify(self.messages));
                                                             self.messages = result.concat(self.messages);
                                                             console.log(JSON.stringify(self.messages));
                                                             //if (self.messages.length === 0)
                                                             //    self.messages = result;
                                                             //else
                                                             //    self.messages = result.push(self.messages);
                                                         }
                                                         
                                                         options.success(self.messages);
                                                     },
                                                     error: function(result) {
                                                         // notify the data source that the request failed
                                                         alert(result.status);
                                                         options.error(result);
                                                     }
                                                 });
                                      }

                                  }
                                                                         });
    
                              $("#messageListView").kendoMobileListView({
                                                                            dataSource: dataSource,
                                                                            pullToRefresh: true,            
                                                                            template: $("#messageListViewTemplate").text(),
                                                                            pullTemplate: "下拉可以更新...",
                                                                            releaseTemplate: "松开立即更新...",
                                                                            refreshTemplate: "更新中..."
                                                                        });
                          });
        }, function(e) {
            console.log("ERROR: " + e.message);
        });
    }
    
    this.getMessageCss = function(sentBy) {
        var css = "";
        if (sentBy === login.userId) {
            css = "p7-message-right";
        }
        else {
            css = "p7-message-left";
        }
        return css;
    }
};