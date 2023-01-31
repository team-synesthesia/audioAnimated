const fs = require("fs");
const router = require("express").Router();
const {
  models: { File },
} = require("../db");
module.exports = router;
require("dotenv").config();

router.get("/", (req, res, next) => {
  const { projectId, filePath } = req.query;
  const fullFilepath =
    process.env.AUDIO_DATA_DIR + "/" + projectId + "/" + filePath;
  fs.readFile(fullFilepath, { encoding: "base64" }, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("problem");
    } else {
      console.log("read file in");
      res.status(200).send(data);
    }
  });
});

router.post("/", async (req, res, next) => {
  try {
    const newFile = await File.create(req.body);
    res.status(201).send(newFile);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const fileToDelete = await File.findByPk(req.params.id);
    const deletedFile = await fileToDelete.destroy();
    res.status(202).send(deletedFile);
  } catch (err) {
    next(err);
  }
});
