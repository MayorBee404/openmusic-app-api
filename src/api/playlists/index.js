const routes = require('./routes');
const PlaylistsHandler = require('./handler');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (
    server,
    {
      playlistsService,
      playlistSongsService,
      playlistSongActivitiesService,
      validator,
    },
  ) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsService,
      playlistSongsService,
      playlistSongActivitiesService,
      validator,
    );

    server.route(routes({
      playlistsHandler,
    }));
  },

};
