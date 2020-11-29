import { Formik, Form, Field, FieldArray } from "formik";
import wretch from "wretch";
import {
  Divider,
  Box,
  Button,
  Input,
  Text,
  FormControl,
  FormLabel,
  Switch,
  Heading,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { Fragment } from "react";
import { Persist } from "formik-persist";

const KeywordField = ({ name, remove }) => (
  <Box my={2} display="flex" justifyContent="space-between">
    <Field as={Input} name={name} placeholder="another keyword" />
    <Button ml={2} onClick={remove}>
      <CloseIcon />
    </Button>
  </Box>
);

const FilterForm = ({ send, setData, state, initialValues, onClose }) => (
  <Formik
    initialValues={{ groups: [], ...initialValues, polishOnly: false }}
    onSubmit={(values) => {
      send({ type: "SUBMIT" });
      wretch("/api/find")
        .post(values)
        .json()
        .then((response) => {
          setData(response);
          send({ type: "RESOLVED" });
          console.log(onClose);
          onClose();
        })
        .catch((error) => {
          console.error(error);
          send({ type: "REJECTED" });
        });
    }}
  >
    {({ values }) => (
      <Box as={Form} p={4}>
        <FieldArray name="groups">
          {({ remove: removeGroup, push: pushGroup }) => (
            <div>
              {values.groups.length > 0 &&
                values.groups.map((_, groupIndex) => (
                  <Fragment key={groupIndex}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Text mt={2}>Group {groupIndex + 1} </Text>
                      <Button
                        mt={1}
                        height={10}
                        width={10}
                        colorScheme="red"
                        onClick={() => removeGroup(groupIndex)}
                      >
                        <DeleteIcon fontSize={12} />
                      </Button>
                    </Box>
                    <FieldArray name={`groups.${groupIndex}`}>
                      {({ remove: removeKeyword, push: pushKeyword }) => (
                        <Box my={4}>
                          {values.groups[groupIndex].length > 0 &&
                            values.groups[groupIndex].map((_, keywordIndex) => (
                              <KeywordField
                                name={`groups[${groupIndex}][${keywordIndex}]`}
                                remove={() => removeKeyword(keywordIndex)}
                                key={keywordIndex}
                              />
                            ))}
                          <Button colorScheme="gray" type="button" onClick={() => pushKeyword("")}>
                            <AddIcon scale={0.75} mr={2} /> add keyword
                          </Button>
                        </Box>
                      )}
                    </FieldArray>
                  </Fragment>
                ))}
              <Button my={2} colorScheme="blue" onClick={() => pushGroup([])}>
                <AddIcon scale={0.75} mr={2} /> add keyword group
              </Button>
            </div>
          )}
        </FieldArray>
        <Divider />

        <FormControl display="flex" alignItems="center" justifyContent="space-between" my={6}>
          <FormLabel htmlFor="polishOnly" mb={0}>
            Search Polish websites only? (🇵🇱)
          </FormLabel>
          <Field as={Switch} name="polishOnly" />
        </FormControl>
        <Divider />

        <Button
          isFullWidth
          my={2}
          type="submit"
          colorScheme="green"
          isLoading={state.matches("loading")}
          disabled={state.matches("loading")}
        >
          {state.matches("loading") ? (
            "Loading..."
          ) : (
            <>
              <SearchIcon mr={2} /> Search
            </>
          )}
        </Button>
        {initialValues ? null : <Persist name="filter-form" />}
      </Box>
    )}
  </Formik>
);

export { FilterForm };
