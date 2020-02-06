const multer = require("multer");
const uuid4 = require("uuid/v4");
let DIR = __dirname.split("/services");
DIR = DIR[0] + "/public/assets";
module.exports = function() {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
      cb(null, uuid4() + "-" + Date.now() + "-" + fileName);
    }
  });

  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
      }
    }
  });
  return upload;
};
