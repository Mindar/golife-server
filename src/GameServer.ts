import * as WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { setImmediate, setTimeout } from 'timers';

import World from './World';
import GameClient from './GameClient';
import MsgHelper from './MsgHelper';
import ICommandHandler from './commands/ICommandHandler';
import WorldModifyHandler from './commands/WorldModifyHandler';
import WorldClearHandler from './commands/WorldClearHandler';

export default class GameServer {
	private clients: GameClient[];
	private world: World;
	private run: boolean;
	private timebefore: [number, number];
	private handlers: ICommandHandler[];

	constructor(){
		this.clients = [];
		this.world = new World(200);

		this.handlers = [];
		this.handlers.push(new WorldModifyHandler(this.world));
		this.handlers.push(new WorldClearHandler(this.world));
	}

	private handleCommand(cmd: string, payload?: any): boolean{
		console.log(cmd);
		// Search for command handler for the given command, and handle the command
		for(const handler of this.handlers){
			if(handler.command === cmd){
				return handler.handle(payload);
			}
		}

		// No command found, can't execute command.
		return false;
	}

	public registerClient(ws: WebSocket, req: IncomingMessage){
		const client = new GameClient(ws, this.world);
		client.on('close', () => this.unregisterClient(client));
		client.on('error', (event) => console.log('Client errored.'));
		client.on('command', (cmd, payload) => this.handleCommand(cmd, payload));

		console.log('Client connected.');
		this.clients.push(client);
	}

	public unregisterClient(client: GameClient){
		if(client.isOpen) {
			client.close();
		}

		this.clients.splice(this.clients.indexOf(client), 1);
		console.log('Client disconnected.');
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



		const simtime = 1000 / 10;

		if(dt >= simtime){
			console.warn('The game is under heavy load and can\'t keep up with the desired update rate. Consider reducing game size or update rate.');
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