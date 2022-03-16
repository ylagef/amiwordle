import styles from "~/styles/game.css";
import Game from "~/components/game";
import { MetaFunction } from "remix";

export const links = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => {
  return {
    title: "Amiwordle · Partida aleatoria",
  };
};

export default function GameIndexRoute({ word }: { word?: string }) {
  return <Game />;
}
