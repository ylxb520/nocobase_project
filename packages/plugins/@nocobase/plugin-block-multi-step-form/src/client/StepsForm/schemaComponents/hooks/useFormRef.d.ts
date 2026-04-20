/// <reference types="react" />
import { Form } from '@formily/core';
export declare function useFormRef(): {
  formInstanceRef: import('react').MutableRefObject<{}>;
  getCurrentFormInstance: (uid: string) => Form<any>;
  registerFormInstance: ({ uid, form }: { uid: any; form: any }) => void;
};
