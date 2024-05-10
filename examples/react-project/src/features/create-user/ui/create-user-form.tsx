import { CreateUserContainer } from "../container";
import { useCreateUserFormProvider } from "../model/use-create-user-from";


export const CreateUserFormProvider = CreateUserContainer.provider(
  (ctx) => function CreateUserForm() {
    const {
      Input, Form, Button
    } = ctx.deps.uikit

    const { isLoading, handleSubmit, register } = ctx.innerDeps.useCreateUserForm();


    return (
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Name"
          {...register("name")}
        />
        <Input
          type="text"
          placeholder="Email"
          {...register("email")}
        />
        <Button disabled={isLoading}>
          Create {isLoading ? "..." : ""}
        </Button>
      </Form>
    )
  },
  {
    useCreateUserForm: useCreateUserFormProvider,
  }
);
