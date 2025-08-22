const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Domain list
const domains = [
  "badrain.pemdeslobar.com",
  "nyurlembang.pemdeslobar.com",
  "batu-kuta.pemdeslobar.com",
  "pakuan.pemdeslobar.com",
  "buwun-sejati.pemdeslobar.com",
  "peresak.pemdeslobar.com",
  "dasan-tereng.pemdeslobar.com",
  "saribaye.pemdeslobar.com",
  "gerimax-indah.pemdeslobar.com",
  "sedau.pemdeslobar.com",
  "golong.pemdeslobar.com",
  "selat.pemdeslobar.com",
  "krama-jaya.pemdeslobar.com",
  "sembung.pemdeslobar.com",
  "lebah-sempage.pemdeslobar.com",
  "sesaot.pemdeslobar.com",
  "lembuak.pemdeslobar.com",
  "sesela.pemdeslobar.com",
  "mekar-sari.pemdeslobar.com",
  "sigerongan.pemdeslobar.com",
  "narmada.pemdeslobar.com"
];

// Function to check website status
async function checkWebsiteStatus(domain) {
  try {
    const startTime = Date.now();
    const response = await axios.get(`https://${domain}`, {
      timeout: 10000,
      validateStatus: function (status) {
        return status < 500; // Accept any status less than 500
      }
    });
    const responseTime = Date.now() - startTime;
    
    return {
      domain,
      status: response.status < 400 ? 'Online' : 'Warning',
      statusCode: response.status,
      responseTime: `${responseTime}ms`,
      lastChecked: new Date().toISOString(),
      isOnline: response.status < 400
    };
  } catch (error) {
    return {
      domain,
      status: 'Offline',
      statusCode: 'N/A',
      responseTime: 'N/A',
      lastChecked: new Date().toISOString(),
      isOnline: false,
      error: error.message
    };
  }
}

// Route to get all domain statuses
app.get('/api/status', async (req, res) => {
  try {
    const statusPromises = domains.map(domain => checkWebsiteStatus(domain));
    const results = await Promise.all(statusPromises);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check website statuses' });
  }
});

// Route to check a specific domain
app.get('/api/status/:domain', async (req, res) => {
  try {
    const domain = req.params.domain;
    if (!domains.includes(domain)) {
      return res.status(404).json({ error: 'Domain not found' });
    }
    
    const status = await checkWebsiteStatus(domain);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check website status' });
  }
});

// Route to get domains list
app.get('/api/domains', (req, res) => {
  res.json(domains);
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Monitoring ${domains.length} domains`);
}); 