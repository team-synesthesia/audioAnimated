const fs = require("fs");
const router = require("express").Router();
module.exports = router;
require("dotenv").config();

router.get("/", (req, res, next) => {
  const { projectId, filePath } = req.query;
  const fullFilepath =
    process.env.AUDIO_DATA_DIR + "/" + projectId + "/" + filePath;
  fs.readFile(fullFilepath, { encoding: "base64" }, (err, data) => {
    if (err) {
      res.status(500).send("problem");
    } else {
      console.log("read file in");
      res.status(200).send(data);
    }
  });
});
