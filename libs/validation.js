module.exports = {
  validateFields: (fields) => {
    for (let field in fields) {
      if (!fields[field]) return false;
    }
    return true;
  },

  validateUpload: (file) => {
    return file.name === '' || file.size === 0;
  }
};
