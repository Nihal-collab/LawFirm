const mongoose = require('./node_modules/mongoose');
const User = require('./src/models/User'); // Register User model schema
const app = require('./app'); // Load our backend express app
const http = require('http');
const crypto = require('crypto');

const TEST_PORT = 5002; // Use a different port to avoid conflicts
const BASE_URL = `http://localhost:${TEST_PORT}/api`;

function postJSON(url, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const body = JSON.stringify(data);
    
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(raw) });
        } catch {
          resolve({ status: res.statusCode, raw });
        }
      });
    });
    
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function runTests() {
  console.log('--- PASSWORD RESET FLOW INTEGRATION TESTS (PORT 5002) ---');
  
  // 1. Connect to MongoDB
  await mongoose.connect('mongodb://localhost:27017/sr4ipr_lawfirm');
  
  // 2. Start express app on TEST_PORT
  const server = app.listen(TEST_PORT, () => {
    console.log(`Test server running on port ${TEST_PORT}`);
  });
  
  try {
    // Clean up any old tokens
    await User.updateOne({ email: 'admin@sr4ipr.com' }, { resetPasswordToken: null, resetPasswordExpires: null });
    
    // 3. Forgot password with non-existent email
    console.log('\n[Test 1] Requesting password reset for non-existent email...');
    const res1 = await postJSON(`${BASE_URL}/auth/forgot-password`, { email: 'doesnotexist@sr4ipr.com' });
    console.log('Status:', res1.status);
    console.log('Body:', res1.data);
    if (res1.status !== 200 || !res1.data.detail.includes('reset link has been sent')) {
      throw new Error('Test 1 failed: Generic success response expected.');
    }
    
    // 4. Forgot password with registered email
    console.log('\n[Test 2] Requesting password reset for registered admin...');
    const res2 = await postJSON(`${BASE_URL}/auth/forgot-password`, { email: 'admin@sr4ipr.com' });
    console.log('Status:', res2.status);
    console.log('Body:', res2.data);
    if (res2.status !== 200) {
      throw new Error('Test 2 failed: Status should be 200.');
    }
    
    // 5. Verify token was created in DB and retrieve it
    const admin = await User.findOne({ email: 'admin@sr4ipr.com' });
    if (!admin.resetPasswordToken || !admin.resetPasswordExpires) {
      throw new Error('Test 3 failed: Reset token or expiration not saved in MongoDB.');
    }
    console.log('Token successfully generated and hashed in DB:', admin.resetPasswordToken);
    
    const mockRawToken = 'mockrawtoken12345678901234567890';
    const mockHashedToken = crypto.createHash('sha256').update(mockRawToken).digest('hex');
    
    admin.resetPasswordToken = mockHashedToken;
    admin.resetPasswordExpires = Date.now() + 300000; // 5 mins
    await admin.save();
    console.log('Injected test token:', mockRawToken);
    
    // 6. Try resetting with mismatched passwords
    console.log('\n[Test 4] Resetting password with mismatched confirmation...');
    const res4 = await postJSON(`${BASE_URL}/auth/reset-password/${mockRawToken}`, {
      password: 'newsecurepassword123',
      confirm_password: 'differentpassword'
    });
    console.log('Status:', res4.status);
    console.log('Body:', res4.data);
    if (res4.status !== 400 || !res4.data.detail.includes('do not match')) {
      throw new Error('Test 4 failed: Mismatched passwords should fail.');
    }
    
    // 7. Try resetting with valid passwords
    console.log('\n[Test 5] Resetting password with valid payload...');
    const res5 = await postJSON(`${BASE_URL}/auth/reset-password/${mockRawToken}`, {
      password: 'newsecurepassword123',
      confirm_password: 'newsecurepassword123'
    });
    console.log('Status:', res5.status);
    console.log('Body:', res5.data);
    if (res5.status !== 200) {
      throw new Error('Test 5 failed: Reset should succeed.');
    }
    
    // 8. Verify token is cleared in database
    const updatedAdmin = await User.findOne({ email: 'admin@sr4ipr.com' });
    if (updatedAdmin.resetPasswordToken || updatedAdmin.resetPasswordExpires) {
      throw new Error('Test 6 failed: Hashed token and expiry must be cleared on successful reset.');
    }
    console.log('Token successfully invalidated in DB.');
    
    // 9. Verify token reuse fails
    console.log('\n[Test 7] Trying to reuse the same token...');
    const res7 = await postJSON(`${BASE_URL}/auth/reset-password/${mockRawToken}`, {
      password: 'anotherpassword123',
      confirm_password: 'anotherpassword123'
    });
    console.log('Status:', res7.status);
    console.log('Body:', res7.data);
    if (res7.status !== 400) {
      throw new Error('Test 7 failed: Token reuse should be rejected.');
    }
    
    // 10. Restore the original password so other client operations continue normally
    console.log('\nRestoring original admin password...');
    updatedAdmin.password = 'adminpassword123';
    await updatedAdmin.save();
    console.log('Original password restored successfully.');
    
    console.log('\n🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉');
    
  } catch (err) {
    console.error('Test Execution Failed:', err.message);
    process.exitCode = 1;
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

runTests();
