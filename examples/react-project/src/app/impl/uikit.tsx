import { UiKit } from "@/kernel/uikit";
import { AppCotainer } from "../container";
import { Ref, forwardRef } from "react";

export const UiKitProvider = AppCotainer.provider(
  (): UiKit => ({
    Input: forwardRef((props, ref: Ref<HTMLInputElement>) => (
      <input
        ref={ref}
        {...props}
      />
    )),
    Button: ({ children, disabled, onClick }) => (
      <button disabled={disabled} onClick={onClick}>
        {children}
      </button>
    ),
    Form: ({ children, onSubmit }) => (
      <form onSubmit={onSubmit}>{children}</form>
    ),
  }),
);
