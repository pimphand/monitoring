const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 6800;

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
    
    // Try multiple approaches to check the website
    let response;
    let usedMethod = 'https';
    
    try {
      // First try HTTPS
      response = await axios.get(`https://${domain}`, {
        timeout: 10000,
        validateStatus: function (status) {
          return status < 500; // Accept any status less than 500
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
    } catch (httpsError) {
      // If HTTPS fails, try HTTP
      try {
        response = await axios.get(`http://${domain}`, {
          timeout: 10000,
          validateStatus: function (status) {
            return status < 500;
          },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        usedMethod = 'http';
      } catch (httpError) {
        // If both fail, try just checking if the domain resolves
        try {
          const dnsResponse = await axios.get(`https://dns.google/resolve?name=${domain}`, {
            timeout: 5000
          });
          
          if (dnsResponse.data.Status === 0 && dnsResponse.data.Answer && dnsResponse.data.Answer.length > 0) {
            // Domain resolves but website is not accessible
            return {
              domain,
              status: 'Warning',
              statusCode: 'DNS OK',
              responseTime: 'N/A',
              lastChecked: new Date().toISOString(),
              isOnline: false,
              error: 'Domain resolves but website not accessible',
              method: 'dns'
            };
          } else {
            throw new Error('Domain does not resolve');
          }
        } catch (dnsError) {
          throw new Error('Domain not accessible');
        }
      }
    }
    
    const responseTime = Date.now() - startTime;
    
    return {
      domain,
      status: response.status < 400 ? 'Online' : 'Warning',
      statusCode: response.status,
      responseTime: `${responseTime}ms`,
      lastChecked: new Date().toISOString(),
      isOnline: response.status < 400,
      method: usedMethod
    };
  } catch (error) {
    // Handle specific error types
    let errorMessage = error.message;
    let status = 'Offline';
    
    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Connection refused';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Domain not found';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Connection timeout';
    } else if (error.response) {
      // Server responded with error status
      if (error.response.status === 403) {
        errorMessage = 'Access forbidden (403)';
        status = 'Warning'; // 403 might mean the site is working but blocking us
      } else if (error.response.status === 429) {
        errorMessage = 'Too many requests (429)';
        status = 'Warning';
      } else {
        errorMessage = `HTTP ${error.response.status}`;
        status = error.response.status < 500 ? 'Warning' : 'Offline';
      }
    }
    
    return {
      domain,
      status: status,
      statusCode: error.response ? error.response.status : 'N/A',
      responseTime: 'N/A',
      lastChecked: new Date().toISOString(),
      isOnline: false,
      error: errorMessage,
      method: 'failed'
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