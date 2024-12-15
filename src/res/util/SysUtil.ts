/**
 * 系统工具类
 *
 * @author Siaor
 * @date 2024-12-15 04:50:55
 * */
export class SysUtil {

    /**
     * 是否为移动端设备
     *
     * @author Siaor
     * @date 2024-12-15 04:58:56
     * */
    static isMobileDevice(){
        const userAgent = navigator.userAgent;
        return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    }
    /**
     * 进入全屏
     *
     * @author Siaor
     * @date 2024-12-15 04:51:44
     * */
    static fullScreen() {
        document.documentElement.requestFullscreen().then(r => {
        });
    }

    /**
     * 退出全屏
     *
     * @author Siaor
     * @date 2024-12-15 04:51:44
     * */
    static exitFullScreen() {
        document.exitFullscreen().then(r => {
        });
    }
}