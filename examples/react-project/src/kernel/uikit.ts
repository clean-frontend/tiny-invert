import { ChangeEventHandler } from "react";
import { createContainer } from "tiny-invert";

export type UiInputProps = {
  type: "text" | "password";
  name: string;
  placeholder: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export type UiButtonProps = {
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
};

export type UiFormProps = {
  children: React.ReactNode;
  onSubmit: () => void;
};

export type UiKit = {
  Input: React.FC<UiInputProps>;
  Button: React.FC<UiButtonProps>;
  Form: React.FC<UiFormProps>;
};

export const UiKitContainer = createContainer<{ uikit: UiKit }>(
  "UiKitContainer",
);
