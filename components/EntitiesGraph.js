import { Box } from "@chakra-ui/react";
import { toPairs, uniqueId } from "lodash";
import { useMemo } from "react";
import { Sigma, RandomizeNodePositions, RelativeSize } from "react-sigma";

const EntitiesGraph = ({ data = [] }) => {
  // const myGraph = {
  //   nodes: [
  //     { id: "n1", label: "Alice" },
  //     { id: "n2", label: "Rabbit" },
  //     { id: "n3", label: "Rabbit2" },
  //   ],
  //   edges: [
  //     { id: "e1", source: "n1", target: "n2", label: "SEES" },
  //     { id: "f1", source: "n1", target: "n3", label: "SEES" },
  //   ],
  // }

  const myGraph = useMemo(() => {
    const formatted = data.map(({ frequency, friends, title: source }) => ({
      id: source,
      label: source,
      // size: frequency,
      edges: toPairs(friends)
        .filter(([, strength]) => strength > 0.25)
        .map(([target, strength]) => ({
          id: uniqueId(),
          source,
          target,
          label: String(strength),
          //   color: "red",
        })),
    }));
    const edges = formatted.reduce((result, node) => [...result, ...node.edges], []);
    const nodes = formatted.map(({ id, label, size }) => ({ id, label, size }));

    return { edges, nodes };
  }, [data]);
  console.log(myGraph);

  return (
    <Box>
      <Sigma
        renderer="canvas"
        graph={myGraph}
        settings={{ skipErrors: true, drawEdges: true, enableEdgeHovering: true }}
      >
        {/* <RandomizeNodePositions /> */}
        {/* <RelativeSize initialSize={35} /> */}
      </Sigma>
    </Box>
  );
};

export default EntitiesGraph;
