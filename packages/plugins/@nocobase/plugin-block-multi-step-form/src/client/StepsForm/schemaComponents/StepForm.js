import { withDynamicSchemaProps, FormV2 } from '@nocobase/client';
import React from 'react';
import { useStepsFormContext } from './context';
import useHeight from './hooks/useHeight';
export const StepForm = withDynamicSchemaProps(
  (props) => {
    // const { uid } = props;
    const ctx = useStepsFormContext();
    const height = useHeight();
    // useEffect(() => {
    //   ctx.registerFormInstance({
    //     uid,
    //     form: ctx.form,
    //   });
    //   return () => {
    //   };
    // }, [uid, ctx.form]);
    return React.createElement(FormV2, { ...props, height: height, form: ctx.form });
  },
  { displayName: 'FormV3' },
);
//# sourceMappingURL=StepForm.js.map
