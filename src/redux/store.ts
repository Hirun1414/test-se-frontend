import { configureStore, combineReducers } from "@reduxjs/toolkit";
import bookSlice from "./features/bookSlice";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist"
import { WebStorage } from "redux-persist/lib/types";

function createPersistStorage(): WebStorage {
    if (typeof window === 'undefined') {
        return {
            getItem: async () => null,
            setItem: async () => {},
            removeItem: async () => {},
        };
    }

    const createWebStorage = require('redux-persist/lib/storage/createWebStorage').default;
    return createWebStorage('local');
}
const storage = createPersistStorage();

const persistConfig = {
    key: "rootPersist_v2",
    storage
}

const rootReducer = combineReducers({bookSlice});
const reduxPersistReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: reduxPersistReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REGISTER, REHYDRATE, PAUSE, PERSIST, PURGE],
        },
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector