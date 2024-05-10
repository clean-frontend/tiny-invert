import { CreateUserFormModule } from "@/features/create-user";
import { AppCotainer } from "../container";
import { UiKitProvider } from "./uikit";
import { ApiProvider } from "./api";
import { UsersListModule } from "@/features/users-list";

export const UsersProvider = AppCotainer.provider(
  (ctx) => {
    return {
      CreateUser: CreateUserFormModule.init({
        uikit: ctx.innerDeps.uikit,
        useCreateUser: ctx.innerDeps.api.useCreateUser,
      }),
      UsersList: UsersListModule.init({
        uikit: ctx.innerDeps.uikit,
        useUsersList: ctx.innerDeps.api.useUsersList,
      }),
    };
  },
  {
    uikit: UiKitProvider,
    api: ApiProvider,
  },
);
