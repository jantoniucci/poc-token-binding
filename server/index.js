const { createSecureServer } = require('http2');
const { readFileSync } = require('fs');
const CircularJSON = require('circular-json')

const server = createSecureServer({
  key: readFileSync('keys/server.key'),
  cert: readFileSync('keys/server.crt')})

server.on('error', (err) => console.error(err))
server.on('socketError', (err) => console.error(err))

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html',
    ':status': 200
  });
  stream.end( CircularJSON.stringify( stream.session.socket.getSession() ));
});

server.listen(3001)