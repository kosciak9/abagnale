import { Box, Button, Text } from "@chakra-ui/react";

const FiletypePicker = ({ send }) => {
  return (
    <Box height="100%" width="100%" display="flex" justifyContent="center" alignItems="center">
      <Box display="flex" justifyContent="space-between" textAlign="center">
        <Box m={4}>
          <Text>Import files from keyword file (newline separated)</Text>
          <Button isFullWidth>from keywords</Button>
        </Box>
        <Box m={4}>
          <Text>Import files from query file export from Cośtam App</Text>
          <Button isFullWidth>from query file</Button>
        </Box>
        <Box m={4}>
          <Text>Don't import - build new query from scratch</Text>
          <Button isFullWidth onClick={() => send("FROM_SCRATCH")}>
            from scratch
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export { FiletypePicker };
