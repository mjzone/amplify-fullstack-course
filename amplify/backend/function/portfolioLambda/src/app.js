const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bodyParser = require('body-parser');
const express = require('express');
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = "portfolio";
const partitionKeyType = "S";
const userIdPresent = false;
AWS.config.update({ region: process.env.TABLE_REGION });

// Declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

// HTTP GET
app.get("/portfolio/:id", function (req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params["id"] = req.apiGateway.event.requestContext.identity.cognitoIdentityId;
  } else {
    params["id"] = req.params["id"];
    try {
      params["id"] = convertUrlType(req.params["id"], partitionKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.get(getItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err.message });
    } else {
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data);
      }
    }
  });
});

// HTTP PUT
app.put("/portfolio", function (req, res) {
  req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId;
  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body });
    } else {
      res.json({ success: 'put call succeed!', url: req.url, data: data })
    }
  });
});

// HTTP POST
app.post("/portfolio", function (req, res) {
  req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId;
  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body });
    } else {
      res.json({ success: 'post call succeed!', url: req.url, data: data })
    }
  });
});

// HTTP DELETE
app.delete("/portfolio", function (req, res) {
  var params = {};
  params["id"] = req.apiGateway.event.requestContext.identity.cognitoIdentityId;
  let removeItemParams = {
    TableName: tableName,
    Key: params
  }
  dynamodb.delete(removeItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url });
    } else {
      res.json({ url: req.url, data: data });
    }
  });
});

app.listen(3000, function () {
  console.log("App started");
});

module.exports = app
