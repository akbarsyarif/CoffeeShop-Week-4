const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    const customFileName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, customFileName);
  },
});

const diskUpload = multer({
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

// const checkError = (err, res, next) => {
//   if (err instanceof multer.MulterError) {
//     return res.status(401).json({
//       msg: err.message,
//     });
//   }
//   if (err) {
//     if (err.message === "Only .jpg, .jpeg, and .png files are allowed") {
//       return res.status(401).json({
//         msg: err.message,
//       });
//     }
//     return res.status(500).json({
//       status: "Internal Server Error",
//       msg: err.message,
//     });
//   }
//   next();
// };

module.exports = {
  singleUpload: (fieldName) =>
    (checkError = (req, res, next) => {
      diskUpload.single(fieldName)(req, res, (err) => {
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
    }),

  multiUpload: (fieldName, maxCount = 1) => diskUpload.array(fieldName, maxCount),
  // singleUpload: (fieldName) => diskUpload.single(fieldName),
  // checkError,
};
