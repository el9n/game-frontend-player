/* eslint-disable react/prop-types */
import cloneObj from "../../functions/cloneObj";
import { getGrayscaleColors } from "../../functions/grayscaleColors";
import Cell from "./Cell/Cell";
import classes from "./GameField.module.css";

const CHAR_CODE_START = 65;

const PLAYER_COLORS = {
  A: ["red", "white"],
  B: ["green", "white"],
  C: ["blue", "white"],
  D: ["orange", "black"],
  E: ["yellow", "black"],
  F: ["magenta", "black"],
  G: ["pink", "black"],
  H: ["cyan", "black"],
};

function GameField({
  options,
  captured,
  playerColors = PLAYER_COLORS,
  activePlayer,
  IndicatorIcon = "●",
  editable = false,
  showValues = true,
  showCaptured = true,
  showBases = true,
  showStrongholds = true,
  onCellClick,
  onValueChange,
}) {
  const zeroCell = (
    <Cell
      indicator
      color={activePlayer ? playerColors[activePlayer] : ["#ddd", "#888"]}
      playable={false}
      value={activePlayer && IndicatorIcon}
    />
  );

  const systemRows = [];
  for (let i = 0; i < options.template.length; i++) {
    systemRows.push(
      <Cell playable={false} value={String.fromCharCode(CHAR_CODE_START + i)} />
    );
  }

  const systemCols = [];
  for (let i = 0; i < options.template[0].length; i++) {
    systemCols.push(<Cell playable={false} value={i + 1} />);
  }

  // delegation
  const handleCellClick = (e) => {
    if (e.target.nodeName !== "INPUT") {
      return;
    }
    if (!e.target.parentNode.hasAttribute("data-index")) {
      return;
    }

    if (e.type === "contextmenu") {
      e.preventDefault();
    }
    onCellClick?.(
      Number(e.target.parentNode.getAttribute("data-index")),
      e.type === "click" ? "lmb" : "rmb"
    );
  };

  console.log(getGrayscaleColors(5));

  return (
    <div
      className={classes["field"]}
      onClick={handleCellClick}
      onContextMenu={handleCellClick}
      style={{
        "--columns": systemCols.length + 1,
        "--rows": systemRows.length + 1,
      }}
    >
      {zeroCell}
      {systemCols}
      {options.template.map((row, row_index) => (
        <>
          {systemRows[row_index]}
          {row.map((value, col_index) => {
            //![normalised index]
            const index =
              row_index * options.template[0].length + (col_index + 1);

            let cellOptions = {};
            if (String(index) in options.rules) {
              cellOptions = cloneObj(options.rules[String(index)]);
              cellOptions.color =
                playerColors[cellOptions[Object.keys(cellOptions)[0]]];
            }

            return (
              <Cell
                key={"cell" + index}
                index={index}
                color={cellOptions.color}
                base={showBases && cellOptions.base}
                stronghold={showStrongholds && cellOptions.stronghold}
                editable={editable}
                value={showValues ? value : null}
                onValueChange={onValueChange}
              />
            );
          })}
        </>
      ))}
    </div>
  );
}

export default GameField;
