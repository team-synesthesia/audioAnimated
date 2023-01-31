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

router.delete("/:id", async (req, res, next) => {
  try {
    const fileToDelete = await File.findByPk(req.params.id);
    const deletedFile = await fileToDelete.destroy();
    res.status(202).send(deletedFile);
  } catch (err) {
    next(err);
  }
});
