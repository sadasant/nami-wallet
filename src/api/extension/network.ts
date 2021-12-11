import { EVENT, NETWORK_ID, NODE, SENDER, STORAGE, TARGET } from "../../config/config";
import { networkNameToId } from "../util";
import { getStorage, setStorage } from "./storage";

export interface Network {
    id: string,
    mainnet: string,
    node: string
}

const emitNetworkChange = async (networkId: number): Promise<void> => {
    //to webpage
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) =>
        chrome.tabs.sendMessage(tab.id!, {
          data: networkId,
          target: TARGET,
          sender: SENDER.extension,
          event: EVENT.networkChange,
        })
      );
    });
  };
    
export const getNetwork = (): Promise<Network> => getStorage<Network>(STORAGE.network);

export const setNetwork = async (network: Network) => {
  const currentNetwork = await getNetwork();
  let id;
  let node;
  if (network.id === NETWORK_ID.mainnet) {
    id = NETWORK_ID.mainnet;
    node = NODE.mainnet;
  } else {
    id = NETWORK_ID.testnet;
    node = NODE.testnet;
  }
  if (network.node) node = network.node;
  if (currentNetwork && currentNetwork.id !== id)
    emitNetworkChange(networkNameToId(id));
  await setStorage({
    [STORAGE.network]: { id, node },
  });
  return true;
};

