const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: handler.postLikeAlbumHandler,
    options: {
      auth: 'openmusik_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: handler.getLikeAlbumHandler,
    options: {
      auth: 'openmusik_jwt',
    },
  },
];

module.exports = routes;
