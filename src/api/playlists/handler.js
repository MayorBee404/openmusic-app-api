const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(
    playlistsService,
    songsService,
    validator,
    collaborationsService,
    playlistSongsService,
    playlistSongActivitiesService,
  ) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;
    this._collaborationsService = collaborationsService;
    this._playlistSongsService = playlistSongsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { name } = request.payload;
    const playlistId = await this._playlistsService.addPlaylist({
      owner: credentialId,
      name,
    });
    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists({ owner: credentialId });
    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
    response.code(200);
    return response;
  }

  async deletePlaylistHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(id, credentialId);
    await this._playlistsService.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validateUpdateSongPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { owner: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const action = 'add';
    await this._playlistSongActivitiesService.addSongActivities(
      playlistId,
      songId,
      credentialId,
      action,
    );

    const playlistSongId = await this._playlistSongsService.addSongToPlaylist({
      playlistId,
      songId,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dimasukan keldalam playlists',
      data: {
        playlistSongId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsInPlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._playlistsService.getPlaylistById(playlistId, credentialId);
    const songs = await this._playlistSongsService.getSongInPlaylistById(playlistId);

    const response = h.response({
      status: 'success',
      data: {
        playlist: {
          ...playlist,
          songs,
        },
      },
    });
  }

  async deleteSongInPlaylistHandler(request, h) {
    this._validator.validateUpdateSongPlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    const { songId } = request.payload;
    const action = 'delete';

    await this._songsService.getSongById(songId);
    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    await this._playlistSongsService.deleteSongInPlaylist({ playlistId: id, songId });

    await this._playlistSongActivitiesService.addSongActivities(id, songId, credentialId, action);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
  }

  async getSongActivitiesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;

    await this._playlistsService.checkPlaylists(id);
    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    const activities = await this._playlistSongActivitiesService.getSongActivities(id);

    const response = h.response({
      status: 'success',
      data: {
        playlistId: id,
        activities,
      },
    });
  }
}

module.exports = PlaylistsHandler;
