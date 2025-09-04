const axios = require('axios');

const redeemInvitation = async (code, organizationName, name, email) => {
  if (!code || !organizationName || !name || !email) {
    console.error('Usage: node redeem-invite.js <invite_code> <org_name> <contact_name> <contact_email>');
    process.exit(1);
  }

  const url = `https://api.sensay.io/v1/api-keys/invites/${encodeURIComponent(code)}/redeem`;
  const data = {
    organizationName,
    name,
    email,
  };
  const headers = {
    'X-API-Version': '2025-03-25',
    'Content-Type': 'application/json',
  };

  try {
    console.log(`Redeeming invitation code ${code}...`);
    const response = await axios.post(url, data, { headers });

    if (response.data.success) {
      console.log('✅ Successfully redeemed invitation!');
      console.log('===================================');
      console.log('🔑 API Key:', response.data.apiKey);
      console.log('🏢 Organization ID:', response.data.organizationID);
      console.log('📅 Valid Until:', response.data.validUntil || 'N/A');
      console.log('===================================');
      console.log('⚠️  IMPORTANT: Store your API key and Organization ID securely.');
      console.log('   The API key cannot be retrieved again after this.');
      
      // Save to .env file
      const envContent = `# Sensay API Configuration
SENSAY_API_KEY=${response.data.apiKey}
SENSAY_ORGANIZATION_ID=${response.data.organizationID}
SENSAY_API_VERSION=2025-03-25

# Backend Configuration
PORT=3001

# Frontend Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
`;
      
      require('fs').writeFileSync('.env', envContent);
      console.log('💾 API credentials saved to .env file');
      
    } else {
      console.error('❌ Failed to redeem invitation:', response.data);
    }
  } catch (error) {
    console.error('💥 An error occurred while redeeming the invitation:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
};

const [,, code, organizationName, name, email] = process.argv;
redeemInvitation(code, organizationName, name, email);
