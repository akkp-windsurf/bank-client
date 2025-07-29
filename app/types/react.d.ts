declare module 'react' {
  export interface ReactNode {}
  export interface FC<P = {}> {
    (props: P): ReactElement | null;
  }
  export interface ReactElement {}
}
