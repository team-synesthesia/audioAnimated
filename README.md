# audioAnimated

An interactive web application that allows users to create music with beautiful animations that move to your music and share their creations with their freinds.

![app-screenshot](app-screenshot.png)

1. Watch our recorded demo to see what you can create: https://youtu.be/h_EGWJua-0w
2. Then Create an account
3. Record with our in-app recording software, or upload existing files into your project editor. Create music by layering and connecting tracks together.

![layer-and-record](layer-and-record.png)

4. Choose a base graphic for your project, and watch the animation move and breathe with your song.

![choose-graphic](choose-graphic.png)

5. Share with your friends by generating a sharable link.

![share-your-creation](share-your-creation.png)

## Setup

#### Database: 

* In Dev you will need to create a local postgresdb called `audioanimated`. Then run the script `script/seed.js`. This will create the schema and add the seed data for local dev. 
* In Prod you will need to set this database up somewhere of your choice then provide the environment variable `DATABASE_URL`. E.g.: 

  DATABASE_URL="postgresql://<username>:<password>@<host-address>:<port>/<dbname>"

#### File storage: 
  
The music files are now stored in an s3 bucket in AWS for both develepment and production running of the application. You will need to create an AWS account, create and s3 bucket and allow access via `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

### Environment variables

You will need to provide these environment variables in dev and prod:
  
A `.env` file is required to run this app in development.

1. Add a `.env` in the root dir of this repo
2. add these variables:

```
AWS_ACCESS_KEY_ID=xxx // as mentioned above
AWS_SECRET_ACCESS_KEY=xxx // as mentioned above
S3_BUCKET_NAME=audioanimated // or whatever you call the bucket
S3_REGION=us-east-2 // choose the same region that you web server uses
S3_ENV_PREFIX=dev // this is just a prefix in the bucket to separate files between environments

// prod only: 
DATABASE_URL="postgresql://<username>:<password>@<host-address>:<port>/<dbname>" // only needed in prod
```

audio files that are uploaded or created in the app will be saved in the s3 bucket.

### Development

- install all required packages using `$ npm install`
- You will need to have postgreSQL installed in your local dev env.
- create the database `audioanimated`
- Seed the database by running `$ npm run seed`
- Run the app in dev by running both :
  - `$ npm run server`
  - `$ npm run client`
