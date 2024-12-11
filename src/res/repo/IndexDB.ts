import {ActResult} from "@/dom/def/base/ActResult";
import {ActCode} from "@/dom/def/base/ActCode";
import {Sys} from "@/dom/def/base/Sys";

/**
 * IndexDB仓储类
 *
 * @description 封装了浏览器IndexDB数据库常用方法
 * @author Siaor
 * @date 2024-12-09 23:59:08
 * */
export class IndexDB {
    private static dbi: IndexDB | null = null;
    private db: IDBDatabase | null = null;
    private dbName: string;
    private storeName: string;
    private version: number;

    constructor(dbName?: string, storeName?: string, version?: number) {
        this.dbName = dbName ?? Sys.SYS_NAME;
        this.storeName = storeName ?? 'store';
        this.version = version ?? Sys.SYS_VERSION;
    }

    public static async getIndexDB(): Promise<IndexDB> {
        if (!IndexDB.dbi) {
            IndexDB.dbi = new IndexDB();
            await IndexDB.dbi.open();
        }
        return IndexDB.dbi;
    }

    public open(): Promise<ActResult> {
        return new Promise((resolve, reject) => {
            console.log('连接数据库ing...')
            const request = indexedDB.open(this.dbName, this.version);
            request.onerror = (event) => {
                console.error('Database error: ' + event);
                reject(ActResult.fail(ActCode.FAILURE, '打开数据库失败'))
            };
            request.onsuccess = (event: Event) => {
                this.db = request.result;
                resolve(ActResult.ok(request.result));
            };
            request.onupgradeneeded = (event) => {
                console.log('数据库更新...')
                const db = request.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
        });
    }

    public put(key: string, data: any): Promise<ActResult> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(ActResult.fail(ActCode.FAILURE, '未连接数据库'))
                return;
            }

            const tx = this.db.transaction(this.storeName, 'readwrite');
            const store = tx.objectStore(this.storeName)
            const request = store.put(data, key);

            request.onsuccess = () => {
                resolve(ActResult.ok());
            };
            request.onerror = () => {
                reject(ActResult.fail(ActCode.FAILURE, '添加失败'))
            };
        });
    }

    public get(key: string): Promise<ActResult> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(ActResult.fail(ActCode.FAILURE, '未连接数据库'))
                return;
            }

            const tx = this.db.transaction(this.storeName, 'readwrite');
            const store = tx.objectStore(this.storeName)
            const request = store.get(key);

            request.onsuccess = () => {
                const val = request.result;
                if (val) {
                    resolve(ActResult.ok(request.result));
                } else {
                    resolve(ActResult.fail(ActCode.FAILURE, '值不存在'));
                }
            };
            request.onerror = () => {
                reject(ActResult.fail(ActCode.FAILURE, '获取失败'))
            };
        });
    }

    public delete(key: string): Promise<ActResult> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(ActResult.fail(ActCode.FAILURE, '未连接数据库'))
                return;
            }

            const tx = this.db.transaction(this.storeName, 'readwrite');
            const store = tx.objectStore(this.storeName)
            const request = store.delete(key);

            request.onsuccess = () => {
                resolve(ActResult.ok());
            };
            request.onerror = () => {
                reject(ActResult.fail(ActCode.FAILURE, '删除失败'))
            };
        });
    }

    static drop(dbName?: string): void {
        indexedDB.deleteDatabase(dbName ?? Sys.SYS_NAME);
    }
}