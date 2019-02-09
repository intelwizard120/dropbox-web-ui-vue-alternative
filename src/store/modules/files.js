import API from "@/middleware/api.js";

export default {
    namespaced: true,
    state: {
        fatalError: null,
        excusableError: null,

        list: [],
        tree: {}
    },
    mutations: {
        SET_FATAL_ERROR(state, err) {
            state.fatalError = err;
        },

        UPDATE_LIST(state, list) {
            state.list = list;
        },

        UPDATE_TREE(state, tree) {
            state.tree = tree;
        }
    },
    actions: {
        connect({ commit }) {
            try {
                API.connect();
            } catch (err) {
                console.error(err);
                commit("SET_FATAL_ERROR", err);
            }
        },

        async update({ commit }) {
            try {
                let list = await API.getFilesList();
                commit("UPDATE_LIST", list);

                let tree = API.Helpers.buildTree(list);
                commit("UPDATE_TREE", tree);
            } catch (err) {
                console.error(err);
                commit("SET_FATAL_ERROR", err);
            }
        }
    },
    getters: {
        folderByLink: (state) => (link = "") => {
            return state.list.find(entry => {
                return entry[".tag"] === "folder" && entry.link === link;
            });
        }
    }
};
