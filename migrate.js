const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' }); // Loads your URI

async function migrate() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Error: MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas...");

    const sourceDb = client.db("puneri_mallus"); // Source (Old/Typo)
    const targetDb = client.db("punerimallus");  // Target (New/Correct)

    // Automatically find all collections in the source database
    const collections = await sourceDb.listCollections().toArray();

    for (const collInfo of collections) {
      const collName = collInfo.name;
      
      // Skip system collections
      if (collName.startsWith("system.")) continue;

      const sourceCollection = sourceDb.collection(collName);
      const documents = await sourceCollection.find({}).toArray();

      if (documents.length > 0) {
        console.log(`🚀 Moving ${documents.length} docs from [${collName}]...`);
        
        // Use insertMany to keep the same _id (BSON)
        await targetDb.collection(collName).insertMany(documents);
        console.log(`✅ ${collName} migration successful.`);
      } else {
        console.log(`ℹ️ ${collName} is empty, skipping.`);
      }
    }

    console.log("\n--- ALL NODES TRANSFERRED ---");
    console.log("Verify your data in MongoDB Compass, then delete the old DB.");

  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.close();
  }
}

migrate();