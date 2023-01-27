const fs = require("fs");
const router = require("express").Router();
module.exports = router;
require("dotenv").config();

router.get("/:filename", (req, res, next) => {
  const filename = req.params.filename;
  const filepath = process.env.AUDIO_DATA_DIR + "/" + filename;
  fs.readFile(filepath, { encoding: "base64" }, (err, data) => {
    if (err) {
      res.status(500).send("problem");
    } else {
      console.log("read file in");
      res.status(200).send(data);
    }
  });
});
