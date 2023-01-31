const router = require("express").Router();
const {
  models: { Section },
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
