import { UserEntity } from "../../entities/user/model";
import { UiKitContainer } from "@/kernel/uikit";

export type CreateUserApi = {
  useCreateUser: () => {
    createUser: (newUser: UserEntity) => Promise<UserEntity>;
    isLoading: boolean;
  };
};

export const CreateUserContainer = UiKitContainer.extend<CreateUserApi>(
  "features/create-user",
);
