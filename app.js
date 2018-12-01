const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const Nexmo = require("nexmo");
const socketio = require("socket.io");

//Init Nexmo
const nexmo = new Nexmo(
  {
    apiKey: "a4e8e737",
    apiSecret: "5nxXXnCFgWwFmB9h"
  },
  { debug: true }
);

//Init app - express is a npm or node package module
const app = express();

//Template engine setup
app.set("view engine", "html");
app.engine("html", ejs.renderFile); //app.engine is going to be ejs.renderFile that way we can use .html as our file extension for our views

//Public folder setup
app.use(express.static(__dirname + "/public")); //The public folder we are going to create is a static folder that's where our static assets go including the main.js file

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index route
app.get("/", (req, res) => {
  res.render("index"); //index is in the view folder
});

//Catch form submit
app.post("/", (req, res) => {
  //res.send(req.body);
  //console.log(req.body);
  const number = req.body.number;
  const text = req.body.text;

  nexmo.message.sendSms();
  "",
    number,
    text,
    { type: "unicode" },
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
        //Get data from response
        const data = {
          id: responseData.message[0]["message-id"],
          number: responseData.messages[0]["to"]
        };

        //Emit to the client
        io.emit("smsStatus", data);
      }
    };
});

//Define port
const port = 3000;

//Start server
const server = app.listen(port, () =>
  console.log("Server started on port " + port)
);

//Connect to socket.io
const io = socketio(server);
io.on("disconnect", () => {
  console.log("Connected");
  io.on("disconnect", () => {
    console.log("Disconnected");
  });
});
