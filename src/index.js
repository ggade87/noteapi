//https://www.mongodb.com/docs/drivers/node/current/
import express from "express";
import cors from "cors";
var app = express();
const PORT = 8080;
app.use(cors());
import pkg from "body-parser";
const { json, urlencoded } = pkg;
var jsonParser = json();
var jsonParser = json();
//app.use(express.bodyParser({limit: '50mb'}));
//Below two line added to save image large size
app.use(
  urlencoded({
    limit: "50mb",
    extended: false,
  })
);
app.use(json({ limit: "50mb" }));
var url = "mongodb://localhost:27017/notebook";
import { MongoClient } from "mongodb";
import mongodb from "mongodb";

const { ObjectId } = mongodb;
import { ServiceErrorResponse, ServiceResponse } from "./Common.js";

app.get("/", async function (req, res) {
  const query = { email: "aa@gmail.com" };
  const options = {
    sort: { usersId: -1 },
  };
  const User = await Users.findOne(query, options);
  res.send(User);
});

app.post("/login", jsonParser, async function (req, res) {
  const client = new MongoClient(url);
  try {
    const database = client.db("notebook");
    const Users = database.collection("Users");
    var { username, password } = req.body;
    const query = { email: username, password: password };
    const options = {
      sort: { userId: -1 },
    };
    const User = await Users.findOne(query, options);
    if (User == null) {
      res.status(401).send(ServiceErrorResponse("Unatherized user"));
    } else {
      res.send(User);
    }
  } finally {
    await client.close();
  }
});

app.post("/signup", jsonParser, async function (req, res) {
  const client = new MongoClient(url);
  try {
    const database = client.db("notebook");
    const Users = database.collection("Users");
    var { username, password } = req.body;
    const request = {
      userId: username,
      image: "",
      name: "",
      email: username,
      password: password,
      Mobile: "",
      profession: "",
    };
    const query = { email: username };
    const options = {
      sort: { userId: -1 },
    };
    const User = await Users.findOne(query, options);
    if (User != null) {
      res.send(ServiceErrorResponse("User already exist"));
    } else {
      const result = await Users.insertOne(request);
      if (result == null) {
        res.send(ServiceErrorResponse("Unable to save"));
      } else {
        res.send(result);
      }
    }
  } finally {
    await client.close();
  }
});

app.post("/create/otp", jsonParser, async function (req, res) {
  const client = new MongoClient(url);
  try {
    const database = client.db("notebook");
    const Otp = database.collection("Otp");
    var { username, password, otp } = req.body;
    const request = {
      username: username,
      otp: otp,
      email: username,
      password: password,
      createDate: new Date(),
    };
    const result = await Otp.insertOne(request);
    if (result == null) {
      res.send(ServiceErrorResponse("Unable to save"));
    } else {
      res.send(result);
    }
  } finally {
    await client.close();
  }
});

app.post("/validate/otp", jsonParser, async function (req, res) {
  const client = new MongoClient(url);
  try {
    const database = client.db("notebook");
    const Otp = database.collection("Otp");
    var { username, password, otp } = req.body;
    const request = {
      username: username,
      otp: otp,
      email: username,
      password: password,
      createDate: new Date(),
    };
    const query = { email: username, password: password, otp: otp };
    const options = {
      sort: { userId: -1 },
    };
    const result = await Otp.findOne(query, options);
    if (result == null) {
      res.send(ServiceErrorResponse("otp not found"));
    } else {
      var diff = Math.abs(new Date() - result.createDate);
      var minutes = Math.floor(diff / 1000 / 60);
      console.log(minutes);
      if (minutes > 10) {
        res.send(ServiceResponse("Otp expired"));
      } else {
        res.send(ServiceResponse("Valid Otp"));
      }
    }
  } finally {
    await client.close();
  }
});

app.get("/getuserinfo", jsonParser, async function (req, res) {
  const client = new MongoClient(url);
  try {
    const database = client.db("notebook");
    const Users = database.collection("Users");
    var { email } = req.query;
    var query = { email: email };
    const options = {
      sort: { userId: -1 },
    };
    const result = await Users.findOne(query, options);
    if (result == null) {
      res.send(ServiceErrorResponse("User not found"));
    } else {
      res.send(result);
    }
  } finally {
    await client.close();
  }
});

app.get("/get/mainmenu", jsonParser, async function (req, res) {
  const client = new MongoClient(url);
  try {
    const database = client.db("notebook");
    const mainMenu = database.collection("mainMenu");
    var { userId } = req.query;
    var query = { userId: userId };
    const options = {
      sort: {},
      projection: { _id: 1, userId: 1, name: 1 },
    };
    var items = await mainMenu.find(query, options);
    var response = [];
    for await (const item of items) {
      response.push(item);
    }
    if (response.length == 0) {
      res.send(ServiceErrorResponse("Menu not found"));
    } else {
      res.send(response);
    }
  } catch (err) {
    console.log("Catttttttt" + err);
  } finally {
    await client.close();
  }
});

app.get("/get/subMenu", jsonParser, async function (req, res) {
  const client = new MongoClient(url);
  try {
    const database = client.db("notebook");
    const SubMenu = database.collection("SubMenu");
    var { mid } = req.query;
    var query = { mid: mid };
    const options = {
      sort: {},
      //projection: { _id: 1, userId: 1, name: 1 },
    };
    var items = await SubMenu.find(query, options);
    var response = [];
    for await (const item of items) {
      response.push(item);
    }
    if (response.length == 0) {
      res.send(ServiceErrorResponse("Sub Menu not found"));
    } else {
      res.send(response);
    }
  } catch (err) {
    console.log("Catttttttt" + err);
  } finally {
    await client.close();
  }
});

app.get("/get/content", jsonParser, async function (req, res) {
  const client = new MongoClient(url);
  try {
    const database = client.db("notebook");
    const Content = database.collection("Content");
    var { smid } = req.query;
    var query = { smid: smid };
    const options = {
      sort: {},
      //projection: { _id: 1, userId: 1, name: 1 },
    };
    var items = await Content.find(query, options);
    var response = [];
    for await (const item of items) {
      response.push(item);
    }
    if (response.length == 0) {
      res.send(ServiceErrorResponse("Content not found"));
    } else {
      res.send(response);
    }
  } catch (err) {
    console.log("Catttttttt" + err);
  } finally {
    await client.close();
  }
});

app.put("/update/userinfo/:id", jsonParser, async function (req, res) {
  const client = new MongoClient(url);
  try {
    const database = client.db("notebook");
    const Users = database.collection("Users");
    var { userId, image, name, email, password, Mobile, profession } = req.body;
    var { id } = req.params;

    if (ObjectId.isValid(id)) {
      var objectId = new ObjectId(id);
      var query = { _id: objectId };
      const updateDocument = {
        $set: {
          userId: userId,
          image: image,
          name: name,
          email: email,
          //password: password,
          Mobile: Mobile,
          profession: profession,
        },
      };
      const options = {
        sort: {},
        //projection: { _id: 1, userId: 1, name: 1 },
      };
      var result = await Users.findOne(query, options);
      console.log(result);
      if (result == null) {
        res.send(ServiceErrorResponse("Users not found"));
      } else {
        var items = await Users.updateOne(query, updateDocument);
        res.send(items);
      }
    } else {
      res.send(ServiceErrorResponse("Invalid id"));
    }
  } catch (err) {
    console.log("Catttttttt" + err);
  } finally {
    await client.close();
  }
});

app.put("/update/password/:id", jsonParser, async function (req, res) {
  const client = new MongoClient(url);
  try {
    const database = client.db("notebook");
    const Users = database.collection("Users");
    var { email, password } = req.body;
    var { id } = req.params;

    if (ObjectId.isValid(id)) {
      var objectId = new ObjectId(id);
      var query = { _id: objectId };
      const updateDocument = {
        $set: {
          email: email,
          password: password,
        },
      };
      const options = {
        sort: {},
        //projection: { _id: 1, userId: 1, name: 1 },
      };
      var result = await Users.findOne(query, options);
      console.log(result);
      if (result == null) {
        res.send(ServiceErrorResponse("Users not found"));
      } else {
        var items = await Users.updateOne(query, updateDocument);
        res.send(items);
      }
    } else {
      res.send(ServiceErrorResponse("Invalid id"));
    }
  } catch (err) {
    console.log("Catttttttt" + err);
  } finally {
    await client.close();
  }
});

app.put("/update/mainmenu/:id", jsonParser, async function (req, res) {
  const client = new MongoClient(url);
  try {
    const database = client.db("notebook");
    const mainMenu = database.collection("mainMenu");
    var { name } = req.body;
    var { id } = req.params;

    if (ObjectId.isValid(id)) {
      var objectId = new ObjectId(id);
      var query = { _id: objectId };
      const updateDocument = {
        $set: {
          name: name,
        },
      };
      const options = {
        sort: {},
        //projection: { _id: 1, userId: 1, name: 1 },
      };
      var result = await mainMenu.findOne(query, options);
      console.log(result);
      if (result == null) {
        res.send(ServiceErrorResponse("MainMenu not found"));
      } else {
        var items = await mainMenu.updateOne(query, updateDocument);
        res.send(items);
      }
    } else {
      res.send(ServiceErrorResponse("Invalid id"));
    }
  } catch (err) {
    console.log("Catttttttt" + err);
  } finally {
    await client.close();
  }
});

app.put("/update/submenu/:id", jsonParser, async function (req, res) {
  const client = new MongoClient(url);
  try {
    const database = client.db("notebook");
    const SubMenu = database.collection("SubMenu");
    var { name } = req.body;
    var { id } = req.params;

    if (ObjectId.isValid(id)) {
      var objectId = new ObjectId(id);
      var query = { _id: objectId };
      const updateDocument = {
        $set: {
          name: name,
        },
      };
      const options = {
        sort: {},
        //projection: { _id: 1, userId: 1, name: 1 },
      };
      var result = await SubMenu.findOne(query, options);
      console.log(result);
      if (result == null) {
        res.send(ServiceErrorResponse("SubMenu not found"));
      } else {
        var items = await SubMenu.updateOne(query, updateDocument);
        res.send(items);
      }
    } else {
      res.send(ServiceErrorResponse("Invalid id"));
    }
  } catch (err) {
    console.log("Catttttttt" + err);
  } finally {
    await client.close();
  }
});

app.put("/update/content/:id", jsonParser, async function (req, res) {
  const client = new MongoClient(url);
  try {
    const database = client.db("notebook");
    const Content = database.collection("Content");
    var { name, value } = req.body;
    var { id } = req.params;

    if (ObjectId.isValid(id)) {
      var objectId = new ObjectId(id);
      var query = { _id: objectId };
      const updateDocument = {
        $set: {
          name: name,
          value: value,
        },
      };
      const options = {
        sort: {},
        //projection: { _id: 1, userId: 1, name: 1 },
      };
      var result = await Content.findOne(query, options);
      console.log(result);
      if (result == null) {
        res.send(ServiceErrorResponse("Content not found"));
      } else {
        var items = await Content.updateOne(query, updateDocument);
        res.send(items);
      }
    } else {
      res.send(ServiceErrorResponse("Invalid id"));
    }
  } catch (err) {
    console.log("Catttttttt" + err);
  } finally {
    await client.close();
  }
});

app.post("/create/mainmenu", jsonParser, async function (req, res) {
  const client = new MongoClient(url);
  try {
    const database = client.db("notebook");
    const mainMenu = database.collection("mainMenu");
    var { userId, name } = req.body;
    const menu = { userId: userId, name: name };
    var result = await mainMenu.insertOne(menu);
    if (result == null) {
      res.send(ServiceErrorResponse("Menu not cretaed"));
    } else {
      res.send(result);
    }
  } catch (err) {
    console.log("Catttttttt" + err);
  } finally {
    await client.close();
  }
});

var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
