import {SysUtil} from "@/res/util/SysUtil";

export const isMobileDevice = SysUtil.isMobileDevice();

export class SysCtr {
    static fullScreen() {
        SysUtil.fullScreen();
    }

    static exitFullScreen() {
        SysUtil.exitFullScreen();
    }
}