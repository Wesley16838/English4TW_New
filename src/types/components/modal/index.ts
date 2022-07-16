import { FC } from "react";

export default interface IModal  {
    title: string;
    subtitle?: string;
    customStyle?: object;
    onCancel?: ()=>void;
    onConfirm?: (str: string)=>void;
    content?: Array<string>;
    confirmString?: string;
    children?: JSX.Element | undefined;
    defaultValue?: any
  };