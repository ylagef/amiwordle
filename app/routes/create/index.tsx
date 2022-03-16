import { useEffect, useState } from "react";
import styles from "~/styles/create.css";
import dict from "~/static/dict/dict";
import { Form, MetaFunction, redirect, useActionData } from "remix";
import type { ActionFunction } from "remix";

export const links = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => {
  return {
    title: "Amiwordle · Crear partida",
  };
};

export const action: ActionFunction = async ({ request }) => {
  const md5 = require("md5-nodejs");

  const formData = await request.formData();
  const word: string = (formData.get("word") as string).toLowerCase();

  let errors: any = { word: [] };
  if (!/[a-z]/i.test(word)) {
    errors.word.push("Debe contener SOLO letras");
  }
  if (word.length < 5 || word.length > 5) {
    errors.word.push("Debe tener 5 letras");
  }
  if (!dict.includes(word)) {
    errors.word.push("La palabra no está en mi diccionario");
  }

  if (errors.word.length) {
    return errors;
  }

  return redirect(`/create/success?data=${md5(word)}`);
};

export default function CreateIndexRoute() {
  const [errors, setErrors] = useState<any>({});
  const formErrors = useActionData();

  useEffect(() => {
    setErrors(formErrors);
  }, [formErrors]);

  return (
    <main className="container">
      <h2>Crear juego nuevo</h2>
      <p>
        Se generará una partida nueva con la palabra seleccionada y un enlace
        para poder retar a quien tú quieras
      </p>

      <Form method="post">
        <label>
          Palabra (5 letras)
          <input
            type="text"
            name="word"
            placeholder="Palabra"
            minLength={5}
            maxLength={5}
            autoComplete="off"
            onFocus={() => setErrors(null)}
            onKeyPress={(event) => {
              event.nativeEvent.returnValue =
                /[a-z]/i.test(event.key) &&
                event.currentTarget.value.length < 5;
            }}
            className={errors?.word ? "error" : ""}
            required
          />
          <div className="error-container">
            {errors?.word &&
              errors.word.map((wordError: string, index: number) => (
                <span key={index}> {wordError}</span>
              ))}
          </div>
        </label>

        <button type="submit">CREAR</button>
      </Form>
    </main>
  );
}
