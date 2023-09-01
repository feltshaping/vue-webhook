let http = require('http');
let crypto = require('crypto');
let { spawn } = require('child_process');
let SECRET = 'bp123456';
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
      let event = req.header['x-github-event'];
      let signature = req.headers['x-hub-signature'];
             let payload = JSON.parse(body);
        console.log('!payload',payload)
        console.log(payload.repository.name,'push请求')

      // console.log(event, signature, sign(body));
      // if (signature !== sign(body)) {
      //   return res.end('Not allowed');
      // }
      // res.setHeader('Content-Type', 'application/json');
      // res.end(JSON.stringify({ ok: true }));
      // if (event == 'push') {
      //   let payload = JSON.parse(body);
      //   console.log('!payload',payload)
      //   console.log(payload.repository.name+'push请求')

      //   let child = spawn('sh', [`./${payload.repository.name}.sh`]);
      //   let buffers = [];
      //   child.stdout.on('data', function (buffer) {
      //     buffers.push(buffer);
      //   });
      //   child.stdout.on('end', function (buffer) {
      //     let log = Buffer.concat(buffers).toString();
      //     console.log('sh done!',log);
      //   });
      // }
    });
  } else {
    res.end('Not found!');
  }
});
server.listen(4000, () => {
  console.log('webhook on 4000');
});
