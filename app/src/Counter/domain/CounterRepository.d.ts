export interface CounterRepository {
    onChange: (callback: (count: number) => void) => void;
    setCount: (count: number) => void;
    getCount: () => number;
}
