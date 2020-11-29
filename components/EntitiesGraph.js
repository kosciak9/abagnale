import { Box } from "@chakra-ui/react";
import { toPairs, uniqueId } from "lodash";
import { useMemo } from "react";
import { Sigma, RandomizeNodePositions, RelativeSize } from "react-sigma";

const EntitiesGraph = ({ data = [] }) => {
  //   {
  //     nodes: [
  //       { id: "n1", label: "Alice" },
  //       { id: "n2", label: "Rabbit" },
  //     ],
  //     edges: [{ id: "e1", source: "n1", target: "n2", label: "SEES" }],
  //   };

  const myGraph = useMemo(() => {
    const formatted = data.map(({ frequency, friends, title: source }) => ({
      id: source,
      label: source,
      size: frequency,
      edges: toPairs(friends)
        .filter(([, strength]) => strength > 0.25)
        .map(([target, strength]) => ({
          id: uniqueId(),
          source,
          target,
          //   label: String(strength),
          //   color: "red",
        })),
    }));
    const edges = formatted.reduce((result, node) => [...result, ...node.edges], []).slice(0, 30);
    const nodes = formatted.map(({ id, label, size }) => ({ id, label, size })).slice(0, 30);

    return { edges, nodes };
  }, [data]);
  console.log(myGraph);

  return (
    <Box>
      <Sigma graph={myGraph}>
        <RandomizeNodePositions />
        <RelativeSize initialSize={15} />
      </Sigma>
    </Box>
  );
};

export default EntitiesGraph;
