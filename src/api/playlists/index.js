const routes = require('./routes');
const PlaylistsHandler = require('./handler');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {
    playlistsService,
    songsService,
    validator,
    collaborationsService,
    playlistSongsService,
    playlistSongActivitiesService,
  }) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsService,
      songsService,
      validator,
      collaborationsService,
      playlistSongsService,
      playlistSongActivitiesService,
    );
    server.route(routes(playlistsHandler));
  },
};
