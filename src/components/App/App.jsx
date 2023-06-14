import { useEffect, useRef, useState } from "react";
import socketIO from "socket.io-client";
import GameField from "../GameField/GameField";
import Player from "../Player/Player";
import classes from "./App.module.css";
import Questions from "../Questions/Questions";
import HistoryParser from "../../classes/HistoryParser";

function App() {
  const [gameData, setGameData] = useState(null);
  const [allQuestions, setAllQuestions] = useState(null);
  const [players, setPlayers] = useState(null);
  const [connectedPlayers, setConnectedPlayers] = useState(null);
  const [chosenPlayer, setChosenPlayer] = useState(null);
  const [history, setHistory] = useState(null);

  // локально вычесляемые значения
  const [questions, setQuestions] = useState(null);
  const [scores, setScores] = useState(null);

  const parserRef = useRef(null);

  const socketRef = useRef(null);

  function selectPlayer(letter) {
    socketRef.current.emit("choose_player", letter);
  }

  useEffect(() => {
    // подключение к серверу
    socketRef.current = socketIO("localhost:3000");

    // получение информации об игре
    socketRef.current.on("game", setGameData);
    socketRef.current.on("players", setPlayers);
    socketRef.current.on("questions", setAllQuestions);
    socketRef.current.on("connected_players", setConnectedPlayers);
    socketRef.current.on("get_letter", setChosenPlayer);
    socketRef.current.on("history", setHistory);

    return () => {
      socketRef.current.disconnect();

      socketRef.current.off("game", setGameData);
      socketRef.current.off("players", setPlayers);
      socketRef.current.off("questions", setAllQuestions);
      socketRef.current.off("connected_players", setConnectedPlayers);
      socketRef.current.off("get_letter", setChosenPlayer);
      socketRef.current.off("history", setHistory);

      [
        setGameData,
        setPlayers,
        setAllQuestions,
        setConnectedPlayers,
        setChosenPlayer,
        setHistory,
      ].forEach((setter) => setter(null));
    };
  }, []);

  // update history parser
  useEffect(() => {
    const updateGame = () => {
      if (gameData && allQuestions) {
        parserRef.current = new HistoryParser(
          gameData,
          allQuestions,
          history || []
        );
      }
    };

    if (
      !parserRef.current ||
      parserRef.current.game !== gameData ||
      parserRef.current.allQuestions !== allQuestions
    ) {
      updateGame();
    } else {
      parserRef.current.update(history);
    }

    if (parserRef.current) {
      setQuestions(parserRef.current.questions);
      setScores(parserRef.current.scores);
    }
  }, [gameData, allQuestions, history]);

  // если полная информация об игре получена
  if (gameData && chosenPlayer && players && questions && scores) {
    return (
      <>
        <div className={classes["container"]}>
          <div>
            {questions && (
              <Questions
                questions={questions}
                onAnswer={(questionIndex, answer) =>
                  socketRef.current.emit("answer", {
                    questionIndex,
                    answer,
                  })
                }
              />
            )}
          </div>
          <GameField options={gameData}></GameField>
          <div className={classes["player-bar"]}>
            <h1>Игроки</h1>
            {connectedPlayers.map((player) => (
              <Player
                short
                key={player.letter}
                letter={player.letter}
                stats={scores[player.letter]}
                name={player.name}
                color={player.color}
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  // если получен список игроков
  if (players && connectedPlayers) {
    const avalivablePlayers = players.filter(
      (player) =>
        !connectedPlayers.find(
          (connectedPLayer) => connectedPLayer.letter === player.letter
        )
    );

    return (
      <div>
        Доступные:
        {avalivablePlayers.map((player) => (
          <Player
            short
            key={player.letter}
            letter={player.letter}
            name={player.name}
            color={player.color}
            onClick={selectPlayer}
          />
        ))}
      </div>
    );
  }
}

export default App;