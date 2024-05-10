import { CreateUserApi } from "@/features/create-user";
import { AppCotainer } from "../container";
import { UsersListApi } from "@/features/users-list";
import { UserEntity } from "@/entities/user";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

export const ApiProvider = AppCotainer.provider(
  (): CreateUserApi & UsersListApi => {
    const usersStore: UserEntity[] = [
      {
        id: nanoid(),
        name: "John",
        email: "j@j.j",
      },
    ];

    const listener = {
      listeners: new Set<() => void>(),
      emit: () => {
        listener.listeners.forEach((cb) => cb());
      },
    };

    return {
      useUsersList: () => {
        const [isLoading, setIsLoading] = useState(false);

        const [users, setUsers] = useState<UserEntity[]>([]);

        useEffect(() => {
          setIsLoading(true);
          const fetch = () => {
            setIsLoading(true);
            setTimeout(() => {
              console.log("fetching");
              setUsers(usersStore.slice());
              setIsLoading(false);
            }, 2000);
          };

          fetch();
          listener.listeners.add(fetch);
          return () => {
            listener.listeners.delete(fetch);
          };
        }, []);
        return {
          users,
          isLoading,
        };
      },
      useCreateUser: () => {
        const [isLoading, setIsLoading] = useState(false);

        const createUser = (newUser: UserEntity) =>
          new Promise<UserEntity>((res) => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              usersStore.push(newUser);
              listener.emit();
              res(newUser);
            }, 2000);
          });

        return {
          createUser,
          isLoading,
        };
      },
    };
  },
);
