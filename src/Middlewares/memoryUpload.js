const multer = require("multer");

const storage = multer.memoryStorage();

const memoryUpload = multer({
  storage,
  limits: {
    fileSize: 2e6,
  },
  fileFilter: (req, file, cb) => {
    const pattern = /jpg|png|jpeg/i;
    const ext = path.extname(file.originalname);

    if (!pattern.test(ext)) {
      cb(null, false);
      return cb(new Error("Only .jpg, .jpeg, and .png files are allowed"));
    }

    cb(null, true);
  },
});

module.exports = {
  singleUpload: (fieldName) => (req, res, next) => {
    memoryUpload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          msg: err.message,
        });
      }
      if (err) {
        if (err.message === "Only .jpg, .jpeg, and .png files are allowed") {
          return res.status(400).json({
            msg: err.message,
          });
        }
        return res.status(500).json({
          status: "Internal Server Error",
          msg: err.message,
        });
      }
      next();
    });
  },

  multiUpload: (fieldName, maxCount = 1) => memoryUpload.array(fieldName, maxCount),
  // singleUpload: (fieldName) => diskUpload.single(fieldName),
  // checkError,
};
