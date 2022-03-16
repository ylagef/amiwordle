import { useEffect, useState } from "react";
import { Link, MetaFunction, useSearchParams } from "remix";
import Share from "~/components/share";
import { CopyToClipboard } from "react-copy-to-clipboard";

import styles from "~/styles/create-success.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => {
  return {
    title: "Amiwordle · Partida creada",
  };
};

export default function CreateSuccessRoute() {
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const hashedWord = searchParams.get("data") || "";

  useEffect(() => {
    setUrl(`${location.origin.split("//")[1]}/game/${hashedWord}`);
  }, []);

  const copyClipboard = () => {
    if (navigator.clipboard) {
      gtag("event", "clipboard_custom_game");

      navigator.clipboard
        .writeText(url)
        .then(() => {
          console.log("Text copied to clipboard");
        })
        .catch((err) => {
          console.error("Error in copying text: ", err);
        });
    } else {
      console.error("No se pudo copiar el texto");
    }
  };

  const showCopied = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <main className="container">
      <div className="inner-container">
        <h2>¡Partida creada!</h2>
        <p>
          Ahora puedes enviarle este enlace a quien quieras y que intente
          adivinar la palabra.
        </p>

        <div className="buttons-container">
          <CopyToClipboard
            text={url}
            onCopy={() => {
              showCopied();
              gtag("event", "clipboard_custom_game");
            }}
          >
            <button>{copied ? "¡Copiado!" : "Copiar enlace"}</button>
          </CopyToClipboard>
        </div>

        <Share
          type="created"
          hashedWord={hashedWord}
          screenshotAvailable={false}
        />

        <Link to={`/game/${hashedWord}`}>Jugar esta palabra</Link>
      </div>
    </main>
  );
}
