import { createMachine } from "@xstate/fsm";
import { useMachine } from "@xstate/react/lib/fsm";
import { useState } from "react";
import { FilterForm } from "../components/FilterForm";
import { FiletypePicker } from "../components/FiletypePicker";
import { ResultsTable } from "../components/ResultsTable";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Text } from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import {
  IconButton,
  Heading,
  Box,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { EntitiesTable } from "../components/EntitiesTable";

import dynamic from "next/dynamic";

// const DynamicGraphWithNoSSR = dynamic(() => import("../components/EntitiesGraph"), {
//   ssr: false,
// });

const moneyMachine = createMachine({
  id: "moneyMachine",
  initial: "files",
  states: {
    files: { on: { KEYWORDS: "keywords", FROM_SCRATCH: "display" } },
    keywords: { on: { PARSED: "display", ERROR: "error" } },
    display: { on: { SUBMIT: "loading", IMPORT: "files" } },
    loading: { on: { RESOLVED: "display", REJECTED: "error" } },
    error: { on: { CLOSE: "display" } },
  },
});

export default function Home() {
  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: true });

  const [state, send] = useMachine(moneyMachine);
  const [data, setData] = useState(null);
  const [initialValues, setInitialValues] = useState(null);

  switch (state.value) {
    case "files":
    case "keywords":
    case "query":
      return <FiletypePicker state={state} send={send} setInitialValues={setInitialValues} />;
    case "display":
    case "error":
    case "loading":
      return (
        <>
          <Box
            width="100%"
            position="sticky"
            top={0}
            backgroundColor="white"
            display="flex"
            alignItems="center"
            p={4}
            borderBottom="1px solid rgba(0, 0, 0, 0.25)"
          >
            <IconButton size="sm" variant="outline" onClick={onOpen} icon={<HamburgerIcon />} />
            <Heading ml={4} mb={0} as="h1" size="lg">
              abagnale
            </Heading>
          </Box>
          <Drawer size="lg" isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay>
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Filters</DrawerHeader>

                <DrawerBody>
                  <FilterForm
                    onClose={onClose}
                    initialValues={initialValues}
                    send={send}
                    setData={setData}
                    state={state}
                  />
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
          {state.value === "loading" ? (
            <Box
              height="100%"
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box width="200px" minHeight="200px">
                <Progress size="lg" isIndeterminate />
              </Box>
            </Box>
          ) : data && data.results.length > 0 ? (
            <>
              {state.value === "error" ? (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle mr={2}>Your browser is outdated!</AlertTitle>
                  <AlertDescription>Your Chakra experience may be degraded.</AlertDescription>
                  <Button onClick={() => send("CLOSE")} position="absolute" right="8px" top="8px">
                    X
                  </Button>
                </Alert>
              ) : null}
              <Tabs isLazy>
                <TabList>
                  <Tab>Lista wyników</Tab>
                  <Tab>Lista powiązań</Tab>
                  {/* <Tab>Graf powiązań</Tab> */}
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <ResultsTable data={data.results} />
                  </TabPanel>
                  <TabPanel>
                    <EntitiesTable data={data.graph} />
                  </TabPanel>
                  {/* <TabPanel>
                    <DynamicGraphWithNoSSR data={data.graph} />
                  </TabPanel> */}
                </TabPanels>
              </Tabs>
            </>
          ) : (
            <Text textAlign="center" p={4}>
              Brak wyników! Zmień kryteria wyszukiwania :)
            </Text>
          )}
        </>
      );
    default:
      return null;
  }
}
