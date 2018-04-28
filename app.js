var express=require('express');
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser')
var path=require('path');   //core module therefore no need to install it separately
// var expressValidator=require('express-validator');
var session=require('express-session');
var csrf=require('csurf');

var csrfProtection=csrf();

var assert=require('assert');
require('mongoose-type-email');
var http=require('http');
var mongoose=require('mongoose');
mongoose.Promise = global.Promise;
//var assert=require('assert');
mongoose.connect('mongodb://localhost/expense-manager',function(err){
//console.log(err);
});
var db=mongoose.connection;
var authmail;
var app=express();

var router = express.Router();
//app.use(csrfProtection);
app.use("/",router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({secret:'enter' , resave:false, saveUninitialized:false}))

//when using this render is working but..
app.use(express.static(path.join(__dirname,'public')));
//app.set('view engine', 'html');

//by using app.use there occurs no prob as it has some file to show
app.get('/',function(req, res) {    //changing use to get
  res.sendFile(__dirname + '/public/index.html');
});


//use any..when using this res.send is working---wrong
//app.use(express.static('public'))
app.get('/',function(req,res){
    res.render('index');
    authmail=" ";
  //  res.render('index', {csrfToken:req.csrfToken()});
})



//FOR SIGHN UP
//define schema for mongo
var Schema=mongoose.Schema;

var detail=new Schema({

      	username: {
            type : "string",
            required: true,
			description: "must be a string and is required"         },
      	 usrmail: {
            type :mongoose.SchemaTypes.Email,
            required: true,
            validate: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            description: "must be a string and match the regular expression pattern"
         },
         usrno: {
            type: "string",
            required: true,
            description: "must be a string and is required"
         },
        
         usrpsw: {
           type: "string",
           required: true
         }
      

})
var DETAILS=mongoose.model('DETAILS',detail);



app.post('/user_signup',function(req,res){
	//console.log(req.body);
	var myData = new DETAILS(req.body);
	//console.log(myData);
	myData.save(function(err, result) {
 	//console.log("i am im");
		if (err)  res.status(400).send("unable to save to database");

		if(result) {
			res.json(result)
		}
	})

})


//FOR LOGIN AUTHENTICATION
app.post('/log',function(req,res){
	//console.log(req.body);
	mail=req.body.mail;
	psw=req.body.psw;
	var cursor=db.collection('details').find({ $and: [ { usrmail:mail }, { usrpsw:psw } ] });

	cursor.count(function(err,count){
		if(count)
			{

				res.send(mail);
				authmail=mail;
				console.log(authmail);
			}
		else
			{
				
			res.send('no');
		}
	})
})


// FOR ADDING EXPENSE TO THE DATABSE
var expense=new Schema({

   
      	 usrmail: {
            type :mongoose.SchemaTypes.Email,
            required: true,
            validate: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            description: "must be a string and match the regular expression pattern"
         },
          	userexpense: {
            type : "date",
            required: true,
			description: "must be a string and is required" },
         
        
         amount: {
           type: "string",
           required: true
         },
         	date: {
            type : "date",
            required: true,
			description: "must be a string and is required" },

			
         

      

})
var EXPENSES=mongoose.model('EXPENSES',expense);


app.post('/user_expense',function(req,res){
	//console.log(req.body);
//userexpense=req.body.userexpense;
amount=req.body.amount;
date=req.body.date;
var d = new Date(); // for now
userexpense=d.getHours(); //
console.log(userexpense);
console.log("userexpense");
var flag=db.collection('expenses').insert({"usrmail":authmail,"userexpense":userexpense,"amount":amount,"date":date})

	if(flag)
		res.json('done');
	else
		res.json('nope');



/*
	var myData = new EXPENSES(req.body);
	//console.log(myData);
	
	myData.save(function(err, result) {
 	//console.log("i am im");
		if (err)  res.status(400).send("unable to save to database");

		if(result) {
			res.json(result);
		}
	})
	*/

})



app.get('/view_expense',function(req,res,next)
{

console.log('in app.js');
var resultArray=[];var esum=0;
var cursor=db.collection('expenses').find();

 cursor.forEach(function(doc,err){
        assert.equal(null,err);
        resultArray.push(doc);

    },function(){
        db.close();
       // res.render('index',{items:resultArray});
       console.log(resultArray);
       

      res.send(resultArray);
       

    })
})





app.listen(3000,function(){
	console.log('server started on 3000...');
})