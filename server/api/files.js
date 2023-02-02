const router = require("express").Router();
const {
  models: { File },
} = require("../db");
module.exports = router;

router.post("/", async (req, res, next) => {
  try {
    const newFile = await File.create(req.body);
    res.status(201).send(newFile);
  } catch (err) {
    next(err);
  }
});

router.delete("/:name", async (req, res, next) => {
  try {
    const filesToDelete = await File.findAll({
      where: { name: req.params.name },
    });
    for (let file of filesToDelete) {
      await file.destroy();
    }
    res.status(202).send("sent");
  } catch (err) {
    next(err);
  }
});
