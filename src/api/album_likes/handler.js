const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(service, albumsService) {
    this._service = service;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const albumId = request.params.id;

    await this._service.addAlbumLike(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Like pada Album berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikeByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const albumId = request.params.id;

    await this._service.deleteAlbumLike(credentialId, albumId);

    return {
      status: 'success',
      message: 'Like pada Album berhasil dihapus',
    };
  }

  async getAlbumLikeByIdHandler(request, h) {
    const albumId = request.params.id;
    const likesData = await this._service.getAlbumLikeById(albumId);

    const { likesCount, source } = likesData;

    const tempLikeCount = JSON.parse(likesCount);

    const response = h.response({
      status: 'success',
      data: {
        likes: tempLikeCount,
      },
    });

    response.header('X-Data-Source', source);

    return response;
  }

  async getLikeAlbumHandler(request, h) {
    const { albumId } = request.params;
    const { likes, isCache = 0 } = await this._service.getLikeAlbum(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: likes.length,
      },
    });
    response.code(200);

    if (isCache) response.header('X-Data-Source', 'cache');
    return response;
  }
}

module.exports = AlbumLikesHandler;
