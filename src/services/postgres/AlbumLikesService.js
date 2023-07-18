const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLikeAlbums(userid, albumid) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2 ',
      values: [userid, albumid],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      await this.userLike(userid, albumid);
    } else {
      await this.userDislike(userid, albumid);
    }

    await this._cacheService.delete(`likes:${albumid}`);
  }

  async userLike(userid, albumid) {
    const query = {
      text: 'INSERT INTO user_album_likes (id,user_id,album_id) VALUES ($1,$2,$3)',
      values: [nanoid(16), userid, albumid],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Like album gagal ditambahkan');
    }
  }

  async userDislike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Like album gagal dihapus');
    }
  }

  async getLikeAlbum(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return { likes: JSON.parse(result), isCache: 1 };
    } catch (error) {
      const query = {
        text: 'SELECT userid FROM user_album_likes where album_id = $1',
        values: [albumId],
      };

      const { result } = await this._pool.query(query);

      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(result));

      return { likes: result };
    }
  }

  async deleteAlbumLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal membatalkan suka album');
    }
    await this._cacheService.delete(`album_likes:${albumId}`);
  }

  async checkLikeUnlike(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      return false;
    }

    return true;
  }
}

module.exports = AlbumLikesService;
