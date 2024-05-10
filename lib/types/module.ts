import { InferProviderDeps, InferProviderValue, Provider } from "./provider";

export type Module<EntryProvider extends Provider> = {
  init: (
    deps: InferProviderDeps<EntryProvider>,
  ) => InferProviderValue<EntryProvider>;
};
