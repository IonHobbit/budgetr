import { decryptData, encryptData } from "@/utils/encryption.util";
import storageUtil, { StorageKey } from "@/utils/storage.util";

const useAuth = () => {
  const passKeys = decryptData(
    process.env.NEXT_PUBLIC_PASS_KEYS!
  ) as Array<string>;

  const authenticate = (passCode: string) => {
    if (passKeys.includes(passCode.toLocaleUpperCase()))
      return true
    return false
  }

  const authorize = (passCode: string) => {
    const decryptedCode = decryptData(passCode) as string
    return authenticate(decryptedCode)
  }

  const login = async (passCode: string) => {
    if (authenticate(passCode)) {
      storageUtil.saveItem({
        key: StorageKey.passKey,
        value: encryptData(passCode),
      });
      return true
    }
    return false
  }

  return { authorize, login };
}

export default useAuth;