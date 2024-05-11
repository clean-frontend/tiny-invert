<img src="https://github.com/clean-frontend/tiny-invert/blob/0adf4adc3f47a97c997fe8020195468f512d1d65/images/logo-1.png" alt="Tiny invert logo" width="100%" />

**Tiny invert is a tiny yet powerful tool for dependency inversion.**

❌ It's not an implementation of the dependency injection pattern.

❌ It's not a copy of solutions from Java and C#.

✅ It's an implementation of dependency inversion in the most effective way for TypeScript.

- **Tiny**: Less than 1kb in size.
- **Typesafe**: All errors are checked at compile time by TypeScript.
- **Modular**: Designed to work with independent modules.
- **TS-way**: No decorators, classes, or keys are needed, only simple objects and lambdas.
- **Explicit**: It is easy to track all dependencies of a module.

```typescript
import { createContainer, createModule } from "tiny-invert";

// Define module dependencies
interface Logger {}
interface Api {}

type ModuleDeps = {
  logger: Logger;
  api: Api;
};

// Create container
const Container = createContainer<ModuleDeps>();

// Define provider with inverted dependency
const loginProvider = Container.provider((ctx) => {
  // Initialization stage
  return function login(username: string, password: string) {
    // Runtime stage

    // Module dependencies usage
    ctx.deps.logger("login: start");
    return ctx.deps.api.login(username, password);
  };
});
// Define dependent provider
const authServiceProvider = Container.provider(
  (ctx) => ({
    // Other providers usage
    login: ctx.innerDeps.login,
  }),
  {
    // Used providers
    login: loginProvider,
  },
);

// Define module
const AuthServiceModule = createModule(
  // Entry provider
  authServiceProvider,
);

// Create module instance
const authService = AuthServiceModule.init({
  logger: new Logger(),
  api: new Api(),
});

// Run
authService.login("Evgeny Paromov", "12345");
```

## Table of Contents

- [Guide](#guide)
  - [Container](#container)
  - [Provider](#provider)
  - [Module](#module)
  - [Modules composition](#modules-composition)
- [Recipes](#recipes)
  - [Provider entrypoint](#provider-entrypoint)
  - [Unit testing](#unit-testing)
  - [Async providers](#async-providers)

## Install

```sh
npm install tiny-invert
```

## Guide

### Container

Container is used to define module dependencies. All providers created by the container can use the module dependencies.

**createContainer has no runtime. It is used only for TypeScript type checking.**

```typescript
interface Logger {}
interface Api {}

type ModuleDeps = {
  logger: Logger;
  api: Api;
};

const Container = createContainer<ModuleDeps>();
```

Containers can be merged and extended.

```typescript
import { createContainer, mergeContainers } from "tiny-invert";

const Container = mergeContainers([
  createContainer<{ test1: string }>(),
  createContainer<{ test2: string }>(),
]);
// Container<{ test1: string } & { test2: string }>

const ExtendedContainer = Container.extend<{ test3: string }>();
// Container<{ test1: string } & { test2: string } & { test3: string }>
```

### Providers

Provider is an object with a factory and links of dependency providers.

To create a provider, you should call the `provider` method on `Container` with a `factory` and a record of dependency providers (optional).

The factory takes one argument ctx which contains all module dependencies `ctx.deps` and provider dependencies `ctx.innerDeps`.

```typescript
const loginProvider = Container.provider(
  (ctx) => {
    // Module deps configured by the container
    ctx.deps;

    // Provider deps configured by the second argument
    ctx.innerDeps.api;

    return function login(username: string, password: string) {
      return ctx.deps.api.login(username, password);
    };
  },
  {
    api: apiProvider,
  },
);
```

Dependencies should contain providers which are created by the container with the same module dependencies type.

To use providers from different containers, you should use `Container.extend` or `mergeContainers`.

```typescript
const Container1 = createContainer<{ test1: string }>();
const Container2 = createContainer<{ test2: string }>();
const provider1 = Container1.provider((ctx) => {
    ...
})
const provider2 = Container2.provider((ctx) => {
    ...
})

const provider3 = mergeContainers([Container1, Container2]).provider((ctx) => {
    ctx.innerDeps.provider1
    ctx.innerDeps.provider2
}, {
  provider2, provider1
})
```

Use this to Interface Segregation Principle (ISP) realization.

### Module

Modules are used to define the entry point of provider hierarchy.

To create a module, you should pass the entry provider to `createModule`.

```typescript

const Container = createContainer<{ ... }>();
const provider = Container.provider((ctx) => {
    ...
})
const Module = createModule(provider);
```

The module has an `init` method which runs all provider factories from leaves to the entry provider.

`init` takes module dependencies of the entry provider and returns the entry provider result.

```typescript
const Container = createContainer<{ test: string }>();
const Module = createModule(Container.provider((ctx) => ctx.deps.test));

Module.init({});
```

Each provider will be called only once. But in the next 'init' call, it will be called again. You can cache init results or provider factories to prevent this.

```typescript
const CachedInit = cache(Module.init);
```

### Modules composition

Modules can be composed. Child modules can be converted to providers and used in parent modules.

```typescript
// SHARED TYPES
type Config = {};

// CHILD MODULE
type DependencyFromParent = {};

const ChildContainer = createContainer<{
  confing: Config;
  parentDep: DependencyFromParent;
}>();

const childProvider = ChildContainer.provider((ctx) => {});

const ChildModule = createModule(childProvider);

// PARENT MODULE
const ParentContainer = createContainer<{ config: Config }>();

const childDependencyProvider = ParentContainer.provider(
  (ctx): DependencyFromParent => {},
);

const childModuleProvider = ParentContainer.provider(
  (ctx) =>
    ChildModule.init({
      confing: ctx.deps.config,
      parentDep: ctx.innerDeps.childDep,
    }),
  {
    childDep: childDependencyProvider,
  },
);

const parentProvider = ParentContainer.provider(
  (ctx) => {
    ctx.innerDeps.childModule;
    return () => {};
  },
  {
    childModule: childModuleProvider,
  },
);

const ParentModule = createModule(parentProvider);

const parentModule = ParentModule.init({ config: {} });
```

## Recipes

### Provider entrypoint

```typescript
const Container = createContainer();

const provider1 = Container.provider((ctx) => {});
const provider2 = Container.provider((ctx) => {});

createModule(
  Container.provider((ctx) => ctx.innerDeps, {
    provider1,
    provider2,
  }),
);
```

### Unit testing

```typescript
const ServiceProvider = Container.provider((ctx) => {}, {
  provider1,
});

test("service", () => {
  const serviceInstance = ServiceProvider.factory({
    deps: {
      api: new ApiImpl(),
    },
    innerDeps: {
      provider1: () => {},
    },
  });
});
```

### Async providers

```typescript
const Container = createContainer<void>();

const provider1 = Container.provider(async (ctx) => {
  return "asyncValue";
});
const provider2 = Container.provider(
  async (ctx) => {
    // before provider1 ready

    await ctx.innerDeps.provider1;

    // after provider1 ready

    return "asyncValue2";
  },
  {
    provider1,
  },
);

const Module = createModule(provider2);

const asyncModuleInstance = await Module.init();
```
