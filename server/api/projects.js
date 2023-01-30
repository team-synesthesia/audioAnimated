const router = require("express").Router();
const {
  models: { Project, Section, File, User, user_projects },
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

router.post("/", async (req, res, next) => {
  try {
    const { name, userId } = req.body;
    const user = await User.findByPk(userId);
    const existingProjects = await Project.findAll({
      where: { "$users.id$": userId, name },
      include: User,
    });
    if (existingProjects.length) {
      res.status(405).send("Project names must be unique for each user");
    }
    if (!user) {
      res.status(405).send("You need a user account to create a project");
    }

    const project = await Project.create({ name });
    const user_project = await user_projects.create({
      userId,
      projectId: project.id,
    });
    res.send(project);
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
          order: "id",
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
