const InvariantError = require('../../exceptions/InvariantError');
const { ImageCoverAlbumsSchema } = require('./schema');

const UploadsValidator = {
  validateImageCoverAlbums: (cover) => {
    const validationResult = ImageCoverAlbumsSchema.validate(cover);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.messsage);
    }
  },
};

module.exports = UploadsValidator;
