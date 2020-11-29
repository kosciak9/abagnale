import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Button, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

const FiletypePicker = ({ state, send, setInitialValues }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      try {
        acceptedFiles[0].text().then((text) => {
          console.log(text);
          setInitialValues({
            groups: [text.split("\n")],
          });
          send("PARSED");
        });
      } catch (error) {
        console.error(error);
        send("ERROR");
      }
    },
  });

  return (
    <Box height="100%" width="100%" display="flex" justifyContent="center" alignItems="center">
      {state.value === "keywords" ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          {...getRootProps({ className: "dropzone" })}
        >
          <ExternalLinkIcon style={{ margin: 16 }} size={48} />
          <input {...getInputProps()} />
          <p>Naciśnij aby wybrać swój plik z wyrazami do wyszukania (lub przeciągnij i upuść!)</p>
        </Box>
      ) : (
        <Box display="flex" justifyContent="space-between" textAlign="center">
          <Box m={4}>
            <Text>Import files from keyword file (newline separated)</Text>
            <Button isFullWidth onClick={() => send("KEYWORDS")}>
              from keywords
            </Button>
          </Box>
          <Box m={4}>
            <Text>Don't import - build new query from scratch</Text>
            <Button isFullWidth onClick={() => send("FROM_SCRATCH")}>
              from scratch
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export { FiletypePicker };
