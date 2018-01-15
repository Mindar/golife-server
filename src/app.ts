import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as path from 'path';
import * as fs from 'fs';
import GameServer from './GameServer';
import * as hjson from 'hjson';

/*
Create a http-server, web-socket-server and GameServer which manages the ws-connections
*/
const app = express();
/**
 * @todo make path to game configurable
 */
const apppath = path.join(__dirname, '..', '..', 'golife-client');
console.log(`Serving game from ${apppath}`);
app.use('/', express.static(apppath));

const gs = new GameServer();
gs.start();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
wss.on('connection', function(ws, req) {
	gs.registerClient(ws, req);
});


/**
 * @todo make port configurable
 */
server.listen(8080);