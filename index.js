// const express = require('express');
require('dotenv').config()
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({ 
  region: process.env.AWS_REGION,
  endpoint : "https://s3.console.aws.amazon.com/s3/buckets/myfirstawsbucket-rja?region=ap-southeast-1&bucketType=general&tab=objects",
    crendentials : {
      accessKeyId :  process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
 });

// const app = express();
// const PORT = 3000;


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

async function getObjectURL(key){
    
  const command = new GetObjectCommand({
      Bucket : "myfirstawsbucket-rja",
      Key : key,
  });
  const url = await getSignedUrl(s3Client,command);
  return url;
}

async function putObject(filename){
  
  const command = new PutObjectCommand({
    Bucket : "myfirstawsbucket-rja",
    Key : `/uploads/user-uploads/${filename}`,
    ContentType : "image/jpeg",
  });
  const url = await getSignedUrl(s3Client, command);
  return url;
}
  
      async function init(){
  // console.log("URL for graphql.jpeg", await getObjectURL("56xsus.jpg"));
   console.log("url for uplpading",await putObject(`image-${Date.now()}.jpeg`));
}

init();
// Upload route
// app.post('/upload', async(req, res) => {
//     const photo = req.body.photo; //
//     if (!photo) {
//       return res.status(400).send('No photo provided');
//   }
//     const params = {
//         Bucket: 'myfirstawsbucket-rja',
//         Key: '5v6gwj.jpg',
//         Body: Buffer.from(photo, 'base64'),
//         ContentType: 'image/jpeg'
//     };
//     try {
//         await s3Client.send(new PutObjectCommand(params));
//         console.log('File uploaded successfully');
//         res.send('File uploaded successfully');
//     } catch (err) {
//         console.error('Failed to upload photo:', err);
//         res.status(500).send('Failed to upload photo');
//     }
// });

// // Delete route
// app.delete('/delete/:photoKey', async(req, res) => {
//     const photoKey = req.params.photoKey;

//     const params = {
//         Bucket: 'myfirstawsbucket-rja',
//         Key: photoKey
//     };

//  try {
//         await s3Client.send(new DeleteObjectCommand(params));
//         console.log('File deleted successfully');
//         res.send('File deleted successfully');
//     } catch (err) {
//         console.error('Failed to delete photo:', err);
//         res.status(500).send('Failed to delete photo');
//     }
// });

// Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });





