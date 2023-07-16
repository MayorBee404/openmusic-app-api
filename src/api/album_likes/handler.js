const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(albumLikesService, albumsService) {
    this._albumLikesService = albumLikesService;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postLikeHandler(request, h) {
    const { albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.getAlbumById(albumId);

    const likedAlbum = await this._albumLikesService.checkLikeUnlike(credentialId, albumId);

    if (!likedAlbum) {
      await this._albumLikesService.addAlbumLike(credentialId, albumId);

      const response = h.response({
        status: 'success',
        message: 'Berhasil ditambahkan ke Album yang Disukai',
      });
      response.code(201);
      return response;
    }

    await this._albumLikesService.deleteAlbumLike(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Dihapus dari Album yang Disukai',
    });
    response.code(201);
    return response;
  }

  async getLikesHandler(request, h) {
    const { albumId } = request.params;

    const data = await this._albumLikesService.getAlbumLikesCount(albumId);
    const likes = data.count;

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.header('X-Data-Source', data.source);
    response.code(200);
    return response;
  }
}

module.exports = AlbumLikesHandler;
