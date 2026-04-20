import { useRef } from 'react';
export function useFormRef() {
  const formInstanceRef = useRef({});
  const getCurrentFormInstance = (uid) => {
    const currentForm = formInstanceRef.current[uid];
    return currentForm;
  };
  const registerFormInstance = ({ uid, form }) => {
    formInstanceRef.current[uid] = form;
  };
  return { formInstanceRef, getCurrentFormInstance, registerFormInstance };
}
//# sourceMappingURL=useFormRef.js.map
