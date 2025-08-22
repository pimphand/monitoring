# Website Monitoring Dashboard

A real-time website monitoring application built with Node.js, Express, and Tailwind CSS. This application monitors the availability and performance of multiple domains.

## Features

- **Real-time Monitoring**: Check the status of all domains simultaneously
- **Individual Domain Checks**: Check specific domains on demand
- **Auto-refresh**: Enable automatic monitoring at configurable intervals
- **Status Indicators**: Visual status badges (Online, Warning, Offline)
- **Performance Metrics**: Response time and HTTP status codes
- **Responsive Design**: Works on desktop and mobile devices
- **Beautiful UI**: Modern interface built with Tailwind CSS

## Domains Monitored

The application monitors the following 21 domains:
- badrain.pemdeslobar.com
- nyurlembang.pemdeslobar.com
- batu-kuta.pemdeslobar.com
- pakuan.pemdeslobar.com
- buwun-sejati.pemdeslobar.com
- peresak.pemdeslobar.com
- dasan-tereng.pemdeslobar.com
- saribaye.pemdeslobar.com
- gerimax-indah.pemdeslobar.com
- sedau.pemdeslobar.com
- golong.pemdeslobar.com
- selat.pemdeslobar.com
- krama-jaya.pemdeslobar.com
- sembung.pemdeslobar.com
- lebah-sempage.pemdeslobar.com
- sesaot.pemdeslobar.com
- lembuak.pemdeslobar.com
- sesela.pemdeslobar.com
- mekar-sari.pemdeslobar.com
- sigerongan.pemdeslobar.com
- narmada.pemdeslobar.com

## Installation

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the application**:
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

### Main Dashboard
- **Check All Domains**: Manually check the status of all domains
- **Auto Refresh**: Enable automatic monitoring at set intervals
- **Refresh Interval**: Choose between 30 seconds, 1 minute, 5 minutes, or 10 minutes

### Domain Cards
Each domain displays:
- Domain name
- Current status (Online/Warning/Offline)
- HTTP status code
- Response time
- Last checked timestamp
- Individual "Check Now" button

### Status Indicators
- 🟢 **Online**: Website is responding normally (HTTP 200-399)
- 🟡 **Warning**: Website is responding but with issues (HTTP 400-499)
- 🔴 **Offline**: Website is not responding or has server errors (HTTP 500+)

## API Endpoints

- `GET /` - Main dashboard page
- `GET /api/domains` - List of all monitored domains
- `GET /api/status` - Status of all domains
- `GET /api/status/:domain` - Status of a specific domain

## Technical Details

- **Backend**: Node.js with Express
- **Frontend**: HTML with Tailwind CSS (via CDN)
- **HTTP Client**: Axios for making requests
- **Monitoring**: Checks HTTPS status with 10-second timeout
- **Real-time Updates**: JavaScript-based status updates

## Customization

### Adding New Domains
Edit the `domains` array in `server.js` to add or remove domains.

### Changing Monitoring Logic
Modify the `checkWebsiteStatus` function in `server.js` to adjust:
- Timeout values
- Status thresholds
- Response validation

### UI Customization
Modify the HTML and Tailwind classes in `public/index.html` to change the appearance.

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `server.js` or kill the process using the port
2. **Domains not responding**: Check if domains are accessible from your network
3. **Slow response times**: Adjust timeout values in the monitoring function

### Logs
Check the console output for any error messages or monitoring results.

## License

MIT License - feel free to modify and distribute as needed. 