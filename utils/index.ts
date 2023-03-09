import { FormControl } from '@angular/forms';
import { FormComponentInterface } from '@azlabsjs/ngx-smart-form';

// convert snake string to camel string
export const snakeToCamel = (str: string) => {
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', '')
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
