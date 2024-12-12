import {ModConf} from "@/dom/def/ModConf";

/**
 * 分组模组配置
 *
 * @description 参考使用文档
 * @author Siaor
 * @date 2024-12-06 12:00:00
 * */
export class GroupModConf{
    x:number;
    y:number;
    isDrag:boolean = true;
    name:string;
    logo:string;
    list: ModConf[];

    constructor() {
        this.x = 0;
        this.y = 0;
        this.name = '';
        this.logo = '';
        this.list = [];
    }
}