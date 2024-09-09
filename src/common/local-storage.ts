export default class LocalStorage {
  static get = async (key: string): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const value = window.localStorage.getItem(key);
      if (value !== null) resolve(value);
      else reject();
    });
  };

  static set = (key: string, value: string) => {
    window.localStorage.setItem(key, value);
  };

  static reset = (key: string) => {
    window.localStorage.removeItem(key);
  };
}
