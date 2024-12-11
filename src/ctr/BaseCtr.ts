import {IndexDB} from "@/res/repo/IndexDB";

const indexDB = await IndexDB.getIndexDB();
export class BaseCtr{
    protected static db = indexDB;
}