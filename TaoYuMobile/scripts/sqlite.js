var sqlite = new function() {
    var self = this;
    this.db = null;
    
    this.openDb = function() { 
        if (window.navigator.simulator === true) { 
            // For debugin in simulator fallback to native SQL Lite 
            console.log("Use built in SQL Lite"); 
            self.db = window.openDatabase("TaoYu", "1.0", "Cordova Demo", 200000); 
        } 
        else { 
            self.db = window.sqlitePlugin.openDatabase("TaoYu"); 
        } 
    };
        
    this.createTables = function() { 
        var db = self.db; 
        db.transaction(function(tx) { 
            tx.executeSql("CREATE TABLE IF NOT EXISTS Message_Individual(Id TEXT PRIMARY KEY ASC, SentBy TEXT, SentOn DATETIME, ReceivedBy TEXT, MessageContent TEXT)", []); 
        }, function(e) {
            alert("ERROR: " + e.message);
        });
    };
    
    this.dropTables = function() { 
        var db = self.db; 
        db.transaction(function(tx) { 
            tx.executeSql("DROP TABLE IF EXISTS Message_Individual", []); 
        }, function(e) {
            alert("ERROR: " + e.message);
        });
    };
    
    this.onError = function(tx, e) { 
        alert("Error: " + e.message); 
    };
}