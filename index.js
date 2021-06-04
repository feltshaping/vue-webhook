let http = require('http');
let crypto = require('crypto');
let { spawn } = require('child_process');
let SECRET = '123456';
function sign(body) {
  return `sha1=` + crypto.createHmac('sha1', SECRET).update(body).digest('hex');
}
let server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    let buffers = [];
    req.on('data', (buffer) => {
      buffers.push(buffer);
    });
    req.on('end', (buffer) => {
      let body = Buffer.concat(buffers);
      let event = req.headers['x-github-event'];
      let signature = req.headers['x-github-signature'];
      if (signature !== sign(body)) {
        return res.end('Not allowed');
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true }));
      if (event == 'push') {
        let payload = JSON.parse(body);
        let child = spawn('sh', [`./${payload.respository.name}.sh`]);
        let buffers = [];
        child.stdout.on('data', function (buffer) {
          buffers.push(buffer);
        });
        child.stdout.on('end', function (buffer) {
          let log = Buffer.concat(buffers);
          console.log(log);
        });
      }
    });
  } else {
    res.end('Not found');
  }
});
server.listen(4000, () => {
  console.log('webhook 4000');
});
