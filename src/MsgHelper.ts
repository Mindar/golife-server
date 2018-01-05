import World from "./World";

export default class MsgHelper {
	public static worldUpdate(world: World): string{
		const msg: any = {};

		msg.action = 'world.update';
		msg.grid = {};
		msg.grid.rows = world.getGrid().rows;
		msg.grid.cols = world.getGrid().cols;
		msg.grid.cells = world.getGrid().toArray();
		
		return JSON.stringify(msg);
	}
}