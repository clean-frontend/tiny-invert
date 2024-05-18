import {
  ContainerDeps,
  InferProvidersRecordValue,
  Provider,
  ProviderValueFactory,
  ProvidersRecord,
} from "./provider";

type DefaultProvidersRecord = Record<never, Provider>;

export type ProviderFactory<Deps> = <
  R,
  I extends ProvidersRecord<Deps> = DefaultProvidersRecord,
>(
  factory: ProviderValueFactory<Deps, InferProvidersRecordValue<I>, R>,
  innerDeps?: I,
) => Provider<Deps, InferProvidersRecordValue<I>, R>;

export type ExtendContainer<Deps> = <Deps2>(
  name?: string,
) => Container<Deps & Deps2>;

export type Container<Deps = ContainerDeps> = {
  provider: ProviderFactory<Deps>;
  containerName: string;
  extend: ExtendContainer<Deps>;
  $inferDeps: Deps;
};
