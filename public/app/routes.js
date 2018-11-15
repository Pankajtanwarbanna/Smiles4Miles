//console.log("Testing routes");

var app = angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider,$locationProvider){
	
	$routeProvider

	.when('/about',{
		templateUrl:'/app/views/about.html',
        authenticated:false,
	})

	.when('/register',{
		templateUrl:'/app/views/register.html',
		controller:'regCtrl',
		controllerAs: 'register',
		authenticated:false,
	})

	.when('/login',{
		templateUrl:'/app/views/login.html',
        authenticated:false,
	})

	.when('/logout',{
		templateUrl:'/app/views/logout.html',
        authenticated:true,
	})

	.when('/profile',{
		templateUrl:'/app/views/profile.html',
        authenticated:true,
	})

	.when('/facebook/:token',{
		templateUrl:'/app/views/profile.html',
		controller :'facebookCtrl',
		controllerAs: 'facebook',
        authenticated:false
	})

	.when('/google/:token',{
		templateUrl:'/app/views/profile.html',
		controller :'googleCtrl',
		controllerAs: 'google',
        authenticated:false
	})

	.when('/googleerror',{
		templateUrl:'/app/views/login.html',
        controller :'googleCtrl',
        controllerAs: 'google',
        authenticated:false
	})

	.when('/activate/:token',{
		templateUrl:'/app/views/activation/activate.html',
		controller :'emailCtrl',
		controllerAs: 'email',
        authenticated:false
    })

	.when('/resend',{
		templateUrl:'/app/views/activation/resend.html',
		controller :'resendCtrl',
		controllerAs: 'resend',
        authenticated:false
    })

	.when('/resetusername',{
		templateUrl:'/app/views/reset/username.html',
		controller :'usernameCtrl',
		controllerAs: 'username',
        authenticated:false
    })

	.when('/resetpassword',{
		templateUrl:'/app/views/reset/password.html',
		controller :'passwordCtrl',
		controllerAs: 'password',
        authenticated:false
    })

	.when('/changepassword/:token',{
		templateUrl:'/app/views/reset/changepassword.html',
		controller :'changepasswordCtrl',
		controllerAs: 'changepassword',
        authenticated:false
    })

	.when('/donatenow' ,{
		templateUrl : 'app/views/donatenow.html',
		authenticated : true
	})

	.when('/donateraw', {
		templateUrl : 'app/views/donateraw.html',
		authenticated : true,
		controller : 'donaterawCtrl',
		controllerAs : 'donateraw'
	})

	.when('/donatefood', {
		templateUrl : 'app/views/donatefood.html',
		authenticated : true,
		controller : 'donatecookedfoodCtrl',
		controllerAs : 'donatecookedfood'
	})

    .when('/donaterequest/:id', {
        templateUrl : 'app/views/readdonaterequest.html',
        authenticated : true,
        controller : 'readdonaterequestCtrl',
        controllerAs : 'readdonaterequest'
    })

    .when('/accepteddonaterequests', {
        templateUrl : 'app/views/accepted.html',
        authenticated : true,
        controller : 'acceptedCtrl',
        controllerAs : 'accepted'
    })

	.when('/buydonate' ,{
		templateUrl : 'app/views/buydonate.html',
		controller : 'buydonateCtrl',
		controllerAs : 'buydonate',
		authenticated : true
	})

	.when('/donaterequests' ,{
		templateUrl : 'app/views/donaterequests.html',
		controller : 'donaterequestsCtrl',
		controllerAs : 'donaterequests',
		authenticated : true
	})

	.when('/cart' ,{
		templateUrl : 'app/views/cart.html',
		controller : 'cartCtrl',
		controllerAs : 'cart',
		authenticated : true
	})

	.when('/donators' ,{
		templateUrl : 'app/views/users/donators.html',
		controller : 'donatorsCtrl',
		controllerAs : 'donators',
		authenticated : true
	})

	.when('/receivers' ,{
		templateUrl : 'app/views/users/receivers.html',
		controller : 'receiversCtrl',
		controllerAs : 'receivers',
		authenticated : true
	})

	.when('/volunteers' ,{
		templateUrl : 'app/views/users/volunteers.html',
		controller : 'volunteersCtrl',
		controllerAs : 'volunteers',
		authenticated : true
	})

	.when('/team' ,{
		templateUrl : 'app/views/team.html',
		authenticated : true
	})

	.when('/addnewproduct',{
		templateUrl : 'app/views/addnewproduct.html',
		controller : 'addnewproductCtrl',
		controllerAs : 'product',
		authenticated : true
	})

    .when('/orderplaced', {
        templateUrl : 'app/views/orderplaced.html',
        authenticated : true,
		controller : 'orderplacedCtrl'
    })


	.otherwise({redirectTo:'/'});

	$locationProvider.html5Mode(true);

});


app.run(['$rootScope','Auth','$location',function($rootScope, Auth , $location){

    $rootScope.$on('$routeChangeStart',function(event,next,current){
    	// console.log(next.$$route);

        if(next.$$route.authenticated == true)
        {
            if(!Auth.isLoggedIn()){
            	event.preventDefault();
            	$location.path('/');
			}
        }
        else if(next.$$route.authenticated == false) {
            if (Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/');
            }
        }
    });
}
]);
// .config(function(){
// 	console.log("Testing routes");
// });


