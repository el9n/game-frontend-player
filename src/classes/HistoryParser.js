import cloneObj from "../functions/cloneObj";
import { getCellByIndex, getCellPositionByIndex } from "../functions/gameUtils";

export default class HistoryParser {
  #history;
  #game;
  #questions;

  constructor(game, questions, history) {
    this.#game = game;
    this.#questions = questions;
    this.update(history);
  }

  update(history) {
    this.#history = history;
  }

  get game() {
    return this.#game;
  }

  get questions() {
    const questions = cloneObj(this.#questions);

    questions.map((questions, index) => (questions.index = index));

    const answeredQuestions = this.filterHistory("answer")
      .filter((answer) => answer.options.successful)
      .map((answer) => answer.options.questionIndex);

    return questions.filter(
      (question) => !answeredQuestions.includes(question.index)
    );
  }

  get captured() {
    const captured = {};

    this.filterHistory("capture").forEach((capture) => {
      captured[String(capture.options.cell)] = capture.user;
    });

    return captured;
  }

  get points() {
    const players = Object.keys(this.#game.players);
    const points = players.reduce((acc, curr) => ((acc[curr] = 0), acc), {});

    this.filterHistory("answer").forEach((answer) => {
      if (answer.options.successful) {
        points[answer.user] +=
          this.#questions[answer.options.questionIndex].value;
      }
    });

    this.filterHistory("capture").forEach((capture) => {
      points[capture.user] -= getCellByIndex(
        this.#game.template,
        capture.options.cell
      );
    });

    return points;
  }

  get scores() {
    const players = Object.keys(this.#game.players);
    const scores = players.reduce((acc, curr) => ((acc[curr] = 0), acc), {});

    Object.entries(this.captured).filter(([cell, player]) => {
      const [i, j] = getCellPositionByIndex(this.#game.template, Number(cell));
      scores[player] += this.#game.template[i][j];
    });

    return scores;
  }

  canCapture(user, cell) {
    if (String(cell) in this.#game.rules) {
      // если клетка - база
      if ("base" in this.#game.rules[String(cell)]) {
        return false;
      }
      // если клетка - чужой стронгхолд
      if (
        "stronghold" in this.#game.rules[String(cell)] &&
        this.#game.rules[String(cell)].stronghold !== user
      ) {
        return false;
      }
    }

    // если игрок уже контролирует клетку
    if (this.captured[String(cell)] === user) {
      return false;
    }

    // если стоимость клетки больше доступных игроку очков
    const userPoints = this.points[user];
    const cellValue = getCellByIndex(this.#game.template, Number(cell));
    if (userPoints < cellValue) {
      return false;
    }

    return true;
  }

  filterHistory(type) {
    return cloneObj(this.#history).filter((action) => action.type === type);
  }
}
