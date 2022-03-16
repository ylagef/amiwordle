import { createRef, useEffect, useState } from "react";
import {
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { BoxType, STATES } from "./game";
const { useScreenshot } = require("use-react-screenshot"); // Using require because of f** typescript

export default function Share({
  type,
  word,
  board,
  hashedWord,
  screenshotAvailable = true,
}: {
  type: string;
  word?: string;
  board?: BoxType[][];
  hashedWord?: string;
  screenshotAvailable?: boolean;
}) {
  const [sharable, setSharable] = useState(false);
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<string[][]>([]);
  const [title, setTitle] = useState("");

  const [image, takeScreenshot] = useScreenshot();

  useEffect(() => {
    if (navigator) {
      const txt = new Blob(["Hello, world!"], { type: "text/plain" });

      const file = new File([txt], "test.txt");
      setSharable(navigator.canShare && navigator.canShare({ files: [file] }));
    }

    const gameUrl = `${location.origin}`;
    if (board && word) {
      const auxResults: string[][] = [];
      for (let i = 0; i < board.length; i++) {
        const row = board[i];
        auxResults.push(
          row.map((box) =>
            box.state === STATES.CORRECT
              ? "🟩"
              : box.state === STATES.INCLUDED
              ? "🟨"
              : "⬜️"
          )
        );

        if (row.every((box) => box.state === STATES.CORRECT)) break;
      }
      setResults(auxResults);
      setTitle(
        `(${word.toUpperCase()})\n\n${auxResults
          .map((row: string[]) => row.join(" "))
          .join("\n")}\n\n${auxResults.length}/${board.length}`
      );

      setUrl(gameUrl);
    } else if (hashedWord) {
      setTitle(`¿Adivinas mi palabra?`);
      setUrl(`${gameUrl}/game/${hashedWord}`);
    }
  }, []);

  const dataURLtoFile = (dataUrl: string, filename: string) => {
    let arr = dataUrl.split(",");
    let mimeAux = arr[0].match(/:(.*?);/) || "";
    let mime = mimeAux[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const screenshot = async () => {
    const displayOnScreenshot = document.getElementById(
      "display-on-screenshot"
    );
    if (displayOnScreenshot) displayOnScreenshot.style.display = "block";

    const hideOnScreenshot = document.querySelectorAll(".hide-on-screenshot");
    hideOnScreenshot.forEach((element) => {
      element.setAttribute("style", "opacity: 0;");
    });
    const displayNoneOnScreenshot = document.querySelectorAll(
      ".display-none-on-screenshot"
    );
    displayNoneOnScreenshot.forEach((element) => {
      element.setAttribute("style", "display: none;");
    });

    const img = await takeScreenshot(document.body);

    if (displayOnScreenshot) displayOnScreenshot.style.display = "none";
    hideOnScreenshot.forEach((element) => {
      element.setAttribute("style", "opacity: 1;");
    });
    displayNoneOnScreenshot.forEach((element) => {
      element.setAttribute("style", "display: flex;");
    });

    const files = [dataURLtoFile(img, "screenshot.png")];
    if (navigator.canShare && navigator.canShare({ files })) {
      navigator
        .share({
          files,
          title: "Amiwordle",
          text: `I ${
            type === "win" ? "won" : "lost"
          } the game with the word ${word?.toUpperCase()}`,
        })
        .then(() => {
          console.log("Share was successful.");
        })
        .catch((error: any) => {
          console.error("Error on sharing", { error });
        });
    } else {
      console.error(`Your system doesn't support sharing files.`);
    }
  };

  return (
    <div className="share-container" id="share-container">
      {board && results && (
        <div className="results-container">
          <h4>
            {results.length}/{board?.length}
          </h4>
          {results.map((row: string[], i) => (
            <p key={i}>{row.join(" ")}</p>
          ))}
        </div>
      )}

      <p className="share-with-friends display-none-on-screenshot">
        Comparte con tus amigxs
      </p>

      <div className="share-buttons-container display-none-on-screenshot">
        <TwitterShareButton
          onClick={() => gtag("event", `share_${type}_twitter`)}
          url={url}
          title={`𝗔𝗺𝗶𝘄𝗼𝗿𝗱𝗹𝗲\n${title}\n${word ? "\n" : ""}`}
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        <WhatsappShareButton
          onClick={() => gtag("event", `share_${type}_whatsapp`)}
          url={url}
          separator={"\n\n"}
          title={`*Amiwordle*\n${title}`}
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>

        {/* {image && <img src={image} alt="screenshot" />} */}

        {sharable && screenshotAvailable && (
          <button onClick={() => screenshot()}>Compartir captura</button>
        )}
      </div>

      <p id="display-on-screenshot">· Juega en amiwordle.netlify.app ·</p>
    </div>
  );
}
