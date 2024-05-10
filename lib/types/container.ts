import {
  ContainerDeps,
  InferProvidersRecordValue,
  Provider,
  ProviderValueFactory,
  ProvidersRecord,
} from "./provider";

export type ProviderFactory<Deps> = <
  R,
  I extends ProvidersRecord<Deps> = Record<never, Provider<Deps>>,
>(
  factory: ProviderValueFactory<Deps, InferProvidersRecordValue<I>, R>,
  innerDeps?: I,
) => Provider<Deps, I, R>;

export type ExtendContainer<Deps> = <Deps2>(
  name: string,
) => Container<Deps & Deps2>;

export type Container<Deps = ContainerDeps> = {
  provider: ProviderFactory<Deps>;
  containerName: string;
  extend: ExtendContainer<Deps>;
  __deps: Deps;
};

// Async provider

export type InferContainerDeps<T extends Container> = T["__deps"];
