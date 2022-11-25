const express=require("express");
const {open}=require("sqlite");
const sqlite3=require("sqlite3");
const path=require("path");
const bcrypt=require("bcrypt");

const dbPath=path.join(__dirname,"userData.db")

const app=express();


app.use(express.json());

let db=null;
const initializeDbAndServer=async()=>{
    try{
        db=await open({
            filename:dbPath,driver:sqlite3.db
        });
        app.listen=>(3000,()=>console.log("server Running at http://localhost:3000/"));
    
    }catch(error){
        console.log(`DB Error:${error.message}`);
        process(exit(1));
    }
};
initializeDbAndServer();

const validatePassword=(password)=>{
    return password.length>4;

}
app.post("/register",async(request,response)=>{
    const{username,name,password,gender,location}=request.body;
    const hashedPassword=await bcrypt.hash(password,10);
    const selectedUserQuery=`select * from user where username='${username}';`;
    const databaseUser= await db.get(selectedUserQuery);

if (databaseUser===undefined){
    const createUserQuery=`
      insert into 
      user(username,name,password,gender,location)
      values('${username}',
               '${name}',
               '${hashedPassword}',
               '${gender}',
               '${location}');`;
    if(validatePassword(password)){
        await db.run(createUserQuery)
        response.send("user Created Successfully")
    }else{
        response.status(400);
        response.send("password is Too short")
    }
    }else{
        response.status(400);
        response.send("user already exits")
    }

});

app.post("/login",async(request,response)=>{
    const{username,password}=request.body;
    const selectedUserQuery=`select * from user where username='${username}';`;
    const databaseUser= await db.get(selectedUserQuery);

if (databaseUser===undefined){
    response.status(400);
    response.send("Invalid User")
   

    if(validatePassword(password)){
        await db.run(createUserQuery)
        response.send("user Created Successfully")
    }else{
        (const isPasswordMatched=await bcrypt.compare(password,databaseUser.password);
     if(passwordMatched===True){
         response.send("login Success!")
     }else{
         response.status(400);
         response.send("Invalid Password")
     }
    }

});
app.post("/login",async(request,response)=>{
    const{username,oldPassword,newPassword}=request.body;
    const selectedUserQuery=`select * from user where username='${username}';`;
    const databaseUser= await db.get(selectedUserQuery);

if (databaseUser===undefined){
    response.status(400);
    response.send("Invalid User")
   

    if(validatePassword(password)){
        await db.run(createUserQuery)
        response.send("user Created Successfully")
    }else{
        (const isPasswordMatched=await bcrypt.compare(password,databaseUser.password);
     if(passwordMatched===True){
         if(validatePassword(newPassword)){
             const hashedPassword=await bcrypt.hash(newPassword,10);
             const updatePasswordQuery=`
                update
                  user
                SET
                  password='${hashedPassword}'
                where
                   username='${username}';`;
            const user= await db.run(updatePasswordQuery);
            response.send("password Updated");
         }else{
             response.status(400);
             response.send("password Invalid");
         }else{
             response.status(400);
             response.send("Invalid current password");
         }
        
    }

});



 module.exports=app;