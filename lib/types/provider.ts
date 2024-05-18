export type ProviderId = string;
export type ProviderValue = any;
export type ContainerDeps = any;
export type InnerDepsRecord = Record<string, ProviderValue>;

export type ProviderValueFactory<
  Deps = ContainerDeps,
  InnerDeps extends InnerDepsRecord = InnerDepsRecord,
  Result = ProviderValue,
> = (options: { deps: Deps; innerDeps: InnerDeps }) => Result;

export type Provider<
  Deps = ContainerDeps,
  InnerDeps extends InnerDepsRecord = any,
  Value = ProviderValue,
> = {
  $inferValue: Value;
  $inferInnerDeps: InnerDeps;
  $inferDeps: Deps;
  containerName: string;
  id: ProviderId;
  innderDeps: ProvidersRecord;
  factory: ProviderValueFactory<Deps, InnerDeps, Value>;
};

export type ProvidersRecord<Deps = ContainerDeps> = Record<
  string,
  Provider<Deps>
>;

export type InferProvidersRecordValue<T extends ProvidersRecord> = {
  [K in keyof T]: T[K]["$inferValue"];
};
