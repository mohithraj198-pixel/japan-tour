const http = require('http');
const fs = require('fs');
const path = require('path');

const DEFAULT_PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  if (req.method === 'POST' && reqPath === '/api/contact') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) req.destroy();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const { name, email, phone, destination, travelDate, travelers, notes } = data;

        if (!name || !name.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          return res.end(JSON.stringify({ success: false, error: 'Full name is required.' }));
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email.trim())) {
          res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          return res.end(JSON.stringify({ success: false, error: 'A valid email address is required.' }));
        }

        const validDestinations = ['Tokyo', 'Osaka', 'Kyoto', 'Explore All Japan'];
        if (destination && !validDestinations.includes(destination)) {
          res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          return res.end(JSON.stringify({ success: false, error: 'Please select a valid destination option.' }));
        }

        const enquiry = {
          id: 'JP-' + Date.now().toString(36).toUpperCase(),
          timestamp: new Date().toISOString(),
          name: name.trim(),
          email: email.trim(),
          phone: phone ? phone.trim() : null,
          destination: destination || 'Explore All Japan',
          travelDate: travelDate || null,
          travelers: parseInt(travelers, 10) || 1,
          notes: notes ? notes.trim() : ''
        };

        const enquiriesFile = path.join(__dirname, 'enquiries.json');
        let existing = [];
        if (fs.existsSync(enquiriesFile)) {
          try {
            existing = JSON.parse(fs.readFileSync(enquiriesFile, 'utf8'));
            if (!Array.isArray(existing)) existing = [];
          } catch (e) {
            existing = [];
          }
        }
        existing.push(enquiry);
        fs.writeFileSync(enquiriesFile, JSON.stringify(existing, null, 2), 'utf8');

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        return res.end(JSON.stringify({
          success: true,
          message: 'Your enquiry has been received.',
          enquiry: {
            id: enquiry.id,
            destination: enquiry.destination,
            travelDate: enquiry.travelDate,
            travelers: enquiry.travelers
          }
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return res.end(JSON.stringify({ success: false, error: 'Invalid request payload.' }));
      }
    });
    return;
  }

  const filePath = path.join(__dirname, reqPath);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const headers = {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    };

    if (ext === '.jpg' || ext === '.jpeg') {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    }

    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  });
});

let currentPort = parseInt(process.env.PORT, 10) || DEFAULT_PORT;

function startServer(port) {
  server.listen(port, () => {
    console.log(`\n==============================================`);
    console.log(`  Scroll Animation Server is running!`);
    console.log(`  Local URL: http://localhost:${port}/`);
    console.log(`==============================================\n`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`\n[!] Port ${currentPort} is already in use.`);
    currentPort += 1;
    console.log(`    Automatically retrying on http://localhost:${currentPort}/ ...\n`);
    setTimeout(() => {
      startServer(currentPort);
    }, 250);
  } else {
    console.error('Server error:', err);
  }
});

startServer(currentPort);
