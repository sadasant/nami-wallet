import Loader from '../loader';
import { NETWORK_ID, STORAGE } from "../../config/config";
import { getNetwork, Network } from "./network";
import { getStorage, setStorage } from "./storage";

export interface CardanoAccount {
    paymentKeyHash: string;
    stakeKeyHash: string;
}

const accountToNetworkSpecific = async (account: CardanoAccount, network: Network) => {
    await Loader.load();
    const paymentKeyHash = Loader.Cardano.Ed25519KeyHash.from_bytes(
      Buffer.from(account.paymentKeyHash, 'hex')
    );
    const stakeKeyHash = Loader.Cardano.Ed25519KeyHash.from_bytes(
      Buffer.from(account.stakeKeyHash, 'hex')
    );
    const paymentAddr = Loader.Cardano.BaseAddress.new(
      network.id === NETWORK_ID.mainnet
        ? Loader.Cardano.NetworkInfo.mainnet().network_id()
        : Loader.Cardano.NetworkInfo.testnet().network_id(),
      Loader.Cardano.StakeCredential.from_keyhash(paymentKeyHash),
      Loader.Cardano.StakeCredential.from_keyhash(stakeKeyHash)
    )
      .to_address()
      .to_bech32();
  
    const rewardAddr = Loader.Cardano.RewardAddress.new(
      network.id === NETWORK_ID.mainnet
        ? Loader.Cardano.NetworkInfo.mainnet().network_id()
        : Loader.Cardano.NetworkInfo.testnet().network_id(),
      Loader.Cardano.StakeCredential.from_keyhash(stakeKeyHash)
    )
      .to_address()
      .to_bech32();
  
    const assets = account[network.id].assets;
    const lovelace = account[network.id].lovelace;
    const history = account[network.id].history;
    const minAda = account[network.id].minAda;
    const collateral = account[network.id].collateral;
    const recentSendToAddresses = account[network.id].recentSendToAddresses;
  
    return {
      ...account,
      paymentAddr,
      rewardAddr,
      assets,
      lovelace,
      minAda,
      collateral,
      history,
      recentSendToAddresses,
    };
  };
  
  /** Returns accounts with network specific settings (e.g. address, reward address, etc.) */
  export const getAccounts = async () => {
    const accounts = await getStorage(STORAGE.accounts);
    const network = await getNetwork();
    for (const index in accounts) {
      accounts[index] = await accountToNetworkSpecific(accounts[index], network);
    }
    return accounts;
  };
  
  export const setAccountName = async (name: string): Promise<boolean> => {
    const currentAccountIndex = await getCurrentAccountIndex();
    const accounts = await getStorage(STORAGE.accounts);
    accounts[currentAccountIndex].name = name;
    return await setStorage({ [STORAGE.accounts]: accounts });
  };
  
  export const setAccountAvatar = async (avatar: string) => {
    const currentAccountIndex = await getCurrentAccountIndex();
    const accounts = await getStorage(STORAGE.accounts);
    accounts[currentAccountIndex].avatar = avatar;
    return await setStorage({ [STORAGE.accounts]: accounts });
  };
  
  
export const getCurrentAccountIndex = (): Promise<string> => getStorage<string>(STORAGE.currentAccount);

/** Returns account with network specific settings (e.g. address, reward address, etc.) */
export const getCurrentAccount = async () => {
  const currentAccountIndex = await getCurrentAccountIndex();
  const accounts = await getStorage(STORAGE.accounts);
  const network = await getNetwork();
  return await accountToNetworkSpecific(accounts[currentAccountIndex], network);
};
