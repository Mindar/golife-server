import World from '../World';
import ICommandHandler from './ICommandHandler';
import {Grid} from '2dgrid';

export default class WorldClearHandler implements ICommandHandler{
	private world: World;

	constructor(world: World){
		this.world = world;
	}

	public get command(){
		return 'world.clear';
	}

	public handle(payload: any): boolean{
		this.world.getGrid().fill(false);
		return true;
	}
}