require('dotenv').config();
const mongoose = require('mongoose');

const sourceUri = process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/sr4ipr_lawfirm';
const targetUri = process.env.ATLAS_MONGO_URI || process.env.MONGO_URI;

if (!targetUri) {
  console.error('❌ Missing Atlas connection string. Set MONGO_URI or ATLAS_MONGO_URI in .env');
  process.exit(1);
}

const isSystemCollection = (name) => name.startsWith('system.');

const cloneCollections = async (sourceConn, targetConn) => {
  const collections = await sourceConn.db.listCollections().toArray();
  const collectionNames = collections
    .map((collection) => collection.name)
    .filter((name) => !isSystemCollection(name));

  if (collectionNames.length === 0) {
    console.log('ℹ️  No collections found in the local database.');
    return;
  }

  for (const collectionName of collectionNames) {
    const sourceCollection = sourceConn.collection(collectionName);
    const targetCollection = targetConn.collection(collectionName);
    const documents = await sourceCollection.find({}).toArray();

    await targetCollection.deleteMany({});

    if (documents.length > 0) {
      await targetCollection.insertMany(documents, { ordered: false });
    }

    console.log(`✅ Copied ${documents.length} document(s) into ${collectionName}`);
  }
};

const run = async () => {
  let sourceConn;
  let targetConn;

  try {
    sourceConn = await mongoose.createConnection(sourceUri).asPromise();
    targetConn = await mongoose.createConnection(targetUri).asPromise();

    console.log(`📥 Source: ${sourceUri}`);
    console.log(`📤 Target: ${targetUri}`);

    await cloneCollections(sourceConn, targetConn);

    console.log('\n🎉 Local database copied to Atlas successfully.');
  } catch (error) {
    if (error?.message?.includes('ECONNREFUSED')) {
      console.error(`❌ Cannot connect to the local MongoDB source at ${sourceUri}`);
      console.error('Start your local MongoDB server or set LOCAL_MONGO_URI to the correct source database.');
    } else {
      console.error('❌ Migration failed:', error.message);
    }
    process.exitCode = 1;
  } finally {
    if (sourceConn) {
      await sourceConn.close();
    }
    if (targetConn) {
      await targetConn.close();
    }
  }
};

run();