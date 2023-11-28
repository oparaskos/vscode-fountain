import type { TState } from './types/TState';

import { getPanels } from '@/getPanels';
import { getState, patchState, postMessage } from '@/vscode';
import { logger } from '@/utils/logger';
import { updateLocationsTable } from '@/tabs/locations/updateLocationsTable';
import { updateScenesTable } from '@/tabs/scenes/updateScenesTable';
import { updateCharacterTable } from '@/tabs/character/updateCharacterTable';


import '@/index.style.scss';
import { updateSummaryStats } from './tabs/summaryStats';

function initState() {
    const state = getState<TState>() || {};
    if (!state.statistics) {
        patchState<TState>({
            statistics: {
                characters: [],
                locations: [],
                scenes: [],
                document: {}
            }
        });
    }
    return state;
}

function onMessage(ev: MessageEvent) {
    console.log("onMessage", ev.data)
    const state = getState<TState>();
    switch (ev.data.command) {
        case "fountain.statistics.characters":
            state.statistics.characters = ev.data.stats;
            updateCharacterTable(state.statistics.characters);
            updateSummaryStats(state.statistics);
            patchState<TState>({ statistics: state.statistics });
            return;
        case "fountain.statistics.locations":
            state.statistics.locations = ev.data.stats;
            updateLocationsTable(state.statistics.locations);
            updateSummaryStats(state.statistics);
            patchState<TState>({ statistics: state.statistics });
            return;
        case "fountain.statistics.scenes":
            state.statistics.scenes = ev.data.stats;
            updateScenesTable(state.statistics.scenes);
            updateSummaryStats(state.statistics);
            patchState<TState>({ statistics: state.statistics });
            return;
        case "fountain.statistics.document":
            state.statistics.document = ev.data.stats;
            updateSummaryStats(state.statistics);
            patchState<TState>({ statistics: state.statistics });
            return;
        case "fountain.analyseLocation":
            getPanels().activeid = "tab-locations";
            return;
        case "fountain.analyseCharacter":
            getPanels().activeid = "tab-characters";
            return;
        case "fountain.analyseScene":
            getPanels().activeid = "tab-scenes";
            return;
        case "opened":
            patchState<TState>({ uri: ev.data.uri });
            return;
    }
}

function handleHrefButton(e: Event) {
    const href = (e.target as HTMLElement).getAttribute('data-href');
    postMessage({
        command: "open",
        link: href
    });
}


function main() {
    logger.trace("main");
    const state = initState();
    document.querySelectorAll('vscode-button[data-href]').forEach((it) => it.addEventListener('click', handleHrefButton));

    if (state.statistics) {
        updateCharacterTable(state.statistics.characters);
        updateLocationsTable(state.statistics.locations);
        updateScenesTable(state.statistics.scenes);
        updateSummaryStats(state.statistics);
    }

    postMessage({ type: 'ready' });
}


window.addEventListener('DOMContentLoaded', main);
window.addEventListener("load", main);
window.addEventListener("message", onMessage);
