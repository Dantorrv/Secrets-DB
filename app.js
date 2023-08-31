
import 'dotenv/config'
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from 'mongoose-encryption';


const app=express();
const port=3000;


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.AUTHDB);
}

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret=process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });


const User = new mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req,res)=>{
    res.render("home.ejs");
})

app.get("/login", (req,res)=>{
    res.render("login.ejs");
})

app.post("/login", async (req,res)=>{
    const userName=req.body.username;
    const passWord=req.body.password;
    
   const userCred = await User.findOne({email: userName});
   if (userCred.password==passWord){
    res.render("secrets.ejs");
   }

})

app.get("/register", (req,res)=>{
    res.render("register.ejs");
})

app.post("/register", async (req,res)=>{
    const newUser=new User({
        email: req.body.username,
        password: req.body.password
    });
    await newUser.save();
    res.render("secrets.ejs");
})

app.listen(port, ()=>{
    console.log("Server is running on port "+port)
})