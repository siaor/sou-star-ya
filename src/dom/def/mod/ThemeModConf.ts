import {AppModConf} from "@/dom/def/mod/AppModConf";

/**
 * 主题模组配置
 *
 * @description 参考使用文档
 * @author Siaor
 * @date 2024-12-11 08:22:51
 * */
export class ThemeModConf {
    x: number;
    y: number;
    name: string;
    logo: string;
    list: AppModConf[];

    constructor() {
        this.x = 0;
        this.y = 0;
        this.name = '';
        this.logo = '';
        this.list = [];
    }
}