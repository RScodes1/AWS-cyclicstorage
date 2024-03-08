const express = require('express');
const app = express();
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const bodyParser = require('body-parser');
require('dotenv').config()
app.use(bodyParser.json());

// curl -i https://some-app.cyclic.app/myFile.txt
app.get('*', async (req, res) => {
  let filename = req.path.slice(1);

  try {
    let s3File = await s3.getObject({
      Bucket: process.env.BUCKET,
      Key: filename,
    }).promise();

    res.set('Content-type', s3File.ContentType);
    res.send(s3File.Body.toString()).end();
  } catch (error) {
    if (error.code === 'NoSuchKey') {
      console.log(`No such key ${filename}`);
      res.sendStatus(404).end();
    } else {
      console.log(error);
      res.sendStatus(500).end();
    }
  }
});

// POST route for uploading files
app.post('/upload', async (req, res) => {
  let filename = req.body.filename;
  let content = req.body.content;

  try {
    let base64Data = Buffer.from(content, 'base64');

    await s3.putObject({
      Bucket: process.env.BUCKET,
      Key: filename,
      Body: base64Data
    }).promise();

    res.send('File uploaded successfully').end();
  } catch (error) {
    console.log(error);
    res.sendStatus(500).end();
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
