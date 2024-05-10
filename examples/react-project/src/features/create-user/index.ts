import { createModule } from "tiny-invert";
export type { CreateUserApi } from "./container";
import { CreateUserFormProvider } from "./ui/create-user-form";

export const CreateUserFormModule = createModule(CreateUserFormProvider);
