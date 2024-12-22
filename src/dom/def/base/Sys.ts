/**
 * 系统通用枚举
 *
 * @description 定义系统的通用静态变量
 * @author Siaor
 * @date 2024-12-09 23:59:08
 * */
export enum Sys {
    SYS_VERSION = 20241206,
    SYS_NAME = 'SouStarYa',

    SYS_MODE = 'sys-mode',
    SYS_MODE_LIST = 'sys-mode-list',
    SYS_MODE_PATH = './sys/mode.json',

    SYS_EVENT_RELOAD_MODE = 'sys-event-reload-mode',
    SYS_EVENT_RELOAD_BG = 'sys-event-reload-bg',
    SYS_EVENT_CACHE_MOD = 'sys-event-cache-mod',
    SYS_EVENT_ADD_DRAG = 'sys-event-add-drag',
    SYS_EVENT_OPEN_MOD_MENU = 'sys-event-open-mod-menu',
    SYS_EVENT_CLOSE_MOD_MENU = 'sys-event-close-mod-menu',
}