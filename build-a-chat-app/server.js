import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3001;
const OPEN = 1; // WebSocket.OPEN

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');

  if (pathname === '/script.js') {
    fs.readFile('./public/script.js', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Not found');
      }
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(data);
    });
    return;
  }

  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Unable to load the chat page');
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

function broadcast(payload) {
  const message = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === OPEN) {
      client.send(message);
    }
  });
}

wss.on('connection', (socket, req) => {
  const username =
    new URL(req.url, 'http://localhost').searchParams.get('username') ||
    'Anonymous';

  broadcast({ type: 'system', text: `${username} joined` });

  socket.on('message', (data) => {
    try {
      const { username: sender, text } = JSON.parse(data.toString());
      broadcast({ type: 'chat', username: sender ?? username, text });
    } catch {
      // Ignore messages that are not valid JSON
    }
  });

  socket.on('close', () => {
    broadcast({ type: 'system', text: `${username} left` });
  });
});

server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});
