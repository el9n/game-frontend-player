/* eslint-disable react/prop-types */
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import classes from "./Questions.module.css";
import cloneObj from "../../functions/cloneObj";

function Questions({ questions, onAnswer }) {
  const [isDecreasing, setIsDecreasing] = useState(false);

  function toggleSorting() {
    setIsDecreasing((id) => !id);
  }

  const list = cloneObj(questions).sort((a, b) =>
    isDecreasing ? a.value - b.value : b.value - a.value
  );

  return (
    <div className={classes["container"]}>
      <button
        className={classes["sorting-button"] + " " + "ui"}
        onClick={toggleSorting}
      >
        {isDecreasing ? "Возрастание" : "Убывание"}
      </button>
      <div className={classes["questions-container"]}>
        {list.map((question) => (
          <Question
            key={uuidv4()}
            item={question}
            onClick={() => onAnswer(question.index, " Лето  ")}
          />
        ))}
      </div>
    </div>
  );
}

function Question({ item, onClick }) {
  return (
    <div className={classes["question"]} onClick={onClick}>
      <div className={classes["text"]}>{item.question}</div>
      <div className={classes["value"]}>{item.value}</div>
    </div>
  );
}

export default Questions;
