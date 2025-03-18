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
  TraceItem,
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
  traces: TraceItem[];
  setTraces: Dispatch<SetStateAction<TraceItem[]>>;
  updateTracesAndStorage: (newValue: TraceItem) => void;
  resetTraces: () => void;
  resetState: () => void;
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
  const [traces, setTraces] = useState<TraceItem[]>([]);

  const stateMap = {
    currentStateSpace: { value: currentStateSpace, setter: setStateSpace },
    types: { value: types, setter: setTypes },
    constants: { value: constants, setter: setConstants },
  };

  // Helper to format into an interpretation object
  const formatStateAndOperation = (
    stateData: CurrentStateSpaceItem[],
    operationsData: OperationItem[],
    opName: string
  ) => {
    const formatted: Record<string, { values: string[] | string[][] }> = {};

    // Parse values
    const parseValues = (value: string | string[]): string[] | string[][] => {
      if (typeof value === "string") {
        return value.includes("(") && value.includes(")")
          ? value.split("), (").map((pair) =>
              pair
                .replace(/[()]/g, "")
                .split(",")
                .map((v) => v.trim())
            )
          : Array.from(new Set(value.split(", ").map((v) => v.trim())));
      }
      return Array.isArray(value) ? value : [];
    };

    // Add types to interpretation
    types.forEach(({ type, value }) => {
      formatted[type] = { values: [value] };
    });

    // Process state data
    stateData.forEach(({ state, value }) => {
      formatted[state] = { values: parseValues(value) };
    });

    // Process operation inputs
    const selectedOperation = operationsData.find(
      ({ name }) => name === opName
    );
    selectedOperation?.declarations.forEach(({ state, value }) => {
      if (state.includes("?") && value) {
        formatted[state] = { values: value.split(",").map((v) => v.trim()) };
      }
    });

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

  const updateTracesAndStorage = useCallback((newValue: TraceItem) => {
    setTraces((prev) => {
      const updatedTraces = prev.some((trace) => trace.name === newValue.name)
        ? prev.map((trace) => (trace.name === newValue.name ? newValue : trace))
        : [...prev, newValue];

      localStorage.setItem("traces", JSON.stringify(updatedTraces));
      return updatedTraces;
    });
  }, []);

  const resetState = useCallback(() => {
    updateStateAndStorage("currentStateSpace", []);
    updateStateAndStorage("types", []);
    updateStateAndStorage("constants", []);
    localStorage.removeItem("operations");
    localStorage.removeItem("traces");
    localStorage.setItem("operations", "");
    localStorage.setItem("traces", "");
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
        resetState,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
