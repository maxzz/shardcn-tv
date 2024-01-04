import { Theme, themeApply } from "@/utils/theme-apply";
import { proxy, subscribe } from "valtio";
import { TreeState, defaultTreeState } from "./case-tree-state";
import { ResizablesState, defaultResizablesStorage } from "./case-resizables";

export type AppSettings = {
    theme: Theme;
    treeState: TreeState;
    resisablesState: ResizablesState;
};

const defaultSettings: AppSettings = {
    theme: 'light',
    treeState: defaultTreeState,
    resisablesState: defaultResizablesStorage,
};

const STORE_KEY = "shadcn-tv-app-settings";

export const appSettings = proxy<AppSettings>(initialSettings());

function initialSettings(): AppSettings {
    const savedSettings = localStorage.getItem(STORE_KEY);
    let rv = defaultSettings;
    if (savedSettings) {
        try {
            rv = JSON.parse(savedSettings);
            console.log('load settings 1', rv);
        } catch (error) {
        }
    }
    console.log('initialSettings', rv);
    if (!rv.resisablesState?.positions) {
        rv.resisablesState = defaultSettings.resisablesState;
    }
    return rv;
}

themeApply(appSettings.theme);

subscribe(appSettings, () => {
    themeApply(appSettings.theme);
});

subscribe(appSettings, () => {
    const str = JSON.stringify(appSettings);
    console.log('save settings 4', str);
    localStorage.setItem(STORE_KEY, str);
});
