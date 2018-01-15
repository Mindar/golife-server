import * as WebSocket from 'ws';
import { EventEmitter } from 'events';
import GameServer from './GameServer';
import World from './World';

export default class GameClient extends EventEmitter {
	private socket: WebSocket;

	constructor(ws: WebSocket, world: World){
		super();

		this.socket = ws;
		this.socket.on('close', (code, reason) => this.emit('close', code, reason));
		this.socket.on('error', (err) => this.emit('error', err));
		this.socket.on('message', (data) => this.handleMsg(data));
	}

	private handleMsg(data: WebSocket.Data): void{
		const msg = JSON.parse(data.toString());
		
		if(typeof msg.cmd === 'string'){
			this.emit('command', msg.cmd, msg.payload);
		}

		// Handle game client internal stuff here.
	}

	public send(msg: string){
		try {
			this.socket.send(msg);
		} catch(e){
			console.log('Error while sending.');
			this.emit('close');
		}
	}

	public close(){
		// If readyState is CONNECTING or OPEN, close the socket
		if(this.socket.readyState <= 1){
			this.socket.close();
		}
	}

	public get isOpen() {
		if(this.socket.readyState === 1) return true;
		return false;
	}
}