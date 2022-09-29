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
        let gender = char.Gender;
        gender = gender[0].toLocaleUpperCase() + gender.slice(1);
        const duration = char.Duration;
        dialogueBalance[gender] = (dialogueBalance[gender] || 0) + (duration || 0);
        totalDialogue += (duration || 0);
    }
    const genderDonutChart = document.getElementById("characters-gender-dialogue");
    genderDonutChart.setEntries(dialogueBalance);
    genderDonutChart.setFormat((n) => {
        console.log({ n });
        return (0,_formatTime__WEBPACK_IMPORTED_MODULE_0__.formatTime)(n.valueOf());
    });
    // const observations = [];
    // for (const gender in dialogueBalance) {
    // 	observations.push(`${gender} characters speak for ${formatTime(dialogueBalance[gender])} (${Math.round(100 * (dialogueBalance[gender] / totalDialogue))}%)`);
    // }
    // document.getElementById("characters-observations")!.innerHTML = observations.join("<br />");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QU0sQ0FBQyxDQUFDO0tBQzlDO0lBRUQsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSwwQkFBMEIsRUFBRTtRQUNsRCxTQUFTLEVBQUUsQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDO0tBQ3ZDO0lBQ0QsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSwyQkFBMkIsRUFBRTtRQUNuRCxTQUFTLEVBQUUsQ0FBQyxRQUFRLEdBQUcsZ0JBQWdCLENBQUM7S0FDeEM7SUFDRCxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLHVCQUF1QixFQUFFO1FBQy9DLFNBQVMsRUFBRSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUM7S0FDcEM7QUFDRixDQUFDO0FBRUQsU0FBUyxJQUFJO0lBQ1osT0FBTztBQUNSLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWxsby13b3JsZC8uL3NyYy9mb3JtYXRUaW1lLnRzIiwid2VicGFjazovL2hlbGxvLXdvcmxkL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2hlbGxvLXdvcmxkL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9oZWxsby13b3JsZC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2hlbGxvLXdvcmxkL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vaGVsbG8td29ybGQvLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZm9ybWF0VGltZShzZWNvbmRzOiBudW1iZXIpIHtcblx0Y29uc3QgaCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuXHRjb25zdCBtID0gTWF0aC5mbG9vcigoc2Vjb25kcyAlIDM2MDApIC8gNjApO1xuXHRjb25zdCBzID0gTWF0aC5yb3VuZChzZWNvbmRzICUgNjApO1xuXHRyZXR1cm4gW1xuXHRcdGgsXG5cdFx0bSA+IDkgPyBtIDogKGggPyAnMCcgKyBtIDogbSB8fCAnMCcpLFxuXHRcdHMgPiA5ID8gcyA6ICcwJyArIHNcblx0XS5maWx0ZXIoQm9vbGVhbikuam9pbignOicpO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBmb3JtYXRUaW1lIH0gZnJvbSAnLi9mb3JtYXRUaW1lJztcblxuY29uc3QgZm91bnRhaW4gPSB7XG5cdHNlbGVjdGlvbnM6IHt9IGFzIHsgW2tleTogc3RyaW5nXTogYW55IH0sXG5cdHN0YXRpc3RpY3M6IHtcblx0XHRjaGFyYWN0ZXJzOiBbXSxcblx0XHRsb2NhdGlvbnM6IFtdLFxuXHRcdHNjZW5lczogW11cblx0fVxufTtcblxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbWFpbik7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgb25NZXNzYWdlKTtcblxuZnVuY3Rpb24gZ2V0UGFuZWxzKGlkID0gXCJyb290LXBhbmVsXCIpIHtcblx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdC1wYW5lbFwiKSBhcyB1bmtub3duIGFzIHsgYWN0aXZlaWQ6IHN0cmluZyB9O1xufVxuXG5mdW5jdGlvbiBnZXREYXRhR3JpZChpZDogc3RyaW5nKSB7XG5cdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgYXMgSFRNTEVsZW1lbnQgJiB7IHJvd3NEYXRhOiBvYmplY3RbXSB9O1xufVxuXG5mdW5jdGlvbiBvblNlbGVjdGlvbkNoYW5nZWQobmFtZTogc3RyaW5nLCBpOiBudW1iZXIsIHJvd0RhdGE6IG9iamVjdFtdKSB7XG5cdGNvbnN0IGNoYXJhY3RlcnNQYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ2c2NvZGUtcGFuZWwtdmlldyN2aWV3LWNoYXJhY3RlcnNcIik7XG5cdGlmIChjaGFyYWN0ZXJzUGFuZWwpIHtcblx0XHRjaGFyYWN0ZXJzUGFuZWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoM1wiKVswXS5pbm5lckhUTUwgPSBmb3VudGFpbi5zZWxlY3Rpb25zW25hbWVdLk5hbWU7XG5cdH1cbn1cblxuZnVuY3Rpb24gb25Sb3dFbGVtZW50Q2xpY2tlZChuYW1lOiBzdHJpbmcsIGk6IG51bWJlciwgcm93RGF0YTogb2JqZWN0W10pIHtcblx0cmV0dXJuIChldnQ6IEV2ZW50KSA9PiB7XG5cdFx0Zm91bnRhaW4uc2VsZWN0aW9uc1tuYW1lXSA9IHJvd0RhdGFbaSAtIDFdO1xuXHRcdG9uU2VsZWN0aW9uQ2hhbmdlZChuYW1lLCBpLCByb3dEYXRhKTtcblx0fTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVGFibGUobmFtZTogc3RyaW5nLCByb3dEYXRhOiBvYmplY3RbXSkge1xuXHRjb25zdCBkYXRhR3JpZCA9IGdldERhdGFHcmlkKG5hbWUpO1xuXHRkYXRhR3JpZC5yb3dzRGF0YSA9IHJvd0RhdGE7XG5cdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdGNvbnN0IHJvd0VsZW1lbnRzID0gZGF0YUdyaWQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ2c2NvZGUtZGF0YS1ncmlkLXJvd1wiKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJvd0VsZW1lbnRzLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRjb25zdCBlbGVtZW50ID0gcm93RWxlbWVudHNbaV07XG5cdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBvblJvd0VsZW1lbnRDbGlja2VkKG5hbWUsIGksIHJvd0RhdGEpKTtcblx0XHR9XG5cdH0sIDEpO1xufVxuXG5mdW5jdGlvbiBkZXNjcmliZUR1cmF0aW9uKGRpYWxvZ3VlQWN0aW9uUmF0aW86IG51bWJlciwgZHVyYXRpb24gOiBudW1iZXIpIHtcblx0Y29uc3QgZGlhbG9ndWVSYXRpbyA9IGRpYWxvZ3VlQWN0aW9uUmF0aW87XG5cdGNvbnN0IGFjdGlvblJhdGlvID0gMSAtIGRpYWxvZ3VlUmF0aW87XG5cdGlmIChkaWFsb2d1ZVJhdGlvID4gYWN0aW9uUmF0aW8pIHtcblx0XHRyZXR1cm4gYCR7Zm9ybWF0VGltZShkdXJhdGlvbil9ICgke01hdGgucm91bmQoZGlhbG9ndWVSYXRpbyAqIDEwMCkudG9GaXhlZCgwKX0lXFx1MDBhMERpYWxvZ3VlKWA7XG5cdH0gaWYgKGFjdGlvblJhdGlvID4gZGlhbG9ndWVSYXRpbykge1xuXHRcdHJldHVybiBgJHtmb3JtYXRUaW1lKGR1cmF0aW9uKX0gKCR7TWF0aC5yb3VuZChhY3Rpb25SYXRpbyAqIDEwMCkudG9GaXhlZCgwKX0lXFx1MDBhMEFjdGlvbilgO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBgJHtmb3JtYXRUaW1lKGR1cmF0aW9uKX0gKEJhbGFuY2VkXFx1MDBhMEFjdGlvblxcdTAwYTAvXFx1MDBhMERpYWxvZ3VlKWA7XG5cdH1cblxufVxuXG5mdW5jdGlvbiB1cGRhdGVTY2VuZXNUYWJsZShzdGF0czogb2JqZWN0W10pIHtcblx0dXBkYXRlVGFibGUoJ2dyaWQtc2NlbmVzJywgc3RhdHMubWFwKChyb3c6IGFueSkgPT4ge1xuXHRcdGNvbnN0IGRpYWxvZ3VlUmF0aW8gPSByb3cuRGlhbG9ndWVEdXJhdGlvbiAvIHJvdy5EdXJhdGlvbjtcblx0XHRyZXR1cm4ge1xuICAgICAgICAgICAgTmFtZTogcm93Lk5hbWUsXG4gICAgICAgICAgICBDaGFyYWN0ZXJzOiByb3cuQ2hhcmFjdGVycyxcbiAgICAgICAgICAgIFN5bm9wc2lzOiByb3cuU3lub3BzaXMsXG5cdFx0XHREdXJhdGlvbjogZGVzY3JpYmVEdXJhdGlvbihkaWFsb2d1ZVJhdGlvLCByb3cuRHVyYXRpb24pLFxuXHRcdH07XG5cdH0pKTtcblxuXHRjb25zdCBiYWRnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ2c2NvZGUtcGFuZWwtdGFiI3RhYi1zY2VuZXMgPiB2c2NvZGUtYmFkZ2VcIik7XG5cdGlmIChiYWRnZSkgeyBiYWRnZS5pbm5lckhUTUwgPSAnJyArIHN0YXRzLmxlbmd0aDsgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMb2NhdGlvbnNUYWJsZShzdGF0czogb2JqZWN0W10pIHtcblx0dXBkYXRlVGFibGUoJ2dyaWQtbG9jYXRpb25zJywgc3RhdHMubWFwKChyb3c6IGFueSkgPT4gKHtcblx0XHQuLi5yb3csXG5cdFx0RHVyYXRpb246IGZvcm1hdFRpbWUocm93LkR1cmF0aW9uKSxcblx0fSkpKTtcblxuXHRjb25zdCBiYWRnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ2c2NvZGUtcGFuZWwtdGFiI3RhYi1sb2NhdGlvbnMgPiB2c2NvZGUtYmFkZ2VcIik7XG5cdGlmIChiYWRnZSkgeyBiYWRnZS5pbm5lckhUTUwgPSAnJyArIHN0YXRzLmxlbmd0aDsgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVDaGFyYWN0ZXJUYWJsZShzdGF0czoge1trZXk6IHN0cmluZ106IGFueX1bXSkge1xuXHR1cGRhdGVUYWJsZSgnZ3JpZC1jaGFyYWN0ZXJzJywgc3RhdHMubWFwKChyb3c6IHtba2V5OiBzdHJpbmddOiBhbnl9KSA9PiAoe1xuXHRcdFwiTmFtZVwiOiByb3cuTmFtZSxcblx0XHRcIkdlbmRlclwiOiByb3cuR2VuZGVyLnRvVXBwZXJDYXNlKCksXG5cdFx0XCJMZW5ndGggJiBEdXJhdGlvblwiOiBgJHtmb3JtYXRUaW1lKHJvdy5EdXJhdGlvbil9IC0gJHtyb3cuTGluZXN9IGxpbmVzIC0gJHtyb3cuV29yZHN9IHdvcmRzYCxcblx0XHRcIlJlYWRpbmcgQWdlXCI6IHJvdy5SZWFkaW5nQWdlXG5cdH0pKSk7XG5cblx0Y29uc3QgYmFkZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidnNjb2RlLXBhbmVsLXRhYiN0YWItY2hhcmFjdGVycyA+IHZzY29kZS1iYWRnZVwiKTtcblx0aWYgKGJhZGdlKSB7IGJhZGdlLmlubmVySFRNTCA9ICcnICsgc3RhdHMubGVuZ3RoOyB9XG5cblx0bGV0IHRvdGFsRGlhbG9ndWUgPSAwO1xuXHRjb25zdCBkaWFsb2d1ZUJhbGFuY2U6IHtbZ2VuZGVyOiBzdHJpbmddOiBudW1iZXJ9ID0ge307XG5cdGZvciAoY29uc3QgY2hhcmFjdGVyU3RhdHMgb2Ygc3RhdHMpIHtcblx0XHRjb25zdCBjaGFyID0gY2hhcmFjdGVyU3RhdHMgYXMgYW55O1xuXHRcdGxldCBnZW5kZXIgPSBjaGFyLkdlbmRlciBhcyBzdHJpbmc7XG5cdFx0Z2VuZGVyID0gZ2VuZGVyWzBdLnRvTG9jYWxlVXBwZXJDYXNlKCkgKyBnZW5kZXIuc2xpY2UoMSk7XG5cblx0XHRjb25zdCBkdXJhdGlvbiA9IGNoYXIuRHVyYXRpb24gYXMgbnVtYmVyO1xuXG5cdFx0ZGlhbG9ndWVCYWxhbmNlW2dlbmRlcl0gPSAoZGlhbG9ndWVCYWxhbmNlW2dlbmRlcl0gfHwgMCkgKyAoZHVyYXRpb24gfHwgMCk7XG5cdFx0dG90YWxEaWFsb2d1ZSArPSAoZHVyYXRpb24gfHwgMCk7XG5cdH1cblxuXHRjb25zdCBnZW5kZXJEb251dENoYXJ0ID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhcmFjdGVycy1nZW5kZXItZGlhbG9ndWVcIikgYXMgYW55KTtcblx0Z2VuZGVyRG9udXRDaGFydC5zZXRFbnRyaWVzKGRpYWxvZ3VlQmFsYW5jZSk7XG5cdGdlbmRlckRvbnV0Q2hhcnQuc2V0Rm9ybWF0KChuOiBudW1iZXIgfCB7IHZhbHVlT2YoKTogbnVtYmVyOyB9KSA9PiB7XG5cdFx0Y29uc29sZS5sb2coe259KTtcblx0XHRyZXR1cm4gZm9ybWF0VGltZShuLnZhbHVlT2YoKSk7XG5cdH0pO1xuXHQvLyBjb25zdCBvYnNlcnZhdGlvbnMgPSBbXTtcblx0Ly8gZm9yIChjb25zdCBnZW5kZXIgaW4gZGlhbG9ndWVCYWxhbmNlKSB7XG5cdC8vIFx0b2JzZXJ2YXRpb25zLnB1c2goYCR7Z2VuZGVyfSBjaGFyYWN0ZXJzIHNwZWFrIGZvciAke2Zvcm1hdFRpbWUoZGlhbG9ndWVCYWxhbmNlW2dlbmRlcl0pfSAoJHtNYXRoLnJvdW5kKDEwMCAqIChkaWFsb2d1ZUJhbGFuY2VbZ2VuZGVyXSAvIHRvdGFsRGlhbG9ndWUpKX0lKWApO1xuXHQvLyB9XG5cdC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhcmFjdGVycy1vYnNlcnZhdGlvbnNcIikhLmlubmVySFRNTCA9IG9ic2VydmF0aW9ucy5qb2luKFwiPGJyIC8+XCIpO1xufVxuXG5mdW5jdGlvbiBvbk1lc3NhZ2UoZXY6IE1lc3NhZ2VFdmVudCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZGVidWdnZXJcblx0aWYgKGV2LmRhdGEuY29tbWFuZCA9PSBcImZvdW50YWluLnN0YXRpc3RpY3MuY2hhcmFjdGVyc1wiKSB7XG5cdFx0Zm91bnRhaW4uc3RhdGlzdGljcy5jaGFyYWN0ZXJzID0gZXYuZGF0YS5zdGF0cztcblx0XHR1cGRhdGVDaGFyYWN0ZXJUYWJsZShmb3VudGFpbi5zdGF0aXN0aWNzLmNoYXJhY3RlcnMpO1xuXHR9XG5cdGlmIChldi5kYXRhLmNvbW1hbmQgPT0gXCJmb3VudGFpbi5zdGF0aXN0aWNzLmxvY2F0aW9uc1wiKSB7XG5cdFx0Zm91bnRhaW4uc3RhdGlzdGljcy5sb2NhdGlvbnMgPSBldi5kYXRhLnN0YXRzO1xuXHRcdHVwZGF0ZUxvY2F0aW9uc1RhYmxlKGZvdW50YWluLnN0YXRpc3RpY3MubG9jYXRpb25zKTtcblx0fVxuXHRpZiAoZXYuZGF0YS5jb21tYW5kID09IFwiZm91bnRhaW4uc3RhdGlzdGljcy5zY2VuZXNcIikge1xuXHRcdGZvdW50YWluLnN0YXRpc3RpY3Muc2NlbmVzID0gZXYuZGF0YS5zdGF0cztcblx0XHR1cGRhdGVTY2VuZXNUYWJsZShmb3VudGFpbi5zdGF0aXN0aWNzLnNjZW5lcyk7XG5cdH1cblxuXHRpZiAoZXYuZGF0YS5jb21tYW5kID09IFwiZm91bnRhaW4uYW5hbHlzZUxvY2F0aW9uXCIpIHtcblx0XHRnZXRQYW5lbHMoKS5hY3RpdmVpZCA9IFwidGFiLWxvY2F0aW9uc1wiO1xuXHR9XG5cdGlmIChldi5kYXRhLmNvbW1hbmQgPT0gXCJmb3VudGFpbi5hbmFseXNlQ2hhcmFjdGVyXCIpIHtcblx0XHRnZXRQYW5lbHMoKS5hY3RpdmVpZCA9IFwidGFiLWNoYXJhY3RlcnNcIjtcblx0fVxuXHRpZiAoZXYuZGF0YS5jb21tYW5kID09IFwiZm91bnRhaW4uYW5hbHlzZVNjZW5lXCIpIHtcblx0XHRnZXRQYW5lbHMoKS5hY3RpdmVpZCA9IFwidGFiLXNjZW5lc1wiO1xuXHR9XG59XG5cbmZ1bmN0aW9uIG1haW4oKSB7XG5cdHJldHVybjtcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=