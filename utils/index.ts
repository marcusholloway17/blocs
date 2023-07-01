import { FormControl } from "@angular/forms";
import { FormComponentInterface } from "@azlabsjs/ngx-smart-form";

export const PHONE_NUMBER_SUFFIX = "@c.us";
export const SUCCESS_ALERT: AlertStateType = {
  type: "success",
  msg: "Message envoyé !",
  closeDelay: 3000,
};
export const ERROR_ALERT: AlertStateType = {
  type: "danger",
  msg: "Échec d'envoie !",
  closeDelay: 3000,
};

export function sanitizePhoneNumber(phone: string): string {
  let validatedPhone = phone
    .trim()
    .split("+")
    .join("")
    .split(" ")
    .join("")
    .split("-")
    .join("");
  if (!validatedPhone.endsWith(PHONE_NUMBER_SUFFIX)) {
    validatedPhone = `${validatedPhone}${PHONE_NUMBER_SUFFIX}`;
  }
  return validatedPhone;
}

export type ImageMessage = {
  chatId: string;
  file: FileType;
  caption?: string;
};

export type FileType = {
  mimetype: string;
  filename: string;
  data: string | unknown;
};

export type AlertStateType = {
  type: string;
  msg?: string;
  closeDelay?: number;
};

// convert snake string to camel string
export const snakeToCamel = (str: string) => {
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );
};

// set a form values
export const setcontrolvalue = (
  formvalue: FormComponentInterface,
  field: string,
  value: string | number
) => {
  formvalue.setControlValue(field, value);
};

// add control value
export const addcontrolvalue = (
  formvalue: FormComponentInterface,
  field: string,
  value: string | number
) => {
  formvalue.addControl(field, new FormControl(value));
};
