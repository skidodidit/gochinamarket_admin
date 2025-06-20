export interface User {
    _id: string;
    email: string;
    role?: 'admin' | 'user';
    verified: boolean;
}
  
export interface CryptoDTO {
  _id?: any;
  crypto: string;
  network: string;
  rate: number;
  cryptoImage?: string;
  networkImage?: string;
  wallet: string;
}

export interface CurrencyDTO {
  _id?: any;
  name: string;
  code: string;
  rate: number;
  image?: string;
  status: 'active' | 'inactive';
}

export interface AccountDetailsDTO {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

export interface TransactionDTO {
  _id?: any;
  type: 'buy' | 'sell';
  user: string;
  status: 'pending' | 'completed' | 'cancelled';
  walletSentTo?: string;
  walletToReceive?: string;
  accountSentTo?: AccountDetailsDTO;
  accountToReceive?: AccountDetailsDTO;
  cryptoCurrencyAmount?: number;
  currencyAmount?: number;
  conversionRateUsed?: number;
  cryptoCurrency?: string;
  network?: string;
  currency?: string;
  createdAt?: any;
}

export interface FetchTransactionsParams {
  page?: number;
  limit?: number;
  id?: string;
  user?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  type?: 'buy' | 'sell';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TransactionResponse {
  data: TransactionDTO[];
  meta: PaginationMeta;
}

export interface BankAccountDTO {
  _id?: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  wallet: string;
  currency: string;
  network: string;
}