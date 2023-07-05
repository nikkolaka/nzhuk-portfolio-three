class Grid {
    constructor(height, width, cellSize) {
        this.height = height;
        this.width = width;
        this.cellSize = cellSize;
        this.grid = [];
        this.gridSize = 0;
    }

    createGrid() {
        for (let i = 0; i < this.height; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.width; j++) {
                this.grid[i][j] = 0;
            }
        }
    }


}