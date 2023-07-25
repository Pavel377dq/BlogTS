/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.scss' {
    const content: { [key: string]: any };
    export = content;
}

declare module '*.svg' {
    const contet: string;
    export = contet;
}
