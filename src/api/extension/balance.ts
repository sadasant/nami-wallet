import Loader from '../loader';

export const getBalance = async () => {
    await Loader.load();
    const currentAccount = await getCurrentAccount();
    const result = await blockfrostRequest(
      `/addresses/${currentAccount.paymentAddr}`
    );
    if (result.error) {
      if (result.status_code === 400) throw APIError.InvalidRequest;
      else if (result.status_code === 500) throw APIError.InternalError;
      else return Loader.Cardano.Value.new(Loader.Cardano.BigNum.from_str('0'));
    }
    const value = await assetsToValue(result.amount);
    return value;
  };
  
  export const getBalanceExtended = async () => {
    const currentAccount = await getCurrentAccount();
    const result = await blockfrostRequest(
      `/addresses/${currentAccount.paymentAddr}/extended`
    );
    if (result.error) {
      if (result.status_code === 400) throw APIError.InvalidRequest;
      else if (result.status_code === 500) throw APIError.InternalError;
      else return [];
    }
    return result.amount;
  };
  
  export const getFullBalance = async () => {
    const currentAccount = await getCurrentAccount();
    const result = await blockfrostRequest(
      `/accounts/${currentAccount.rewardAddr}`
    );
    if (result.error) return '0';
    return (
      BigInt(result.controlled_amount) - BigInt(result.withdrawable_amount)
    ).toString();
  };
  
  export const setBalanceWarning = async () => {
    const currentAccount = await getCurrentAccount();
    const network = await getNetwork();
    let warning = { active: false, fullBalance: '0' };
  
    const result = await blockfrostRequest(
      `/accounts/${currentAccount.rewardAddr}/addresses?count=2`
    );
  
    if (result.length > 1) {
      const fullBalance = await getFullBalance();
      if (fullBalance !== currentAccount[network.id].lovelace) {
        warning.active = true;
        warning.fullBalance = fullBalance;
      }
    }
  
    return warning;
  };
  