import  Cell  from '../interfaces/cell.interface';
import  MinesweeperGame from './minesweeper-game.class';

const onGameWon = () => {
	console.log('GAME WON');
}

const onGameOver = () => {
	console.log('GAME WON');
}

describe('MinesweeperGame', () => {
  let game: MinesweeperGame;

  beforeEach(() => {
    game = new MinesweeperGame(onGameOver, onGameWon);
  });

  describe('resetGame', () => {
    it('should generate a new game board', () => {
      const oldGrid = game.grid;

      game.resetGame();

      expect(game.grid).not.toBe(oldGrid);
    });

    it('should plant the correct number of mines', () => {
      const numMines = game.numMines;
      let numMinesFound = 0;

      game.grid.forEach((row: Cell[]) => {
        row.forEach((cell) => {
          if (cell.isMine) {
            numMinesFound++;
          }
        });
      });

      expect(numMinesFound).toBe(numMines);
    });
  });

  describe('toggleFlag', () => {
    it('should flag the cell if it is not flagged', () => {
      const cell = game.grid[0][0];
			game.toggleFlag(0,0);

      expect(cell.isFlagged).toBe(true);
    });

    it('should unflag the cell if it is flagged', () => {
      const cell = game.grid[0][0];
      cell.isFlagged=true;
      game.toggleFlag(0,0);

      expect(cell.isFlagged).toBe(false);
    });
  });

  describe('revealCell', () => {
    it('should reveal the cell if it is not a mine', () => {
      const cell = game.grid[0][0];
      game.revealCell(0,0);

      expect(cell.isRevealed).toBe(true);
    });

    it('should reveal adjacent cells if the cell has no adjacent mines', () => {
      const cell = game.grid[0][0];
      const adjacentCell = game.grid[1][1];
      adjacentCell.adjacentMines = 0;

      game.revealCell(0,0);
			game.revealCell(1,1);

      expect(cell.isRevealed).toBe(true);
      expect(adjacentCell.isRevealed).toBe(true);
    });

    it('should not reveal adjacent cells if the cell has adjacent mines', () => {
      const cell = game.grid[0][0];
      const adjacentCell = game.grid[1][1];
      adjacentCell.adjacentMines = 1;
      game.grid[1][1] = adjacentCell;

      game.revealCell(0,0);

      expect(cell.isRevealed).toBe(true);
      expect(adjacentCell.isRevealed).toBe(false);
    });
  });

  describe('checkWin', () => {
    it('should return true if all non-mine cells are revealed', () => {

			for (let i = 0; i < game.grid.length; i++) {
				const row = game.grid[i];
				for (let j = 0; j < row.length; j++) {
					const cell = row[j];
					if (!cell.isMine) {
            game.revealCell(i,j);
					}
				}
			}
      expect(game.checkWin()).toBe(true);
    });

    it('should return false if any non-mine cells are unrevealed', () => {
      game.grid.forEach((row) => {
        row.forEach((cell) => {
          if (!cell.isMine) {
            cell.isRevealed = false;
          }
        });
      });

      expect(game.checkWin()).toBe(false);
    });
  });
});
