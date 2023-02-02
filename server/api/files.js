const router = require("express").Router();
const {
  models: { File, Section },
} = require("../db");
module.exports = router;

router.post("/", async (req, res, next) => {
  try {
    let { projectId, sectionNumber, filePath, name, type, userId } = req.body;
    if (typeof sectionNumber === "undefined") {
      sectionNumber = 0;
    }
    let section = await Section.findOne({ where: { sectionNumber } });
    if (!section) section = await Section.create({ projectId, sectionNumber });

    const newFile = await File.create({
      name,
      filePath,
      type,
      sectionId: section.id,
      userId,
    });
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
