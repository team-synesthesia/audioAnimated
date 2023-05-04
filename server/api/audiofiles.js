const router = require("express").Router();

const {
  requireToken,
  requireTokenOrShareable,
  isYourProject,
  isYourProjectOrShareable,
} = require("../gatekeeper");

module.exports = router;

const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    ACL: "public-read",
    key: function (req, file, cb) {
      const { projectId, filePath } = req.query;
      const key = process.env.S3_ENV_PREFIX + "/" + projectId + "/" + filePath;
      cb(null, key);
    },
  }),
});

router.get(
  "/",
  requireTokenOrShareable,
  isYourProjectOrShareable,
  async (req, res, next) => {
    const { projectId, filePath } = req.query;
    const key = process.env.S3_ENV_PREFIX + "/" + projectId + "/" + filePath;
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };
    try {
      const command = new GetObjectCommand(params);
      const response = await s3.send(command);
      const chunks = [];
      for await (const chunk of response.Body) {
        chunks.push(chunk);
      }
      const data = Buffer.concat(chunks);
      const base64Audio = data.toString("base64");
      res.status(200).send(base64Audio);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/",
  requireToken,
  isYourProject,
  upload.single("audiofile"),
  async (req, res, next) => {
    try {
      const { filePath } = req.query;
      res.status(201).send(`${filePath}`);
    } catch (err) {
      next(err);
    }
  }
);
