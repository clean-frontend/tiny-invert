import { createContainer } from "../lib/create-container";
import { createModule } from "../lib/create-module";
import { mergeContainers } from "../lib/merge-containers";
import { describe, it, expect } from "vitest";

describe("mergeContainers", () => {
  it("should return container with dependencies intersection", () => {
    const container1 = createContainer<{ dep1: string }>("container1");
    const container2 = createContainer<{ dep2: string }>("container2");

    const mergedContainer = mergeContainers([container1, container2]);

    const containerResult = createModule(
      mergedContainer.provider((deps) => deps),
    ).init({
      dep1: "dep1",
      dep2: "dep2",
    });

    expect(containerResult).toEqual({
      deps: {
        dep1: "dep1",
        dep2: "dep2",
      },
      innerDeps: {},
    });
  });
});
