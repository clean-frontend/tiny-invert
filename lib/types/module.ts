import { Provider } from "./provider";

export type Module<EntryProvider extends Provider> = {
  init: (deps: EntryProvider["$inferDeps"]) => EntryProvider["$inferValue"];
};
