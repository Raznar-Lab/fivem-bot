import yaml from 'yaml';
import * as fs from 'fs';
import { IConfig } from './typings/config';
import { defaultConfig } from './constants';

export class Config {
    public data: IConfig = defaultConfig;
    private filePath: string = "";
    constructor() {}

    public load() {
        const content = fs.readFileSync(this.filePath, {
            encoding: 'utf-8',
        });

        const result = yaml.parse(content) as IConfig;
        if (result == null) {
            console.log('Cannot load config, invalid content!');
            return;
        }

        this.data = result;
    }

    public save() {
        const content = yaml.stringify(this.data, {
            indent: 2,
        });

        fs.writeFileSync(this.filePath, content, {
            encoding: 'utf-8',
        });
    }

    public setFilePath(filepath: string) {
        this.filePath = filepath;
    }
}
