import { IConfig } from './typings/config';

export const defaultConfig: IConfig = {
    token: '',
    adminRoles: [],
    fivemData: [],
    main: {
        host: "127.0.0.1:30120",
        name: "Test",
        maxPlayer: "32",
        interval: 3
    },
}

export const ipPattern = new RegExp("^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(?::\\d{1,5})$");
export const domainPattern = new RegExp("^([a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}$");