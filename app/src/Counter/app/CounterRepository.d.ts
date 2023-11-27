export interface CounterRepository {
    setCount: (count: number) => void;
    getCount: () => number;
}
