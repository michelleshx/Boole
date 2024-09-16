import { Dispatch, SetStateAction, createContext, useState } from "react";
import { FileType, File } from "../common/files";

type FileContextType = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  openFile: File;
  setOpenFile: Dispatch<SetStateAction<File>>;
  fileType: FileType;
  setFileType: Dispatch<SetStateAction<FileType>>;
};

export const FileContext = createContext<FileContextType>(
  {} as FileContextType
);

const FileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [value, setValue] = useState<string>(""); // current value in text editor
  const [openFile, setOpenFile] = useState<File>({} as File); // which file is open in editor
  // TODO set file type when loading file?
  const [fileType, setFileType] = useState<FileType>(FileType.PREDTYPE);

  return (
    <FileContext.Provider
      value={{ value, setValue, openFile, setOpenFile, fileType, setFileType }}
    >
      {children}
    </FileContext.Provider>
  );
};

export default FileProvider;
