import {Grid} from '2dgrid';

export default class World {
	private grid: Grid<boolean>

	constructor(size: number){
		this.grid = new Grid<boolean>(size, size);
		this.grid.fill(false);

		// Insert test data
		this.grid.insert(true, 9, 10);
		this.grid.insert(true, 10, 10);
		this.grid.insert(true, 11, 10);
	}

	private updateCell(row: number, col:number): boolean {
		const alive = this.grid.valueAt(row, col);

		const neighbours = this.grid.getNeighbours(row, col);
		let neighCount: number = 0;

		for(let neighbour of neighbours){
			if(neighbour) {
				neighCount++;
			}
		}

		// ############### Game rules ###############
		// Kill alive cells
		if(alive && neighCount <= 1) return !alive;
		if(alive && neighCount >= 4) return !alive;

		// Create new cells
		if(!alive && neighCount == 3) return !alive;

		// Cell does not change state
		return alive;
	}

	public update(): void{
		const newgrid = new Grid<boolean>(this.grid.rows, this.grid.cols);
		
		for(let row = 0; row < this.grid.rows; row++){
			for(let col = 0; col < this.grid.cols; col++){
				newgrid.insert(this.updateCell(row, col), row, col);
			}
		}

		//update grid
		this.grid = newgrid;
	}

	public getGrid(): Grid<boolean> {
		return this.grid;
	}
}