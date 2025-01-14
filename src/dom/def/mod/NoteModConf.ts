import {ModConf} from "@/dom/def/ModConf";

/**
 * 便签模组配置
 *
 * @description 参考使用文档
 * @author Siaor
 * @date 2025-01-08 11:10:25
 * */
export class NoteModConf extends ModConf {
    title: string = '便签';
    content: string = '';
    isShow: boolean = true;
    width:number = 200;
    height:number = 280;
    bg: string = 'rgb(0,0,0,0.3)';
}