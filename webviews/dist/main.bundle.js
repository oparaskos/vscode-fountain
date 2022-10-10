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


/***/ }),

/***/ "./src/genderRepresentation.ts":
/*!*************************************!*\
  !*** ./src/genderRepresentation.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "showGenderRepresentationStatistics": () => (/* binding */ showGenderRepresentationStatistics)
/* harmony export */ });
/* harmony import */ var _formatTime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./formatTime */ "./src/formatTime.ts");

function showGenderRepresentationStatistics(stats) {
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


/***/ }),

/***/ "./src/racialIdentityRepresentation.ts":
/*!*********************************************!*\
  !*** ./src/racialIdentityRepresentation.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "showRacialIdentityRepresentationStatistics": () => (/* binding */ showRacialIdentityRepresentationStatistics)
/* harmony export */ });
/* harmony import */ var _formatTime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./formatTime */ "./src/formatTime.ts");

function showRacialIdentityRepresentationStatistics(stats) {
    const { durationBy, readingAgeBy, speakingRolesBy, sentimentBy, hasRacialIdentity } = generateRacialIdentityStats(stats);
    const racialIdentityPrompt = document.getElementById("characters-racial-identity-fountainrc");
    racialIdentityPrompt.style.visibility = hasRacialIdentity ? "hidden" : "visible";
    const durationDonutChart = document.getElementById("characters-racial-identity-dialogue");
    const readingAgeBarChart = document.getElementById("characters-racial-identity-readingAge");
    const speakingRolesBarChart = document.getElementById("characters-speaking-roles-by-racial-identity");
    const sentimentBarChart = document.getElementById("characters-sentiment-by-racial-identity");
    document.querySelectorAll('.hide-if-no-racial-identity').forEach((element) => { element.style.display = hasRacialIdentity ? "initial" : "none"; });
    [durationDonutChart, readingAgeBarChart, speakingRolesBarChart, sentimentBarChart].map(element => {
        element.style.visibility = hasRacialIdentity ? "visible" : "hidden";
    });
    if (hasRacialIdentity) {
        durationDonutChart.setEntries(durationBy);
        durationDonutChart.setFormat((n) => (0,_formatTime__WEBPACK_IMPORTED_MODULE_0__.formatTime)(n.valueOf()));
        readingAgeBarChart.setEntries(Object.keys(readingAgeBy).map(label => ({ label, value: readingAgeBy[label] })));
        speakingRolesBarChart.setEntries(Object.keys(speakingRolesBy).map(label => ({ label, value: speakingRolesBy[label] })));
        sentimentBarChart.setEntries(Object.keys(sentimentBy).map(label => ({ label, value: sentimentBy[label] })));
    }
}
function generateRacialIdentityStats(stats) {
    let totalDialogue = 0;
    const durationBy = {};
    const readingAgeBy = {};
    const speakingRolesBy = {};
    const sentimentBy = {};
    let hasRacialIdentity = false;
    for (const characterStats of stats) {
        const char = characterStats;
        const readingAge = char.ReadingAge;
        const duration = char.Duration;
        const sentiment = char.Sentiment;
        let racialIdentity = char.RacialIdentity;
        if (racialIdentity && racialIdentity !== "unknown") {
            console.log({ racialIdentity });
            hasRacialIdentity = true;
        }
        racialIdentity = racialIdentity[0].toLocaleUpperCase() + racialIdentity.slice(1);
        durationBy[racialIdentity] = (durationBy[racialIdentity] || 0) + (duration || 0);
        totalDialogue += (duration || 0);
        const numChars = speakingRolesBy[racialIdentity] || 0;
        const averageReadingAge = readingAgeBy[racialIdentity] || 0;
        const averageSentiment = sentimentBy[racialIdentity] || 0;
        const newAverageReadingAge = ((averageReadingAge * numChars) + readingAge) / (numChars + 1);
        readingAgeBy[racialIdentity] = newAverageReadingAge;
        speakingRolesBy[racialIdentity] = numChars + 1;
        sentimentBy[racialIdentity] = ((averageSentiment * numChars) + sentiment) / (numChars + 1);
    }
    return { durationBy, readingAgeBy, speakingRolesBy, sentimentBy, hasRacialIdentity };
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
/* harmony import */ var _genderRepresentation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./genderRepresentation */ "./src/genderRepresentation.ts");
/* harmony import */ var _racialIdentityRepresentation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./racialIdentityRepresentation */ "./src/racialIdentityRepresentation.ts");



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
    console.log("updateScenesTable");
    document.getElementById("scenes-timeline").setEntries(stats);
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
        "Length & Duration": [
            `${(0,_formatTime__WEBPACK_IMPORTED_MODULE_0__.formatTime)(row.Duration)}`,
            `${row.Lines}\u00a0lines`,
            `${row.Words}\u00a0words`,
            `${row.Monologues}\u00a0monologues`
        ].join('\u00a0\u00ad\u00a0'),
        "Reading Age": row.ReadingAge,
        "Sentiment": sentimentToEmoji(row.Sentiment)
    })));
    const badge = document.querySelector("vscode-panel-tab#tab-characters > vscode-badge");
    if (badge) {
        badge.innerHTML = '' + stats.length;
    }
    (0,_genderRepresentation__WEBPACK_IMPORTED_MODULE_1__.showGenderRepresentationStatistics)(stats);
    (0,_racialIdentityRepresentation__WEBPACK_IMPORTED_MODULE_2__.showRacialIdentityRepresentationStatistics)(stats);
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
    console.log({ scriptStats: fountain.statistics });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUM7S0FDOUM7SUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxVQUFVLEVBQUMsQ0FBQyxDQUFDO0lBRWhELElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksMEJBQTBCLEVBQUU7UUFDbEQsU0FBUyxFQUFFLENBQUMsUUFBUSxHQUFHLGVBQWUsQ0FBQztLQUN2QztJQUNELElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksMkJBQTJCLEVBQUU7UUFDbkQsU0FBUyxFQUFFLENBQUMsUUFBUSxHQUFHLGdCQUFnQixDQUFDO0tBQ3hDO0lBQ0QsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSx1QkFBdUIsRUFBRTtRQUMvQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDO0tBQ3BDO0FBQ0YsQ0FBQztBQUVELFNBQVMsSUFBSTtJQUNaLE9BQU87QUFDUixDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaGVsbG8td29ybGQvLi9zcmMvZm9ybWF0VGltZS50cyIsIndlYnBhY2s6Ly9oZWxsby13b3JsZC8uL3NyYy9nZW5kZXJSZXByZXNlbnRhdGlvbi50cyIsIndlYnBhY2s6Ly9oZWxsby13b3JsZC8uL3NyYy9yYWNpYWxJZGVudGl0eVJlcHJlc2VudGF0aW9uLnRzIiwid2VicGFjazovL2hlbGxvLXdvcmxkL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2hlbGxvLXdvcmxkL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9oZWxsby13b3JsZC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2hlbGxvLXdvcmxkL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vaGVsbG8td29ybGQvLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZm9ybWF0VGltZShzZWNvbmRzOiBudW1iZXIpIHtcblx0Y29uc3QgaCA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDM2MDApO1xuXHRjb25zdCBtID0gTWF0aC5mbG9vcigoc2Vjb25kcyAlIDM2MDApIC8gNjApO1xuXHRjb25zdCBzID0gTWF0aC5yb3VuZChzZWNvbmRzICUgNjApO1xuXHRyZXR1cm4gW1xuXHRcdGgsXG5cdFx0bSA+IDkgPyBtIDogKGggPyAnMCcgKyBtIDogbSB8fCAnMCcpLFxuXHRcdHMgPiA5ID8gcyA6ICcwJyArIHNcblx0XS5maWx0ZXIoQm9vbGVhbikuam9pbignOicpO1xufVxuIiwiaW1wb3J0IHsgZm9ybWF0VGltZSB9IGZyb20gJy4vZm9ybWF0VGltZSc7XG5cbnR5cGUgU3RhdHNSZXN1bHQgPSB7XG5cdGRpYWxvZ3VlQmFsYW5jZTogeyBbZ2VuZGVyOiBzdHJpbmddOiBudW1iZXI7IH07XG5cdHJlYWRpbmdBZ2VCeUdlbmRlcjogeyBbZ2VuZGVyOiBzdHJpbmddOiBudW1iZXI7IH07XG5cdG51bVNwZWFraW5nUm9sZXNCeUdlbmRlcjogeyBbZ2VuZGVyOiBzdHJpbmddOiBudW1iZXI7IH07XG5cdHNlbnRpbWVudEJ5R2VuZGVyOiB7IFtnZW5kZXI6IHN0cmluZ106IG51bWJlcjsgfSA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93R2VuZGVyUmVwcmVzZW50YXRpb25TdGF0aXN0aWNzKHN0YXRzOiB7IFtrZXk6IHN0cmluZ106IGFueTsgfVtdKSB7XG5cdGNvbnN0IHsgZGlhbG9ndWVCYWxhbmNlLCByZWFkaW5nQWdlQnlHZW5kZXIsIG51bVNwZWFraW5nUm9sZXNCeUdlbmRlciwgc2VudGltZW50QnlHZW5kZXIgfSA9IGdlbmVyYXRlQ2hhcmFjdGVyU3RhdHMoc3RhdHMpO1xuXG5cdGNvbnN0IGdlbmRlckRvbnV0Q2hhcnQgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGFyYWN0ZXJzLWdlbmRlci1kaWFsb2d1ZVwiKSBhcyBhbnkpO1xuXHRnZW5kZXJEb251dENoYXJ0LnNldEVudHJpZXMoZGlhbG9ndWVCYWxhbmNlKTtcblx0Z2VuZGVyRG9udXRDaGFydC5zZXRGb3JtYXQoKG46IG51bWJlcikgPT4gZm9ybWF0VGltZShuLnZhbHVlT2YoKSkpO1xuXG5cdGNvbnN0IGdlbmRlckJhckNoYXJ0ID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhcmFjdGVycy1nZW5kZXItcmVhZGluZ0FnZVwiKSBhcyBhbnkpO1xuXHRnZW5kZXJCYXJDaGFydC5zZXRFbnRyaWVzKE9iamVjdC5rZXlzKHJlYWRpbmdBZ2VCeUdlbmRlcikubWFwKGxhYmVsID0+ICh7IGxhYmVsLCB2YWx1ZTogcmVhZGluZ0FnZUJ5R2VuZGVyW2xhYmVsXSB9KSkpO1xuXG5cdGNvbnN0IHNwZWFraW5nUm9sZXNCYXJDaGFydCA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXJhY3RlcnMtc3BlYWtpbmctcm9sZXMtYnktZ2VuZGVyXCIpIGFzIGFueSk7XG5cdHNwZWFraW5nUm9sZXNCYXJDaGFydC5zZXRFbnRyaWVzKE9iamVjdC5rZXlzKG51bVNwZWFraW5nUm9sZXNCeUdlbmRlcikubWFwKGxhYmVsID0+ICh7IGxhYmVsLCB2YWx1ZTogbnVtU3BlYWtpbmdSb2xlc0J5R2VuZGVyW2xhYmVsXSB9KSkpO1xuXG5cdGNvbnN0IHNlbnRpbWVudEJ5R2VuZGVyQmFyQ2hhcnQgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGFyYWN0ZXJzLXNlbnRpbWVudC1ieS1nZW5kZXJcIikgYXMgYW55KTtcblx0c2VudGltZW50QnlHZW5kZXJCYXJDaGFydC5zZXRFbnRyaWVzKE9iamVjdC5rZXlzKHNlbnRpbWVudEJ5R2VuZGVyKS5tYXAobGFiZWwgPT4gKHsgbGFiZWwsIHZhbHVlOiBzZW50aW1lbnRCeUdlbmRlcltsYWJlbF0gfSkpKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVDaGFyYWN0ZXJTdGF0cyhzdGF0czogeyBba2V5OiBzdHJpbmddOiBhbnk7IH1bXSk6IFN0YXRzUmVzdWx0IHtcblx0bGV0IHRvdGFsRGlhbG9ndWUgPSAwO1xuXHRjb25zdCBkaWFsb2d1ZUJhbGFuY2U6IHsgW2dlbmRlcjogc3RyaW5nXTogbnVtYmVyOyB9ID0ge307XG5cdGNvbnN0IHJlYWRpbmdBZ2VCeUdlbmRlcjogeyBbZ2VuZGVyOiBzdHJpbmddOiBudW1iZXI7IH0gPSB7fTtcblx0Y29uc3QgbnVtU3BlYWtpbmdSb2xlc0J5R2VuZGVyOiB7IFtnZW5kZXI6IHN0cmluZ106IG51bWJlcjsgfSA9IHt9O1xuXHRjb25zdCBzZW50aW1lbnRCeUdlbmRlcjogeyBbZ2VuZGVyOiBzdHJpbmddOiBudW1iZXI7IH0gPSB7fTtcblx0Zm9yIChjb25zdCBjaGFyYWN0ZXJTdGF0cyBvZiBzdGF0cykge1xuXHRcdGNvbnN0IGNoYXIgPSBjaGFyYWN0ZXJTdGF0cyBhcyBhbnk7XG5cdFx0Y29uc3QgcmVhZGluZ0FnZSA9IGNoYXIuUmVhZGluZ0FnZSBhcyBudW1iZXI7XG5cdFx0Y29uc3QgZHVyYXRpb24gPSBjaGFyLkR1cmF0aW9uIGFzIG51bWJlcjtcblx0XHRjb25zdCBzZW50aW1lbnQgPSBjaGFyLlNlbnRpbWVudCBhcyBudW1iZXI7XG5cdFx0bGV0IGdlbmRlciA9IGNoYXIuR2VuZGVyIGFzIHN0cmluZztcblx0XHRnZW5kZXIgPSBnZW5kZXJbMF0udG9Mb2NhbGVVcHBlckNhc2UoKSArIGdlbmRlci5zbGljZSgxKTtcblxuXG5cdFx0ZGlhbG9ndWVCYWxhbmNlW2dlbmRlcl0gPSAoZGlhbG9ndWVCYWxhbmNlW2dlbmRlcl0gfHwgMCkgKyAoZHVyYXRpb24gfHwgMCk7XG5cdFx0dG90YWxEaWFsb2d1ZSArPSAoZHVyYXRpb24gfHwgMCk7XG5cblx0XHRjb25zdCBudW1DaGFycyA9IG51bVNwZWFraW5nUm9sZXNCeUdlbmRlcltnZW5kZXJdIHx8IDA7XG5cdFx0Y29uc3QgYXZlcmFnZVJlYWRpbmdBZ2UgPSByZWFkaW5nQWdlQnlHZW5kZXJbZ2VuZGVyXSB8fCAwO1xuXHRcdGNvbnN0IGF2ZXJhZ2VTZW50aW1lbnQgPSBzZW50aW1lbnRCeUdlbmRlcltnZW5kZXJdIHx8IDA7XG5cdFx0Y29uc3QgbmV3QXZlcmFnZVJlYWRpbmdBZ2UgPSAoKGF2ZXJhZ2VSZWFkaW5nQWdlICogbnVtQ2hhcnMpICsgcmVhZGluZ0FnZSkgLyAobnVtQ2hhcnMgKyAxKTtcblx0XHRyZWFkaW5nQWdlQnlHZW5kZXJbZ2VuZGVyXSA9IG5ld0F2ZXJhZ2VSZWFkaW5nQWdlO1xuXHRcdG51bVNwZWFraW5nUm9sZXNCeUdlbmRlcltnZW5kZXJdID0gbnVtQ2hhcnMgKyAxO1xuXHRcdHNlbnRpbWVudEJ5R2VuZGVyW2dlbmRlcl0gPSAoKGF2ZXJhZ2VTZW50aW1lbnQgKiBudW1DaGFycykgKyBzZW50aW1lbnQpIC8gKG51bUNoYXJzICsgMSk7XG5cdH1cblx0cmV0dXJuIHsgZGlhbG9ndWVCYWxhbmNlLCByZWFkaW5nQWdlQnlHZW5kZXIsIG51bVNwZWFraW5nUm9sZXNCeUdlbmRlciwgc2VudGltZW50QnlHZW5kZXIgfTtcbn1cbiIsImltcG9ydCB7IGZvcm1hdFRpbWUgfSBmcm9tICcuL2Zvcm1hdFRpbWUnO1xuXG50eXBlIFN0YXRzUmVzdWx0ID0ge1xuXHRkdXJhdGlvbkJ5OiB7IFtyYWNpYWxJZGVudGl0eTogc3RyaW5nXTogbnVtYmVyOyB9O1xuXHRyZWFkaW5nQWdlQnk6IHsgW3JhY2lhbElkZW50aXR5OiBzdHJpbmddOiBudW1iZXI7IH07XG5cdHNwZWFraW5nUm9sZXNCeTogeyBbcmFjaWFsSWRlbnRpdHk6IHN0cmluZ106IG51bWJlcjsgfTtcblx0c2VudGltZW50Qnk6IHsgW3JhY2lhbElkZW50aXR5OiBzdHJpbmddOiBudW1iZXI7IH0gO1xuXHRoYXNSYWNpYWxJZGVudGl0eTogYm9vbGVhbjtcbn1cblxudHlwZSBDaGFydEVsZW1lbnQgPSB7XG5cdHNldEVudHJpZXM6IChlbnRyaWVzOiBhbnkpID0+IHZvaWQ7XG5cdHNldEZvcm1hdDogKGVudHJpZXM6IGFueSkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dSYWNpYWxJZGVudGl0eVJlcHJlc2VudGF0aW9uU3RhdGlzdGljcyhzdGF0czogeyBba2V5OiBzdHJpbmddOiBhbnk7IH1bXSkge1xuXHRjb25zdCB7IGR1cmF0aW9uQnksIHJlYWRpbmdBZ2VCeSwgc3BlYWtpbmdSb2xlc0J5LCBzZW50aW1lbnRCeSAsIGhhc1JhY2lhbElkZW50aXR5fSA9IGdlbmVyYXRlUmFjaWFsSWRlbnRpdHlTdGF0cyhzdGF0cyk7XG5cblxuXHRjb25zdCByYWNpYWxJZGVudGl0eVByb21wdCA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXJhY3RlcnMtcmFjaWFsLWlkZW50aXR5LWZvdW50YWlucmNcIikgYXMgSFRNTEVsZW1lbnQpO1xuXHRyYWNpYWxJZGVudGl0eVByb21wdC5zdHlsZS52aXNpYmlsaXR5ID0gaGFzUmFjaWFsSWRlbnRpdHkgPyBcImhpZGRlblwiIDogXCJ2aXNpYmxlXCI7XG5cblx0Y29uc3QgZHVyYXRpb25Eb251dENoYXJ0ID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhcmFjdGVycy1yYWNpYWwtaWRlbnRpdHktZGlhbG9ndWVcIikgYXMgSFRNTEVsZW1lbnQgJiBDaGFydEVsZW1lbnQpO1xuXHRjb25zdCByZWFkaW5nQWdlQmFyQ2hhcnQgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGFyYWN0ZXJzLXJhY2lhbC1pZGVudGl0eS1yZWFkaW5nQWdlXCIpIGFzIEhUTUxFbGVtZW50ICYgQ2hhcnRFbGVtZW50KTtcblx0Y29uc3Qgc3BlYWtpbmdSb2xlc0JhckNoYXJ0ID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhcmFjdGVycy1zcGVha2luZy1yb2xlcy1ieS1yYWNpYWwtaWRlbnRpdHlcIikgYXMgSFRNTEVsZW1lbnQgJiBDaGFydEVsZW1lbnQpO1xuXHRjb25zdCBzZW50aW1lbnRCYXJDaGFydCA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXJhY3RlcnMtc2VudGltZW50LWJ5LXJhY2lhbC1pZGVudGl0eVwiKSBhcyBIVE1MRWxlbWVudCAmIENoYXJ0RWxlbWVudCk7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhpZGUtaWYtbm8tcmFjaWFsLWlkZW50aXR5JykuZm9yRWFjaCgoZWxlbWVudCkgPT4geyAoZWxlbWVudCBhcyBIVE1MRWxlbWVudCkuc3R5bGUuZGlzcGxheSA9IGhhc1JhY2lhbElkZW50aXR5ID8gXCJpbml0aWFsXCIgOiBcIm5vbmVcIjsgfSk7XG5cblx0W2R1cmF0aW9uRG9udXRDaGFydCwgcmVhZGluZ0FnZUJhckNoYXJ0LCBzcGVha2luZ1JvbGVzQmFyQ2hhcnQsIHNlbnRpbWVudEJhckNoYXJ0XS5tYXAoZWxlbWVudCA9PiB7XG5cdFx0ZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gaGFzUmFjaWFsSWRlbnRpdHkgPyBcInZpc2libGVcIiA6IFwiaGlkZGVuXCI7XG5cdH0pO1xuXG5cdGlmIChoYXNSYWNpYWxJZGVudGl0eSl7XG5cdFx0ZHVyYXRpb25Eb251dENoYXJ0LnNldEVudHJpZXMoZHVyYXRpb25CeSk7XG5cdFx0ZHVyYXRpb25Eb251dENoYXJ0LnNldEZvcm1hdCgobjogbnVtYmVyKSA9PiBmb3JtYXRUaW1lKG4udmFsdWVPZigpKSk7XG5cdFx0cmVhZGluZ0FnZUJhckNoYXJ0LnNldEVudHJpZXMoT2JqZWN0LmtleXMocmVhZGluZ0FnZUJ5KS5tYXAobGFiZWwgPT4gKHsgbGFiZWwsIHZhbHVlOiByZWFkaW5nQWdlQnlbbGFiZWxdIH0pKSk7XG5cdFx0c3BlYWtpbmdSb2xlc0JhckNoYXJ0LnNldEVudHJpZXMoT2JqZWN0LmtleXMoc3BlYWtpbmdSb2xlc0J5KS5tYXAobGFiZWwgPT4gKHsgbGFiZWwsIHZhbHVlOiBzcGVha2luZ1JvbGVzQnlbbGFiZWxdIH0pKSk7XG5cdFx0c2VudGltZW50QmFyQ2hhcnQuc2V0RW50cmllcyhPYmplY3Qua2V5cyhzZW50aW1lbnRCeSkubWFwKGxhYmVsID0+ICh7IGxhYmVsLCB2YWx1ZTogc2VudGltZW50QnlbbGFiZWxdIH0pKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVSYWNpYWxJZGVudGl0eVN0YXRzKHN0YXRzOiB7IFtrZXk6IHN0cmluZ106IGFueTsgfVtdKTogU3RhdHNSZXN1bHQge1xuXHRsZXQgdG90YWxEaWFsb2d1ZSA9IDA7XG5cdGNvbnN0IGR1cmF0aW9uQnk6IHsgW3JhY2lhbElkZW50aXR5OiBzdHJpbmddOiBudW1iZXI7IH0gPSB7fTtcblx0Y29uc3QgcmVhZGluZ0FnZUJ5OiB7IFtyYWNpYWxJZGVudGl0eTogc3RyaW5nXTogbnVtYmVyOyB9ID0ge307XG5cdGNvbnN0IHNwZWFraW5nUm9sZXNCeTogeyBbcmFjaWFsSWRlbnRpdHk6IHN0cmluZ106IG51bWJlcjsgfSA9IHt9O1xuXHRjb25zdCBzZW50aW1lbnRCeTogeyBbcmFjaWFsSWRlbnRpdHk6IHN0cmluZ106IG51bWJlcjsgfSA9IHt9O1xuXHRsZXQgaGFzUmFjaWFsSWRlbnRpdHkgPSBmYWxzZTtcblx0Zm9yIChjb25zdCBjaGFyYWN0ZXJTdGF0cyBvZiBzdGF0cykge1xuXHRcdGNvbnN0IGNoYXIgPSBjaGFyYWN0ZXJTdGF0cyBhcyBhbnk7XG5cdFx0Y29uc3QgcmVhZGluZ0FnZSA9IGNoYXIuUmVhZGluZ0FnZSBhcyBudW1iZXI7XG5cdFx0Y29uc3QgZHVyYXRpb24gPSBjaGFyLkR1cmF0aW9uIGFzIG51bWJlcjtcblx0XHRjb25zdCBzZW50aW1lbnQgPSBjaGFyLlNlbnRpbWVudCBhcyBudW1iZXI7XG5cdFx0bGV0IHJhY2lhbElkZW50aXR5ID0gY2hhci5SYWNpYWxJZGVudGl0eSBhcyBzdHJpbmc7XG5cdFx0aWYocmFjaWFsSWRlbnRpdHkgJiYgcmFjaWFsSWRlbnRpdHkgIT09IFwidW5rbm93blwiKSB7XG5cdFx0XHRjb25zb2xlLmxvZyh7cmFjaWFsSWRlbnRpdHl9KTtcblx0XHRcdGhhc1JhY2lhbElkZW50aXR5ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRyYWNpYWxJZGVudGl0eSA9IHJhY2lhbElkZW50aXR5WzBdLnRvTG9jYWxlVXBwZXJDYXNlKCkgKyByYWNpYWxJZGVudGl0eS5zbGljZSgxKTtcblxuXHRcdGR1cmF0aW9uQnlbcmFjaWFsSWRlbnRpdHldID0gKGR1cmF0aW9uQnlbcmFjaWFsSWRlbnRpdHldIHx8IDApICsgKGR1cmF0aW9uIHx8IDApO1xuXHRcdHRvdGFsRGlhbG9ndWUgKz0gKGR1cmF0aW9uIHx8IDApO1xuXG5cdFx0Y29uc3QgbnVtQ2hhcnMgPSBzcGVha2luZ1JvbGVzQnlbcmFjaWFsSWRlbnRpdHldIHx8IDA7XG5cdFx0Y29uc3QgYXZlcmFnZVJlYWRpbmdBZ2UgPSByZWFkaW5nQWdlQnlbcmFjaWFsSWRlbnRpdHldIHx8IDA7XG5cdFx0Y29uc3QgYXZlcmFnZVNlbnRpbWVudCA9IHNlbnRpbWVudEJ5W3JhY2lhbElkZW50aXR5XSB8fCAwO1xuXHRcdGNvbnN0IG5ld0F2ZXJhZ2VSZWFkaW5nQWdlID0gKChhdmVyYWdlUmVhZGluZ0FnZSAqIG51bUNoYXJzKSArIHJlYWRpbmdBZ2UpIC8gKG51bUNoYXJzICsgMSk7XG5cdFx0cmVhZGluZ0FnZUJ5W3JhY2lhbElkZW50aXR5XSA9IG5ld0F2ZXJhZ2VSZWFkaW5nQWdlO1xuXHRcdHNwZWFraW5nUm9sZXNCeVtyYWNpYWxJZGVudGl0eV0gPSBudW1DaGFycyArIDE7XG5cdFx0c2VudGltZW50QnlbcmFjaWFsSWRlbnRpdHldID0gKChhdmVyYWdlU2VudGltZW50ICogbnVtQ2hhcnMpICsgc2VudGltZW50KSAvIChudW1DaGFycyArIDEpO1xuXHR9XG5cdHJldHVybiB7IGR1cmF0aW9uQnksIHJlYWRpbmdBZ2VCeSwgc3BlYWtpbmdSb2xlc0J5LCBzZW50aW1lbnRCeSwgaGFzUmFjaWFsSWRlbnRpdHkgfTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgZm9ybWF0VGltZSB9IGZyb20gJy4vZm9ybWF0VGltZSc7XG5pbXBvcnQgeyBzaG93R2VuZGVyUmVwcmVzZW50YXRpb25TdGF0aXN0aWNzIH0gZnJvbSAnLi9nZW5kZXJSZXByZXNlbnRhdGlvbic7XG5pbXBvcnQgeyBzaG93UmFjaWFsSWRlbnRpdHlSZXByZXNlbnRhdGlvblN0YXRpc3RpY3MgfSBmcm9tICcuL3JhY2lhbElkZW50aXR5UmVwcmVzZW50YXRpb24nO1xuXG5jb25zdCBmb3VudGFpbiA9IHtcblx0c2VsZWN0aW9uczoge30gYXMgeyBba2V5OiBzdHJpbmddOiBhbnkgfSxcblx0c3RhdGlzdGljczoge1xuXHRcdGNoYXJhY3RlcnM6IFtdLFxuXHRcdGxvY2F0aW9uczogW10sXG5cdFx0c2NlbmVzOiBbXVxuXHR9XG59O1xuXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBtYWluKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBvbk1lc3NhZ2UpO1xuXG5mdW5jdGlvbiBnZXRQYW5lbHMoaWQgPSBcInJvb3QtcGFuZWxcIikge1xuXHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290LXBhbmVsXCIpIGFzIHVua25vd24gYXMgeyBhY3RpdmVpZDogc3RyaW5nIH07XG59XG5cbmZ1bmN0aW9uIGdldERhdGFHcmlkKGlkOiBzdHJpbmcpIHtcblx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBhcyBIVE1MRWxlbWVudCAmIHsgcm93c0RhdGE6IG9iamVjdFtdIH07XG59XG5cbmZ1bmN0aW9uIG9uU2VsZWN0aW9uQ2hhbmdlZChuYW1lOiBzdHJpbmcsIGk6IG51bWJlciwgcm93RGF0YTogb2JqZWN0W10pIHtcblx0Y29uc3QgY2hhcmFjdGVyc1BhbmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInZzY29kZS1wYW5lbC12aWV3I3ZpZXctY2hhcmFjdGVyc1wiKTtcblx0aWYgKGNoYXJhY3RlcnNQYW5lbCkge1xuXHRcdGNoYXJhY3RlcnNQYW5lbC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImgzXCIpWzBdLmlubmVySFRNTCA9IGZvdW50YWluLnNlbGVjdGlvbnNbbmFtZV0uTmFtZTtcblx0fVxufVxuXG5mdW5jdGlvbiBvblJvd0VsZW1lbnRDbGlja2VkKG5hbWU6IHN0cmluZywgaTogbnVtYmVyLCByb3dEYXRhOiBvYmplY3RbXSkge1xuXHRyZXR1cm4gKGV2dDogRXZlbnQpID0+IHtcblx0XHRmb3VudGFpbi5zZWxlY3Rpb25zW25hbWVdID0gcm93RGF0YVtpIC0gMV07XG5cdFx0b25TZWxlY3Rpb25DaGFuZ2VkKG5hbWUsIGksIHJvd0RhdGEpO1xuXHR9O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVUYWJsZShuYW1lOiBzdHJpbmcsIHJvd0RhdGE6IG9iamVjdFtdKSB7XG5cdGNvbnN0IGRhdGFHcmlkID0gZ2V0RGF0YUdyaWQobmFtZSk7XG5cdGRhdGFHcmlkLnJvd3NEYXRhID0gcm93RGF0YTtcblx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0Y29uc3Qgcm93RWxlbWVudHMgPSBkYXRhR3JpZC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInZzY29kZS1kYXRhLWdyaWQtcm93XCIpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcm93RWxlbWVudHMubGVuZ3RoOyArK2kpIHtcblx0XHRcdGNvbnN0IGVsZW1lbnQgPSByb3dFbGVtZW50c1tpXTtcblx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG9uUm93RWxlbWVudENsaWNrZWQobmFtZSwgaSwgcm93RGF0YSkpO1xuXHRcdH1cblx0fSwgMSk7XG59XG5cbmZ1bmN0aW9uIGRlc2NyaWJlRHVyYXRpb24oZGlhbG9ndWVBY3Rpb25SYXRpbzogbnVtYmVyLCBkdXJhdGlvbiA6IG51bWJlcikge1xuXHRjb25zdCBkaWFsb2d1ZVJhdGlvID0gZGlhbG9ndWVBY3Rpb25SYXRpbztcblx0Y29uc3QgYWN0aW9uUmF0aW8gPSAxIC0gZGlhbG9ndWVSYXRpbztcblx0aWYgKGRpYWxvZ3VlUmF0aW8gPiBhY3Rpb25SYXRpbykge1xuXHRcdHJldHVybiBgJHtmb3JtYXRUaW1lKGR1cmF0aW9uKX0gKCR7TWF0aC5yb3VuZChkaWFsb2d1ZVJhdGlvICogMTAwKS50b0ZpeGVkKDApfSVcXHUwMGEwRGlhbG9ndWUpYDtcblx0fSBpZiAoYWN0aW9uUmF0aW8gPiBkaWFsb2d1ZVJhdGlvKSB7XG5cdFx0cmV0dXJuIGAke2Zvcm1hdFRpbWUoZHVyYXRpb24pfSAoJHtNYXRoLnJvdW5kKGFjdGlvblJhdGlvICogMTAwKS50b0ZpeGVkKDApfSVcXHUwMGEwQWN0aW9uKWA7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGAke2Zvcm1hdFRpbWUoZHVyYXRpb24pfSAoQmFsYW5jZWRcXHUwMGEwQWN0aW9uXFx1MDBhMC9cXHUwMGEwRGlhbG9ndWUpYDtcblx0fVxuXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVNjZW5lc1RhYmxlKHN0YXRzOiBvYmplY3RbXSkge1xuXHR1cGRhdGVUYWJsZSgnZ3JpZC1zY2VuZXMnLCBzdGF0cy5tYXAoKHJvdzogYW55KSA9PiB7XG5cdFx0Y29uc3QgZGlhbG9ndWVSYXRpbyA9IHJvdy5EaWFsb2d1ZUR1cmF0aW9uIC8gcm93LkR1cmF0aW9uO1xuXHRcdHJldHVybiB7XG4gICAgICAgICAgICBOYW1lOiByb3cuTmFtZSxcbiAgICAgICAgICAgIENoYXJhY3RlcnM6IHJvdy5DaGFyYWN0ZXJzLFxuICAgICAgICAgICAgU3lub3BzaXM6IHJvdy5TeW5vcHNpcyxcblx0XHRcdER1cmF0aW9uOiBkZXNjcmliZUR1cmF0aW9uKGRpYWxvZ3VlUmF0aW8sIHJvdy5EdXJhdGlvbiksXG5cdFx0XHRTZW50aW1lbnQ6IHNlbnRpbWVudFRvRW1vamkocm93LlNlbnRpbWVudClcblx0XHR9O1xuXHR9KSk7XG5cblx0Y29uc29sZS5sb2coXCJ1cGRhdGVTY2VuZXNUYWJsZVwiKTtcblx0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2NlbmVzLXRpbWVsaW5lXCIpIGFzIGFueSkuc2V0RW50cmllcyhzdGF0cyk7XG5cblx0Y29uc3QgYmFkZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidnNjb2RlLXBhbmVsLXRhYiN0YWItc2NlbmVzID4gdnNjb2RlLWJhZGdlXCIpO1xuXHRpZiAoYmFkZ2UpIHsgYmFkZ2UuaW5uZXJIVE1MID0gJycgKyBzdGF0cy5sZW5ndGg7IH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTG9jYXRpb25zVGFibGUoc3RhdHM6IG9iamVjdFtdKSB7XG5cdHVwZGF0ZVRhYmxlKCdncmlkLWxvY2F0aW9ucycsIHN0YXRzLm1hcCgocm93OiBhbnkpID0+ICh7XG5cdFx0Li4ucm93LFxuXHRcdER1cmF0aW9uOiBmb3JtYXRUaW1lKHJvdy5EdXJhdGlvbiksXG5cdH0pKSk7XG5cblx0Y29uc3QgYmFkZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidnNjb2RlLXBhbmVsLXRhYiN0YWItbG9jYXRpb25zID4gdnNjb2RlLWJhZGdlXCIpO1xuXHRpZiAoYmFkZ2UpIHsgYmFkZ2UuaW5uZXJIVE1MID0gJycgKyBzdGF0cy5sZW5ndGg7IH1cbn1cblxuZnVuY3Rpb24gc2VudGltZW50VG9FbW9qaShzZW50aW1lbnQ6IG51bWJlciB8IG51bGwpIHtcblx0aWYoc2VudGltZW50ICE9PSAwICYmICFzZW50aW1lbnQpIHJldHVybiAn4oiFJztcblxuXHRjb25zdCBlbW9qaUluZGV4ID0gTWF0aC5tYXgoLTUsIE1hdGgubWluKDUsIE1hdGgucm91bmQoc2VudGltZW50KSkpICsgNTtcblx0Ly8gU2VudGltZW5lbnQgaXMgb25seSBndWVzc2luZyBhdCBnb29kL2JhZCBub3QgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBhbmdyeS9zYWQgc28gdGhpcyBpcyBqdXN0IGEgcm91Z2ggJ2hvdyBnb29kL2JhZCBkb2VzIHRoaXMgY2hhcmFjdGVyIGZlZWwgYXQgdGhpcyBtb21lbnQnLlxuXHRjb25zdCBlbW9qaSA9IFsn8J+krCcsICfwn5irJywgJ/CfmKMnLCAn8J+ZgScsICfwn5iVJywgJ/CfmJAnLCAn8J+YjycsICfwn5mCJywgJ/CfmIAnLCAn8J+YgycsICfwn5iGJ107XG5cdHJldHVybiBgJHtlbW9qaVtlbW9qaUluZGV4XSB8fCBlbW9qaVs1XX0gKCR7c2VudGltZW50LnRvRml4ZWQoMSl9KWA7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNoYXJhY3RlclRhYmxlKHN0YXRzOiB7W2tleTogc3RyaW5nXTogYW55fVtdKSB7XG5cdHVwZGF0ZVRhYmxlKCdncmlkLWNoYXJhY3RlcnMnLCBzdGF0cy5tYXAoKHJvdzoge1trZXk6IHN0cmluZ106IGFueX0pID0+ICh7XG5cdFx0XCJOYW1lXCI6IHJvdy5OYW1lLFxuXHRcdFwiR2VuZGVyXCI6IHJvdy5HZW5kZXIudG9VcHBlckNhc2UoKSxcblx0XHRcIkxlbmd0aCAmIER1cmF0aW9uXCI6IFtcblx0XHRcdGAke2Zvcm1hdFRpbWUocm93LkR1cmF0aW9uKX1gLFxuXHRcdFx0YCR7cm93LkxpbmVzfVxcdTAwYTBsaW5lc2AsXG5cdFx0XHRgJHtyb3cuV29yZHN9XFx1MDBhMHdvcmRzYCxcblx0XHRcdGAke3Jvdy5Nb25vbG9ndWVzfVxcdTAwYTBtb25vbG9ndWVzYFxuXHRcdF0uam9pbignXFx1MDBhMFxcdTAwYWRcXHUwMGEwJyksXG5cdFx0XCJSZWFkaW5nIEFnZVwiOiByb3cuUmVhZGluZ0FnZSxcblx0XHRcIlNlbnRpbWVudFwiOiBzZW50aW1lbnRUb0Vtb2ppKHJvdy5TZW50aW1lbnQpXG5cdH0pKSk7XG5cblx0Y29uc3QgYmFkZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidnNjb2RlLXBhbmVsLXRhYiN0YWItY2hhcmFjdGVycyA+IHZzY29kZS1iYWRnZVwiKTtcblx0aWYgKGJhZGdlKSB7IGJhZGdlLmlubmVySFRNTCA9ICcnICsgc3RhdHMubGVuZ3RoOyB9XG5cblx0c2hvd0dlbmRlclJlcHJlc2VudGF0aW9uU3RhdGlzdGljcyhzdGF0cyk7XG5cdHNob3dSYWNpYWxJZGVudGl0eVJlcHJlc2VudGF0aW9uU3RhdGlzdGljcyhzdGF0cyk7XG59XG5cbmZ1bmN0aW9uIG9uTWVzc2FnZShldjogTWVzc2FnZUV2ZW50KSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1kZWJ1Z2dlclxuXHRpZiAoZXYuZGF0YS5jb21tYW5kID09IFwiZm91bnRhaW4uc3RhdGlzdGljcy5jaGFyYWN0ZXJzXCIpIHtcblx0XHRmb3VudGFpbi5zdGF0aXN0aWNzLmNoYXJhY3RlcnMgPSBldi5kYXRhLnN0YXRzO1xuXHRcdHVwZGF0ZUNoYXJhY3RlclRhYmxlKGZvdW50YWluLnN0YXRpc3RpY3MuY2hhcmFjdGVycyk7XG5cdH1cblx0aWYgKGV2LmRhdGEuY29tbWFuZCA9PSBcImZvdW50YWluLnN0YXRpc3RpY3MubG9jYXRpb25zXCIpIHtcblx0XHRmb3VudGFpbi5zdGF0aXN0aWNzLmxvY2F0aW9ucyA9IGV2LmRhdGEuc3RhdHM7XG5cdFx0dXBkYXRlTG9jYXRpb25zVGFibGUoZm91bnRhaW4uc3RhdGlzdGljcy5sb2NhdGlvbnMpO1xuXHR9XG5cdGlmIChldi5kYXRhLmNvbW1hbmQgPT0gXCJmb3VudGFpbi5zdGF0aXN0aWNzLnNjZW5lc1wiKSB7XG5cdFx0Zm91bnRhaW4uc3RhdGlzdGljcy5zY2VuZXMgPSBldi5kYXRhLnN0YXRzO1xuXHRcdHVwZGF0ZVNjZW5lc1RhYmxlKGZvdW50YWluLnN0YXRpc3RpY3Muc2NlbmVzKTtcblx0fVxuXHRjb25zb2xlLmxvZyh7c2NyaXB0U3RhdHM6IGZvdW50YWluLnN0YXRpc3RpY3N9KTtcblxuXHRpZiAoZXYuZGF0YS5jb21tYW5kID09IFwiZm91bnRhaW4uYW5hbHlzZUxvY2F0aW9uXCIpIHtcblx0XHRnZXRQYW5lbHMoKS5hY3RpdmVpZCA9IFwidGFiLWxvY2F0aW9uc1wiO1xuXHR9XG5cdGlmIChldi5kYXRhLmNvbW1hbmQgPT0gXCJmb3VudGFpbi5hbmFseXNlQ2hhcmFjdGVyXCIpIHtcblx0XHRnZXRQYW5lbHMoKS5hY3RpdmVpZCA9IFwidGFiLWNoYXJhY3RlcnNcIjtcblx0fVxuXHRpZiAoZXYuZGF0YS5jb21tYW5kID09IFwiZm91bnRhaW4uYW5hbHlzZVNjZW5lXCIpIHtcblx0XHRnZXRQYW5lbHMoKS5hY3RpdmVpZCA9IFwidGFiLXNjZW5lc1wiO1xuXHR9XG59XG5cbmZ1bmN0aW9uIG1haW4oKSB7XG5cdHJldHVybjtcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=