import { UsersListContainer } from "../container";
import { useUsersListProvider } from "../model/use-users-list";


export const UsersListProvider = UsersListContainer.provider(
  (ctx) => function CreateUserForm() {
    const {
      Input
    } = ctx.deps.uikit

    const { isLoading, query, users, setQuery } = ctx.innerDeps.useUsersList();


    return (
      <div>
        <Input
          name="query"
          type="text"
          placeholder="Query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div>{isLoading && "Loading..."}
          {users.map((user) => (
            <div key={user.id}>name:{user.name} email:{user.email}</div>
          ))}
        </div>
      </div>
    )
  },
  {
    useUsersList: useUsersListProvider
  }
);
