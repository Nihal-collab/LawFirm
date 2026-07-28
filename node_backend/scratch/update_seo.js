require('dotenv').config();
const mongoose = require('mongoose');
const SeoMetadata = require('../src/models/SeoMetadata');

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sr4ipr_lawfirm';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB at:', mongoUri);

    const records = await SeoMetadata.find({});
    console.log(`Found ${records.length} custom SEO Metadata records in DB.`);

    let updatedCount = 0;
    for (const record of records) {
      let changed = false;

      if (record.title && record.title.includes('SR4IPR Partners')) {
        record.title = record.title.replace(/SR4IPR Partners/g, 'ROOTS-IP Partners');
        changed = true;
      }
      if (record.title && record.title.includes('ROOTSIP')) {
        record.title = record.title.replace(/ROOTSIP/g, 'ROOTS-IP');
        changed = true;
      }
      if (record.title && record.title.includes('SR4IPR')) {
        record.title = record.title.replace(/SR4IPR/g, 'ROOTS-IP');
        changed = true;
      }

      if (record.meta_description && record.meta_description.includes('SR4IPR Partners')) {
        record.meta_description = record.meta_description.replace(/SR4IPR Partners/g, 'ROOTS-IP Partners');
        changed = true;
      }
      if (record.meta_description && record.meta_description.includes('ROOTSIP')) {
        record.meta_description = record.meta_description.replace(/ROOTSIP/g, 'ROOTS-IP');
        changed = true;
      }
      if (record.meta_description && record.meta_description.includes('SR4IPR')) {
        record.meta_description = record.meta_description.replace(/SR4IPR/g, 'ROOTS-IP');
        changed = true;
      }

      if (changed) {
        await record.save();
        updatedCount++;
        console.log(`Updated path: ${record.path} to title: "${record.title}"`);
      }
    }

    console.log(`✅ Successfully updated ${updatedCount} records.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during update:', err);
    process.exit(1);
  }
};

run();
