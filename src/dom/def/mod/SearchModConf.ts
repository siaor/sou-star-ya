import {ModConf} from "@/dom/def/ModConf";

/**
 * 参考使用文档
 *
 * @description
 * @author Siaor
 * @date 2024-12-06 12:00:00
 * */
export class SearchModConf extends ModConf {
    x: number = 0;
    y: number = 0;
    isDrag: boolean = true;
    engine: string = '百度';
}