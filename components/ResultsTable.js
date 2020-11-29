import { useTable } from "react-table";
import { Box } from "@chakra-ui/react";
import { useMemo } from "react";

const ResultsTable = ({ data = [] }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Nazwa przedsięwzięcia",
        accessor: "title", // accessor is the "key" in the data
      },

      {
        Header: "Adres URL",
        accessor: "url",
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
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
  );
};

export { ResultsTable };
