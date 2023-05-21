import mongoose from "mongoose";
import express from "express";
import userRoute from "./Routes/userRoute.js";


const app = express();

/* Create a connection & new DB in mongooose */
mongoose.connect("mongodb://localhost:27017/authDB",
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log("Database is Connected successfully...!!!"))
.catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/api',userRoute); 


const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log("Server Started......"))