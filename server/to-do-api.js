var express = require("express");
var mongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const { data } = require("jquery");

var app = express();
app.use(cors());

app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());

var conStr = "mongodb://127.0.0.1:27017";
  
app.get("/users", (request, response)=>{

  mongoClient.connect(conStr).then(clientObject=>{
      var database = clientObject.db("tododb");
      database.collection("user").find({}).toArray().then(documents=>{
          response.send(documents);
          response.end();
      });
  });
 
});
app.post("/register-user",(request,response)=>{

  var user = {
    UserId: request.body.UserId,
    UserName:request.body.UserName ,
    Password: request.body.Password,
    Email: request.body.Email,
    Mobile:request.body.Mobile
  }
  mongoClient.connect(conStr).then(clientObject=>{
var database = clientObject.db("tododb");
database.collection("user").insertOne(user).then(()=>{
  console.log("Data insert successfuly");
  // response.redirect("/users");
})
  })
})

app.get("/appointments/:userid",(request,response)=>{
  mongoClient.connect(conStr).then(clientObject=>{
    var database=clientObject.db("tododb");
    database.collection("appointments").find({UserId:request.params.userid}).toArray().then(document=>{
      response.send(document);
      response.end()
    })
  })
})

app.post("/add-task",(request,response)=>{

  var task = {
    UserId:request.body.UserId,
    Title :request.body.Title,
    Date:new Date(request.body.Date),
    Id : parseInt(request.body.Id) 
 }
 mongoClient.connect(conStr).then(clientObject=>{
  var database = clientObject.db("tododb")
  database.collection("appointments").insertOne(task).then(()=>{
    console.log("task added")
    response.end()
  })
 })
})

app.put("/edit-task/:id", (request, response)=> {
  var id = parseInt(request.params.id);
  mongoClient.connect(conStr).then(clientObject=>{
      var database = clientObject.db("tododb");
      database.collection("appointments").updateOne({Id:id},{$set:{ UserId: request.body.UserId, Title:request.body.Title, Date: new Date(request.body.Date),Id:parseInt(request.body.id)}}).then(()=>{
          console.log("Task Updated");
          response.end();
      });
  });
});

app.delete("/delete-task/:id", (request, response)=>{
  var id = parseInt(request.params.id);
  mongoClient.connect(conStr).then(clientObject=>{
      var database = clientObject.db("tododb");
      database.collection("appointments").deleteOne({Id:id}).then(()=>{
          console.log("Task Deleted");
          response.end();
      });
  });
});

  app.listen(5500)
  console.log("server is running on http://127.0.0.1:5500")