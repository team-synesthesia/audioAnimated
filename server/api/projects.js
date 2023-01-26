const router = require("express").Router();
const {
  models: { Project, User },
} = require("../db");
module.exports = router;

// get all projects by userId
// ensure query string is passed from front end
router.get("/", async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (userId) {
      const user = await User.findByPk(userId, {
        include: Project,
        attributes: ["id", "username"],
      });
      res.send(user.projects);
    } else {
      res.status(404).send("Not Found");
    }
  } catch (err) {
    console.error("error in All Projects GET route");
    next(err);
  }
});

// get project by projectId
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
