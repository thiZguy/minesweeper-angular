import Cell from "../interfaces/cell.interface";

const PEERS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
let visitedCells = new Map<string, Cell>();

class MinesweeperGame {
  public readonly gridSize: number = 10;
  public readonly numMines: number = 10;
  private handleGameOver: Function;
  private handleGameWon: Function;
  public grid: Cell[][] = this.generateGrid();

  constructor(handleGameOver: Function, handleGameWon: Function) {
    this.resetGame();
    this.handleGameOver = handleGameOver;
    this.handleGameWon = handleGameWon;
  }

  public resetGame(): void {
    this.grid = this.generateGrid();
    this.plantMines();
    this.countAdjacentMines();
  }

  public revealCell(row: number, col: number): void {
    const cell = this.grid[row][col];

    if (cell.isFlagged) {
      return;
    }

    cell.isRevealed = true;

    if (cell.isMine) {
      this.handleGameOver();
    } else if (cell.adjacentMines === 0) {
      this.revealAdjacentCells(row, col);
    }

    if (this.checkWin()) {
      this.handleGameWon();
    }
  }

  public toggleFlag(row: number, col: number): void {
    const cell = this.grid[row][col];

    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged;
    }
  }

  private generateGrid(): Cell[][] {
    const grid: Cell[][] = [];

    for (let i = 0; i < this.gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        grid[i][j] = { isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 };
      }
    }

    return grid;
  }

  private plantMines(): void {
    let minesToPlant = this.numMines;

    while (minesToPlant > 0) {
      const row = Math.floor(Math.random() * this.gridSize);
      const col = Math.floor(Math.random() * this.gridSize);
      const cell = this.grid[row][col];

      if (!cell.isMine) {
        cell.isMine = true;
        minesToPlant--;
      }
    }
  }

  private countAdjacentMines(): void {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const cell = this.grid[i][j];

        if (!cell.isMine) {
          const adjacentCells = this.getAdjacentCells(i, j);
          cell.adjacentMines = adjacentCells.filter((c) => c.isMine).length;
        }
      }
    }
  }

  private getAdjacentCells(row: number, col: number): Cell[] {
    const adjacentCells: Cell[] = [];

    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && i < this.gridSize && j >= 0 && j < this.gridSize && !(i === row && j === col)) {
          adjacentCells.push(this.grid[i][j]);
        }
      }
    }

    return adjacentCells;
  }

  private revealAdjacentCells(row: number, col: number): void {
    // REVEAL ADJACENT CELLS PER PEER
    visitedCells.set(`${row},${col}`, this.grid[row][col]);
    PEERS.forEach(peerCoords => {
      const adjacentCellX = row + peerCoords[0];
      const adjacentCellY = col + peerCoords[1];
      // EVALUATE ADJACENT ONLY CELLS AND BETWEEN GRID BOUNDARIES
      if (
        !visitedCells.has(`${adjacentCellX},${adjacentCellY}`) &&
        (adjacentCellX > -1 && adjacentCellY > -1) &&
        (adjacentCellX < this.gridSize && adjacentCellY < this.gridSize)
      ) {

        const adjacentCell = this.grid[adjacentCellX][adjacentCellY]

        if (!adjacentCell.isRevealed && !adjacentCell.isFlagged) {
          if (adjacentCell.adjacentMines === 0) {
            this.revealAdjacentCells(adjacentCellX, adjacentCellY);
          } else {
            adjacentCell.isRevealed = true;
          }
        }
      }
    });
  }

  public checkWin(): boolean {
    let totalUnrevealedCells = 0;

    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const cell = this.grid[i][j];

        if (!cell.isRevealed) {
          totalUnrevealedCells++;
        }
      }
    }

    return totalUnrevealedCells === this.numMines;
  }

}

export default MinesweeperGame;