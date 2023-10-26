const { MongoClient } = require('mongodb');

// Create a MongoDB client
const client = new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true });

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
        const formattedCarouselData = carouselData.map(item => ({
            title: item.title,
            subTitle: item.subTitle,
            image: `${process.env.SERVER_URL}/${item.imageLocation}`, // Assuming images are stored in the 'images' folder
        }));

        return res.json({ slides: formattedCarouselData });

    } catch (error) {
        
        console.error('Error fetching carousel data from MongoDB', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

};

exports.storeCarouselController = async (req, res) => {
    const { title, subTitle } = req.body;
    const imageLocation = `images/${req.file.filename}`;

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