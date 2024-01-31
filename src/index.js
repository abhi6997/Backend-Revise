
import dotenv from "dotenv"
import {app} from "./app.js"

import connectDB from "./db/mongodbConnection.js";



dotenv.config({
    path:'./env'
})

connectDB().then(()=>{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log("server connection initialized at port: ",process.env.PORT)
    })

    app.on("error",(error)=>{
        console.log("server connection failed");
        throw error;
    })
}).catch((error)=>{
    console.log("MONGODB Connection Failed!!!!!", error)
})