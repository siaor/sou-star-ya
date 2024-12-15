import {IndexDB} from "@/res/repo/IndexDB";

const indexDB = await IndexDB.getIndexDB();
export class BaseCtr{
    protected static db = indexDB;

    static buildModeName(url: string): string {
        return url.substring(url.lastIndexOf('/') + 1).split('.')[0];
    }

    static buildModeKey(modeName:string):string{
        return `${modeName}-mode`;
    }
}