import * as React from 'react';
declare function useDrawer(): (React.JSX.Element | {
    open: (config: any) => {
        destroy: () => void;
        update: (newConfig: any) => void;
    };
})[];
export default useDrawer;
