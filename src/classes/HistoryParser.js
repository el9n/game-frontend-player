import cloneObj from "../functions/cloneObj";

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

  get scores() {
    const players = Object.keys(this.#game.players);
    const scores = players.reduce((acc, curr) => ((acc[curr] = 0), acc), {});

    this.filterHistory("answer").forEach((answer) => {
      if (answer.options.successful) {
        scores[answer.user] +=
          this.#questions[answer.options.questionIndex].value;
      }
    });

    console.log(scores);
    return scores;
  }

  filterHistory(type) {
    return cloneObj(this.#history).filter((action) => action.type === type);
  }
}
