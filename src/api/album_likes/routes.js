const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{albumId}/likes',
    handler: handler.postLikeHandler,
    options: {
      auth: 'openmusik_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{albumId}/likes',
    handler: handler.getLikesHandler,

  },
];

module.exports = routes;
