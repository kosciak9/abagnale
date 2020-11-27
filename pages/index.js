import Head from "next/head";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createMachine } from "@xstate/fsm";
import { useMachine } from "@xstate/react/lib/fsm";
import wretch from "wretch";
import { useState, useMemo } from "react";
import { Box, Button, Heading, Input, Text } from "@chakra-ui/react";
import { useTable } from "react-table";

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
  const columns = useMemo(
    () => [
      {
        Header: "Imię i nazwisko",
        accessor: "name", // accessor is the "key" in the data
      },

      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Address",
        accessor: "address",
      },
      {
        Header: "Phone number",
        accessor: "phoneNo",
      },
    ],

    []
  );

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <Box display="grid" gridTemplateColumns="1fr 70%" padding={4}>
      <Box marginTop={8}>
        <Head>
          <title>threat-alert</title>
        </Head>

        <Heading>Find bad guys</Heading>
        <Text>
          Fill the blanks below to find freshiest Bitcoin scammers, Insurance scammers or any other
          type of a scammer you want!
        </Text>

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
              as={Input}
              m={2}
              // type="email"
              name="email"
            />

            <ErrorMessage name="email" component="div" />

            <Field m={2} as={Input} type="password" name="password" />

            <ErrorMessage name="password" component="div" />

            <Button
              isFullWidth
              m={2}
              type="submit"
              isLoading={state.matches("loading")}
              disabled={state.matches("loading")}
            >
              {state.matches("loading") ? "Loading..." : "Submit"}
            </Button>
          </Form>
        </Formik>
      </Box>
      {/* <Box as="main" p={4}>
        {data.map((row) => (
          <div key={row.id}>{JSON.stringify(row, null, 2)}</div>
        ))}
      </Box> */}

      <Box as="main" p={8}>
        <Box as="table" {...getTableProps()} width="100%">
          <Box as="thead" borderBottom="1px solid rgba(0, 0, 0, 0.25)" mb={2} textAlign="left">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
              </tr>
            ))}
          </Box>

          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);

              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </Box>
      </Box>
    </Box>
  );
}
