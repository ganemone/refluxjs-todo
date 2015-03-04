var express = require('express');
var path = require('path');
var _ = require('lodash');
var BodyParser = require('body-parser');
// In memory store of todo list
// Obviously never do this in a real project
var todos = [];

var server = express();

server.use(BodyParser.json());

server.get('/todos/:id', function(req, res) {
  var todo = _.findWhere(todos, { id: req.params.id });
  if (todo) {
    res.json(todo);
  }
  res.status(404);
  res.end();
});

server.get('/todos/', function(req, res) {
  res.json(todos);
});

server.put('/todos/:id', function(req, res) {
  var todo = _.findWhere(todos, { id: req.params.id });
  if (todo) {
    for(var prop in req.body.data) {
      if (req.body.data.hasOwnProperty(prop)) {
        todo[prop] = req.body.data[prop];
      }
    }
    return res.status(200).end();
  }
  todo = req.body.data;
  todo.id = req.params.id;
  todos.push(todo);
  res.status(201).end();
});

server.patch('/todos/:id', function(req, res) {
  var todo = _.findWhere(todos, { id: req.params.id });
  if (todo) {
    for(var prop in req.body.data) {
      if (req.body.data.hasOwnProperty(prop)) {
        todo[prop] = req.body.data[prop];
      }
    }
    return res.status(200).end();
  }
  return res.status(204).end();
});

server.delete('/todos/:id', function(req, res) {
  var found = false;
  todos = _.filter(todos, function(todo) {
    if (todo.id === req.params.id) {
      found = true;
      return true;
    }
    return false;
  });
  if (found) {
    return res.status(200).end();
  }
  return res.status(204).end();
});

server.post('/todos/', function(req, res) {
  console.log('Received Body: ', req.body);
  todos.push(req.body);
  console.log('New todos: ', todos);
  res.status(201);
  res.end();
});

server.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

server.use(express.static(path.join(__dirname, '../public')));

server.listen(8080);