var restify = require('restify');
var _ = require('lodash');
// In memory store of todo list
// Obviously never do this in a real project
var todos = [];

var server = restify.createServer();

server.get('/todos/:id', function(res, req) {
  var todo = _.findWhere(todos, { id: req.params.id });
  if (todo) {
    res.json(todo);
  }
  res.status(404);
  res.end();
});

server.get('/todos/', function(res, req) {
  res.json(todos);
});

server.put('/todos/:id', function(res, req) {
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

server.patch('/todos/:id', function(res, req) {
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

server.del('/todos/:id', function(res, req) {
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
  todos.push(req.body);
  res.status(201);
  res.end();
});