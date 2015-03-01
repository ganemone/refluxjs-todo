var createAPI = require('reflux-rest');

var resource = {
  resource: {
    'name': 'todo',
    'structure': {
      'id': true,
      'created': true,
      'completed': true,
      'label': true
    },
  },
  methods: {
    'post': true,
    'get': true,
    'put': true,
    'patch': true,
    'delete': true,
    'update': 'patch'
  },
  otherActions: [{
    name: 'toggleItem',
    endpoint: 'item/toggle',
    method: 'patch'
  }, {
    name: 'toggleAll',
    method: 'post'
  }, {
    name: 'clearCompleted',
    method: 'patch'
  }]
};

var { model, actions } = createAPI(resource);

exports.model = model;
exports.actions = actions;