import * as WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { setImmediate, setTimeout } from 'timers';

import World from './World';
import GameClient from './GameClient';
import MsgHelper from './MsgHelper';

export default class GameServer {
	private clients: GameClient[];
	private world: World;
	private run: boolean;
	private timebefore: [number, number];

	constructor(){
		this.clients = [];
		this.world = new World(200);
	}

	public registerClient(ws: WebSocket, req: IncomingMessage){
		const client = new GameClient(ws, this.world);
		client.on('close', () => {
			console.log('Client disconnected.');
			this.clients.splice(this.clients.indexOf(client),1);
		});
		client.on('error', (event) => {
			console.log('Client errored.');
			this.clients.splice(this.clients.indexOf(client),1);
		});
		console.log('Client connected.');
		this.clients.push(client);
	}

	public start(){
		this.run = true;
		this.timebefore = process.hrtime();
		this.loop();
	}

	public stop(){
		this.run = false;
	}

	private loop(): void{
		if(!this.run) return;

		const time = process.hrtime();
		this.update();
		const duration = process.hrtime(time);
		const dt = duration[1] / 1e6; // Converting ns to ms



		const simtime = 1000 / 15;

		if(dt >= simtime){
			console.warn('The game is causing heavy load. Consider reducing game size or update rate.');
			setImmediate(this.loop.bind(this));
		} else {
			const remaining = simtime - dt;
			setTimeout(this.loop.bind(this), remaining);
		}
	}

	private update(): void{
		this.world.update();

		//broadcast world state
		for(let c of this.clients){
			let data = MsgHelper.worldUpdate(this.world)
			c.send(data);
		}
	}
}