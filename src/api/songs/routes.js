const routes = (handler) => [
  {
    method: 'GET',
    path: '/songs',
    handler: handler.list,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getById,
  },
  {
    method: 'POST',
    path: '/songs',
    handler: handler.create,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.update,
  },
];
