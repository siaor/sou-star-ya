//ts默认不识别.vue后缀的文件，全局定义后即可正常import 'xxx.vue'，否则会出现红色报错，但是不影响功能。
declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
