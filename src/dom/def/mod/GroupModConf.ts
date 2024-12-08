import {ModConf} from "@/dom/def/ModConf";

export class GroupModConf{
    x:number;
    y:number;
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