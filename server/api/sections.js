const router = require("express").Router();
const {
  models: { Section, File },
} = require("../db");
module.exports = router;

router.post("/", async (req, res, next) => {
  try {
    const { projectId } = req.body;
    const existingSections = await Section.findAll({ where: { projectId } });
    let sectionNumber;
    if (existingSections.length) sectionNumber = existingSections.length + 1;
    else sectionNumber = 1;
    const section = await Section.create({ sectionNumber, projectId });
    res.send(section);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const sectionToDelete = await Section.findByPk(req.params.id);
    const filesToDelete = await File.findAll({
      where: { sectionId: sectionToDelete.id },
    });
    for (let file of filesToDelete) {
      console.log(file);
      await file.destroy();
    }
    const deletedSection = await sectionToDelete.destroy();
    res.status(202).send(deletedSection);
  } catch (err) {
    next(err);
  }
});
