const multer = require("multer");
const path = require("path");

module.exports = {
  storage: new multer.diskStorage({
    destination: path.resolve(__dirname, ".", "uploads"),
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    },
  }),
  limits: { fileSize: "10000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: Only JPEG and PNG\'s accepted");
  },
};
