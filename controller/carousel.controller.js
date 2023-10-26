const { MongoClient } = require('mongodb');
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/aws");

// Create a MongoDB client
const client = new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true });


// Define a utility function to convert a stream to a buffer
function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}


exports.carouselController = async (req, res) => {
    const { slides } = req.query;

    if (!slides || isNaN(slides) || slides > 10 || slides <= 0 || !Number.isInteger(Number(slides))) {
        return res.status(400).json({ error: 'Invalid slides parameter. The slides parameter must be a number between 1 and 10.' });
    }
  
    try {
        // Access the MongoDB collection
        const db = client.db(process.env.DATABASE_NAME);
        const collection = db.collection(process.env.COLLECTION_NAME);
  
        // Retrieve carousel data from MongoDB
        const carouselData = await collection.find().limit(Number(slides)).toArray();
        // Map the data to include the image URL
        const formattedCarouselData = await Promise.all(carouselData.map(async item => {
            // Use the key or path to the image in your S3 bucket
            const key = item.imageLocation; 

            // Fetch the image data from S3 using the S3Client
            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME, // Replace with your S3 bucket name
                Key: key,
            };
            const { Body } = await s3.send(new GetObjectCommand(params));
           // Convert the stream to a buffer
            const imageData = await streamToBuffer(Body);

            return {
                title: item.title,
                subTitle: item.subTitle,
                image: imageData.toString('base64'), // Convert to base64, // Include image data
            };
        }));

        return res.json({ slides: formattedCarouselData });

    } catch (error) {
        
        console.error('Error fetching carousel data from MongoDB', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

};

exports.storeCarouselController = async (req, res) => {
    const { title, subTitle } = req.body;
    const imageLocation = req.file.key;

    try {
      const db = client.db(process.env.DATABASE_NAME);
      const collection = db.collection(process.env.COLLECTION_NAME);
  
      // Save data in MongoDB
      await collection.insertOne({ title, subTitle, imageLocation });
  
      return res.json({ message: 'Data saved successfully' });
    } catch (error) {
      console.error('Error saving data in MongoDB', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
};