import { createContainer } from "./create-container";
import { Container } from "./types/container";
import { UnionToIntersection } from "./types/utils";

/* @__NO_SIDE_EFFECTS__ */
export const mergeContainers = <Containers extends Container<any>[]>(
  _: Containers,
  name?: string,
): Container<UnionToIntersection<Containers[number]["__deps"]>> => {
  return createContainer(name);
};
