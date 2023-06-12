export enum StorageKey {
  user = 'budgetr::user',
  token = 'budgetr::token',
  passKey = 'budgetr::passKey',
  session = 'budgetr::session::',
}

const stringPrefix = "s::";

type StorageItem = {
  key: StorageKey | string;
  value: any;
};

const saveItem = (item: StorageItem): void => {
  if (typeof window === "undefined") return;

  if (!item || !item.key || !item.value) {
    throw new Error('Invalid item format');
  }

  if (typeof item.value == 'string') {
    item.value = `${stringPrefix}${item.value}`
  }

  if (typeof item.value == 'object') {
    item.value = JSON.stringify(item.value)
  }

  localStorage.setItem(item.key, item.value);
}

const deleteItem = (key: string): void => {
  if (typeof window === "undefined") return;
  if (!key) {
    throw new Error('Invalid key');
  }

  localStorage.removeItem(key);
}

const getItem = <T>(key: string): T | null => {
  // if (typeof window !== "undefined") return;
  if (!key) {
    throw new Error('Invalid key');
  }

  const item = localStorage.getItem(key);

  return item ? (item?.includes(stringPrefix) ? item.replace(stringPrefix, "") : JSON.parse(item)) : null;
}

export default { saveItem, deleteItem, getItem };
