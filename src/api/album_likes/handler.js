const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(service, albumsService) {
    this._service = service;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postLikeAlbumHandler(request, h) {
    const { id } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumsService.getAlbumById(id);
    await this._service.addLikeAlbums(userId, id);
    const response = h.response({
      status: 'success',
      message: 'Like album berhasil ditambahkan ke daftar ',
    });
    response.code(201);
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
