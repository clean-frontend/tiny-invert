import { UsersListContainer } from "../container";
import { useMemo, useState } from "react";

export const useUsersListProvider = UsersListContainer.provider((ctx) => () => {
  const [query, setQuery] = useState("");

  const { isLoading, users } = ctx.deps.useUsersList();

  const filteredUsers = useMemo(() => {
    if (!query) {
      return users;
    }
    return users.filter((user) => user.name.includes(query));
  }, [query, users]);

  return {
    isLoading,
    users: filteredUsers,
    query,
    setQuery,
  };
});
