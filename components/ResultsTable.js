import { useTable } from "react-table";
import { Box, Link, Tag } from "@chakra-ui/react";
import { useMemo } from "react";
import createPersistedState from "use-persisted-state";
import { useEffect } from "react";

const useSeenState = createPersistedState("seen");

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
  const [unseen, setSeen] = useSeenState(true);
  useEffect(() => {
    return () => setSeen(false);
  }, []);

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
          {data.map((row, index) => (
            <Box as="tr" key={row.url}>
              <td>
                {row.title} {unseen ? <Tag colorScheme="green">Nowe</Tag> : null}
              </td>
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
