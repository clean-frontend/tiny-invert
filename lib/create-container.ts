import { nanoid } from "nanoid";
import { Container, ExtendContainer } from "./types/container";
import { Provider, ProviderValueFactory } from "./types/provider";

/* @__NO_SIDE_EFFECTS__ */
export function createContainer<Deps>(
  containerName = "Unnamed",
): Container<Deps> {
  /* @__NO_SIDE_EFFECTS__ */
  const createProvider = (
    factory: ProviderValueFactory,
    innerDeps = {} as any,
  ): Provider => {
    return {
      __value: undefined as any,
      __innerDeps: undefined as any,
      id: `${factory.name}-${nanoid()}`,
      containerName,
      innderDeps: innerDeps,
      factory,
    };
  };

  const extend: ExtendContainer<Deps> = (name) => {
    return createContainer(name);
  };

  return {
    __deps: null as Deps,
    extend,
    containerName,
    provider: createProvider as any,
  };
}
