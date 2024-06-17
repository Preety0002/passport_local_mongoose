const mongoose=require("mongoose")

mongoose.connect("mongodb://0.0.0.0/passport").then(()=>
    console.log("db connected")
)