import World from '../World';
import ICommandHandler from './ICommandHandler';
import {Grid} from '2dgrid';

export default class WorldModifyHandler implements ICommandHandler{
	private world: World;

	constructor(world: World){
		this.world = world;
	}

	public get command(){
		return 'world.modify';
	}

	public handle(payload: any): boolean{
		for(const change of payload){
			this.world.getGrid().insert(change.val, change.row, change.col);
		}
		return true;
	}
}