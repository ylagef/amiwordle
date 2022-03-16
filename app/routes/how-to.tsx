import { Link } from "react-router-dom";
import { MetaFunction } from "remix";
import styles from "~/styles/how-to.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => {
  return {
    title: "Amiwordle · Cómo jugar",
  };
};

export default function HowTo() {
  return (
    <div className="container how-to">
      <section>
        <h1>¿Cómo jugar?</h1>

        <p>
          El objetivo del juego es adivinar la palabra secreta antes de
          completar los intentos disponibles. ⏱
        </p>

        <p>
          Para ello, en cada intento podrás comprobar en color{" "}
          <span className="yellow">AMARILLO</span> si la letra está en la
          palabra secreta, y en color <span className="green">VERDE</span> si la
          letra está y además es la posición correcta.
        </p>

        <p>
          Eso si, cuidado si se pone en color <span className="grey">GRIS</span>{" "}
          porque quiere decir que esa letra no está en la palabra secreta y{" "}
          <strong>no podrás volver a utilizarla en esta partida</strong>.
        </p>

        <small>
          NOTA: Es posible que la letra esté repetida, así que mucho ojo con
          eso. 👀
        </small>

        <h3>Atajos</h3>
        <p>
          <strong>Rendirse:</strong> Si te quedas sin ideas, puedes rendirte. La
          palabra se mostrará pero no podrás seguir jugando.{" "}
          <i>(Solo disponible en modo aleatorio).</i>
        </p>
        <p>
          <strong>Nueva palabra:</strong> Reiniciar la partida con una nueva
          palabra aleatoria.
        </p>
      </section>

      <section>
        <h2>¿Cómo crear partidas?</h2>
        <p>
          Para crear partidas sólo tienes que ir al apartado{" "}
          <i>"Crear partida personalizada"</i>, introducir la palabra que se
          jugará y finalmente...
        </p>
        <p>¡Compartir el enlace con quien tú quieras! 🎉</p>
      </section>

      <section>
        <h2>¿Cuánto puedo jugar?</h2>
        <p>
          <strong>Amiwordle</strong> no tiene límite de partidas ni tiempo, así
          que puedes jugar hasta que te sepas todas las palabras del diccionario
          de memoria.
        </p>
      </section>

      <div className="lets-play lets-play-bottom">
        <Link
          to="/game"
          onClick={() => {
            localStorage.setItem("how-to-done", "true");
          }}
        >
          EMPEZAR
        </Link>
      </div>

      <div className="lets-play lets-play-top">
        <Link
          to="/game"
          onClick={() => {
            localStorage.setItem("how-to-done", "true");
          }}
        >
          EMPEZAR
        </Link>
      </div>

      <div className="starting-accepts-container">
        <small>
          Al empezar, aceptas los{" "}
          <Link to="/privacy">Términos y condiciones</Link>.
        </small>
      </div>

      <div className="original-idea">
        <small>
          Idea original de{" "}
          <a href="https://www.powerlanguage.co.uk/">Josh Wardle</a> (
          <a href="https://www.powerlanguage.co.uk/wordle/">Wordle</a>) y
          adaptada por <a href="https://danielfrg.com/">Daniel Rodríguez</a> con
          (<a href="https://wordle.danielfrg.com/">Wordle</a>).
        </small>
      </div>
    </div>
  );
}
