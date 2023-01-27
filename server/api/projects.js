const router = require("express").Router();
const {
  models: { Project, Section, File, User },
} = require("../db");
module.exports = router;

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
    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: Section,
          order: "createdAt",
          include: { model: File, order: "id" },
        },
      ],
    });
    res.send(project);
  } catch (err) {
    console.error("error in Single Projects GET route");
    next(err);
  }
});
