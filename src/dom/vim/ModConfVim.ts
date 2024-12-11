import {ActResult} from "@/dom/def/base/ActResult";
/**
 * 模块配置接口定义
 *
 * @author Siaor
 * @date 2024-12-06 12:00:00
 * */
export interface ModConfVim{
    get(path: string): Promise<ActResult>;
}