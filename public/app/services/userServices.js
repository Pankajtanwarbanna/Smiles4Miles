// console.log('services');
angular.module('userServices',[])

.factory('User',function($http){
    userFactory={};

    userFactory.create = function(regData){
        return $http.post('/api/users',regData);
    };

    // userFactory.checkUsername = function(regData){
    //     return $http.post('/api/checkusername',regData);
    // },
    // userFactory.checkEmail = function(regData){
    //     return $http.post('/api/checkemail',regData);
    // }

    userFactory.activateAccount = function(token){
        return $http.put('/api/activate/' + token);
    };

    userFactory.checkCredentials = function(loginData){
        //console.log(logData);
        return $http.post('/api/resend',loginData);
    };

    userFactory.resendLink = function(username){
        //console.log(logData);
        return $http.put('/api/sendlink',username);
    };

    userFactory.resetUsername = function(email){
        //console.log(logData);
        return $http.post('/api/resetusername',email);
    };

    userFactory.resetPassword = function(email){
        console.log(email);
        return $http.post('/api/resetpassword',email);
    };

    // change password
    userFactory.changepassword = function(logObj) {
        return $http.put('/api/changepassword', logObj);
    };

    userFactory.donaterawfood = function(rawfoodData){
        //console.log(logData);
        return $http.post('/api/donaterawfood',rawfoodData);
    };

    userFactory.donateCookedFood = function(foodData){
        //console.log(logData);
        return $http.post('/api/donateCookedFood',foodData);
    };

    userFactory.donaterequests = function(){
        //console.log(logData);
        return $http.get('/api/donaterequests');
    };

    userFactory.readdonaterequest = function (id) {
        return $http.get('/api/readdonaterequest/'+id);
    };

    userFactory.donators = function () {
        return $http.get('/api/donators');
    };

    userFactory.receivers = function () {
        return $http.get('/api/receivers');
    };

    userFactory.volunteers = function () {
        return $http.get('/api/volunteers');
    };

    userFactory.addtocart = function (id) {
        //console.log(id);
        return $http.post('/api/addtocart/'+ id);
    };

    userFactory.cart = function () {
        return $http.get('/api/cart');
    };

    userFactory.addnewproduct = function (Data) {
        return $http.post('/api/addnewproduct',Data);
    };

    userFactory.displayproduct = function(){
      return $http.get('/api/displayproduct');
    };

    userFactory.accept = function (id) {
        //console.log(id);
        return $http.put('/api/accept/'+id);
    };

    userFactory.searchAccepted = function () {
        return $http.get('/api/searchAccepted');
    };

    userFactory.removeitem = function (id) {
        return $http.post('/api/removeitem/'+id);
    };

    userFactory.clearcart = function () {
        return $http.post('/api/clearcart');
    };

    return userFactory;
});