declare module 'react' {
  export interface ReactNode {}
  export interface FC<P = {}> {
    (props: P): ReactElement | null;
  }
  export interface ReactElement {}
  export interface FormEvent<T = Element> {
    preventDefault(): void;
  }
  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prevState: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: unknown[]): T;
}
