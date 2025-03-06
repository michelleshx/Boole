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
  formatStateAndOperation: (
    stateData: CurrentStateSpaceItem[],
    OperationData: OperationItem[],
    opName: string
  ) => string;
  updateStateAndStorage: (
    key: keyof StateContextType["stateMap"],
    newValue: unknown
  ) => void;
  operations: OperationItem[];
  setOperations: Dispatch<SetStateAction<OperationItem[]>>;
  updateOperationAndStorage: (newValue: OperationItem) => void;
  traces: OperationItem[];
  setTraces: Dispatch<SetStateAction<OperationItem[]>>;
  updateTracesAndStorage: (newValue: OperationItem) => void;
  resetTraces: () => void;
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

  const formatStateAndOperation = (
    stateData: CurrentStateSpaceItem[],
    operationsData: OperationItem[],
    opName: string
  ) => {
    const formatted: any = {};

    // Process state data
    stateData.forEach(({ state, value }) => {
      // Convert comma-separated values into a set-like array
      const formattedValues =
        value.includes("(") && value.includes(")")
          ? value.split("), (").map((pair: string) =>
              pair
                .replace(/[()]/g, "")
                .split(", ")
                .map((v) => v.trim())
            )
          : Array.from(new Set(value.split(", ").map((v) => v.trim())));
      formatted[state] = { values: formattedValues };
    });

    // Process operations inputs
    const selectedOperation = operationsData.find(
      ({ name }) => name === opName
    );
    if (selectedOperation) {
      selectedOperation.declarations.forEach(({ state, value }) => {
        if (state.includes("?") && value) {
          formatted[state] = {
            values: value.split(",").map((v) => v.trim()),
          };
        }
      });
    }

    return JSON.stringify(formatted);
  };

  // Helper to update both state and localStorage for a given key
  const updateStateAndStorage = useCallback(
    (key: keyof typeof stateMap, newValue: any) => {
      stateMap[key].setter(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    []
  );

  const updateOperationAndStorage = useCallback((newValue: OperationItem) => {
    setOperations((prev) => {
      const updatedOperations = prev.some(
        (operation) => operation.name === newValue.name
      )
        ? prev.map((operation) =>
            operation.name === newValue.name ? newValue : operation
          ) // Update existing
        : [...prev, newValue]; // Add new if not found

      localStorage.setItem("operations", JSON.stringify(updatedOperations));
      return updatedOperations;
    });
  }, []);

  const updateTracesAndStorage = useCallback((newValue: OperationItem) => {
    setTraces((prev) => {
      const updatedTraces = prev.some((trace) => trace.name === newValue.name)
        ? prev.map((trace) => (trace.name === newValue.name ? newValue : trace))
        : [...prev, newValue];

      localStorage.setItem("traces", JSON.stringify(updatedTraces));
      return updatedTraces;
    });
  }, []);

  const resetTraces = useCallback(() => {
    setTraces([]); // Clear traces in state
    localStorage.removeItem("traces"); // Remove traces from local storage
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
        formatStateAndOperation,
        updateStateAndStorage,
        operations,
        setOperations,
        updateOperationAndStorage,
        traces,
        setTraces,
        updateTracesAndStorage,
        resetTraces,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
