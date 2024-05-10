import { useForm } from "react-hook-form";
import { CreateUserContainer } from "../container";
import { nanoid } from "nanoid";

export const useCreateUserFormProvider = CreateUserContainer.provider(
  (ctx) => () => {
    const { isLoading, createUser } = ctx.deps.useCreateUser();

    const userForm = useForm<{
      name: string;
      email: string;
    }>({
      defaultValues: {
        name: "",
        email: "",
      },
    });

    return {
      isLoading,
      register: userForm.register,
      handleSubmit: userForm.handleSubmit(async (data) => {
        await createUser({
          id: nanoid(),
          name: data.name,
          email: data.email,
        });
      }),
    };
  },
);
