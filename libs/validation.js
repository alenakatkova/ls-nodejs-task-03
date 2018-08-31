module.exports = {
  validateFields: (fields) => {
    for (let field in fields) {
      if (!fields[field]) return false;
    }
    return true;
  },

  validateUpload: (file) => {
    if (file.name === '' || file.size === 0) {
      return false;
    }
    return true;
  }
};
