import { Box, Button, List, ListItem, Tag } from "@chakra-ui/react";
import { toPairs, mapValues, values } from "lodash";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

const EntitiesTable = ({ data = [] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={6}>
        <IconButton
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          icon={<ArrowLeftIcon />}
        />
        <Text>
          Obecna strona: {currentPage + 1} z {Math.ceil(data.length / 10)}
        </Text>
        <IconButton
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          icon={<ArrowRightIcon />}
        />
      </Box>
      <Accordion allowToggle>
        {data
          .sort((a, b) => a.frequency < b.frequency)
          .slice(10 * currentPage, 10 * (currentPage + 1))
          .map((row) => (
            <AccordionItem key={row.title}>
              <AccordionButton>
                <Box display="flex" alignItems="center" flex="1" textAlign="left">
                  <Tag
                    colorScheme={
                      row.frequency > 50 ? "red" : row.frequency > 25 ? "orange" : "gray"
                    }
                  >
                    {row.frequency}
                  </Tag>{" "}
                  <Text ml={2}>{row.title}</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Box as="table" width="80%" marginLeft="10%">
                  <Box as="thead" borderBottom="1px solid rgba(0, 0, 0, 0.25)">
                    <Box as="tr">
                      <Box as="td">identyfikator</Box>
                      <Box as="td">siła powiązania</Box>
                    </Box>
                  </Box>
                  <Box as="tbody">
                    {toPairs(row.friends)
                      .sort(([, frequencyA], [, frequencyB]) => frequencyA < frequencyB)
                      .map(([friend, frequency]) => (
                        <Box as="tr" key={friend}>
                          <td>{friend}</td>
                          <Box as="td" textAlign="right">
                            {Math.round(frequency * 100)}
                          </Box>
                        </Box>
                      ))}
                  </Box>
                </Box>
              </AccordionPanel>
            </AccordionItem>
          ))}
      </Accordion>
    </>
  );
};

export { EntitiesTable };
