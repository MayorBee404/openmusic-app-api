const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'openmusik_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistHandler,
    options: {
      auth: 'openmusik_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deletePlaylistHandler,
    options: {
      auth: 'openmusik_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postSongToPlaylistHandler,
    options: {
      auth: 'openmusik_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getSongFromPlaylistHandler,
    options: {
      auth: 'openmusik_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deleteSongFromPlaylistHandler,
    options: {
      auth: 'openmusik_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: handler.getSongActivitiesHandler,
    options: {
      auth: 'openmusik_jwt',
    },
  },

];

module.exports = routes;
