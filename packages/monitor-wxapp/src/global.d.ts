
declare let common_vendor: any;
declare let uni: any;
declare let wx: any;
declare let App: (obj: Record<string, any>) => void;//微信小程序
declare let Page: (obj: Record<string, any>) => void;//微信小程序
declare let Component: (obj: Record<string, any>) => any;//微信小程序
interface WxPage {
    route?: string;
    options?: Record<string, any>;
    [K: string]: any
}

declare function getCurrentPages(): WxPage[];