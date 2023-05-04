BEGIN;

\COPY files TO '/Users/dirtyflagnotspecified/files.csv' WITH (FORMAT CSV, HEADER);
\COPY projects TO '/Users/dirtyflagnotspecified/projects.csv' WITH (FORMAT CSV, HEADER);
\COPY sections TO '/Users/dirtyflagnotspecified/sections.csv' WITH (FORMAT CSV, HEADER);
\COPY user_projects TO '/Users/dirtyflagnotspecified/user_projects.csv' WITH (FORMAT CSV, HEADER);
\COPY users TO '/Users/dirtyflagnotspecified/users.csv' WITH  (FORMAT CSV, HEADER);

COMMIT; 
ROLLBACK;