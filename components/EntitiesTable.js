import { Box, Button, Link, List, ListItem, Tag, Tooltip } from "@chakra-ui/react";
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
          .sort((a, b) => a.relative_frequency < b.relative_frequency)
          .slice(10 * currentPage, 10 * (currentPage + 1))
          .map((row) => (
            <AccordionItem key={row.title}>
              <AccordionButton>
                <Box display="flex" alignItems="center" flex="1" textAlign="left">
                  <Tooltip
                    label={`To powiązanie jest ${
                      row.relative_frequency > 50
                        ? "silne"
                        : row.relative_frequency > 25
                        ? "średniej siły"
                        : "słabe"
                    } - ${
                      row.relative_frequency
                    }% wystąpień tego identyfikatora występuje na stronach w wyszukiwaniu.`}
                    hasArrow
                  >
                    <Tag
                      colorScheme={
                        row.relative_frequency > 50
                          ? "red"
                          : row.relative_frequency > 25
                          ? "orange"
                          : "gray"
                      }
                    >
                      {row.relative_frequency}
                    </Tag>
                  </Tooltip>
                  <Text ml={2}>{row.title}</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Box width="80%" marginLeft="10%">
                  {toPairs(row.friends)
                    .sort(([, frequencyA], [, frequencyB]) => frequencyA < frequencyB)
                    .map(([friend, connectionStrength]) => (
                      <Box key={friend} my={1}>
                        <Tooltip
                          label={`To powiązanie jest ${
                            Math.round(connectionStrength * 100) > 50
                              ? "silne"
                              : Math.round(connectionStrength * 100) > 25
                              ? "średniej siły"
                              : "słabe"
                          } - identyfikatory występują obok siebie w ${Math.round(
                            connectionStrength * 100
                          )}% stron, na których występuje choć jeden z nich.`}
                          hasArrow
                        >
                          <Tag
                            colorScheme={
                              Math.round(connectionStrength * 100) > 50
                                ? "red"
                                : Math.round(connectionStrength * 100) > 25
                                ? "orange"
                                : "gray"
                            }
                          >
                            {Math.round(connectionStrength * 100)}
                          </Tag>
                        </Tooltip>
                        <Link ml={2} href={"http://" + friend}>
                          {friend}
                        </Link>
                      </Box>
                    ))}
                </Box>
              </AccordionPanel>
            </AccordionItem>
          ))}
      </Accordion>
    </>
  );
};

export { EntitiesTable };
