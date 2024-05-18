import { Module } from "./types/module";
import {
  Provider,
  ProviderId,
  ProviderValue,
  ProvidersRecord,
} from "./types/provider";

// Хелпер нужен так как невозможно определить корректный рекурсивный тип провайдера
const getInnerProviders = (provider: Provider) => {
  return provider.innderDeps as ProvidersRecord;
};

const checkCircularDependency = (
  provider: Provider,
  seen: Set<ProviderId>,
): void => {
  if (seen.has(provider.id)) {
    throw new Error(
      `Module: ${provider.containerName}\n Cyclic dependency: ${Array.from(seen.values()).concat([provider.id]).join(" -> ")}`,
    );
  }

  for (const p of Object.values(getInnerProviders(provider))) {
    checkCircularDependency(p, new Set([...seen, provider.id]));
  }
};

/* @__NO_SIDE_EFFECTS__ */
export const createModule = <EntryProvider extends Provider>(
  entryProvider: EntryProvider,
): Module<EntryProvider> => {
  type Deps = EntryProvider["$inferDeps"];
  checkCircularDependency(entryProvider, new Set());

  const resolveDependency = (
    deps: Deps,
    provider: Provider,
    valuesMap: Map<ProviderId, ProviderValue>,
  ) => {
    if (valuesMap.has(provider.id)) {
      return valuesMap.get(provider.id);
    }

    const innerDeps = Object.entries(getInnerProviders(provider)).reduce(
      (acc, [key, innerDep]) => {
        return {
          ...acc,
          [key]: resolveDependency(deps, innerDep, valuesMap),
        };
      },
      {},
    );

    const result = provider.factory({
      deps,
      innerDeps,
    });

    valuesMap.set(provider.id, result);

    return result;
  };

  return {
    /* @__NO_SIDE_EFFECTS__ */
    init(deps) {
      return resolveDependency(deps, entryProvider, new Map()) as any;
    },
  };
};
