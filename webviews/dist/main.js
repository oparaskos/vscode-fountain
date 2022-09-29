/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/formatTime.ts":
/*!***************************!*\
  !*** ./src/formatTime.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "formatTime": () => (/* binding */ formatTime)
/* harmony export */ });
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    return [
        h,
        m > 9 ? m : (h ? '0' + m : m || '0'),
        s > 9 ? s : '0' + s
    ].filter(Boolean).join(':');
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _formatTime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./formatTime */ "./src/formatTime.ts");

const fountain = {
    selections: {},
    statistics: {
        characters: [],
        locations: [],
        scenes: []
    }
};
window.addEventListener("load", main);
window.addEventListener("message", onMessage);
function getPanels(id = "root-panel") {
    return document.getElementById("root-panel");
}
function getDataGrid(id) {
    return document.getElementById(id);
}
function onSelectionChanged(name, i, rowData) {
    const charactersPanel = document.querySelector("vscode-panel-view#view-characters");
    if (charactersPanel) {
        charactersPanel.getElementsByTagName("h3")[0].innerHTML = fountain.selections[name].Name;
    }
}
function onRowElementClicked(name, i, rowData) {
    return (evt) => {
        fountain.selections[name] = rowData[i - 1];
        onSelectionChanged(name, i, rowData);
    };
}
function updateTable(name, rowData) {
    const dataGrid = getDataGrid(name);
    dataGrid.rowsData = rowData;
    setTimeout(() => {
        const rowElements = dataGrid.getElementsByTagName("vscode-data-grid-row");
        for (let i = 0; i < rowElements.length; ++i) {
            const element = rowElements[i];
            element.addEventListener("click", onRowElementClicked(name, i, rowData));
        }
    }, 1);
}
function describeDuration(dialogueActionRatio, duration) {
    const dialogueRatio = dialogueActionRatio;
    const actionRatio = 1 - dialogueRatio;
    if (dialogueRatio > actionRatio) {
        return `${(0,_formatTime__WEBPACK_IMPORTED_MODULE_0__.formatTime)(duration)} (${Math.round(dialogueRatio * 100).toFixed(0)}%\u00a0Dialogue)`;
    }
    if (actionRatio > dialogueRatio) {
        return `${(0,_formatTime__WEBPACK_IMPORTED_MODULE_0__.formatTime)(duration)} (${Math.round(actionRatio * 100).toFixed(0)}%\u00a0Action)`;
    }
    else {
        return `${(0,_formatTime__WEBPACK_IMPORTED_MODULE_0__.formatTime)(duration)} (Balanced\u00a0Action\u00a0/\u00a0Dialogue)`;
    }
}
function updateScenesTable(stats) {
    updateTable('grid-scenes', stats.map((row) => {
        const dialogueRatio = row.DialogueDuration / row.Duration;
        return {
            Name: row.Name,
            Characters: row.Characters,
            Synopsis: row.Synopsis,
            Duration: describeDuration(dialogueRatio, row.Duration),
        };
    }));
    const badge = document.querySelector("vscode-panel-tab#tab-scenes > vscode-badge");
    if (badge) {
        badge.innerHTML = '' + stats.length;
    }
}
function updateLocationsTable(stats) {
    updateTable('grid-locations', stats.map((row) => (Object.assign(Object.assign({}, row), { Duration: (0,_formatTime__WEBPACK_IMPORTED_MODULE_0__.formatTime)(row.Duration) }))));
    const badge = document.querySelector("vscode-panel-tab#tab-locations > vscode-badge");
    if (badge) {
        badge.innerHTML = '' + stats.length;
    }
}
function updateCharacterTable(stats) {
    updateTable('grid-characters', stats.map((row) => ({
        "Name": row.Name,
        "Gender": row.Gender.toUpperCase(),
        "Length & Duration": `${(0,_formatTime__WEBPACK_IMPORTED_MODULE_0__.formatTime)(row.Duration)} - ${row.Lines} lines - ${row.Words} words`,
        "Reading Age": row.ReadingAge
    })));
    const badge = document.querySelector("vscode-panel-tab#tab-characters > vscode-badge");
    if (badge) {
        badge.innerHTML = '' + stats.length;
    }
    let totalDialogue = 0;
    const dialogueBalance = {};
    for (const characterStats of stats) {
        const char = characterStats;
        dialogueBalance[char.Gender] = (dialogueBalance[char.Gender] || 0) + (char.Duration || 0);
        totalDialogue += (char.Duration || 0);
    }
    const observations = [];
    for (const gender in dialogueBalance) {
        observations.push(`${gender} characters speak for ${(0,_formatTime__WEBPACK_IMPORTED_MODULE_0__.formatTime)(dialogueBalance[gender])} (${Math.round(100 * (dialogueBalance[gender] / totalDialogue))}%)`);
    }
    document.getElementById("characters-observations").innerHTML = observations.join("<br />");
}
function onMessage(ev) {
    // eslint-disable-next-line no-debugger
    if (ev.data.command == "fountain.statistics.characters") {
        fountain.statistics.characters = ev.data.stats;
        updateCharacterTable(fountain.statistics.characters);
    }
    if (ev.data.command == "fountain.statistics.locations") {
        fountain.statistics.locations = ev.data.stats;
        updateLocationsTable(fountain.statistics.locations);
    }
    if (ev.data.command == "fountain.statistics.scenes") {
        fountain.statistics.scenes = ev.data.stats;
        updateScenesTable(fountain.statistics.scenes);
    }
    if (ev.data.command == "fountain.analyseLocation") {
        getPanels().activeid = "tab-locations";
    }
    if (ev.data.command == "fountain.analyseCharacter") {
        getPanels().activeid = "tab-characters";
    }
    if (ev.data.command == "fountain.analyseScene") {
        getPanels().activeid = "tab-scenes";
    }
}
function main() {
    return;
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFPLFNBQVMsVUFBVSxDQUFDLE9BQWU7SUFDekMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDckMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM1QyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNuQyxPQUFPO1FBQ04sQ0FBQztRQUNELENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUM7UUFDcEMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztLQUNuQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0IsQ0FBQzs7Ozs7OztVQ1REO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOMEM7QUFFMUMsTUFBTSxRQUFRLEdBQUc7SUFDaEIsVUFBVSxFQUFFLEVBQTRCO0lBQ3hDLFVBQVUsRUFBRTtRQUNYLFVBQVUsRUFBRSxFQUFFO1FBQ2QsU0FBUyxFQUFFLEVBQUU7UUFDYixNQUFNLEVBQUUsRUFBRTtLQUNWO0NBQ0QsQ0FBQztBQUdGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdEMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUU5QyxTQUFTLFNBQVMsQ0FBQyxFQUFFLEdBQUcsWUFBWTtJQUNuQyxPQUFPLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFvQyxDQUFDO0FBQ2pGLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxFQUFVO0lBQzlCLE9BQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQXlDLENBQUM7QUFDNUUsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUMsSUFBWSxFQUFFLENBQVMsRUFBRSxPQUFpQjtJQUNyRSxNQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7SUFDcEYsSUFBSSxlQUFlLEVBQUU7UUFDcEIsZUFBZSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQztLQUN6RjtBQUNGLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLElBQVksRUFBRSxDQUFTLEVBQUUsT0FBaUI7SUFDdEUsT0FBTyxDQUFDLEdBQVUsRUFBRSxFQUFFO1FBQ3JCLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMzQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3RDLENBQUMsQ0FBQztBQUNILENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxJQUFZLEVBQUUsT0FBaUI7SUFDbkQsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLFFBQVEsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzVCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZixNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUMxRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtZQUM1QyxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDekU7SUFDRixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxtQkFBMkIsRUFBRSxRQUFpQjtJQUN2RSxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQztJQUMxQyxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDO0lBQ3RDLElBQUksYUFBYSxHQUFHLFdBQVcsRUFBRTtRQUNoQyxPQUFPLEdBQUcsdURBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDO0tBQ2hHO0lBQUMsSUFBSSxXQUFXLEdBQUcsYUFBYSxFQUFFO1FBQ2xDLE9BQU8sR0FBRyx1REFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUM7S0FDNUY7U0FBTTtRQUNOLE9BQU8sR0FBRyx1REFBVSxDQUFDLFFBQVEsQ0FBQyw4Q0FBOEMsQ0FBQztLQUM3RTtBQUVGLENBQUM7QUFFRCxTQUFTLGlCQUFpQixDQUFDLEtBQWU7SUFDekMsV0FBVyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7UUFDakQsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDMUQsT0FBTztZQUNHLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSTtZQUNkLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVTtZQUMxQixRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVE7WUFDL0IsUUFBUSxFQUFFLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDO1NBQ3ZELENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRUosTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO0lBQ25GLElBQUksS0FBSyxFQUFFO1FBQUUsS0FBSyxDQUFDLFNBQVMsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztLQUFFO0FBQ3BELENBQUM7QUFFRCxTQUFTLG9CQUFvQixDQUFDLEtBQWU7SUFDNUMsV0FBVyxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFRLEVBQUUsRUFBRSxDQUFDLGlDQUNsRCxHQUFHLEtBQ04sUUFBUSxFQUFFLHVEQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUNqQyxDQUFDLENBQUMsQ0FBQztJQUVMLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUN0RixJQUFJLEtBQUssRUFBRTtRQUFFLEtBQUssQ0FBQyxTQUFTLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7S0FBRTtBQUNwRCxDQUFDO0FBRUQsU0FBUyxvQkFBb0IsQ0FBQyxLQUE2QjtJQUMxRCxXQUFXLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQXlCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJO1FBQ2hCLFFBQVEsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRTtRQUNsQyxtQkFBbUIsRUFBRSxHQUFHLHVEQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLFlBQVksR0FBRyxDQUFDLEtBQUssUUFBUTtRQUM1RixhQUFhLEVBQUUsR0FBRyxDQUFDLFVBQVU7S0FDN0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVMLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZ0RBQWdELENBQUMsQ0FBQztJQUN2RixJQUFJLEtBQUssRUFBRTtRQUFFLEtBQUssQ0FBQyxTQUFTLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7S0FBRTtJQUVuRCxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7SUFDdEIsTUFBTSxlQUFlLEdBQStCLEVBQUUsQ0FBQztJQUN2RCxLQUFLLE1BQU0sY0FBYyxJQUFJLEtBQUssRUFBRTtRQUNuQyxNQUFNLElBQUksR0FBRyxjQUFxQixDQUFDO1FBQ25DLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxRixhQUFhLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQ3RDO0lBQ0QsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQ3hCLEtBQUssTUFBTSxNQUFNLElBQUksZUFBZSxFQUFFO1FBQ3JDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLHlCQUF5Qix1REFBVSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzdKO0lBQ0QsUUFBUSxDQUFDLGNBQWMsQ0FBQyx5QkFBeUIsQ0FBRSxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdGLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxFQUFnQjtJQUNsQyx1Q0FBdUM7SUFDdkMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxnQ0FBZ0MsRUFBRTtRQUN4RCxRQUFRLENBQUMsVUFBVSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMvQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ3JEO0lBQ0QsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSwrQkFBK0IsRUFBRTtRQUN2RCxRQUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUM5QyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3BEO0lBQ0QsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSw0QkFBNEIsRUFBRTtRQUNwRCxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMzQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzlDO0lBRUQsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSwwQkFBMEIsRUFBRTtRQUNsRCxTQUFTLEVBQUUsQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDO0tBQ3ZDO0lBQ0QsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSwyQkFBMkIsRUFBRTtRQUNuRCxTQUFTLEVBQUUsQ0FBQyxRQUFRLEdBQUcsZ0JBQWdCLENBQUM7S0FDeEM7SUFDRCxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLHVCQUF1QixFQUFFO1FBQy9DLFNBQVMsRUFBRSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUM7S0FDcEM7QUFDRixDQUFDO0FBRUQsU0FBUyxJQUFJO0lBQ1osT0FBTztBQUNSLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWxsby13b3JsZC8uL3NyYy9mb3JtYXRUaW1lLnRzIiwid2VicGFjazovL2hlbGxvLXdvcmxkL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2hlbGxvLXdvcmxkL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9oZWxsby13b3JsZC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2hlbGxvLXdvcmxkL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vaGVsbG8td29ybGQvLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZm9ybWF0VGltZShzZWNvbmRzOiBudW1iZXIpIHtcblx0Y29uc3QgaCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuXHRjb25zdCBtID0gTWF0aC5mbG9vcigoc2Vjb25kcyAlIDM2MDApIC8gNjApO1xuXHRjb25zdCBzID0gTWF0aC5yb3VuZChzZWNvbmRzICUgNjApO1xuXHRyZXR1cm4gW1xuXHRcdGgsXG5cdFx0bSA+IDkgPyBtIDogKGggPyAnMCcgKyBtIDogbSB8fCAnMCcpLFxuXHRcdHMgPiA5ID8gcyA6ICcwJyArIHNcblx0XS5maWx0ZXIoQm9vbGVhbikuam9pbignOicpO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBmb3JtYXRUaW1lIH0gZnJvbSAnLi9mb3JtYXRUaW1lJztcblxuY29uc3QgZm91bnRhaW4gPSB7XG5cdHNlbGVjdGlvbnM6IHt9IGFzIHsgW2tleTogc3RyaW5nXTogYW55IH0sXG5cdHN0YXRpc3RpY3M6IHtcblx0XHRjaGFyYWN0ZXJzOiBbXSxcblx0XHRsb2NhdGlvbnM6IFtdLFxuXHRcdHNjZW5lczogW11cblx0fVxufTtcblxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbWFpbik7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgb25NZXNzYWdlKTtcblxuZnVuY3Rpb24gZ2V0UGFuZWxzKGlkID0gXCJyb290LXBhbmVsXCIpIHtcblx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdC1wYW5lbFwiKSBhcyB1bmtub3duIGFzIHsgYWN0aXZlaWQ6IHN0cmluZyB9O1xufVxuXG5mdW5jdGlvbiBnZXREYXRhR3JpZChpZDogc3RyaW5nKSB7XG5cdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgYXMgSFRNTEVsZW1lbnQgJiB7IHJvd3NEYXRhOiBvYmplY3RbXSB9O1xufVxuXG5mdW5jdGlvbiBvblNlbGVjdGlvbkNoYW5nZWQobmFtZTogc3RyaW5nLCBpOiBudW1iZXIsIHJvd0RhdGE6IG9iamVjdFtdKSB7XG5cdGNvbnN0IGNoYXJhY3RlcnNQYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ2c2NvZGUtcGFuZWwtdmlldyN2aWV3LWNoYXJhY3RlcnNcIik7XG5cdGlmIChjaGFyYWN0ZXJzUGFuZWwpIHtcblx0XHRjaGFyYWN0ZXJzUGFuZWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoM1wiKVswXS5pbm5lckhUTUwgPSBmb3VudGFpbi5zZWxlY3Rpb25zW25hbWVdLk5hbWU7XG5cdH1cbn1cblxuZnVuY3Rpb24gb25Sb3dFbGVtZW50Q2xpY2tlZChuYW1lOiBzdHJpbmcsIGk6IG51bWJlciwgcm93RGF0YTogb2JqZWN0W10pIHtcblx0cmV0dXJuIChldnQ6IEV2ZW50KSA9PiB7XG5cdFx0Zm91bnRhaW4uc2VsZWN0aW9uc1tuYW1lXSA9IHJvd0RhdGFbaSAtIDFdO1xuXHRcdG9uU2VsZWN0aW9uQ2hhbmdlZChuYW1lLCBpLCByb3dEYXRhKTtcblx0fTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVGFibGUobmFtZTogc3RyaW5nLCByb3dEYXRhOiBvYmplY3RbXSkge1xuXHRjb25zdCBkYXRhR3JpZCA9IGdldERhdGFHcmlkKG5hbWUpO1xuXHRkYXRhR3JpZC5yb3dzRGF0YSA9IHJvd0RhdGE7XG5cdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdGNvbnN0IHJvd0VsZW1lbnRzID0gZGF0YUdyaWQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ2c2NvZGUtZGF0YS1ncmlkLXJvd1wiKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJvd0VsZW1lbnRzLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRjb25zdCBlbGVtZW50ID0gcm93RWxlbWVudHNbaV07XG5cdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBvblJvd0VsZW1lbnRDbGlja2VkKG5hbWUsIGksIHJvd0RhdGEpKTtcblx0XHR9XG5cdH0sIDEpO1xufVxuXG5mdW5jdGlvbiBkZXNjcmliZUR1cmF0aW9uKGRpYWxvZ3VlQWN0aW9uUmF0aW86IG51bWJlciwgZHVyYXRpb24gOiBudW1iZXIpIHtcblx0Y29uc3QgZGlhbG9ndWVSYXRpbyA9IGRpYWxvZ3VlQWN0aW9uUmF0aW87XG5cdGNvbnN0IGFjdGlvblJhdGlvID0gMSAtIGRpYWxvZ3VlUmF0aW87XG5cdGlmIChkaWFsb2d1ZVJhdGlvID4gYWN0aW9uUmF0aW8pIHtcblx0XHRyZXR1cm4gYCR7Zm9ybWF0VGltZShkdXJhdGlvbil9ICgke01hdGgucm91bmQoZGlhbG9ndWVSYXRpbyAqIDEwMCkudG9GaXhlZCgwKX0lXFx1MDBhMERpYWxvZ3VlKWA7XG5cdH0gaWYgKGFjdGlvblJhdGlvID4gZGlhbG9ndWVSYXRpbykge1xuXHRcdHJldHVybiBgJHtmb3JtYXRUaW1lKGR1cmF0aW9uKX0gKCR7TWF0aC5yb3VuZChhY3Rpb25SYXRpbyAqIDEwMCkudG9GaXhlZCgwKX0lXFx1MDBhMEFjdGlvbilgO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBgJHtmb3JtYXRUaW1lKGR1cmF0aW9uKX0gKEJhbGFuY2VkXFx1MDBhMEFjdGlvblxcdTAwYTAvXFx1MDBhMERpYWxvZ3VlKWA7XG5cdH1cblxufVxuXG5mdW5jdGlvbiB1cGRhdGVTY2VuZXNUYWJsZShzdGF0czogb2JqZWN0W10pIHtcblx0dXBkYXRlVGFibGUoJ2dyaWQtc2NlbmVzJywgc3RhdHMubWFwKChyb3c6IGFueSkgPT4ge1xuXHRcdGNvbnN0IGRpYWxvZ3VlUmF0aW8gPSByb3cuRGlhbG9ndWVEdXJhdGlvbiAvIHJvdy5EdXJhdGlvbjtcblx0XHRyZXR1cm4ge1xuICAgICAgICAgICAgTmFtZTogcm93Lk5hbWUsXG4gICAgICAgICAgICBDaGFyYWN0ZXJzOiByb3cuQ2hhcmFjdGVycyxcbiAgICAgICAgICAgIFN5bm9wc2lzOiByb3cuU3lub3BzaXMsXG5cdFx0XHREdXJhdGlvbjogZGVzY3JpYmVEdXJhdGlvbihkaWFsb2d1ZVJhdGlvLCByb3cuRHVyYXRpb24pLFxuXHRcdH07XG5cdH0pKTtcblxuXHRjb25zdCBiYWRnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ2c2NvZGUtcGFuZWwtdGFiI3RhYi1zY2VuZXMgPiB2c2NvZGUtYmFkZ2VcIik7XG5cdGlmIChiYWRnZSkgeyBiYWRnZS5pbm5lckhUTUwgPSAnJyArIHN0YXRzLmxlbmd0aDsgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMb2NhdGlvbnNUYWJsZShzdGF0czogb2JqZWN0W10pIHtcblx0dXBkYXRlVGFibGUoJ2dyaWQtbG9jYXRpb25zJywgc3RhdHMubWFwKChyb3c6IGFueSkgPT4gKHtcblx0XHQuLi5yb3csXG5cdFx0RHVyYXRpb246IGZvcm1hdFRpbWUocm93LkR1cmF0aW9uKSxcblx0fSkpKTtcblxuXHRjb25zdCBiYWRnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ2c2NvZGUtcGFuZWwtdGFiI3RhYi1sb2NhdGlvbnMgPiB2c2NvZGUtYmFkZ2VcIik7XG5cdGlmIChiYWRnZSkgeyBiYWRnZS5pbm5lckhUTUwgPSAnJyArIHN0YXRzLmxlbmd0aDsgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVDaGFyYWN0ZXJUYWJsZShzdGF0czoge1trZXk6IHN0cmluZ106IGFueX1bXSkge1xuXHR1cGRhdGVUYWJsZSgnZ3JpZC1jaGFyYWN0ZXJzJywgc3RhdHMubWFwKChyb3c6IHtba2V5OiBzdHJpbmddOiBhbnl9KSA9PiAoe1xuXHRcdFwiTmFtZVwiOiByb3cuTmFtZSxcblx0XHRcIkdlbmRlclwiOiByb3cuR2VuZGVyLnRvVXBwZXJDYXNlKCksXG5cdFx0XCJMZW5ndGggJiBEdXJhdGlvblwiOiBgJHtmb3JtYXRUaW1lKHJvdy5EdXJhdGlvbil9IC0gJHtyb3cuTGluZXN9IGxpbmVzIC0gJHtyb3cuV29yZHN9IHdvcmRzYCxcblx0XHRcIlJlYWRpbmcgQWdlXCI6IHJvdy5SZWFkaW5nQWdlXG5cdH0pKSk7XG5cblx0Y29uc3QgYmFkZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidnNjb2RlLXBhbmVsLXRhYiN0YWItY2hhcmFjdGVycyA+IHZzY29kZS1iYWRnZVwiKTtcblx0aWYgKGJhZGdlKSB7IGJhZGdlLmlubmVySFRNTCA9ICcnICsgc3RhdHMubGVuZ3RoOyB9XG5cblx0bGV0IHRvdGFsRGlhbG9ndWUgPSAwO1xuXHRjb25zdCBkaWFsb2d1ZUJhbGFuY2U6IHtbZ2VuZGVyOiBzdHJpbmddOiBudW1iZXJ9ID0ge307XG5cdGZvciAoY29uc3QgY2hhcmFjdGVyU3RhdHMgb2Ygc3RhdHMpIHtcblx0XHRjb25zdCBjaGFyID0gY2hhcmFjdGVyU3RhdHMgYXMgYW55O1xuXHRcdGRpYWxvZ3VlQmFsYW5jZVtjaGFyLkdlbmRlcl0gPSAoZGlhbG9ndWVCYWxhbmNlW2NoYXIuR2VuZGVyXSB8fCAwKSArIChjaGFyLkR1cmF0aW9uIHx8IDApO1xuXHRcdHRvdGFsRGlhbG9ndWUgKz0gKGNoYXIuRHVyYXRpb24gfHwgMCk7XG5cdH1cblx0Y29uc3Qgb2JzZXJ2YXRpb25zID0gW107XG5cdGZvciAoY29uc3QgZ2VuZGVyIGluIGRpYWxvZ3VlQmFsYW5jZSkge1xuXHRcdG9ic2VydmF0aW9ucy5wdXNoKGAke2dlbmRlcn0gY2hhcmFjdGVycyBzcGVhayBmb3IgJHtmb3JtYXRUaW1lKGRpYWxvZ3VlQmFsYW5jZVtnZW5kZXJdKX0gKCR7TWF0aC5yb3VuZCgxMDAgKiAoZGlhbG9ndWVCYWxhbmNlW2dlbmRlcl0gLyB0b3RhbERpYWxvZ3VlKSl9JSlgKTtcblx0fVxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXJhY3RlcnMtb2JzZXJ2YXRpb25zXCIpIS5pbm5lckhUTUwgPSBvYnNlcnZhdGlvbnMuam9pbihcIjxiciAvPlwiKTtcbn1cblxuZnVuY3Rpb24gb25NZXNzYWdlKGV2OiBNZXNzYWdlRXZlbnQpIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWRlYnVnZ2VyXG5cdGlmIChldi5kYXRhLmNvbW1hbmQgPT0gXCJmb3VudGFpbi5zdGF0aXN0aWNzLmNoYXJhY3RlcnNcIikge1xuXHRcdGZvdW50YWluLnN0YXRpc3RpY3MuY2hhcmFjdGVycyA9IGV2LmRhdGEuc3RhdHM7XG5cdFx0dXBkYXRlQ2hhcmFjdGVyVGFibGUoZm91bnRhaW4uc3RhdGlzdGljcy5jaGFyYWN0ZXJzKTtcblx0fVxuXHRpZiAoZXYuZGF0YS5jb21tYW5kID09IFwiZm91bnRhaW4uc3RhdGlzdGljcy5sb2NhdGlvbnNcIikge1xuXHRcdGZvdW50YWluLnN0YXRpc3RpY3MubG9jYXRpb25zID0gZXYuZGF0YS5zdGF0cztcblx0XHR1cGRhdGVMb2NhdGlvbnNUYWJsZShmb3VudGFpbi5zdGF0aXN0aWNzLmxvY2F0aW9ucyk7XG5cdH1cblx0aWYgKGV2LmRhdGEuY29tbWFuZCA9PSBcImZvdW50YWluLnN0YXRpc3RpY3Muc2NlbmVzXCIpIHtcblx0XHRmb3VudGFpbi5zdGF0aXN0aWNzLnNjZW5lcyA9IGV2LmRhdGEuc3RhdHM7XG5cdFx0dXBkYXRlU2NlbmVzVGFibGUoZm91bnRhaW4uc3RhdGlzdGljcy5zY2VuZXMpO1xuXHR9XG5cblx0aWYgKGV2LmRhdGEuY29tbWFuZCA9PSBcImZvdW50YWluLmFuYWx5c2VMb2NhdGlvblwiKSB7XG5cdFx0Z2V0UGFuZWxzKCkuYWN0aXZlaWQgPSBcInRhYi1sb2NhdGlvbnNcIjtcblx0fVxuXHRpZiAoZXYuZGF0YS5jb21tYW5kID09IFwiZm91bnRhaW4uYW5hbHlzZUNoYXJhY3RlclwiKSB7XG5cdFx0Z2V0UGFuZWxzKCkuYWN0aXZlaWQgPSBcInRhYi1jaGFyYWN0ZXJzXCI7XG5cdH1cblx0aWYgKGV2LmRhdGEuY29tbWFuZCA9PSBcImZvdW50YWluLmFuYWx5c2VTY2VuZVwiKSB7XG5cdFx0Z2V0UGFuZWxzKCkuYWN0aXZlaWQgPSBcInRhYi1zY2VuZXNcIjtcblx0fVxufVxuXG5mdW5jdGlvbiBtYWluKCkge1xuXHRyZXR1cm47XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9