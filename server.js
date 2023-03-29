const express = require("express");


const cors = require("cors");

const morgan = require("morgan");
const dotenv = require('dotenv');
const connectDB = require("./data/db.js");

const path = require('path');

dotenv.config();
const userRoutes = require("./route/userRoutes.js");

const blogRoutes = require("./route/blogRoutes.js");





connectDB()
const app = express();

app.use(cors());
app.use(express.json());

app.use(morgan("dev"));


app.use(express.static(path.join(__dirname , './client/build')));

app.use("/api/v1/user" , userRoutes);

app.use("/api/v1/blog" , blogRoutes);


app.use('*' , function(req , res){
    res.sendFile(path.join(__dirname , './client/build/index.html'));
});

const PORT = process.env.PORT || 8080

app.listen(PORT , (req , res) =>{
    console.log(`Server is running on port number ${PORT}`);
})

