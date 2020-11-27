import Head from "next/head";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createMachine } from "@xstate/fsm";
import { useMachine } from "@xstate/react/lib/fsm";
import wretch from "wretch";
import { useState } from "react";

const toggleMachine = createMachine({
  id: "form",
  initial: "display",
  states: {
    display: { on: { SUBMIT: "loading" } },
    loading: { on: { RESOLVED: "display", REJECT: "error" } },
    error: { on: { RESET: "idle" } },
  },
});

export default function Home() {
  const [state, send] = useMachine(toggleMachine);
  const [data, setData] = useState([]);

  return (
    <main>
      <Head>
        <title>threat-alert</title>
      </Head>

      <h1>
        Follow us to the land: <code>{JSON.stringify(state)}</code>
      </h1>
      <p>Expected something different?</p>

      <Formik
        initialValues={{ email: "", password: "" }}
        validate={(values) => {
          const errors = {};

          // if (!values.email) {
          //   errors.email = "Required";
          // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
          //   errors.email = "Invalid email address";
          // }

          return errors;
        }}
        onSubmit={(values) => {
          send({ type: "SUBMIT" });
          wretch("/api/find")
            .post(values)
            .json()
            .then((response) => {
              setData(response.results);
              send({ type: "RESOLVED" });
            })
            .catch((error) => send({ type: "REJECT" }));
        }}
      >
        <Form>
          <Field
            // type="email"
            name="email"
          />

          <ErrorMessage name="email" component="div" />

          <Field type="password" name="password" />

          <ErrorMessage name="password" component="div" />

          <button type="submit" disabled={state.matches("loading")}>
            {state.matches("loading") ? "Loading..." : "Submit"}
          </button>
        </Form>
      </Formik>

      {data.map((row) => (
        <div key={row.id}>{JSON.stringify(row, null, 2)}</div>
      ))}
    </main>
  );
}
