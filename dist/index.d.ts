interface RVarElement {
    e: Element;
    render: () => any;
}
export interface RVar<T> {
    value: T;
    set: (newValue: T) => void;
    _rves: Set<RVarElement>;
}

declare module 'revik/jsx-runtime' {
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
    export default function jsx(type: string, props: { [key: string]: any }, ...children: any[]): HTMLElement;
}