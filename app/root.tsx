import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "remix";
import styles from "~/styles/global.css";
import type { MetaFunction } from "remix";
import galicia from "~/static/images/galicia.svg";
import back from "~/static/images/back.svg";
import { useEffect, useState } from "react";
import { resetGame } from "./utils";

import sharedStyles from "~/styles/share.css";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: sharedStyles },
  ];
}

export const meta: MetaFunction = () => {
  return {
    title: "Amiwordle",
  };
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Google Analytics
    const gaElement = document.getElementById("ga");
    if (gaElement)
      gaElement.innerHTML =
        'window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag("js", new Date()); gtag("config", "G-F919B2J5SQ");';

    console.log("GA initialized");

    const htd = localStorage.getItem("how-to-done");
    if (!htd) navigate("/how-to");
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,user-scalable=no"
        />
        <Meta />
        <Links />

        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-F919B2J5SQ"
        ></script>
        <script id="ga" />
      </head>

      <body>
        <div className="index-container">
          <div className="index-container-inner">
            <header>
              {location.pathname !== "/" && location.pathname !== "/how-to" && (
                <button
                  className="back hide-on-screenshot"
                  onClick={() => window.history.back()}
                >
                  <img src={back} />
                </button>
              )}
              {location.pathname === "/" ||
              location.pathname === "how-to" ||
              location.pathname === "privacy" ? (
                <h1 className="title">AW</h1>
              ) : (
                <h1 className="title">
                  <Link to="/">AW</Link>
                </h1>
              )}

              {/* {location.pathname.startsWith("/game") &&
                location.pathname !== "/game/win" &&
                location.pathname !== "/game/game-over" && (

                )} */}
            </header>

            <div className="outlet-container">
              <Outlet />
            </div>

            <ScrollRestoration />
            <Scripts />

            {process.env.NODE_ENV === "development" && <LiveReload />}

            <footer>
              <p>
                2022 · Yeray Lage · Con agarimo dende Galiza{" "}
                <img src={galicia} />
              </p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
