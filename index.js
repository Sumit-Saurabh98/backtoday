const express = require('express');
const cors = require('cors');
const connection = require("./configs/db")
const UserModel = require("./models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const employeeRoute = require("./controllers/employeeRoute")

const PORT = 8080;
const app = express();


app.use(express.json())
app.use(cors())

app.post('/signup', async(req, res)=>{
    const{email, password, conformPassword} = req.body
    console.log(password, conformPassword)
    if(password==conformPassword){
    const user = await UserModel.findOne({email})
    if(user){
        res.send({msg:"User already exists"})
        return
    }
    const hash = bcrypt.hashSync(password, 8);
    const new_user = new UserModel({
        email,
        password:hash,
        conformPassword:hash
    })
    new_user.save();
    res.send({msg:"Welcome, Sign up Successful!"});
    }else{
        res.send({msg:"password and conform password is not matched"})
        return
    }
})

app.post('/login', async(req, res) => {
    const {email, password} = req.body
    const user = await UserModel.findOne({email})
    if(!user){
        res.send({msg:'Login Failed, wrong credentials'})
        return;
    }
    const hash = user.password;
    const correct_password = bcrypt.compareSync(password, hash);
    if(correct_password){
        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);
        res.send({msg:"login success", token: token})
    }else{
        res.send({msg:"Login Failed, wrong credentials"})
    }
    })

 app.use('/employee', employeeRoute)


app.listen(PORT, async() => {
    try {
        await connection()
        console.log(`listening on ${PORT}`)
    } catch (error) {
        console.log(`error: ${error}`)
    }
})