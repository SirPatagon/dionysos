import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';

export const key: InjectionKey<Store<object>> = Symbol();

export default createStore({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {},
});

export function useStore() {
    return baseUseStore(key);
}
