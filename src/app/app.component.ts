import { Component } from '@angular/core';
import MinesweeperGame from './classes/minesweeper-game.class';
import Cell from './interfaces/cell.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public MSG: MinesweeperGame;
  title = 'minesweeper';

  constructor() {
    this.MSG = new MinesweeperGame(this.gameOver, this.gameWon);
  }

  revealCell(row: number, col: number) {
    this.MSG.revealCell(row,col);
  }

  flagCell(row: number, col: number) {
    this.MSG.toggleFlag(row,col);
  }

  gameWon() {
    setTimeout(() => alert('¡Has Ganado!'), 500)
  }

  gameOver() {
    alert('¡Has Perdido!');
    setTimeout(() => {
      window.location.reload();  
    }, 1000);
  }

  reset() {
    this.MSG.resetGame();
  }

  getCellClass(cell: Cell) : string{
    if(cell.isRevealed) {
      return cell.isMine ? 'cell-mine': 'cell-revealed';
    } 
    return 'cell';
  }
}
