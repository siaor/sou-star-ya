import {DefineComponent} from "vue";

/**
 * 模组
 *
 * @description 模组基本属性信息
 * @author Siaor
 * @date 2024-12-06 12:00:00
 * */
export class Mod {
    id?: string;
    mod: string = '';
    conf: any;

    def?: DefineComponent<{}, {}, any> | undefined;
}