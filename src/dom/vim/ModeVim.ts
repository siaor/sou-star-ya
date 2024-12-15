import {ActResult} from "@/dom/def/base/ActResult";

/**
 * 模块接口定义
 *
 * @author Siaor
 * @date 2024-12-15 08:51:23
 * */
export interface ModeVim {
    get(): Promise<ActResult>;
}