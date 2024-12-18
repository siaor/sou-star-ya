import {SysUtil} from "@/res/util/SysUtil";

export const isMobileDevice = SysUtil.isMobileDevice();

export const rootPath = `${import.meta.env.BASE_URL}`;

export class SysCtr {
    static fullScreen() {
        SysUtil.fullScreen();
    }

    static exitFullScreen() {
        SysUtil.exitFullScreen();
    }

}