import { useEffect, useState } from "react";
import styles from "~/styles/game.css";
import dict from "~/static/dict/dict.js";
import { useNavigate } from "remix";
import { formatElapsedTime, resetGame } from "~/utils";

export const links = () => [{ rel: "stylesheet", href: styles }];

export type BoxType = { letter: string; state: string | null };

export const STATES = {
  CORRECT: "correct",
  INCLUDED: "included",
  NOT_INCLUDED: "not-included",
};

const KEYBOARD = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["ENVIAR", "Z", "X", "C", "V", "B", "N", "M", "del"],
];

const Box = ({ box }: { box: BoxType }) => (
  <div className={`box box-${box.state}`}>
    <h1>{box.letter}</h1>
  </div>
);

export default function Game({ initialWord }: { initialWord?: string }) {
  const [word, setWord] = useState(initialWord);
  const [ended, setEnded] = useState(false);
  const [board, setBoard] = useState<BoxType[][]>([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [usedLetters, setUsedLetters] = useState<
    { letter: string; state: string }[] | []
  >([]);

  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState<Date>();
  const [surrendered, setSurrendered] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (board.length > 0) checkEnded(board);

    document.onkeyup = (e) => {
      e = e || window.event;
      var key = e.key;

      if (!ended) {
        if (key === "Backspace") {
          removeLetter();
        } else if (key === "Enter") {
          send();
        } else if (e.code.startsWith("Key")) {
          addLetter(key.toUpperCase());
        }
      }
    };
  }, [board, currentRowIndex]);

  useEffect(() => {
    const prevWord = atob(localStorage.getItem("word") || "");

    if (!prevWord || (initialWord && prevWord !== initialWord)) {
      // NEW GAME!
      resetGame({ reload: false });

      localStorage.setItem("word", btoa(word || ""));

      setStartTime(new Date().getTime());
    }
  }, [word]);

  useEffect(() => {
    if (startTime > 0) {
      localStorage.setItem("start-time", startTime.toString());
    } else {
      const localStorageStartTime = localStorage.getItem("start-time");
      if (localStorageStartTime) {
        const startInt = parseInt(localStorage.getItem("start-time") || "0");
        setStartTime(startInt);
      }
    }

    const interval = setInterval(() => {
      if (!ended) {
        setElapsedTime(
          new Date(new Date().getTime() - startTime - 1000 * 60 * 60)
        );
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, ended]);

  useEffect(() => {
    if (board.length > 0) {
      localStorage.setItem("board", JSON.stringify(board));
    }
  }, [board]);

  useEffect(() => {
    if (usedLetters.length > 0) {
      localStorage.setItem("usedLetters", JSON.stringify(usedLetters));
    }
  }, [usedLetters]);

  useEffect(() => {
    const decodedWord = atob(localStorage.getItem("word") || "");

    const prevBoard = localStorage.getItem("board");
    const prevUsedLetters = localStorage.getItem("usedLetters");

    if (prevBoard) {
      setBoard(JSON.parse(prevBoard));
      if (prevUsedLetters) setUsedLetters(JSON.parse(prevUsedLetters));

      checkEnded(JSON.parse(prevBoard));
    } else {
      setBoard([
        [
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
        ],
        [
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
        ],
        [
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
        ],
        [
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
        ],
        [
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
        ],
        [
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
          { letter: "", state: null },
        ],
      ]);
    }

    if (!initialWord) {
      setWord(decodedWord || dict[Math.floor(Math.random() * dict.length)]);
    }

    const localStorageEndTime = localStorage.getItem("end-time");
    if (localStorageEndTime) {
      const endInt = parseInt(localStorageEndTime);
      const startInt = parseInt(localStorage.getItem("start-time") || "0");

      setElapsedTime(new Date(endInt - startInt - 1000 * 60 * 60));
    }

    const localSurrendered = localStorage.getItem("surrendered");
    if (localSurrendered) {
      setSurrendered(localSurrendered === "true");
    }
  }, []);

  const checkEnded = (board: BoxType[][]) => {
    const win = board.findIndex((row) =>
      row.every((box) => box.state === STATES.CORRECT)
    );
    const playing = board.findIndex((row) => row.some((box) => !box.state));
    setCurrentRowIndex(win > -1 ? win : playing);

    const gameOver = board[board.length - 1].every((box) => box.state !== null);

    const end = win > -1 || gameOver;
    setEnded(end);
    const localStorageEndTime = localStorage.getItem("end-time");
    if (end && !localStorageEndTime)
      localStorage.setItem("end-time", new Date().getTime().toString());
  };

  const Key = ({
    keyboardKey,
    handleClick,
  }: {
    keyboardKey: string;
    handleClick: (key: string) => void;
  }) => {
    const usedLetter = usedLetters.find(
      (letter) => letter.letter === keyboardKey
    );
    const state = usedLetter !== undefined ? `key-${usedLetter.state}` : "";

    return (
      <button
        className={`key ${state}`}
        onClick={() => handleClick(keyboardKey)}
        disabled={state === `key-${STATES.NOT_INCLUDED}`}
      >
        <p>{keyboardKey === "del" ? "←" : keyboardKey}</p>
      </button>
    );
  };

  const showMessage = (message: string) => {
    setMessage(message);

    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const addLetter = (letter: string) => {
    const usedLetter = usedLetters.find(
      (usedLetter) => usedLetter.letter === letter
    );

    // TODO enable keyboard in dev
    if (
      !usedLetter ||
      (usedLetter && usedLetter.state !== STATES.NOT_INCLUDED)
    ) {
      const currentColIndex = board[currentRowIndex].findIndex(
        (box: BoxType) => box.letter === ""
      );

      if (currentColIndex > -1) {
        setBoard((prev) => {
          const newBoard = [...prev];
          newBoard[currentRowIndex][currentColIndex].letter = letter;
          return newBoard;
        });
      }
    }
  };

  const removeLetter = () => {
    const emptyBoxes = board[currentRowIndex].findIndex(
      (box: BoxType) => box.letter === ""
    );
    const currentColIndex = emptyBoxes >= 0 ? emptyBoxes - 1 : board.length - 2;

    if (currentColIndex >= 0) {
      setBoard((prev) => {
        const newBoard = [...prev];
        newBoard[currentRowIndex][currentColIndex].letter = "";
        return newBoard;
      });
    }
  };

  const checkWordLetters = () => {
    const boardWordArray = board[currentRowIndex];
    const guessWordArray = word?.toUpperCase().split("") || [];

    boardWordArray.forEach((box: BoxType, index: number) => {
      let state: string;

      if (box.letter === guessWordArray[index]) {
        state = STATES.CORRECT;
      } else if (guessWordArray.includes(box.letter)) {
        state = STATES.INCLUDED;
      } else {
        state = STATES.NOT_INCLUDED;
      }

      const usedLetter = usedLetters.find(
        (letter) => letter.letter === box.letter
      );

      if (!usedLetter) {
        setUsedLetters((prev) => [...prev, { letter: box.letter, state }]);
      } else if (usedLetter && usedLetter.state !== STATES.CORRECT) {
        setUsedLetters((prev) => {
          const newUsedLetters = [...prev];
          newUsedLetters.find(
            (usedLetter) => usedLetter.letter === box.letter
          )!.state = state;

          return newUsedLetters;
        });
      }

      box.state = state;
    });

    setBoard((prev) => {
      const newBoard = [...prev];
      prev[currentRowIndex] = boardWordArray;

      return newBoard;
    });

    if (boardWordArray.every((box: BoxType) => box.state === STATES.CORRECT)) {
      navigate("/game/win");
      return false;
    }

    return true;
  };

  const setCorrectKeyboardLetters = () => {
    const guessWordArray = word?.toUpperCase().split("") || [];

    setUsedLetters((prev) => {
      const ul = guessWordArray.map((letter: string) => ({
        letter: letter,
        state: STATES.CORRECT,
      }));

      const filteredPrevUl = prev.filter(
        (ul) => !guessWordArray.includes(ul.letter)
      );

      return [...filteredPrevUl, ...ul];
    });
  };

  const nextRow = () => {
    const win = board[currentRowIndex].every(
      (box) => box.state === STATES.CORRECT
    );
    if (!win) {
      if (currentRowIndex < board.length - 1) {
        setCurrentRowIndex((prev) => (prev += 1));
      } else {
        setTimeout(() => {
          navigate("/game/game-over");
        }, 1000);
      }
    }
  };

  const send = () => {
    if (board[currentRowIndex].find((col) => col.letter === "") === undefined) {
      // Row is full
      const boardWord = board[currentRowIndex]
        .map((box: BoxType) => box.letter)
        .join("")
        .toLowerCase();
      if (dict.includes(boardWord)) {
        // Row is valid
        if (checkWordLetters()) {
          nextRow();
        }
      } else {
        showMessage("La palabra no está en mi diccionario");
      }
    } else {
      showMessage("Completa la palabra antes de enviar");
    }
  };

  const handleKeyClick = (key: string): ((letter: string) => void) => {
    return ended
      ? () => {}
      : key === "del"
      ? removeLetter
      : key === "ENVIAR"
      ? send
      : addLetter;
  };

  const giveUp = () => {
    setEnded(true);

    localStorage.setItem("surrendered", "true");
    setSurrendered(true);

    localStorage.setItem("end-time", new Date().getTime().toString());

    setBoard((prev: BoxType[][]) => {
      const guessWordArray = word?.toUpperCase().split("") || [];

      const newBoard = [...prev];
      newBoard[currentRowIndex] = guessWordArray.map((letter) => ({
        letter,
        state: STATES.CORRECT,
      }));

      return newBoard;
    });

    setCorrectKeyboardLetters();
  };

  return (
    <div className="game-container">
      {/* {word} */}

      <div className="buttons-container">
        {!ended && !initialWord && (
          <button
            onClick={() => {
              gtag("event", "give_up");
              giveUp();
            }}
          >
            Rendirse
          </button>
        )}

        <button
          onClick={() => {
            gtag("event", "reset_game");
            navigate("/game");
            resetGame({ reload: true });
          }}
        >
          Nueva palabra
        </button>
      </div>

      <div className="board-container">
        {board.map((row: BoxType[], rowIndex: number) => (
          <div
            className={`board-row ${
              rowIndex === currentRowIndex ? "selected-row" : ""
            }`}
            key={`board-row-${rowIndex}`}
          >
            {row.map((box: BoxType, colIndex: number) => (
              <Box key={`board-box-${rowIndex}-${colIndex}`} box={box} />
            ))}
          </div>
        ))}

        <div className="messages-container">
          {!message && elapsedTime && (
            <p className="message">
              {surrendered ? "Te has rendido · " : ended ? "FIN · " : ""}
              {formatElapsedTime(elapsedTime)}
            </p>
          )}
          {message && <p className="message">{message}</p>}
        </div>
      </div>
      <div className="keyboard-container">
        {KEYBOARD.map((row: string[], rowIndex: number) => (
          <div className="keyboard-row" key={`keyboard-row-${rowIndex}`}>
            {row.map((col: string) => (
              <Key
                key={`${col}`}
                keyboardKey={col}
                handleClick={handleKeyClick(col)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
