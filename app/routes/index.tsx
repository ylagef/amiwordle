import { Link, redirect } from "remix";
import styles from "~/styles/index.css";
import { resetGame } from "~/utils";
import { useEffect, useState } from "react";

export const links = () => [{ rel: "stylesheet", href: styles }];

export default function Index() {
  const [resume, setResume] = useState(false);

  useEffect(() => {
    setResume(localStorage.getItem("board") !== null);
  }, []);

  return (
    <div className="index-container">
      <main className="buttons-container">
        <div className="random-mode-container">
          <Link
            className="button"
            to="/game"
            onClick={() => {
              gtag("event", "new_random_game");
              resetGame({ reload: false });
            }}
          >
            NUEVA PALABRA ALEATORIA
          </Link>

          {resume && (
            <Link
              className="continue"
              to="/game"
              onClick={() => {
                gtag("event", "continue_game");
              }}
            >
              Continuar partida
            </Link>
          )}
        </div>

        <Link
          className="button create"
          to="/create"
          onClick={() => {
            gtag("event", "create_game");
          }}
        >
          CREAR PARTIDA PERSONALIZADA
        </Link>
      </main>

      <Link className="how-to" to="/how-to">
        Cómo jugar
      </Link>
      <div className="footer-row">
        <a href="mailto:amiwordle@gmail.com">Contacto</a>
        <span>·</span>
        <Link
          className="privacy-policy"
          to="/privacy"
          onClick={() => {
            gtag("event", "privacy_policy");
          }}
        >
          Política de privacidad
        </Link>
      </div>
    </div>
  );
}
