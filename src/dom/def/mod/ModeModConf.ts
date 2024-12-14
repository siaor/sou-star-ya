import {AppModConf} from "@/dom/def/mod/AppModConf";
import {ModConf} from "@/dom/def/ModConf";

/**
 * 主题模组配置
 *
 * @description 参考使用文档
 * @author Siaor
 * @date 2024-12-11 08:22:51
 * */
export class ModeModConf extends ModConf{
    x:number = 0;
    y:number = 0;
    isDrag:boolean=false;
    name: string = '主题';
    logo: string = '/img/mode.svg';
    list: AppModConf[] = [];
}