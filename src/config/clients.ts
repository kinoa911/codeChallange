import { AptosClient, CoinClient } from 'aptos'

export const client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1');
export const coinClient = new CoinClient(client);