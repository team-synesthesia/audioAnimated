const router = require("express").Router();
const {
  models: { Project, user_projects },
} = require("../db");
module.exports = router;

// fix this so that it only gets project by userId!!!
// router.get("/:id", async (req, res, next) => {
//   try {
//     const userId = req.params.id;
//     const projects = await user_projects.findAll({
//       where: { userId: userId },
//     });
//     res.send(projects);
//   } catch (err) {
//     console.error("error in All Projects GET route");
//     next(err);
//   }
// });

router.get("/:id", async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findByPk(projectId);
    res.send(project);
  } catch (err) {
    console.error("error in Single Projects GET route");
    next(err);
  }
});
