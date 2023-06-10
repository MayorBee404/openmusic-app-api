const { server } = require('@hapi/hapi');
const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',

  register: async (service, validator) => {
    const albumsHandler = new AlbumsHandler(service, validator);
  },
};
