import { Dispatch, SetStateAction, createContext, useState } from "react";
import { CurrentStateSpaceItem, TypeItem, ConstantItem } from "../common/types";

type StateContextType = {
  types: TypeItem[];
  setTypes: Dispatch<SetStateAction<TypeItem[]>>;
  constants: ConstantItem[];
  setConstants: Dispatch<SetStateAction<ConstantItem[]>>;
  currentStateSpace: CurrentStateSpaceItem[];
  setStateSpace: Dispatch<SetStateAction<CurrentStateSpaceItem[]>>;
};

export const StateContext = createContext<StateContextType>(
  {} as StateContextType
);

const StateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [types, setTypes] = useState<TypeItem[]>([]);
  const [constants, setConstants] = useState<ConstantItem[]>([]);
  const [currentStateSpace, setStateSpace] = useState<CurrentStateSpaceItem[]>([]);

  return (
    <StateContext.Provider
      value={{
        types,
        setTypes,
        constants,
        setConstants,
        currentStateSpace,
        setStateSpace,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
