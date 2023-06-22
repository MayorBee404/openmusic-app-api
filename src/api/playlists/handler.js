const autoBind = require('auto-bind');
const PlaylistSongsService = require('../../services/postgres/PlaylistSongsService');

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
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._playlistsService.addPlaylist(
      name,
      credentialId,
    );
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
    const playlists = await this._playlistsService.getPlaylists(credentialId);
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
    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsService.deletePlaylist(playlistId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validateUpdateSongPlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    const { songId } = request.payload;
    const action = 'add';

    await this._songsService.getSongById(songId);
    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    await this._playlistSongsService.addSongToPlaylist(id, songId);
    await this._playlistSongActivitiesService.addSongActivity(id, songId, credentialId, action);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke dalam playlist',
    });

    response.code(201);
    return response;
  }

  async getSongsInPlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    const playlist = await this._playlistsService.getPlaylistById(id, credentialId);
    const songs = await this._playlistSongsService.getSongsInPlaylist(id);

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
    await this._playlistSongsService.deleteSongFromPlaylist(id, songId);

    await this._playlistSongActivitiesService.addSongActivity(id, songId, credentialId, action);

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
