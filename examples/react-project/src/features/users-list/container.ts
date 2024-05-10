import { UserEntity } from "../../entities/user/model";
import { UiKitContainer } from "@/kernel/uikit";

export type UsersListApi = {
  useUsersList: () => {
    users: UserEntity[];
    isLoading: boolean;
  };
};

export const UsersListContainer = UiKitContainer.extend<UsersListApi>(
  "features/users-list",
);
