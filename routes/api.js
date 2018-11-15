var User        = require('../models/user.js');
var Rawitems    = require('../models/rawitems.js');
var Cookedfood  = require('../models/cookedfood.js');
var Product     = require('../models/product.js');
var jwt         = require('jsonwebtoken');
var nodemailer  = require('nodemailer');
var secret      = 'Pankaj';

var transporter = nodemailer.createTransport({
    service : 'gmail',
    auth: {
        user: 'YOUR_EMAIL_ID',
        pass: 'YOUR_PASSWORD'
    }
});

module.exports = function(router){

    //register route

	router.post('/users',function(req,res){
        var user = new User();

        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.name = req.body.name;
        user.role = req.body.role;
        user.institute = req.body.institute;
        user.temporarytoken = jwt.sign({username: user.username, email:user.email},secret,{expiresIn: '24h'});
        if(req.body.username == null || req.body.password == null || req.body.email == null || req.body.role == null || req.body.name == null || req.body.username == "" || req.body.password == "" || req.body.email == "" || req.body.name == "" || req.body.role == "")
        {
             //res.send("Make sure all fields are provided");
            res.json({ success:false , message:'Make sure all fields are provided'});
        }
        else {
            user.save(function(err) {
                if(err) {
                    if(err.errors != null) {
                        // validation errors
                        if(err.errors.name) {
                            res.json({
                                success: false,
                                message: err.errors.name.message
                            });
                        } else if (err.errors.email) {
                            res.json({
                                success : false,
                                message : err.errors.email.message
                            });
                        } else if(err.errors.password) {
                            res.json({
                                success : false,
                                message : err.errors.password.message
                            });
                        } else {
                            res.json({
                                success : false,
                                message : err
                            });
                        }
                    } else {
                        // duplication errors
                        if(err.code === 11000) {
                            //console.log(err.errmsg);
                            if(err.errmsg[70] === 'e') {
                                res.json({
                                    success: false,
                                    message: 'Email is already registered.'
                                });
                            } else if(err.errmsg[70] === 'u') {
                                res.json({
                                    success : false,
                                    message : 'Username is already registered.'
                                });
                            } else {
                                res.json({
                                    success : false,
                                    message : err
                                });
                            }
                        } else {
                            res.json({
                                success: false,
                                message: err
                            })
                        }
                    }
                }



               else {
                    //res.send("User created");
                    var email = {
                        from: '"Smiles for Miles Support" <smilesformilesproject@gmail.com>',
                        to: user.email,
                        subject: 'Activation Link - SmilesforMiles Registration',
                        text: 'Hello '+ user.name + 'Thank you for registering with us.Please find the below activation link Activation link Thank you Jagriti Aggarwal MD, SmilesforMiles',
                        html: 'Hello <strong>'+ user.name + '</strong>,<br><br>Thank you for registering with us.Please find the below activation link<br><br><a href="http://localhost:8000/activate/'+ user.temporarytoken+'">Activation link</a><br><br>Thank you<br>Jagriti Aggarwal <br>MD, SmilesforMiles'
                    };

                    transporter.sendMail(email, function(err, info){
                        if (err ){
                            console.log(err);
                        }
                        else {
                            console.log('Message sent: ' + info.response);
                        }
                    });

                    res.json({ success:true , message:'Account Registered. Please check your inbox for the activation link'});
                }
            });
        }
	});

	//check username

    // router.post('/checkusername',function(req,res){
    //     User.findOne({username:req.body.username}).select('username').exec(function(err,user){
    //
    //             if(user) {
    //                 res.json({success: false, message: "Username is already taken"});
    //                 //res.send("User doesn't exist");
    //             }
    //             else{
    //                 res.json({success: true, message: "Valid username"});
    //             }
    //
    //     });
    // });

    //check email

    // router.post('/checkemail',function(req,res){
    //     User.findOne({username:req.body.email}).select('email').exec(function(err,user){
    //
    //         if(user) {
    //             res.json({success: false, message: "Email is already taken"});
    //             //res.send("User doesn't exist");
    //         }
    //         else{
    //             res.json({success: true, message: "Valid email"});
    //         }
    //
    //     });
    // });

    //login route

	router.post('/login',function(req,res){
	User.findOne({username:req.body.username}).select('username password email active').exec(function(err,user){
        if(req.body.username == null || req.body.password == null || req.body.username == "" || req.body.password == "")
        {
            res.json({success: false, message: "Please fill in the complete details"});
		}
		else
		{
            if(!user) {
                res.json({success: false, message: "User doesn't exist"});
                //res.send("User doesn't exist");
            }
            else
            {
            	var validation = user.comparepassword(req.body.password);

            	if(!user.active){
                    res.json({success: false, message: "Your account is not yet activated. Please check your email for the activation link",expired:true});
                }
                else{
                    if(validation){
                        var token = jwt.sign({username: user.username, email:user.email},secret,{expiresIn: '24h'});
                        res.json({success: true, message: "Login Successful",token:token});
                    }
                    else{
                        res.json({success: false, message: "Incorrect Password"});
                    }
                }
            }
		}
	});
});

	// Resend Activation Link


    router.post('/resend',function(req,res) {


        if (!req.body.username || !req.body.password ) {
            res.json({success: false, message: "Please fill in the complete details"});
        }
        else {
            User.findOne({username: req.body.username}).select('username password active').exec(function (err, user) {

                //console.log(req.body.username);

                if (!user) {
                    res.json({success: false, message: "User doesn't exist"});
                    //res.send("User doesn't exist");
                }
                else {

                    if (user.active) {
                        res.json({success: false, message: "Your account is already activated"});
                    }
                    else {

                        var validation = user.comparepassword(req.body.password);

                        if (validation) {
                            res.json({success: true, user: user});
                        }
                        else {
                            res.json({success: false, message: "Incorrect Password"});
                        }
                    }
                }
            })
        }
    });

    //Updating the database with the new token and sending the link again

    router.put('/sendlink',function(req,res) {

            User.findOne({username: req.body.username}).select('username name email temporarytoken').exec(function (err, user) {

                if(err) throw err;
                //console.log(req.body.username);
                user.temporarytoken = jwt.sign({username: user.username, email:user.email},secret,{expiresIn: '24h'});

                user.save(function(err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        var email = {
                            from: 'SmilesforMiles Registration, support@smilesformiles.com',
                            to: user.email,
                            subject: 'Activation Link Request - SmilesforMiles Registration',
                            text: 'Hello '+ user.name + 'You requested for a new account activation link. Please find the below activation link Activation link Thank you Jagriti Aggarwal MD, SmilesforMiles',
                            html: 'Hello <strong>'+ user.name + '</strong>,<br><br>You requested for a new account activation link. Please find the below activation link<br><br><a href="http://localhost:8000/activate/'+ user.temporarytoken+'">Activation link</a><br><br>Thank you<br>Jagriti Aggarwal <br>MD, SmilesforMiles'
                        };

                        transporter.sendMail(email, function(err, info){
                            if (err ){
                                console.log(err);
                            }
                            else {
                                console.log('Message sent: ' + info.response);
                            }
                        });

                        res.json({success:true , message:'Activation Link has been resent to ' + user.email + ' !'});

                    }
                })
            })
    });


    //Forgot Username

    router.post('/resetusername',function(req,res) {

            if (!req.body.email) {
                res.json({success: false, message: "Please enter the email"});
            }
            else {
                User.findOne({email: req.body.email}).select('username name email').exec(function (err, user) {

                    if(err){
                        console.log(err);
                    }
                    else if (!user) {
                        res.json({success: false, message: "User doesn't exist"});
                        //res.send("User doesn't exist");
                    }
                    else {

                        var email = {
                            from: 'SmilesforMiles, support@smilesformiles.com',
                            to: user.email,
                            subject: 'Reset Username Request - SmilesforMiles Registration',
                            text: 'Hello ' + user.name + 'You requested for the username. Your username is ' + user.username + ' Thank you Jagriti Aggarwal MD, SmilesforMiles',
                            html: 'Hello <strong>' + user.name + '</strong>,<br><br>You requested for the username. Your username is <strong>' + user.username + '</strong><br><br>Thank you<br>Jagriti Aggarwal <br>MD, SmilesforMiles'
                        };

                        transporter.sendMail(email, function (err, info) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log('Message sent: ' + info.response);
                            }
                        });

                        res.json({
                            success: true,
                            message: 'Username has been sent to ' + user.email + ' !',
                        });

                    }
                })
            }
    });

    router.post('/resetpassword',function(req,res) {

        if (!req.body.email) {
            res.json({success: false, message: "Please enter the email"});
        }
        else {
            User.findOne({email: req.body.email}).select('username name email').exec(function (err, user) {

                if(err){
                    console.log(err);
                }
                else if (!user) {
                    res.json({success: false, message: "User doesn't exist"});
                    //res.send("User doesn't exist");
                }
                else {

                    user.temporarytoken =  jwt.sign({ username:user.username ,name: user.name, email:user.email},secret,{expiresIn: '24h'});

                    user.save(function(err)
                    {
                        if(err){
                            throw err;
                        }
                        else{
                            var email = {
                                from: 'SmilesforMiles, support@smilesformiles.com',
                                to: user.email,
                                subject: 'Reset Password Link - SmilesforMiles',
                                text: 'Hello '+ user.name + 'You requested for the reset password.Please find the below reset password link Reset Password link Thank you Jagriti Aggarwal MD, SmilesforMiles',
                                html: 'Hello <strong>'+ user.name + '</strong>,<br><br>You requested for the reset password.Please find the below reset password link <br><br><a href="http://localhost:8000/changepassword/'+ user.temporarytoken+'">Reset Password link</a><br><br>Thank you<br>Jagriti Aggarwal <br>MD, SmilesforMiles'
                            };

                            transporter.sendMail(email, function(err, info){
                                if (err ){
                                    console.log(err);
                                }
                                else {
                                    console.log('Message sent: ' + info.response);
                                }
                            });

                            res.json({ success:true , message:'Reset Password link sent. Check your inbox', token: user.temporarytoken});
                        }
                    })

                }
            })
        }
    });

    router.post('/setpassword/:token',function(req,res) {

        if (!req.params.token) {
            res.json({success: false, message: "Token not provided"});
        }
        else {
            User.findOne({temporarytoken: req.params.token}, function (err, user) {
                //console.log('hi'+req.params.token+'hi');

                if (err) {
                    throw err;
                }

                var token = req.params.token;

                jwt.verify(token, secret, function (err, decoded) {
                    if (err) {
                        res.json({success: false, message: "Reset Password Link has expired"});
                    }
                    else if (!user) {
                        res.json({success: false, message: "Reset Password Link has expired"});
                    }
                    else {

                        user.temporarytoken = false;
                        user.active = true;
                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                            }
                            else {

                                var email = {
                                    from: 'SmilesforMiles, support@smilesformiles.com',
                                    to: user.email,
                                    subject: 'Password changed - SmilesforMiles',
                                    text: 'Hello ' + user.name + 'Your account has been activated. Thank you Jagriti Aggarwal MD, SmilesforMiles',
                                    html: 'Hello <strong>' + user.name + '</strong>,<br><br>Your account has been activated<br><br>Thank you<br>Jagriti Aggarwal <br>MD, SmilesforMiles'
                                };

                                transporter.sendMail(email, function (err, info) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        console.log('Message sent: ' + info.response);
                                    }
                                });


                                res.json({success: true, message: "Password changed"});
                            }
                        })
                    }
                })
            })
        }
    });

    // change password
    router.put('/changepassword', function (req,res) {

        if(!req.body) {
            res.json({
                success : false,
                message : 'Details are missing.'
            });
        } else {

            User.findOne({ temporarytoken : req.body.token }).select('username password email').exec( function (err, user) {
                if(err) {
                    throw err;
                }

                if(!user) {
                    res.json({
                        success : false,
                        message : 'Token invalid.'
                    });
                } else {

                    console.log(user.password);

                    user.password = req.body.password;

                    user.save(function (err) {
                        if(err) {
                            res.json({
                                success : false,
                                message : 'Error while saving password.'
                            });
                        } else {
                            res.json({
                                success : true,
                                message : 'Password successfully updated.'
                            })
                        }
                    });
                }
            })
        }
    });

    //Account activation link

    router.put('/activate/:token',function(req,res){

	    if(!req.params.token){
	        res.json({success:false , message:'No token provided'});
        }
        else{
            User.findOne({temporarytoken : req.params.token},function(err,user){
                //console.log('hi'+req.params.token+'hi');

                if(err){
                    throw err;
                }

                var token = req.params.token;

                jwt.verify(token,secret,function(err,decoded){
                    if(err){
                        res.json({success:false,message:"Activation Link has expired"});
                    }
                    else if(!user) {
                        res.json({success:false,message:"Activation Link has expired"});
                    }
                    else{

                        user.temporarytoken=false;
                        user.active=true;
                        user.save(function(err){
                            if(err){
                                console.log(err);
                            }
                            else{

                                var email = {
                                    from: 'SmilesforMiles Registration, support@smilesformiles.com',
                                    to: user.email,
                                    subject: 'Account Activated - SmilesforMiles Registration',
                                    text: 'Hello '+ user.name + 'Your account has been activated. Thank you Jagriti Aggarwal MD, SmilesforMiles',
                                    html: 'Hello <strong>'+ user.name + '</strong>,<br><br>Your account has been activated<br><br>Thank you<br>Jagriti Aggarwal <br>MD, SmilesforMiles'
                                };

                                transporter.sendMail(email, function(err, info){
                                    if (err ){
                                        console.log(err);
                                    }
                                    else {
                                        console.log('Message sent: ' + info.response);
                                    }
                                });


                                res.json({success:true,message:"Account Activated"});
                            }
                        })
                    }
                });

            })
        }


    });

	router.use(function(req,res,next)
	{
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if(token){
            jwt.verify(token,secret,function(err,decoded){
                if(err){
                    res.json({success:false,message:"Token Invalid"});
                }
                else {
                	req.decoded = decoded;
                	next();
                    //res.json({success:true,message:"Token Verified"});
                }
            });
        }
        else {
            res.json({success:false, message:"Token not provided"});
        }
	});

    router.post('/me', function (req,res) {

        //console.log(req.decoded.email);
        // getting profile of user from database using email, saved in the token in localStorage
        User.findOne({ email : req.decoded.email }).select('email username name role').exec(function (err, user) {
            if(err) throw err;

            if(!user) {
                res.status(500).send('User not found.');
            } else {
                res.send(user);
            }
        });
    });


    // route to post data of donating raw food
    router.post('/donaterawfood',function (req,res) {

        var food = new Rawitems();
        food.name = req.body.name;
        food.quantity = req.body.quantity;
        food.city = req.body.city;
        food.state = req.body.state;
        food.postedby = req.decoded.username;

        if(req.body.name == null || req.body.quantity == null || req.body.city == null || req.body.state == null || req.body.name == "" || req.body.quantity == "" || req.body.city == "" || req.body.state == "" )
        {
            //res.send("Make sure all fields are provided");
            res.json({ success:false , message:'Make sure all fields are provided'});
        }
        else {
            food.save(function(err) {
                if(err) {
                    res.json({success:false,message:'Error in saving the data to the database'});
                }
                else {
                    res.json({ success:true , message:'Donate request successfully posted. We will contact you soon'});
                }
            });
        }
    });


    // route to post data of donating cooked food
    router.post('/donateCookedFood', function (req,res) {

        if(!req.body.meal || !req.body.people || !req.body.city || !req.body.state) {
            res.json({
                success : false,
                message : 'Please ensure you fill all details.'
            });
        } else {
            var cookedfood = new Cookedfood();

            cookedfood.meal = req.body.meal;
            cookedfood.people = req.body.people;
            cookedfood.city = req.body.city;
            cookedfood.state = req.body.state;
            cookedfood.postedby = req.decoded.username;

            cookedfood.save(function (err) {
                if(err) {
                    throw err;
                } else {
                    res.json({
                        success : true,
                        message : 'Donate Request successfully posted.'
                    });
                }
            })
        }
    });

    router.get('/donaterequests',function(req,res){

        var institute = User();

       Rawitems.find({ requeststatus : false }).exec(function(err,user){
           if(err){
               res.json({success:false,message:'No requests found for donation of raw food'});
           }
           else{
               console.log(user);
               Cookedfood.find({ requeststatus : false }, function (err, food) {

                   if(err){
                       res.json({success:false,message:'No requests found for donation of cooked food'});
                   } else{
                       res.json({success:true,user:user,food:food,institute:institute});
                   }
               });
           }

       })
    });

    router.get('/readdonaterequest/:id', function (req, res) {
        Rawitems.findOne({_id: req.params.id},function(err,raw){
            if(err){
                res.json({success:false});
            }
            if(!raw) {
                Cookedfood.findOne({ _id : req.params.id}, function (err,cooked) {
                    if (err) {
                        throw err;
                    }
                    if (!cooked) {
                        res.json({
                            success: false,
                            message: 'Food not found.'
                        });
                    } else {
                        User.findOne({ username : cooked.postedby }, function (err, user) {
                            if(err){
                                throw err;
                            }
                            else if(!user){
                                res.json({success:false,message:'User not found'});
                            }
                            else{
                                res.json({success:true,user:user,food:cooked});
                            }
                        });

                    }
                });

            }
            else{
                User.findOne({ username : raw.postedby }, function (err, user) {
                    if(err){
                        throw err;
                    }
                    else if(!user){
                        res.json({success:false,message:'User not found'});
                    }
                    else{
                        res.json({success:true,user:user,food:raw});
                    }
                });

            }
        });
        console.log(req.params.id);
    });

    // request accept
    router.put('/accept/:id', function (req, res) {

        User.findOne({ username : req.decoded.username }, function (err, user) {
            if(err) {
                throw err;
            } else {
                console.log(user);

                Rawitems.findOne({ _id : req.params.id }, function (err, raw) {
                    if(err) {
                        throw err;
                    } else if(!raw) {
                        Cookedfood.findOne({ _id : req.params.id }, function (err,cook) {
                            if(err) {
                                throw err;
                            } else {
                                //console.log(cook);

                                cook.requeststatus = true;
                                cook.acceptedby = req.decoded.username;

                                cook.save(function (err) {
                                    if(err) {
                                        res.json({success : false, message : 'Error while saving.'})
                                    } else {
                                        res.json({
                                            success : true,
                                            message : 'Requests accepted.'
                                        })
                                    }
                                });
                            }
                        })
                    } else {
                        //console.log(raw);

                        raw.requeststatus = true;
                        raw.acceptedby = req.decoded.username;

                        raw.save(function (err) {
                            if(err) {
                                res.json({success : false, message : 'Error while saving.'})
                            } else {

                                res.json({
                                    success : true,
                                    message : 'Requests accepted.'
                                })
                            }
                        });
                    }
                });

            }
        })
    });

    // get accepted request
    router.get('/searchAccepted', function (req, res) {

        Cookedfood.find({ acceptedby : req.decoded.username }, function (err, cook) {
            if(err) {
                throw err;
            } else {
                Rawitems.find({ acceptedby : req.decoded.username }, function (err, raw) {
                    if(err) {
                        throw err;
                    } else {
                        res.json({
                            success : true,
                            cook : cook,
                            raw : raw
                        });
                    }
                });
            }
        });
    });

    // Add to Cart
    router.post('/addtocart/:id',function(req,res){

        User.findOne({ username : req.decoded.username }, function (err, user) {
            if(err){
                throw err;
            }
            else if(!user){
                res.json({ success:false,message:'User not found' });
            }
            else {

                Product.findOne({ _id : req.params.id}, function (err, item) {
                    if(err) {
                        throw err;
                    } else if(!item) {
                        res.json({
                            success : false
                        });
                    } else {
                        var cartObj = {};
                        cartObj.itemid = req.params.id;
                        cartObj.count = 1;
                        cartObj.name = item.name;
                        cartObj.price = item.price;
                        cartObj.tag = item.tag;

                        //console.log('id from api ' + req.body);

                        user.cart.push(cartObj);

                        //console.log(user.cart);

                        user.save(function (err) {
                            if(err){
                                res.json({success:false,message:'Not added to cart'})
                            }
                            else{
                                res.json({success:true,message:'Successfully added to cart !!',item : cartObj});
                            }
                        })
                    }
                });
            }
        })

    });

    router.get('/cart',function(req,res){

        User.findOne({ username : req.decoded.username }, function (err, user) {
            if(err){
                throw err;
            }
            else if(!user){
                res.json({ success:false,message:'User not found' });
            }
            else {

                var value = 0;

                for(var i=0;i<user.cart.length; i++) {
                    //console.log(user.cart[i].price)
                    if(user.cart[i].price) {
                        value = value + user.cart[i].price;
                    }
                    //
                    //console.log(value);
                }

                res.json({
                    success : true,
                    cart : user.cart,
                    value : value
                });

            }
        });
    });

    // router to clear cart
    router.post('/clearcart', function (req, res) {
        User.findOne({ username : req.decoded.username}, function (err, user) {
            if(err) {
                throw err;
            } if(!user) {
                console.log('User not found.')
            } else {
                user.cart = [];

                user.save(function (err) {
                    if(err) {
                        throw err;
                    } else {
                        console.log('User cart cleared successfully.');
                    }
                });
            }
        });
    });

    // remove item from cart
    router.post('/removeitem/:id', function (req, res) {

        User.findOne({ username : req.decoded.username }, function (err, user) {
            if(err) {
                throw err;
            } else if(!user) {
                res.json({
                    succcess : false,
                    message : 'User not found.'
                });
            } else {
                //console.log(user.cart);

                for(var i=0;i<user.cart.length;i++) {
                    //console.log(user.cart[i]._id);
                    //console.log(req.params.id);
                    if(user.cart[i]._id == req.params.id) {

                        user.cart.splice(i,1);
                        //console.log(user.cart);
                        break;

                    }
                }

                user.save(function (err) {
                    if(err) {
                        res.json({
                            success : false,
                            message : 'Error while saving user.'
                        })
                    } else {
                        res.json({
                            success : true,
                            message : 'Removed item from Cart.'
                        });
                    }
                })


            }
        })
    });

    //Add new product
    router.post('/addnewproduct',function(req,res){

        var product = Product();
        product.name = req.body.name;
        product.price = req.body.price;
        product.quantity = req.body.quantity;
        product.tag = req.body.tag;

        if(req.body.name == null || req.body.name == '' || req.body.price == null || req.body.price == '' || req.body.quantity == null || req.body.quantity == '' || req.body.tag == null || req.body.tag == ''){
            res.json({success : false, message : 'Make sure all fields are provided'});
        }
        else{
            product.save(function(err){
                if(err){
                    throw err;
                }
                else {
                    res.json({success : true, message : 'Product successfully added to cart'});
                }
            })
        }
    });

    //Buy and Donate
    router.get('/displayproduct',function(req,res){
       Product.find().exec(function(err,item){
           if(err){
               throw err;
           }
           else{
               res.json({success : true , item : item});
           }
       })
    });

    //Display all donators
    router.get('/donators',function(req,res){
        User.find({role:'donator'},function(err,user){
            res.json({success:true,user:user});
        })
    });

    router.get('/receivers',function(req,res){
        User.find({role:'receiver'},function(err,user){
            res.json({success:true,user:user});
        })
    });

    router.get('/volunteers',function(req,res){
        User.find({role:'volunteer'},function(err,user){
            res.json({success:true,user:user});
        })
    });


	return router;
};

