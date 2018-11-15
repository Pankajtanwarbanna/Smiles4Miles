// console.log("hi from login route");

angular.module('mainController',['authServices'])

.controller('mainCtrl',function(Auth,$timeout,$location,AuthToken,$rootScope){
    var app=this;

    app.isLoggedIn = false;

    $rootScope.$on('$routeChangeStart',function(event, next, current){

        app.isHomePage = false;

        if(next.$$route) {
            //console.log('we are not at home page');
            app.isHomePage = false;
        } else {
            app.isHomePage = true;
        }

        if(Auth.isLoggedIn()){
            //console.log('hi');
            app.isLoggedIn = true;
            Auth.getUser().then(function(data){
                if(data.data.role === 'donator'){
                    app.isDonator = true;
                }
                else if(data.data.role === 'receiver'){
                    app.isReceiver = true;
                }
                else{
                    app.isDonator = true;
                    app.isReceiver = true;
                }
                //console.log(data);
                app.username=data.data.username;
            });
        }
        else {
            console.log("Not logged in");
            app.isLoggedIn = false;
            app.username="";
        }
    });

    this.google=function(){
        $window.location=$window.location.protocol+'//'+ $window.loaction.host + '/auth/google'
    };

    this.dologin = function(loginData) {
        //console.log('hi');
        app.loading=true;
        app.errMsg = false;
        app.successMsg=false;
        app.expired = false;
        //console.log(loginData);

        Auth.login(app.loginData).then(function (data) {
            //console.log(data);
            if(data.data.success)
            {
                app.loading=false;
                app.successMsg = data.data.message + ' Redirecting.....';
                $timeout(function() {
                    $location.path('/about');
                },1500);

                app.loginData="";
            }
            else {
                if(data.data.expired){

                    app.expired = true;
                    app.loading = false;
                    app.errMsg = data.data.message;
                }
                else {
                    app.errMsg = data.data.message;
                    app.loading=false;
                }
            }
        })
    };

    this.logout=function(){
        Auth.logout();
        $location.path('/logout');
        $timeout(function(){
            $location.path('/');
        },2000);
    };

})

.controller('facebookCtrl',function($routeParams,Auth) {
    console.log($routeParams.token);
    Auth.facebook($routeParams.token);
    $location.path('/');
//     var app=this;
//     if($window.loaction.pathname == '/googleerror'){
//         app.errorMsg="Gmail email not found in database";
//     }
//     else{
//         Auth.google($routeParams.token);
//         $location.path('/');
//     }
})

.controller('googleCtrl',function($routeParams,Auth,$location) {
    console.log($routeParams.token);
    Auth.google($routeParams.token);
    $location.path('/');
//     var app=this;
//     if($window.loaction.pathname == '/googleerror'){
//         app.errorMsg="Gmail email not found in database";
//     }
//     else{
//         Auth.google($routeParams.token);
//         $location.path('/');
//     }
});