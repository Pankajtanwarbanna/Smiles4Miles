//console.log("Testing main page");

angular.module('userApp',['appRoutes','userControllers','userServices','mainController','authServices','emailController'])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
});