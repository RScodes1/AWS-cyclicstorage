const express = require('express');
const multer = require('multer');
require('dotenv').config()
const app = express();

const upload = multer({ dest: 'uploads/' });
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Read the file from the local path
        const fileContent = fs.readFileSync(req.file.path);

        const params = {
            Bucket: BUCKET,
            Key: req.file.originalname,
            Body: fileContent
        };
        const result = await s3.upload(params).promise();

        res.send('File uploaded successfully: ' + result.Key);
    } catch (error) {
        res.status(500).send('Error uploading file: ' + error.message);
    }
});


app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});