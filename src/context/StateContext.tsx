import {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useCallback,
} from "react";
import {
  CurrentStateSpaceItem,
  TypeItem,
  ConstantItem,
  OperationItem,
} from "../common/types";

type StateContextType = {
  types: TypeItem[];
  setTypes: Dispatch<SetStateAction<TypeItem[]>>;
  constants: ConstantItem[];
  setConstants: Dispatch<SetStateAction<ConstantItem[]>>;
  currentStateSpace: CurrentStateSpaceItem[];
  setStateSpace: Dispatch<SetStateAction<CurrentStateSpaceItem[]>>;
  stateMap: {
    currentStateSpace: {
      value: CurrentStateSpaceItem[];
      setter: Dispatch<SetStateAction<CurrentStateSpaceItem[]>>;
    };
    types: { value: TypeItem[]; setter: Dispatch<SetStateAction<TypeItem[]>> };
    constants: {
      value: ConstantItem[];
      setter: Dispatch<SetStateAction<ConstantItem[]>>;
    };
  };
  updateStateAndStorage: (
    key: keyof StateContextType["stateMap"],
    newValue: unknown
  ) => void;
  operations: OperationItem[];
  setOperations: Dispatch<SetStateAction<OperationItem[]>>;
  addOperationAndStorage: (newValue: OperationItem) => void;
  updateOperationAndStorage: (newValue: OperationItem) => void;
  traces: OperationItem[];
  setTraces: Dispatch<SetStateAction<OperationItem[]>>;
  updateTracesAndStorage: (newValue: OperationItem) => void;
};

export const StateContext = createContext<StateContextType>(
  {} as StateContextType
);

const StateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State
  const [types, setTypes] = useState<TypeItem[]>([]);
  const [constants, setConstants] = useState<ConstantItem[]>([]);
  const [currentStateSpace, setStateSpace] = useState<CurrentStateSpaceItem[]>(
    []
  );

  // Operation
  const [operations, setOperations] = useState<OperationItem[]>([]);

  // Trace (also a list of OperationItems)
  const [traces, setTraces] = useState<OperationItem[]>([]);

  const stateMap = {
    currentStateSpace: { value: currentStateSpace, setter: setStateSpace },
    types: { value: types, setter: setTypes },
    constants: { value: constants, setter: setConstants },
  };

  // Helper to update both state and localStorage for a given key
  const updateStateAndStorage = useCallback(
    (key: keyof typeof stateMap, newValue: any) => {
      stateMap[key].setter(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    []
  );

  const addOperationAndStorage = useCallback((newValue: OperationItem) => {
    setOperations((prev) => {
      const updatedOperations = [...prev, newValue];
      localStorage.setItem("operations", JSON.stringify(updatedOperations));
      return updatedOperations;
    });
  }, []);

  // TODO test
  const updateOperationAndStorage = useCallback((newValue: OperationItem) => {
    setOperations((prevOperations) => {
      const updatedOperations = prevOperations.map((op) =>
        op.name === newValue.name ? newValue : op
      );

      localStorage.setItem("operations", JSON.stringify(updatedOperations));
      return updatedOperations;
    });
  }, []);

  // TODO test
  const updateTracesAndStorage = useCallback((newValue: OperationItem) => {
    setTraces((prev) => {
      const updatedTraces = [...prev, newValue];
      localStorage.setItem("traces", JSON.stringify(updatedTraces));
      return updatedTraces;
    });
  }, []);

  return (
    <StateContext.Provider
      value={{
        types,
        setTypes,
        constants,
        setConstants,
        currentStateSpace,
        setStateSpace,
        stateMap,
        updateStateAndStorage,
        operations,
        setOperations,
        addOperationAndStorage,
        updateOperationAndStorage,
        traces,
        setTraces,
        updateTracesAndStorage,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
