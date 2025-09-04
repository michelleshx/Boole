import { Dispatch, SetStateAction, createContext, useState } from "react";
import { FileType, File } from "../common/files";

type FileContextType = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  openFile: File;
  setOpenFile: Dispatch<SetStateAction<File>>;
  fileType: FileType;
  setFileType: Dispatch<SetStateAction<FileType>>;
  getFileType: (val: string) => FileType;
};

export const FileContext = createContext<FileContextType>(
  {} as FileContextType
);

const FileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [value, setValue] = useState<string>(""); // current value in text editor
  const [openFile, setOpenFile] = useState<File>({} as File); // which file is open in editor
  const [fileType, setFileType] = useState<FileType>(FileType.PREDTYPE);

  const checkToFileType: { [key: string]: FileType } = {
    "#check Z": FileType.Z,
    "#check PREDTYPE": FileType.PREDTYPE,
    "#check PRED": FileType.PRED,
    "#check TP": FileType.TP,
    "#check ST": FileType.ST,
    "#check PROP": FileType.PROP,
    "#check PC": FileType.PC,
    "#check ND": FileType.ND,

    "#check SEM_F": FileType.SEM_F,
    "#check SEM_CONSISTENT": FileType.SEM_CONSISTENT,
    "#check SEM_SAT": FileType.SEM_SAT,
    "#check SEM": FileType.SEM,
    "#check SEM_CE": FileType.SEM_CE,
	"#check SEM_T": FileType.SEM_T
  };

  const getFileType = (value: string): FileType => {
    for (const key in checkToFileType) {
      if (value.includes(key)) {
        return checkToFileType[key];
      }
    }
    return FileType.NONE; // Default case
  };

  return (
    <FileContext.Provider
      value={{
        value,
        setValue,
        openFile,
        setOpenFile,
        fileType,
        setFileType,
        getFileType,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export default FileProvider;
