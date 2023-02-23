import styles from '@styles/applications/Tictactoe.scss';
import htmlTemplate from '@templates/applications/Tictactoe.html?raw';

import Application from '@/Application';
import APPLICATION from '@constants/application';
import { isNull } from '@utils/tools';

import type { Application as ApplicationType } from 'types/application';

type Position = { x: number, y: number };

class Tictactoe extends Application implements ApplicationType {
  name = APPLICATION.TICTACTOE.name;

  cross = '\u274C';

  circle = '\u2B55';

  board = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];

  template = this.getShadow();

  #alternateChoice = false;

  #cells: NodeListOf<HTMLDivElement> | [] = [];

  #buttonReset: HTMLButtonElement | null = null;

  #winner: 'cross' | 'circle' | null = null;

  constructor() {
    super();
    this.appendStyle(styles);
    this.setupApp({
      cbRun: this.run.bind(this),
      cbStop: this.stop.bind(this),
    });
  }

  run() {
    this.windowDiv = this.template.querySelector('.window');

    if (this.windowDiv) {
      const contentWindow = this.windowDiv.lastElementChild;
      const appTemplate = this.convertStringToNode(htmlTemplate);

      if (contentWindow && appTemplate) {
        contentWindow.appendChild(appTemplate);
        this.tictactoe(this.windowDiv);
      }
    }
  }

  tictactoe(windowDiv: Element) {
    this.#buttonReset = windowDiv.querySelector('[data-reset]');
    this.#buttonReset?.addEventListener('click', this.reset.bind(this));
    this.#cells = windowDiv.querySelectorAll('[data-cell-type]');
    this.#cells.forEach((cell) => {
      cell.addEventListener('mousedown', this.callCell.bind(this));
    });
  }

  reset() {
    this.#winner = null;
    this.#alternateChoice = false;
    this.#cells.forEach((cell) => {
      cell.dataset.cellType = '';
      cell.textContent = '';
    });
  }

  callCell(event: Event) {
    if (event.target instanceof HTMLElement && !event.target.textContent) {
      event.target.textContent = this.#alternateChoice ? this.circle : this.cross;
      event.target.dataset.cellType = this.#alternateChoice ? this.circle : this.cross;
      this.#alternateChoice = !this.#alternateChoice;

      const gameStatus = this.isDone();

      if (gameStatus !== 'in progress') {
        const winner = this.windowContent?.querySelector('.match-result') as HTMLElement | null;

        if (winner) {
          const onWinnerClick = () => {
            winner.removeEventListener('click', onWinnerClick);
            winner.style.display = 'none';
            winner.style.visibility = 'hidden';
            this.reset();
          };
          const winnerText = winner.querySelector('.match-winner');

          if (winnerText) {
            winnerText.textContent = gameStatus === 'win' ? `${this.#winner} wins` : 'Draw';
          }

          winner.style.display = 'flex';
          winner.style.visibility = 'visible';
          winner.addEventListener('click', onWinnerClick);

          return;
        }

        this.reset();
      }
    }
  }

  isDone(): 'win' | 'loose' | 'in progress' {
    for (let i = 0; i < 3; i++) {
      // Horizontal
      if (this.checkTheePosition({ x: i, y: 0 }, { x: i, y: 1 }, { x: i, y: 2 })) {
        this.#winner = this.getCellType(i, 0);
        return 'win';
      }

      // Vertical
      if (this.checkTheePosition({ x: 0, y: i }, { x: 1, y: i }, { x: 2, y: i })) {
        this.#winner = this.getCellType(0, i);
        return 'win';
      }
    }

    // Diagonal top to bottom
    if (this.checkTheePosition({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 })) {
      this.#winner = this.getCellType(0, 0);
      return 'win';
    }

    // Diagonal bottom to top
    if (this.checkTheePosition({ x: 2, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 2 })) {
      this.#winner = this.getCellType(2, 0);
      return 'win';
    }

    // There is no more cell
    if (!this.template.querySelector<HTMLDivElement>(`[data-cell-type=""]`)) {
      return 'loose';
    }

    return 'in progress';
  }

  getCellType(x: number, y: number) {
    const cell = this.template.querySelector(`[data-cell-position="${ this.board[x][y] }"]`) as HTMLDivElement;
    return cell.dataset.cellType ? (cell.dataset.cellType === this.cross ? 'cross' : 'circle') : null;
  }

  checkTheePosition(first: Position, second: Position, third: Position) {
    const firstCell = this.getCellType(first.x, first.y);
    const secondCell = this.getCellType(second.x, second.y);
    const thirdCell = this.getCellType(third.x, third.y);

    if (!isNull(firstCell) && !isNull(secondCell) && !isNull(thirdCell)) {
      if ((firstCell === secondCell) && (secondCell === thirdCell)) {
        return true;
      }
    }

    return false;
  }

  stop() {
    this.#buttonReset?.addEventListener('click', this.reset.bind(this));
    this.#cells.forEach((cell) => {
      cell.removeEventListener('mousedown', this.callCell.bind(this));
    });
  }
}

export default Tictactoe;
