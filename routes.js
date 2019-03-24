'use strict';

const express = require("express");
const router = express.Router();
const User = require("./UserModel").User;
const Course = require("./CourseModel").Course;
const bcrypt = require("bcryptjs");
const { check, validationResult } = require('express-validator/check');
const auth = require('basic-auth');

const authenticateUser = async (req,res,next) => {
    let message = null;
    const credentials = auth(req);
    console.log(credentials)
    
    if(credentials){
        let user = await User.findOne({emailAddress : credentials.name});
        
    if(user){
        const authenticated = bcrypt
        .compareSync(credentials.pass, user.password);
    if(authenticated){
        console.log(`Authentication successful for username: ${user.emailAddress}`);
        req.currentUser = user;
    }else{
        message = `Authentication failure for username: ${user.emailAddress}`
    }
    }else{
        message = `User not found for username: ${credentials.name}`
    }
  }else{
      message = `Auth header not found`
    }
    if(message){
        console.warn(message);
        res.status(401).json({message: "Access Denied"})
    }else{
        next();
    }
}


router.get("/users", authenticateUser ,(req,res,next)=>{

const user = req.currentUser;
console.log(user)

res.json({
    Username: user.emailAddress
    
    
    });
});



router.post("/users",[
    check('firstName')
    .exists({checkNull:true,checkFalsy:true})
    .withMessage('Please enter a first name'),
    check('lastName')
    .exists({checkNull:true,checkFalsy:true})
    .withMessage('Please enter a last name'),
    check('emailAddress')
    .exists({checkNull:true,checkFalsy:true})
    .withMessage('please enter an email address'),
    check('password')
    .exists({checkNull:true,checkFalsy:true})
    .withMessage("please enter a password"),
],(req,res,next)=>{
    let errors = validationResult(req);

    if(!errors.isEmpty()){
        const errorMessages = errors.array().map(error => error.msg);

       return res.status(400).json({errors:errorMessages})
    }
    let user = new User(req.body);
    user.password = bcrypt.hashSync(user.password);
    user.save(function(err, user){
        if(err) next(err);
        res.status(201)
        res.json(user);
    });
});

router.get("/courses",(req,res,next)=>{
     Course.find({})
     .exec(function(err,courses){
        if(err) next(err);
        res.status(200);
        res.json(courses);
     });
});

router.get("/courses/:id",(req,res,next)=>{
    Course.findById(req.params.id)
    .exec(function(err,course){
       if(err) next(err);
       res.status(200);
       res.json(course);
    });
});

router.post("/courses",(req,res,next)=>{
    let course = new Course(req.body);
    course.save(function(err,course){
        if(err) next(err);
        res.status(201);
        res.json(course);
    });
});

router.put("/courses/:id",(req,res,next)=>{
    Course.findById(req.params.id)
    .exec(function(err,course){
        if(err) next(err); 
        course.update(req.body, function(err,course){
            if(err) next(err); 
            res.status(204)
            res.json(course);
        })
    })
});

router.delete("/courses/:id",(req,res,next)=>{
    Course.findById(req.params.id)
    .exec(function(err,course){
        if(err) next(err);
        course.remove(function(err, course){
            if(err) next(err);
            res.status(204)
            res.json(course)
        });
        
    });
});

module.exports = router;