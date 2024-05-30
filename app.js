import express from "express";
import bodyParser from "body-parser";
import https from "https";
import path from 'path';
import { fileURLToPath } from 'url';
import { STATUS_CODES } from "http";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function (req, res) {
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;


    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us17.api.mailchimp.com/3.0/lists/79a5e85e7e";
    const options = {
        method: "POST",
        auth: "David0505:d5fcb1391415ba839e33e998065f51dd-us17"
    }

    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })


    request.write(jsonData);
    request.end();
})

app.post("/failure", function (req, res) {
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
})


// mailChimp API key
// e5fcb1391415ba839e33e998065f51dd-us17

// List ID
// 79a5e85e7e