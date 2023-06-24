/* eslint-disable camelcase */
const mapAlbums = ({
  id,
  name,
  year,
  created_at,
  updated_at,
}) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapSongs = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

const mapSong = ({
  song_id,
  song_title,
  performer,
}) => ({
  id: song_id,
  title: song_title,
  performer,
});

const mapPlaylist = ({
  id,
  name,
  username,
}) => ({
  id,
  name,
  username,
});

const mapActivity = ({
  username,
  title,
  action,
  time,
}) => ({
  username,
  title,
  action,
  time,
});

module.exports = {
  mapSongs, mapAlbums, mapSong, mapPlaylist, mapActivity,
};
