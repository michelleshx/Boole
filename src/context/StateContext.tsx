import { Dispatch, SetStateAction, createContext, useState } from "react";

type StateContextType = {
  types: string[];
  setTypes: Dispatch<SetStateAction<string[]>>;
  constants: string[];
  setConstants: Dispatch<SetStateAction<string[]>>;
  stateSpace: string[];
  setStateSpace: Dispatch<SetStateAction<string[]>>;
};

export const StateContext = createContext<StateContextType>(
  {} as StateContextType
);

const StateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // TODO fix the data structure of these
  const [types, setTypes] = useState<string[]>([]);
  const [constants, setConstants] = useState<string[]>([]);
  const [stateSpace, setStateSpace] = useState<string[]>([]);

  return (
    <StateContext.Provider
      value={{
        types,
        setTypes,
        constants,
        setConstants,
        stateSpace,
        setStateSpace,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
