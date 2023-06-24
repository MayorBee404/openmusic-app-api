const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(
    playlistsService,
    usersService,
    service,
    validator,
  ) {
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._usersService.getUserById(userId);
      const collaborationId = await this._service.addCollaboration(
        playlistId,
        userId,
      );

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async deleteCollaborationHandler(request) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._usersService.getUserById(userId);
      await this._service.deleteCollaboration(
        playlistId,
        userId,
      );

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

module.exports = CollaborationsHandler;
