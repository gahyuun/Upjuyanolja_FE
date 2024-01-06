import { ChangeEvent } from 'react';

export type ButtonContainerProps = {
  buttonStyle: 'navigate' | 'request' | 'edit';
  isValid: boolean;
};

export type ButtonContainerStyledWrapperProps = {
  $buttonStyle: 'navigate' | 'request' | 'edit';
};

export type CheckBoxContainerProps = {
  options: string[];
  label: string;
};

export type FormErrorMessageProps = {
  errorMessage: string;
};

export type RouteConfigProps = {
  [key: string]: {
    pageName: string;
    pageDesc: string;
  };
};

export type ImageUploadFileItem = {
  uid: number;
  name: string;
  url: string;
  originFileObj?: File;
};

export type ImageUploadHandleChangeProps = {
  event: ChangeEvent<HTMLInputElement>;
};
