import React, { createContext } from 'react';
import { useSchemaInitializerRender, useToken } from '@nocobase/client';
const AddVariableButtonContext = createContext({
  onSuccess: () => {},
});
export const AddVariableButton = (props) => {
  const { token } = useToken();
  const { render } = useSchemaInitializerRender('customVariables:addVariable');
  return React.createElement(
    AddVariableButtonContext.Provider,
    { value: { onSuccess: props.onSuccess || (() => {}) } },
    render({ style: { borderRadius: token.borderRadius } }),
  );
};
export const useAddVariableButtonProps = () => {
  return React.useContext(AddVariableButtonContext);
};
//# sourceMappingURL=AddVariableButton.js.map
