/**
 * 系统事件
 *
 * @author Siaor
 * @date 2024-12-10 04:41:36
 * */
export class SysEvent {
    name: string;
    data: any;

    constructor(name: string = '', data: any = null) {
        this.name = name;
        this.data = data;
    }
}