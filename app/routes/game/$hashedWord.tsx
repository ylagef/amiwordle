import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import styles from "~/styles/game.css";
import Game from "~/components/game";
import { resetGame } from "~/utils";
import { useEffect } from "react";
import dict from "~/static/dict/dict";

export const links = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => {
  return {
    title: "Amiwordle · Partida personalizada",
  };
};

export const loader: LoaderFunction = ({ params }) => {
  const md5 = require("md5-nodejs");
  const { hashedWord } = params;

  return dict.find((w: string) => md5(w) === hashedWord) || "";
};

export default function CustomGame() {
  const initialWord = useLoaderData();

  return <Game initialWord={initialWord} />;
}
