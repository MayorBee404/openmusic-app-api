const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._songs = [];
  }

  addSong({
    title, year, performer, duration, genre, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const newSong = {
      id,
      title,
      year,
      performer,
      duration,
      genre,
      albumId,
    };
    this._songs.push(newSong);
    const isSucces = this._songs.filter((song) => song.id === id).length > 0;
    if (!isSucces) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }
    return id;
  }

  getSongs() {
    return this._songs;
  }

  getSongById(id) {
    const song = this._songs.filter((n) => n.id === id)[0];
    if (!song) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return song;
  }

  editSongById(id, {
    title, year, performer, duration, genre, albumId,
  }) {
    const index = this._songs.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    this._songs[index] = {
      ...this._songs[index],
      title,
      year,
      performer,
      duration,
      genre,
      albumId,
    };
  }

  deleteSongById(id) {
    const index = this._songs.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    this._songs.splice(index, 1);
  }
}

module.exports = SongsService;
