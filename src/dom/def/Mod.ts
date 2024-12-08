import {DefineComponent} from "vue";
import AppMod from '@/view/mod/AppMod.vue'
import GroupMod from "@/view/mod/GroupMod.vue";
import SearchMod from '@/view/mod/SearchMod.vue'

export class Mod {
    id?: string;
    type?: DefineComponent<{}, {}, any> | undefined;
    props?: Record<string, any>;
}

export const AllMod = {
    AppMod,
    GroupMod,
    SearchMod
}