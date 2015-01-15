var pollVote = new function() {
    var self = this;
    this.poll = null;
    this.votes = [];
    this.isVoted = false;
    
    this.init = function(e) {
    };
    
    this.show = function(e) {        
        var pollId = e.view.params.pollId;
        self.poll = JSLINQ(pollList.polls).First(function(item) {
            return item.Id === pollId;
        });
        
        $("#pollVote_title").text(self.poll.Title);
        
        try {
            self.load();
        } catch (e) {
            alert(e.message);
        }
    };
    
    this.voteButton_click = function(e) {
        var pollId = self.poll.Id;        
        var data = {
            PollId: pollId,
            Votes: self.votes
        };
              
        var jqxhr = $.ajax({
                               type: "POST",
                               url: settingsHome.getServerRoot() + "zhihai/Poll/Vote",
                               headers: {"Authorization": "bearer " + login.token},
                               data: data
                           })
            .done(function(data) {
                var listView = $('#pollVote_listView').data('kendoMobileListView');
                listView.dataSource.read();
                alert("投票成功");
                $("#pollVote_voteButton").data("kendoMobileButton").enable(false);
            })
            .fail(function(j, textStatus, errorThrown) {
                //alert(j + "   " + textStatus + "   " + errorThrown);
            })
            .always(function() {
            });
    };
    
    this.switchChange = function(e) {
        var vote = e.sender.element.data("vote");
        if (e.checked) {
            if ($.inArray(vote, self.votes) < 0) {
                self.votes.push(vote);
            }
        } else {
            if ($.inArray(vote, self.votes) >= 0) {
                self.votes.splice($.inArray(vote, self.votes), 1);
            }
        }
        
        $("#pollVote_voteButton").data("kendoMobileButton").enable(self.votes.length > 0);
    }
    
    this.load = function() {
        var pollId = self.poll.Id;
        var dataSource = new kendo.data.DataSource({
                                                       transport: {
                read: function(options) {                    
                    // make JSONP request to http://demos.telerik.com/kendo-ui/service/products
                    $.ajax({
                               type: "GET",
                               url: settingsHome.getServerRoot() + "zhihai/Poll?pollId=" + pollId,
                               headers: {"Authorization": "bearer " + login.token},
                               success: function(result) {
                                   //console.log(JSON.stringify(result));
                                   $("#pollVote_body").text(result.PollBody);
                                   self.isVoted = result.IsVoted;
                                   $("#pollVote_voteButton").data("kendoMobileButton").enable(!result.IsVoted);

                                   options.success(result.PollOptions);
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
    
        $("#pollVote_listView").kendoMobileListView({
                                                        dataSource: dataSource,
                                                        pullToRefresh: true,            
                                                        template: $("#pollVote_listViewTemplate").text(),
                                                        pullTemplate: "下拉可以更新...",
                                                        releaseTemplate: "松开立即更新...",
                                                        refreshTemplate: "更新中..."
                                                    });
    }
};