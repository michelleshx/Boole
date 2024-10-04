import axios from "axios";

import { DefaultFile, RemoteFile } from "./files";
import miscFiles from "./misc-files";

export interface Directory {
  name: string;
  expanded: boolean;
  files: RemoteFile[];
}

const miscellaneousDirectory = {
  name: "Miscellaneous",
  expanded: true,
  files: miscFiles.map(({ name, contents }) => new DefaultFile(name, contents)),
};

export default class Directories {
  static get = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const directories: Directory[] = (
          await axios({
            method: "get",
            url: "https://student.cs.uwaterloo.ca/~se212/files.json",
            responseType: "json",
          })
        ).data;

        const remoteDirectories = directories.map((directory: Directory) => {
          return {
            name: directory.name,
            expanded: false,
            files: directory.files.map(
              (file) => new RemoteFile(file.name, file.path)
            ),
          };
        });

        resolve([miscellaneousDirectory, ...remoteDirectories]);
      } catch (err) {
        console.error("Failed to get list of remote files!");

        resolve([miscellaneousDirectory]);
      }
    });
  };
}
