import { Box, Button, List, ListItem } from "@chakra-ui/react";
import { mapValues, values } from "lodash";
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
        {data.slice(10 * currentPage, 10 * (currentPage + 1)).map((row) => (
          <AccordionItem key={row.title}>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                {row.title} - {row.frequency}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <List>
                {values(
                  mapValues(row.friends, (frequency, friend) => (
                    <ListItem>
                      {friend} - {frequency}
                    </ListItem>
                  ))
                )}
              </List>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export { EntitiesTable };
