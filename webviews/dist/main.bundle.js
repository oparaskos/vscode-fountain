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
            Sentiment: sentimentToEmoji(row.Sentiment)
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
function sentimentToEmoji(sentiment) {
    if (sentiment !== 0 && !sentiment)
        return '∅';
    const emojiIndex = Math.max(-5, Math.min(5, Math.round(sentiment))) + 5;
    // Sentimenent is only guessing at good/bad not the difference between angry/sad so this is just a rough 'how good/bad does this character feel at this moment'.
    const emoji = ['🤬', '😫', '😣', '🙁', '😕', '😐', '😏', '🙂', '😀', '😃', '😆'];
    return `${emoji[emojiIndex] || emoji[5]} (${sentiment.toFixed(1)})`;
}
function updateCharacterTable(stats) {
    updateTable('grid-characters', stats.map((row) => ({
        "Name": row.Name,
        "Gender": row.Gender.toUpperCase(),
        "Length & Duration": `${(0,_formatTime__WEBPACK_IMPORTED_MODULE_0__.formatTime)(row.Duration)} - ${row.Lines} lines - ${row.Words} words`,
        "Reading Age": row.ReadingAge,
        "Sentiment": sentimentToEmoji(row.Sentiment)
    })));
    const badge = document.querySelector("vscode-panel-tab#tab-characters > vscode-badge");
    if (badge) {
        badge.innerHTML = '' + stats.length;
    }
    const { dialogueBalance, readingAgeByGender, numSpeakingRolesByGender, sentimentByGender } = generateCharacterStats(stats);
    const genderDonutChart = document.getElementById("characters-gender-dialogue");
    genderDonutChart.setEntries(dialogueBalance);
    genderDonutChart.setFormat((n) => (0,_formatTime__WEBPACK_IMPORTED_MODULE_0__.formatTime)(n.valueOf()));
    const genderBarChart = document.getElementById("characters-gender-readingAge");
    genderBarChart.setEntries(Object.keys(readingAgeByGender).map(label => ({ label, value: readingAgeByGender[label] })));
    const speakingRolesBarChart = document.getElementById("characters-speaking-roles-by-gender");
    speakingRolesBarChart.setEntries(Object.keys(numSpeakingRolesByGender).map(label => ({ label, value: numSpeakingRolesByGender[label] })));
    const sentimentByGenderBarChart = document.getElementById("characters-sentiment-by-gender");
    sentimentByGenderBarChart.setEntries(Object.keys(sentimentByGender).map(label => ({ label, value: sentimentByGender[label] })));
}
function generateCharacterStats(stats) {
    let totalDialogue = 0;
    const dialogueBalance = {};
    const readingAgeByGender = {};
    const numSpeakingRolesByGender = {};
    const sentimentByGender = {};
    for (const characterStats of stats) {
        const char = characterStats;
        const readingAge = char.ReadingAge;
        const duration = char.Duration;
        const sentiment = char.Sentiment;
        let gender = char.Gender;
        gender = gender[0].toLocaleUpperCase() + gender.slice(1);
        dialogueBalance[gender] = (dialogueBalance[gender] || 0) + (duration || 0);
        totalDialogue += (duration || 0);
        const numChars = numSpeakingRolesByGender[gender] || 0;
        const averageReadingAge = readingAgeByGender[gender] || 0;
        const averageSentiment = sentimentByGender[gender] || 0;
        const newAverageReadingAge = ((averageReadingAge * numChars) + readingAge) / (numChars + 1);
        readingAgeByGender[gender] = newAverageReadingAge;
        numSpeakingRolesByGender[gender] = numChars + 1;
        sentimentByGender[gender] = ((averageSentiment * numChars) + sentiment) / (numChars + 1);
    }
    return { dialogueBalance, readingAgeByGender, numSpeakingRolesByGender, sentimentByGender };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFJLENBQUMsS0FBSyxDQUFDO1FBQzlDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDcEQ7SUFDRCxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLDRCQUE0QixFQUFFO1FBQ3BELFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzNDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDOUM7SUFFRCxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLDBCQUEwQixFQUFFO1FBQ2xELFNBQVMsRUFBRSxDQUFDLFFBQVEsR0FBRyxlQUFlLENBQUM7S0FDdkM7SUFDRCxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLDJCQUEyQixFQUFFO1FBQ25ELFNBQVMsRUFBRSxDQUFDLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQztLQUN4QztJQUNELElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksdUJBQXVCLEVBQUU7UUFDL0MsU0FBUyxFQUFFLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQztLQUNwQztBQUNGLENBQUM7QUFFRCxTQUFTLElBQUk7SUFDWixPQUFPO0FBQ1IsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2hlbGxvLXdvcmxkLy4vc3JjL2Zvcm1hdFRpbWUudHMiLCJ3ZWJwYWNrOi8vaGVsbG8td29ybGQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vaGVsbG8td29ybGQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2hlbGxvLXdvcmxkL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vaGVsbG8td29ybGQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9oZWxsby13b3JsZC8uL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBmb3JtYXRUaW1lKHNlY29uZHM6IG51bWJlcikge1xuXHRjb25zdCBoID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gMzYwMCk7XG5cdGNvbnN0IG0gPSBNYXRoLmZsb29yKChzZWNvbmRzICUgMzYwMCkgLyA2MCk7XG5cdGNvbnN0IHMgPSBNYXRoLnJvdW5kKHNlY29uZHMgJSA2MCk7XG5cdHJldHVybiBbXG5cdFx0aCxcblx0XHRtID4gOSA/IG0gOiAoaCA/ICcwJyArIG0gOiBtIHx8ICcwJyksXG5cdFx0cyA+IDkgPyBzIDogJzAnICsgc1xuXHRdLmZpbHRlcihCb29sZWFuKS5qb2luKCc6Jyk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGZvcm1hdFRpbWUgfSBmcm9tICcuL2Zvcm1hdFRpbWUnO1xuXG5jb25zdCBmb3VudGFpbiA9IHtcblx0c2VsZWN0aW9uczoge30gYXMgeyBba2V5OiBzdHJpbmddOiBhbnkgfSxcblx0c3RhdGlzdGljczoge1xuXHRcdGNoYXJhY3RlcnM6IFtdLFxuXHRcdGxvY2F0aW9uczogW10sXG5cdFx0c2NlbmVzOiBbXVxuXHR9XG59O1xuXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBtYWluKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBvbk1lc3NhZ2UpO1xuXG5mdW5jdGlvbiBnZXRQYW5lbHMoaWQgPSBcInJvb3QtcGFuZWxcIikge1xuXHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290LXBhbmVsXCIpIGFzIHVua25vd24gYXMgeyBhY3RpdmVpZDogc3RyaW5nIH07XG59XG5cbmZ1bmN0aW9uIGdldERhdGFHcmlkKGlkOiBzdHJpbmcpIHtcblx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBhcyBIVE1MRWxlbWVudCAmIHsgcm93c0RhdGE6IG9iamVjdFtdIH07XG59XG5cbmZ1bmN0aW9uIG9uU2VsZWN0aW9uQ2hhbmdlZChuYW1lOiBzdHJpbmcsIGk6IG51bWJlciwgcm93RGF0YTogb2JqZWN0W10pIHtcblx0Y29uc3QgY2hhcmFjdGVyc1BhbmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInZzY29kZS1wYW5lbC12aWV3I3ZpZXctY2hhcmFjdGVyc1wiKTtcblx0aWYgKGNoYXJhY3RlcnNQYW5lbCkge1xuXHRcdGNoYXJhY3RlcnNQYW5lbC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImgzXCIpWzBdLmlubmVySFRNTCA9IGZvdW50YWluLnNlbGVjdGlvbnNbbmFtZV0uTmFtZTtcblx0fVxufVxuXG5mdW5jdGlvbiBvblJvd0VsZW1lbnRDbGlja2VkKG5hbWU6IHN0cmluZywgaTogbnVtYmVyLCByb3dEYXRhOiBvYmplY3RbXSkge1xuXHRyZXR1cm4gKGV2dDogRXZlbnQpID0+IHtcblx0XHRmb3VudGFpbi5zZWxlY3Rpb25zW25hbWVdID0gcm93RGF0YVtpIC0gMV07XG5cdFx0b25TZWxlY3Rpb25DaGFuZ2VkKG5hbWUsIGksIHJvd0RhdGEpO1xuXHR9O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUYWJsZShuYW1lOiBzdHJpbmcsIHJvd0RhdGE6IG9iamVjdFtdKSB7XG5cdGNvbnN0IGRhdGFHcmlkID0gZ2V0RGF0YUdyaWQobmFtZSk7XG5cdGRhdGFHcmlkLnJvd3NEYXRhID0gcm93RGF0YTtcblx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0Y29uc3Qgcm93RWxlbWVudHMgPSBkYXRhR3JpZC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInZzY29kZS1kYXRhLWdyaWQtcm93XCIpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcm93RWxlbWVudHMubGVuZ3RoOyArK2kpIHtcblx0XHRcdGNvbnN0IGVsZW1lbnQgPSByb3dFbGVtZW50c1tpXTtcblx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG9uUm93RWxlbWVudENsaWNrZWQobmFtZSwgaSwgcm93RGF0YSkpO1xuXHRcdH1cblx0fSwgMSk7XG59XG5cbmZ1bmN0aW9uIGRlc2NyaWJlRHVyYXRpb24oZGlhbG9ndWVBY3Rpb25SYXRpbzogbnVtYmVyLCBkdXJhdGlvbiA6IG51bWJlcikge1xuXHRjb25zdCBkaWFsb2d1ZVJhdGlvID0gZGlhbG9ndWVBY3Rpb25SYXRpbztcblx0Y29uc3QgYWN0aW9uUmF0aW8gPSAxIC0gZGlhbG9ndWVSYXRpbztcblx0aWYgKGRpYWxvZ3VlUmF0aW8gPiBhY3Rpb25SYXRpbykge1xuXHRcdHJldHVybiBgJHtmb3JtYXRUaW1lKGR1cmF0aW9uKX0gKCR7TWF0aC5yb3VuZChkaWFsb2d1ZVJhdGlvICogMTAwKS50b0ZpeGVkKDApfSVcXHUwMGEwRGlhbG9ndWUpYDtcblx0fSBpZiAoYWN0aW9uUmF0aW8gPiBkaWFsb2d1ZVJhdGlvKSB7XG5cdFx0cmV0dXJuIGAke2Zvcm1hdFRpbWUoZHVyYXRpb24pfSAoJHtNYXRoLnJvdW5kKGFjdGlvblJhdGlvICogMTAwKS50b0ZpeGVkKDApfSVcXHUwMGEwQWN0aW9uKWA7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGAke2Zvcm1hdFRpbWUoZHVyYXRpb24pfSAoQmFsYW5jZWRcXHUwMGEwQWN0aW9uXFx1MDBhMC9cXHUwMGEwRGlhbG9ndWUpYDtcblx0fVxuXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVNjZW5lc1RhYmxlKHN0YXRzOiBvYmplY3RbXSkge1xuXHR1cGRhdGVUYWJsZSgnZ3JpZC1zY2VuZXMnLCBzdGF0cy5tYXAoKHJvdzogYW55KSA9PiB7XG5cdFx0Y29uc3QgZGlhbG9ndWVSYXRpbyA9IHJvdy5EaWFsb2d1ZUR1cmF0aW9uIC8gcm93LkR1cmF0aW9uO1xuXHRcdHJldHVybiB7XG4gICAgICAgICAgICBOYW1lOiByb3cuTmFtZSxcbiAgICAgICAgICAgIENoYXJhY3RlcnM6IHJvdy5DaGFyYWN0ZXJzLFxuICAgICAgICAgICAgU3lub3BzaXM6IHJvdy5TeW5vcHNpcyxcblx0XHRcdER1cmF0aW9uOiBkZXNjcmliZUR1cmF0aW9uKGRpYWxvZ3VlUmF0aW8sIHJvdy5EdXJhdGlvbiksXG5cdFx0XHRTZW50aW1lbnQ6IHNlbnRpbWVudFRvRW1vamkocm93LlNlbnRpbWVudClcblx0XHR9O1xuXHR9KSk7XG5cblx0Y29uc3QgYmFkZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidnNjb2RlLXBhbmVsLXRhYiN0YWItc2NlbmVzID4gdnNjb2RlLWJhZGdlXCIpO1xuXHRpZiAoYmFkZ2UpIHsgYmFkZ2UuaW5uZXJIVE1MID0gJycgKyBzdGF0cy5sZW5ndGg7IH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTG9jYXRpb25zVGFibGUoc3RhdHM6IG9iamVjdFtdKSB7XG5cdHVwZGF0ZVRhYmxlKCdncmlkLWxvY2F0aW9ucycsIHN0YXRzLm1hcCgocm93OiBhbnkpID0+ICh7XG5cdFx0Li4ucm93LFxuXHRcdER1cmF0aW9uOiBmb3JtYXRUaW1lKHJvdy5EdXJhdGlvbiksXG5cdH0pKSk7XG5cblx0Y29uc3QgYmFkZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidnNjb2RlLXBhbmVsLXRhYiN0YWItbG9jYXRpb25zID4gdnNjb2RlLWJhZGdlXCIpO1xuXHRpZiAoYmFkZ2UpIHsgYmFkZ2UuaW5uZXJIVE1MID0gJycgKyBzdGF0cy5sZW5ndGg7IH1cbn1cblxuZnVuY3Rpb24gc2VudGltZW50VG9FbW9qaShzZW50aW1lbnQ6IG51bWJlciB8IG51bGwpIHtcblx0aWYoc2VudGltZW50ICE9PSAwICYmICFzZW50aW1lbnQpIHJldHVybiAn4oiFJztcblxuXHRjb25zdCBlbW9qaUluZGV4ID0gTWF0aC5tYXgoLTUsIE1hdGgubWluKDUsIE1hdGgucm91bmQoc2VudGltZW50KSkpICsgNTtcblx0Ly8gU2VudGltZW5lbnQgaXMgb25seSBndWVzc2luZyBhdCBnb29kL2JhZCBub3QgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBhbmdyeS9zYWQgc28gdGhpcyBpcyBqdXN0IGEgcm91Z2ggJ2hvdyBnb29kL2JhZCBkb2VzIHRoaXMgY2hhcmFjdGVyIGZlZWwgYXQgdGhpcyBtb21lbnQnLlxuXHRjb25zdCBlbW9qaSA9IFsn8J+krCcsICfwn5irJywgJ/CfmKMnLCAn8J+ZgScsICfwn5iVJywgJ/CfmJAnLCAn8J+YjycsICfwn5mCJywgJ/CfmIAnLCAn8J+YgycsICfwn5iGJ107XG5cdHJldHVybiBgJHtlbW9qaVtlbW9qaUluZGV4XSB8fCBlbW9qaVs1XX0gKCR7c2VudGltZW50LnRvRml4ZWQoMSl9KWA7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNoYXJhY3RlclRhYmxlKHN0YXRzOiB7W2tleTogc3RyaW5nXTogYW55fVtdKSB7XG5cdHVwZGF0ZVRhYmxlKCdncmlkLWNoYXJhY3RlcnMnLCBzdGF0cy5tYXAoKHJvdzoge1trZXk6IHN0cmluZ106IGFueX0pID0+ICh7XG5cdFx0XCJOYW1lXCI6IHJvdy5OYW1lLFxuXHRcdFwiR2VuZGVyXCI6IHJvdy5HZW5kZXIudG9VcHBlckNhc2UoKSxcblx0XHRcIkxlbmd0aCAmIER1cmF0aW9uXCI6IGAke2Zvcm1hdFRpbWUocm93LkR1cmF0aW9uKX0gLSAke3Jvdy5MaW5lc30gbGluZXMgLSAke3Jvdy5Xb3Jkc30gd29yZHNgLFxuXHRcdFwiUmVhZGluZyBBZ2VcIjogcm93LlJlYWRpbmdBZ2UsXG5cdFx0XCJTZW50aW1lbnRcIjogc2VudGltZW50VG9FbW9qaShyb3cuU2VudGltZW50KVxuXHR9KSkpO1xuXG5cdGNvbnN0IGJhZGdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInZzY29kZS1wYW5lbC10YWIjdGFiLWNoYXJhY3RlcnMgPiB2c2NvZGUtYmFkZ2VcIik7XG5cdGlmIChiYWRnZSkgeyBiYWRnZS5pbm5lckhUTUwgPSAnJyArIHN0YXRzLmxlbmd0aDsgfVxuXG5cdGNvbnN0IHsgZGlhbG9ndWVCYWxhbmNlLCByZWFkaW5nQWdlQnlHZW5kZXIsIG51bVNwZWFraW5nUm9sZXNCeUdlbmRlciwgc2VudGltZW50QnlHZW5kZXIgfSA9IGdlbmVyYXRlQ2hhcmFjdGVyU3RhdHMoc3RhdHMpO1xuXG5cdGNvbnN0IGdlbmRlckRvbnV0Q2hhcnQgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGFyYWN0ZXJzLWdlbmRlci1kaWFsb2d1ZVwiKSBhcyBhbnkpO1xuXHRnZW5kZXJEb251dENoYXJ0LnNldEVudHJpZXMoZGlhbG9ndWVCYWxhbmNlKTtcblx0Z2VuZGVyRG9udXRDaGFydC5zZXRGb3JtYXQoKG46IG51bWJlcikgPT4gZm9ybWF0VGltZShuLnZhbHVlT2YoKSkpO1xuXG5cdGNvbnN0IGdlbmRlckJhckNoYXJ0ID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhcmFjdGVycy1nZW5kZXItcmVhZGluZ0FnZVwiKSBhcyBhbnkpO1xuXHRnZW5kZXJCYXJDaGFydC5zZXRFbnRyaWVzKE9iamVjdC5rZXlzKHJlYWRpbmdBZ2VCeUdlbmRlcikubWFwKGxhYmVsID0+ICh7bGFiZWwsIHZhbHVlOiByZWFkaW5nQWdlQnlHZW5kZXJbbGFiZWxdfSkpKTtcblxuXHRjb25zdCBzcGVha2luZ1JvbGVzQmFyQ2hhcnQgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGFyYWN0ZXJzLXNwZWFraW5nLXJvbGVzLWJ5LWdlbmRlclwiKSBhcyBhbnkpO1xuXHRzcGVha2luZ1JvbGVzQmFyQ2hhcnQuc2V0RW50cmllcyhPYmplY3Qua2V5cyhudW1TcGVha2luZ1JvbGVzQnlHZW5kZXIpLm1hcChsYWJlbCA9PiAoe2xhYmVsLCB2YWx1ZTogbnVtU3BlYWtpbmdSb2xlc0J5R2VuZGVyW2xhYmVsXX0pKSk7XG5cdFxuXHRjb25zdCBzZW50aW1lbnRCeUdlbmRlckJhckNoYXJ0ID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhcmFjdGVycy1zZW50aW1lbnQtYnktZ2VuZGVyXCIpIGFzIGFueSk7XG5cdHNlbnRpbWVudEJ5R2VuZGVyQmFyQ2hhcnQuc2V0RW50cmllcyhPYmplY3Qua2V5cyhzZW50aW1lbnRCeUdlbmRlcikubWFwKGxhYmVsID0+ICh7bGFiZWwsIHZhbHVlOiBzZW50aW1lbnRCeUdlbmRlcltsYWJlbF19KSkpO1xufVxuXG50eXBlIFN0YXRzUmVzdWx0ID0ge1xuXHRkaWFsb2d1ZUJhbGFuY2U6IHsgW2dlbmRlcjogc3RyaW5nXTogbnVtYmVyOyB9O1xuXHRyZWFkaW5nQWdlQnlHZW5kZXI6IHsgW2dlbmRlcjogc3RyaW5nXTogbnVtYmVyOyB9O1xuXHRudW1TcGVha2luZ1JvbGVzQnlHZW5kZXI6IHsgW2dlbmRlcjogc3RyaW5nXTogbnVtYmVyOyB9O1xuXHRzZW50aW1lbnRCeUdlbmRlcjogeyBbZ2VuZGVyOiBzdHJpbmddOiBudW1iZXI7IH0gO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUNoYXJhY3RlclN0YXRzKHN0YXRzOiB7IFtrZXk6IHN0cmluZ106IGFueTsgfVtdKTogU3RhdHNSZXN1bHQge1xuXHRsZXQgdG90YWxEaWFsb2d1ZSA9IDA7XG5cdGNvbnN0IGRpYWxvZ3VlQmFsYW5jZTogeyBbZ2VuZGVyOiBzdHJpbmddOiBudW1iZXI7IH0gPSB7fTtcblx0Y29uc3QgcmVhZGluZ0FnZUJ5R2VuZGVyOiB7IFtnZW5kZXI6IHN0cmluZ106IG51bWJlcjsgfSA9IHt9O1xuXHRjb25zdCBudW1TcGVha2luZ1JvbGVzQnlHZW5kZXI6IHsgW2dlbmRlcjogc3RyaW5nXTogbnVtYmVyOyB9ID0ge307XG5cdGNvbnN0IHNlbnRpbWVudEJ5R2VuZGVyOiB7IFtnZW5kZXI6IHN0cmluZ106IG51bWJlcjsgfSA9IHt9O1xuXHRmb3IgKGNvbnN0IGNoYXJhY3RlclN0YXRzIG9mIHN0YXRzKSB7XG5cdFx0Y29uc3QgY2hhciA9IGNoYXJhY3RlclN0YXRzIGFzIGFueTtcblx0XHRjb25zdCByZWFkaW5nQWdlID0gY2hhci5SZWFkaW5nQWdlIGFzIG51bWJlcjtcblx0XHRjb25zdCBkdXJhdGlvbiA9IGNoYXIuRHVyYXRpb24gYXMgbnVtYmVyO1xuXHRcdGNvbnN0IHNlbnRpbWVudCA9IGNoYXIuU2VudGltZW50IGFzIG51bWJlcjtcblx0XHRsZXQgZ2VuZGVyID0gY2hhci5HZW5kZXIgYXMgc3RyaW5nO1xuXHRcdGdlbmRlciA9IGdlbmRlclswXS50b0xvY2FsZVVwcGVyQ2FzZSgpICsgZ2VuZGVyLnNsaWNlKDEpO1xuXG5cblx0XHRkaWFsb2d1ZUJhbGFuY2VbZ2VuZGVyXSA9IChkaWFsb2d1ZUJhbGFuY2VbZ2VuZGVyXSB8fCAwKSArIChkdXJhdGlvbiB8fCAwKTtcblx0XHR0b3RhbERpYWxvZ3VlICs9IChkdXJhdGlvbiB8fCAwKTtcblxuXHRcdGNvbnN0IG51bUNoYXJzID0gbnVtU3BlYWtpbmdSb2xlc0J5R2VuZGVyW2dlbmRlcl0gfHwgMDtcblx0XHRjb25zdCBhdmVyYWdlUmVhZGluZ0FnZSA9IHJlYWRpbmdBZ2VCeUdlbmRlcltnZW5kZXJdIHx8IDA7XG5cdFx0Y29uc3QgYXZlcmFnZVNlbnRpbWVudCA9IHNlbnRpbWVudEJ5R2VuZGVyW2dlbmRlcl0gfHwgMDtcblx0XHRjb25zdCBuZXdBdmVyYWdlUmVhZGluZ0FnZSA9ICgoYXZlcmFnZVJlYWRpbmdBZ2UgKiBudW1DaGFycykgKyByZWFkaW5nQWdlKSAvIChudW1DaGFycyArIDEpO1xuXHRcdHJlYWRpbmdBZ2VCeUdlbmRlcltnZW5kZXJdID0gbmV3QXZlcmFnZVJlYWRpbmdBZ2U7XG5cdFx0bnVtU3BlYWtpbmdSb2xlc0J5R2VuZGVyW2dlbmRlcl0gPSBudW1DaGFycyArIDE7XG5cdFx0c2VudGltZW50QnlHZW5kZXJbZ2VuZGVyXSA9ICgoYXZlcmFnZVNlbnRpbWVudCAqIG51bUNoYXJzKSArIHNlbnRpbWVudCkgLyAobnVtQ2hhcnMgKyAxKTtcblx0fVxuXHRyZXR1cm4geyBkaWFsb2d1ZUJhbGFuY2UsIHJlYWRpbmdBZ2VCeUdlbmRlciwgbnVtU3BlYWtpbmdSb2xlc0J5R2VuZGVyLCBzZW50aW1lbnRCeUdlbmRlciB9O1xufVxuXG5mdW5jdGlvbiBvbk1lc3NhZ2UoZXY6IE1lc3NhZ2VFdmVudCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZGVidWdnZXJcblx0aWYgKGV2LmRhdGEuY29tbWFuZCA9PSBcImZvdW50YWluLnN0YXRpc3RpY3MuY2hhcmFjdGVyc1wiKSB7XG5cdFx0Zm91bnRhaW4uc3RhdGlzdGljcy5jaGFyYWN0ZXJzID0gZXYuZGF0YS5zdGF0cztcblx0XHR1cGRhdGVDaGFyYWN0ZXJUYWJsZShmb3VudGFpbi5zdGF0aXN0aWNzLmNoYXJhY3RlcnMpO1xuXHR9XG5cdGlmIChldi5kYXRhLmNvbW1hbmQgPT0gXCJmb3VudGFpbi5zdGF0aXN0aWNzLmxvY2F0aW9uc1wiKSB7XG5cdFx0Zm91bnRhaW4uc3RhdGlzdGljcy5sb2NhdGlvbnMgPSBldi5kYXRhLnN0YXRzO1xuXHRcdHVwZGF0ZUxvY2F0aW9uc1RhYmxlKGZvdW50YWluLnN0YXRpc3RpY3MubG9jYXRpb25zKTtcblx0fVxuXHRpZiAoZXYuZGF0YS5jb21tYW5kID09IFwiZm91bnRhaW4uc3RhdGlzdGljcy5zY2VuZXNcIikge1xuXHRcdGZvdW50YWluLnN0YXRpc3RpY3Muc2NlbmVzID0gZXYuZGF0YS5zdGF0cztcblx0XHR1cGRhdGVTY2VuZXNUYWJsZShmb3VudGFpbi5zdGF0aXN0aWNzLnNjZW5lcyk7XG5cdH1cblxuXHRpZiAoZXYuZGF0YS5jb21tYW5kID09IFwiZm91bnRhaW4uYW5hbHlzZUxvY2F0aW9uXCIpIHtcblx0XHRnZXRQYW5lbHMoKS5hY3RpdmVpZCA9IFwidGFiLWxvY2F0aW9uc1wiO1xuXHR9XG5cdGlmIChldi5kYXRhLmNvbW1hbmQgPT0gXCJmb3VudGFpbi5hbmFseXNlQ2hhcmFjdGVyXCIpIHtcblx0XHRnZXRQYW5lbHMoKS5hY3RpdmVpZCA9IFwidGFiLWNoYXJhY3RlcnNcIjtcblx0fVxuXHRpZiAoZXYuZGF0YS5jb21tYW5kID09IFwiZm91bnRhaW4uYW5hbHlzZVNjZW5lXCIpIHtcblx0XHRnZXRQYW5lbHMoKS5hY3RpdmVpZCA9IFwidGFiLXNjZW5lc1wiO1xuXHR9XG59XG5cbmZ1bmN0aW9uIG1haW4oKSB7XG5cdHJldHVybjtcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=