declare const uni: any;

interface Page {
    route?: string;
    options?: Record<string, any>;
}

declare function getCurrentPages(): Page[];