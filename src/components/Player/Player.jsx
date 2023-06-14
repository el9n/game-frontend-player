/* eslint-disable react/prop-types */
import classes from "./Player.module.css";

function Player({
  letter,
  name,
  color,
  stats,
  editable = false,
  short = false,
  onClick,
  onNameChange,
}) {
  return (
    <div
      className={classes["container"]}
      onClick={
        typeof onClick === "function" ? () => onClick(letter, "lmb") : null
      }
      onContextMenu={
        typeof onClick === "function"
          ? (e) => {
              e.preventDefault();
              onClick(letter, "rmb");
            }
          : null
      }
      style={{
        "--primaryColor": color[0],
        "--secondaryColor": color[1],
        cursor: typeof onClick === "function" ? "pointer" : null,
      }}
    >
      <div className={classes["letter"]}>{letter}</div>
      {stats && <div className={classes["stats"]}>{stats}</div>}
      {!short &&
        (editable ? (
          <input
            className={classes["name"]}
            value={name}
            type="text"
            placeholder="Название команды"
            onChange={(e) => onNameChange(letter, e.target.value)}
          />
        ) : (
          <div className={classes["name"]}>
            {name ? `${name}` : "Без имени"}
          </div>
        ))}
    </div>
  );
}

export default Player;
