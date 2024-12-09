import {ActResult} from "@/dom/def/base/ActResult";
/**
 * 模块配置接口定义
 *
 * @author Siaor
 * */
export interface ModConfVim{
    get(path: string): Promise<ActResult>;
}