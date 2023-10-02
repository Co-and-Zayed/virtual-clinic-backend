const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose  = require("mongoose");

// Middleware 
app.use(express.json());
app.use(cors());

// Mongoose Setup
mongoose.set("strictQuery", false);

// Port Number
const port = 3000 || process.env.PORT;

// Util Imports
const { upload } = require("./utils/uploadFile");

// Route Imports
const { getRoute, fileUploadRoute} = require("./routes/test");

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database Setup Correctly");
        app.listen(port, () => {
            console.log(`Server running on port: ${port}`);
        });
    })
    .catch((err) => {
        console.log(`Error occured: ${err}`);
    });

/*

Register The Routes Here

/<route-prefix>/<route based on REST convention> 

*/
app.get("/test", getRoute);

/*
    the request should include the image field in this format: 
    {
        image: File()
    }
*/

app.post("/upload", upload.single('image'), fileUploadRoute);