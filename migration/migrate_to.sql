BEGIN;

\copy public.users FROM '/Users/dirtyflagnotspecified/users.csv' WITH (FORMAT CSV, HEADER);
\copy public.projects FROM '/Users/dirtyflagnotspecified/projects.csv' WITH (FORMAT CSV, HEADER);
\copy public.sections FROM '/Users/dirtyflagnotspecified/sections.csv' WITH (FORMAT CSV, HEADER);
\copy public.files FROM '/Users/dirtyflagnotspecified/files.csv' WITH (FORMAT CSV, HEADER);
\copy public.user_projects FROM '/Users/dirtyflagnotspecified/user_projects.csv' WITH (FORMAT CSV, HEADER);

-- Update the sequences for each table
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects));
SELECT setval('sections_id_seq', (SELECT MAX(id) FROM sections));
SELECT setval('files_id_seq', (SELECT MAX(id) FROM files));

COMMIT;
ROLLBACK;