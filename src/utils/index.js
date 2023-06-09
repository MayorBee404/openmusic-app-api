const mapAlbums = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

module.exports = { mapAlbums };

const mapSongs = ({
  id,
  title,
  duration,
  albumId,
}) => ({
  id,
  title,
  duration,
  albumId,
});

module.exports = { mapSongs };
