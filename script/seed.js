"use strict";

const {
  db,
  models: { User, Project, Section, File, user_projects },
} = require("../server/db");

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log("db synced!");

  const users = await Promise.all([
    User.create({ username: "cody", password: "123" }),
    User.create({ username: "murphy", password: "123" }),
  ]);

  const projects = await Promise.all([
    Project.create({ name: "project1" }),
    Project.create({ name: "project2" }),
  ]);

  const sections = await Promise.all([
    Section.create({ projectId: 1, sectionNumber: 1 }),
    Section.create({ projectId: 1, sectionNumber: 2 }),
    Section.create({ projectId: 1, sectionNumber: 3 }),
    Section.create({ projectId: 2, sectionNumber: 1 }),
    Section.create({ projectId: 2, sectionNumber: 2 }),
  ]);

  const files = await Promise.all([
    File.create({ name: "file1", sectionId: 1 }),
    File.create({ name: "file2", sectionId: 1 }),
    File.create({ name: "file3", sectionId: 2 }),
    File.create({ name: "file4", sectionId: 3 }),
    File.create({ name: "file5", sectionId: 4 }),
  ]);

  console.log(
    `seeded ${users.length} users, ${projects.length} projects, ${sections.length} sections, and ${files.length} files`
  );

  console.log(`seeded successfully`);
  return {
    users: {
      cody: users[0],
      murphy: users[1],
    },
    projects,
    sections,
  };
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
    await user_projects.create({ userId: 1, projectId: 1 });
    await user_projects.create({ userId: 1, projectId: 2 });
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
