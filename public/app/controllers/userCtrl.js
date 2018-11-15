angular.module('userControllers',['userServices'])

.controller('regCtrl',function(User,$http,$location,$timeout) {

    var app = this;

    this.regUser = function (regData) {
        app.loading = true;
        app.errMsg = false;
        app.successMsg = false;
        //console.log(app.regData);
        User.create(app.regData).then(function (data) {
            //console.log(data.data.message);
            if (data.data.success) {
                app.loading = false;
                app.successMsg = data.data.message + ' Redirecting.....';
                $timeout(function () {
                    $location.path('/');
                }, 1000);
            }
            else {
                app.errMsg = data.data.message;
                app.loading = false;
            }
            //
            // this.checkUsername = function(regData) {
            //     User.checkUsername(app.regData).then(function (data) {
            //         console.log(data);
            //         // if(data.data.success)
            //         // {
            //         //     app.loading=false;
            //         //     app.successMsg = data.data.message;
            //         //     $timeout(function() {
            //         //         $location.path('/');
            //         //     },1500);
            //         // }
            //         // else
            //         // {
            //         //     app.errMsg = data.data.message;
            //         //     app.loading=false;
            //         // }
            //     });

        });
    }


})

.directive('match', function () {
    return {
        restrict: 'A',
        controller:function($scope) {

            $scope.confirmed = false;

            $scope.doConfirm = function(values){
                // console.log(values);
                // console.log($scope.confirm);
                values.forEach(function(letter){

                    if($scope.confirm == letter) {
                        $scope.confirmed = true;
                        console.log($scope.confirmed);
                    }
                    else{
                        $scope.confirmed = false;
                        console.log($scope.confirmed);
                    }
                    // console.log(letter);
                    // console.log($scope.confirm);
                });

            }

        },

        link: function(scope, element, attrs){

            attrs.$observe('match',function() {
                scope.matches = JSON.parse(attrs.match);
                scope.doConfirm(scope.matches);
            });

            scope.$watch('confirm',function() {
                scope.matches = JSON.parse(attrs.match);
                scope.doConfirm(scope.matches);
            });
        }
    };
})

.controller('buydonateCtrl', function (User,$timeout) {

    var app = this;

    User.displayproduct().then(function(data){
       if(data.data.success){
           app.item = data.data.item;
       }
    });

    app.addtocart = function(id){
        //console.log(id);
        User.addtocart(id).then(function(data){
            if(data.data.success){
                app.successMsg = data.data.message;
            }
            else{
                app.errorMsg = data.data.message;
            }
            $timeout(function(){
                app.successMsg = '';
            },1000);
        })
    }
})

.controller('donaterawCtrl', function (User) {
    //console.log('testing donate raw');
    var app=this;

    app.successMsg = false;
    app.errorMsg = false;

    app.addData = function(rawfoodData){

        //console.log(app.rawfoodData);
        User.donaterawfood(app.rawfoodData).then(function(data){
            console.log(data);
            if(data.data.success){
                app.successMsg = data.data.message;
            }
            else{
                app.errorMsg = data.data.message;
            }
        })
    }
})

.controller('donatecookedfoodCtrl', function (User) {
    var app=this;

    app.successMsg = false;
    app.errorMsg = false;

    app.addFood = function(foodData){

        //console.log(app.foodData);
        User.donateCookedFood(app.foodData).then(function(data){
            console.log(data);
            if(data.data.success){
                app.successMsg = data.data.message;
            }
            else{
                app.errorMsg = data.data.message;
            }
        })
    }
})

.controller('donaterequestsCtrl', function (User) {
    var app=this;

    app.rawfood = false;
    app.cookedfood = false;
    app.institute = false;

    User.donaterequests().then(function(data){

        console.log(data);

        if(data.data.success){
            app.cookedfood = data.data.food;
            app.rawfood = data.data.user;
            app.institute = data.data.institute;
        }
    })
})

.controller('cartCtrl',function (User, $location) {

   var app = this;

   function cart() {

       User.cart().then(function(data){
           console.log(data);
           if(data.data.success) {
               app.cart = data.data.cart;
               app.value = data.data.value;
           }
       });
   }

   cart();

   app.removeitem = function (id) {
       //console.log(id);
       User.removeitem(id).then(function (data) {
           console.log(data);
           if(data.data.success) {
               cart();
           }
       });
   };
})

.controller('orderplacedCtrl', function (User) {
    User.clearcart();
})


.controller('readdonaterequestCtrl', function (User, $routeParams,$timeout, $location) {
    //aconsole.log('testing');
    var app = this;


    User.readdonaterequest($routeParams.id).then(function (data) {
        //console.log(data);

        if(data.data.success){
            app.city = data.data.food.city;
            app.meal = data.data.food.meal;
            app.people = data.data.food.people;
            app.state = data.data.food.state;
            app.username = data.data.user.username;
            app.name = data.data.user.name;
            app.email = data.data.user.email;
            app.institute = data.data.user.institute;
            app.id = $routeParams.id;
        }
    });

    app.accept = function (id) {
        //console.log(id);

        User.accept(id).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.successMsg = data.data.message;
                $timeout(function () {
                    $location.path('/donaterequests')
                },1000);
            } else {
                app.errorMsg = data.data.message;
            }
        })
    }
})

.controller('acceptedCtrl', function (User) {
   // console.log('testing')

    var app = this;

    User.searchAccepted().then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.cook = data.data.cook;
            app.raw = data.data.raw;
        }
    });

})

.controller('addnewproductCtrl',function(User){

    var app = this;

    app.addnewproduct = function(Data){

        app.successMsg = false;
        app.errorMsg = false;

        User.addnewproduct(app.Data).then(function(data){
            console.log(data);
            if(data.data.success){
                app.successMsg = data.data.message;
                app.Data = '';
            }
            else{
                app.errorMsg = data.data.message;
            }
        })
    }
})

.controller('donatorsCtrl',function (User) {
    var app = this;
    User.donators().then(function(data){
        if(data.data.success) {
            app.donators = data.data.user;
        } else {
            app.errorMsg = data.data.message;
            console.log('Error in fetching Users.')
        }
    });
})

.controller('receiversCtrl',function (User) {
    var app = this;
    User.receivers().then(function(data){
        if(data.data.success) {
            app.receivers = data.data.user;
        } else {
            app.errorMsg = data.data.message;
            console.log('Error in fetching Users.')
        }
    });
})

.controller('volunteersCtrl',function (User) {
    var app = this;
    User.volunteers().then(function(data){
        if(data.data.success) {
            app.volunteers = data.data.user;
        } else {
            app.errorMsg = data.data.message;
            console.log('Error in fetching Users.')
        }
    });
});