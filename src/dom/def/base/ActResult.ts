import {ActCode} from "@/dom/def/base/ActCode";

/**
 * 统一操作响应
 *
 * @author Siaor
 * */
export class ActResult {
    public code: number;
    public success: boolean;
    public msg: string;
    public data: any;

    constructor(code: number, success: boolean, msg: string, data: any) {
        this.code = code
        this.success = success
        this.msg = msg
        this.data = data
    }

    static ok(data?: any): ActResult {
        return new ActResult(ActCode.SUCCESS.code, true, ActCode.SUCCESS.msg, data ?? {})
    }

    static fail(actCode?: { code: number, msg: string }, msg?: string): ActResult {
        return new ActResult(ActCode.FAILURE.code, false, msg ?? ActCode.FAILURE.msg, {})
    }
}