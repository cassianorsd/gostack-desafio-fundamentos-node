import Transaction from '../models/Transaction';
// import CreateTransactionService from '../services/CreateTransactionService';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface TransactionsAbstractDTO {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    const { transactions } = this;
    return transactions;
  }

  public getAbstract(): TransactionsAbstractDTO {
    const abstract = {
      transactions: this.all(),
      balance: this.getBalance(),
    };
    return abstract;
  }

  public getBalance(): Balance {
    // const income = this.transactions
    //   .filter(transaction => transaction.type === 'income')
    //   .reduce((acc, item) => acc + (item.value || 0), 0);
    const totals = this.transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') acc.income += transaction.value;
        if (transaction.type === 'outcome') acc.outcome += transaction.value;
        return acc;
      },
      {
        income: 0,
        outcome: 0,
      },
    );
    return {
      income: totals.income,
      outcome: totals.outcome,
      total: totals.income - totals.outcome,
    };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
