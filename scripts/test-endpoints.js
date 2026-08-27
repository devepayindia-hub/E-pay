const http = require('http');

const urls = [
  'http://localhost:3000/',
  'http://localhost:3000/login',
  'http://localhost:3000/superadmin',
  'http://localhost:3000/sales-exec',
  'http://localhost:3000/hr',
  'http://localhost:3000/ceo'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          statusCode: res.statusCode,
          hasBody: data.length > 0,
          length: data.length
        });
      });
    }).on('error', (err) => {
      resolve({ url, error: err.message });
    });
  });
}

async function run() {
  console.log('Testing Server Endpoints:');
  for (const u of urls) {
    const result = await checkUrl(u);
    console.log(`[HTTP ${result.statusCode || 'ERR'}] ${result.url} - Content length: ${result.length || 0} bytes`);
  }
}

run();
