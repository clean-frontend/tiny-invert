import { createModule } from "tiny-invert";
import { UsersListProvider } from "./ui/users-list";
export { type UsersListApi } from "./container";

export const UsersListModule = createModule(UsersListProvider);
