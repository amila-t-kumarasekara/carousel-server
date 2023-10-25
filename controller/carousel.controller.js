const { MongoClient } = require('mongodb');

exports.carouselController = async (req, res) => {
    const { slides } = req.query;

    if (!slides || isNaN(slides) || slides > 10 || slides <= 0 || !Number.isInteger(Number(slides))) {
        return res.status(400).json({ error: 'Invalid slides parameter. The slides parameter must be a number between 1 and 10.' });
    }
  
    try {
        // Create a MongoDB client
        const client = new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true });
        // Access the MongoDB collection
        const db = client.db(process.env.DATABASE_NAME);
        const collection = db.collection(process.env.COLLECTION_NAME);
  
        // Retrieve carousel data from MongoDB
        const carouselData = await collection.find().limit(Number(slides)).toArray();
        res.json({ slides: carouselData });

    } catch (error) {
        
        console.error('Error fetching carousel data from MongoDB', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};