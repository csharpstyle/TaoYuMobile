var app;

(function () {
    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    // create an object to store the models for each view
    window.APP = {
        models: {
            home: {
                    title: 'Home'
                },
            settings: {
                    title: 'Settings'
                },
            contacts: {
                    title: 'Contacts',
                    ds: new kendo.data.DataSource({
                                                      data: [{ id: 1, name: 'Bob' }, { id: 2, name: 'Mary' }, { id: 3, name: 'John' }]
                                                  }),
                    alert: function(e) {
                        alert(e.data.name);
                    }
                }
        }
    };

    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {  
        // hide the splash screen as soon as the app is ready. otherwise
        // Cordova will wait 5 very long seconds to do it for you.
        //navigator.splashscreen.hide();
        var skin;
        skin = ("android" == kendo.support.mobileOS.device) ? "flat" : "";

        app = new kendo.mobile.Application(document.body, {
        
                                               // you can change the default transition (slide, zoom or fade)
                                               transition: 'slide',
        
                                               // comment out the following line to get a UI which matches the look
                                               // and feel of the operating system
                                               skin: skin,

                                               // the application needs to know which view to load first
                                               initial: 'views/login.html'
                                           });
        
        sqlite.openDb();
        sqlite.dropTables();
        sqlite.createTables();
        
        //window.plugins.jPushPlugin.receiveMessageInAndroidCallback = function(data1) {
        //    alert("!!!!!!!!!!" + data1);
        //};
        
        //window.plugins.jPushPlugin.openNotificationInAndroidCallback = function(data1) {
        //    alert(data1);
        //};
        
        $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
            console.log(event);
            console.log(jqxhr);
            console.log(settings);
            console.log(thrownError);
            index.showMessage("您的网络好像不太给力，请稍后再试。");
        });
        
    }, false);
}());

String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};