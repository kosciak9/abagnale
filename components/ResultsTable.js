import { useTable } from "react-table";
import { Box, Link } from "@chakra-ui/react";
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
          <tr>
            <th>Nazwa przedsięwzięcia</th>
            <th>Adres URL</th>
          </tr>
        </Box>
        <Box as="tbody">
          {data.map((row) => (
            <Box as="tr" key={row.url}>
              <td>{row.title}</td>
              <td>
                <Link href={row.url}>{row.url}</Link>
              </td>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export { ResultsTable };
