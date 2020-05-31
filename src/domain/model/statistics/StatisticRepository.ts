export interface StatisticRepostory {
  getTotalAmountOfUsers(): Promise<number>;
  getTotalAmountOfTests(): Promise<number>;
  getTotalAmountOfAccessPasses(): Promise<number>;
}
