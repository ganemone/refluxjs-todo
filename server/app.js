var path = require('path');
var fortune = require('fortune');
var express = require('express');

var app = fortune({
    db: 'reflux_todo',
  })
  .resource('todo', {
    label: String,
    created: Date,
    isComplete: Boolean
  });

var _app = app.router;

_app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// _app.get('bower_components/todomvc-common/base.css', function(req, res) {
//   res.sendFile(path.join(__dirname, '../bower_components/todomvc-common/base.css'));
// });

_app.use(express.static(path.join(__dirname, '../public')));

app.listen(8080);