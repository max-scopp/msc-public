import { StringBoolean } from "./general";

export interface FormElement<T = any> {
  placeholder?: string;
  multiple?: boolean | StringBoolean;
  autocomplete?: boolean | StringBoolean;

  name: string;

  required: boolean | StringBoolean;
  disabled: boolean | StringBoolean;

  value?: T;
}
