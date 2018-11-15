angular.module('emailController',['userServices'])

.controller('emailCtrl',function($routeParams,User,$timeout,$location){

    var app = this;

    console.log('testing');
    //console.log($routeParams.token);
    User.activateAccount($routeParams.token).then(function(data){

        app.successMsg = false;
        app.errorMsg=false;


        console.log(data);

        if(data.data.success){
            app.successMsg = data.data.message + ' Redirecting.......';
            $timeout(function() {
                $location.path('/login');
            },3000);
        }
        else{
            app.errorMsg = data.data.message + '  Redirecting.......';
            $timeout(function() {
                $location.path('/login');
            },3000);
        }
    })
})

.controller('resendCtrl',function(User){

    var app = this;

    //console.log('testing');
    app.checkCredentials = function(loginData) {

        app.errorMsg = false;
        app.successMsg = false;
        app.linksent = false;

        User.checkCredentials(app.loginData).then(function(data) {
            console.log(data);

            if(data.data.success){
                User.resendLink(app.loginData).then(function(data){
                    if(data.data.success){
                        app.linksent = true;
                        app.successMsg = data.data.message;
                    }
                })
            }
            else{
                app.errorMsg = data.data.message;
            }
        });
    };
})

.controller('usernameCtrl',function(User){

    var app = this;

    //console.log('testing username');
    app.resetUsername = function(loginData) {

        app.errorMsg = false;
        app.successMsg = false;
        app.sent = false;

        User.resetUsername(app.loginData).then(function(data) {
            console.log(data);

            if(data.data.success){

                app.sent = true;
                app.successMsg = data.data.message;
            }
            else{
                app.errorMsg = data.data.message;
            }
        });
    }
})

.controller('passwordCtrl',function(User){

    var app = this;


    app.errorMsg = false;
    app.successMsg = false;
    app.sent = false;

    //console.log('testing password');
    app.resetPassword = function(loginData) {


        User.resetPassword(app.loginData).then(function(data) {
            console.log(data);

            if(data.data.success){

                app.sent = true;
                app.successMsg = data.data.message;
            }
            else{
                app.errorMsg = data.data.message;
            }
        });
    }

})

.controller('changepasswordCtrl', function (User , $routeParams) {
    console.log('testing');
    var app = this;

    app.errorMsg = false;
    app.successMsg = false;
    app.sent = false;
    var logObj = {};

    app.resetPassword = function (loginData) {

        logObj.password = app.loginData.password;
        logObj.token = $routeParams.token;

        console.log(logObj);
        User.changepassword(logObj).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.successMsg = data.data.message;
            } else {
                app.errorMsg = data.data.message;
            }
        });
    }
});