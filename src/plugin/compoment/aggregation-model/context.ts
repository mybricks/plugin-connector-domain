import { createContext } from 'react';

export const AggregationPanelContext = createContext({
	addBlurAry: (key: string, blur: AnyType) => {}
});
