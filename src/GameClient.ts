import * as WebSocket from 'ws';
import { EventEmitter } from 'events';
import GameServer from './GameServer';
import World from './World';

export default class GameClient extends EventEmitter {
	private socket: WebSocket;
	private world: World;

	constructor(ws: WebSocket, world: World){
		super();

		this.world = world;
		this.socket = ws;
		this.socket.on('close', (code, reason) => this.emit('close', code, reason));
		this.socket.on('error', (err) => this.emit('error', err));
		this.socket.on('message', (data) => this.handleMsg(data));
	}

	private handleModify(msg: any){
		for(let change of msg.changes){
			this.world.getGrid().insert(change.val, change.row, change.col);
		}
	}

	private handleMsg(data: WebSocket.Data): void{
		const msg = JSON.parse(data.toString());
		switch(msg.action){
			case 'world.modify':
				this.handleModify(msg);
				break;
		}
	}

	public send(msg: string){
		try {
			this.socket.send(msg);
		} catch(e){
			console.log('Error while sending.');
			this.emit('close');
		}
	}
}