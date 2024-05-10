import { createContainer } from "../lib/create-container";
import { createModule } from "../lib/create-module";
import { describe, it, expect } from "vitest";

describe("createContainer", () => {
  type TestDeps = {
    vkApi: () => string;
  };

  const testDeps: TestDeps = {
    vkApi: () => "{vkApi}",
  };

  const testContent = "testContent";

  it("should resolve dependency from container", () => {
    const Container = createContainer<TestDeps>("Container");

    const LayoutProvider = Container.provider(({ deps }) => {
      // init code
      return function Layout() {
        // runtime code
        return `<Layout>${deps.vkApi()}</Layout>`;
      };
    });

    const EntryProvider = Container.provider(
      ({ innerDeps: { Layout } }) => {
        // init code
        return function Entry({ prop }: { prop: number }) {
          // runtime code
          return `<Entry prop="${prop}">${Layout()}</Entry>`;
        };
      },
      {
        Layout: LayoutProvider,
      },
    );

    const Entry = createModule(EntryProvider).init(testDeps);
    const entryResult = Entry({ prop: 1 });

    expect(entryResult).toBe(
      `<Entry prop="1"><Layout>{vkApi}</Layout></Entry>`,
    );
  });

  it("should resolve sub container", () => {
    /* Container1 */
    const Container1 = createContainer<TestDeps>("Container1");

    const provider = Container1.provider(({ deps }) => {
      return deps.vkApi() + testContent;
    });

    const module1 = createModule(provider);

    /* Container2 */
    type TestDeps2 = TestDeps & {
      testDep2: string;
    };
    const testDep2 = "testDep2";

    const Container2 = createContainer<TestDeps2>("Container2");

    const module1Provider = Container2.provider(({ deps }) =>
      module1.init(deps),
    );

    const provider2 = Container2.provider(
      ({ deps, innerDeps }) => innerDeps.module1Provider + deps.testDep2,
      {
        module1Provider,
      },
    );

    const moduleInstance = createModule(provider2).init({
      ...testDeps,
      testDep2,
    });

    expect(moduleInstance).toBe(testDeps.vkApi() + testContent + testDep2);
  });
});
