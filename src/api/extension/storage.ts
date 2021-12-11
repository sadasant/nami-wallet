export type ChromeStorageItem = { [key: string]: any };

export const getStorage = <ValueType = ChromeStorageItem>(key: string): Promise<ValueType> =>
  new Promise((res, rej) =>
    chrome.storage.local.get(key, (result) => {
      if (chrome.runtime.lastError) rej(undefined);
      res(key ? result[key] : result);
    })
  );

export const setStorage = (item: ChromeStorageItem): Promise<boolean> =>
  new Promise((res, rej) =>
    chrome.storage.local.set(item, () => {
      if (chrome.runtime.lastError) rej(chrome.runtime.lastError);
      res(true);
    })
  );
