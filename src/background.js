let timerIntervalId = null;

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.type === "updateWebsites") {
        const websites = message.payload;
        if (!Array.isArray(websites)) {
            sendResponse({ status: "error", message: "Invalid payload format" });
            return;
        }

        const rules = websites.map((site, index) => {
            try {
                return {
                    id: index + 1,
                    priority: 1,
                    action: {
                        type: "redirect",
                        redirect: { extensionPath: "/Block.html" }
                    },
                    condition: {
                        urlFilter: new URL(site.url).hostname,
                        resourceTypes: ["main_frame"]
                    },
                };
            } catch (error) {
                sendResponse({ status: "error", message: `Invalid URL: ${site.url}` });
                return null;
            }
        }).filter(rule => rule !== null);

        chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
            const existingRuleIds = existingRules.map((rule) => rule.id);

            chrome.declarativeNetRequest.updateDynamicRules(
                {
                    removeRuleIds: existingRuleIds,
                    addRules: rules,
                },
                () => {
                    if (chrome.runtime.lastError) {
                        sendResponse({ status: "error", message: chrome.runtime.lastError.message });
                    } else {
                        sendResponse({ status: "success" });
                    }
                }
            );
        });

        return true;
    }

    if (message.type === "clearBlockingRules") {
        clearBlockingRules(sendResponse);
        return true;
    }

    if (message.type === "resetTimer") {
        chrome.storage.session.set({ hours: 0, minutes: 0, seconds: 0, timer: 0, isRunning: false, startText: "Start" });
        startPomodoroTimer(0, 0, 0, false);
        return true;
    }

    if (message.type === "startPomodoroTimer") {
        const { hour, minute, second, isRunning } = message.payload;

        if (
            typeof hour !== "number" ||
            typeof minute !== "number" ||
            typeof second !== "number" ||
            typeof isRunning !== "boolean" ||
            hour < 0 || minute < 0 || second < 0 ||
            (hour === 0 && minute === 0 && second === 0)
        ) {
            chrome.storage.session.set({ hours: 0, minutes: 0, seconds: 0, timer: 0, isRunning: false, startText: "Start" });
            sendResponse({ status: "error", message: "Invalid time provided. Timer has been reset." });
            return;
        }

        if (isRunning) {
            startPomodoroTimer(second, minute, hour, isRunning);
        } else {
            chrome.storage.session.set({ isRunning: false });
        }
        sendResponse({ status: "success" });
    }


});

function clearBlockingRules(sendResponse) {
    chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
        const existingRuleIds = existingRules.map((rule) => rule.id);

        chrome.declarativeNetRequest.updateDynamicRules(
            {
                removeRuleIds: existingRuleIds,
                addRules: [],
            },
            () => {
                if (chrome.runtime.lastError) {
                    sendResponse({ status: "error", message: chrome.runtime.lastError.message });
                } else {
                    sendResponse({ status: "success" });
                }
            }
        );
    });

    chrome.storage.session.set({ isRunning: false });
}

function storeUpdatedValues(seconds, minutes, hours) {
    chrome.storage.session.set({
        seconds: seconds,
        minutes: minutes,
        hours: hours
    }, () => {
        if (chrome.runtime.lastError) {
            console.error("Error storing values:", chrome.runtime.lastError.message);
        }
    });
}

function startPomodoroTimer(seconds, minutes, hours, isRunning) {
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    chrome.action.setBadgeText({
        text: "",
    });
    function updateTimer() {
        chrome.storage.session.get(["isRunning"], (result) => {
            if (!result.isRunning) {
                if (timerIntervalId) {
                    clearInterval(timerIntervalId);
                    timerIntervalId = null;
                }
                return;
            }

            if (totalSeconds > 0) {
                totalSeconds -= 1;

                const currentHours = Math.floor(totalSeconds / 3600);
                const currentMinutes = Math.floor((totalSeconds % 3600) / 60);
                const currentSeconds = totalSeconds % 60;

                storeUpdatedValues(currentSeconds, currentMinutes, currentHours);

                chrome.action.setBadgeText({
                    text: `${currentHours > 0 ? currentHours + "h" : currentMinutes > 0 ? currentMinutes + "m" : currentSeconds + "s"}`,
                });
            } else {
                clearInterval(timerIntervalId);
                timerIntervalId = null;

                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "icon128.png",
                    title: "Session Complete!",
                    message: "Great job! Take a break.",
                    silent: false,
                    priority: 2,
                });

                chrome.tabs.create({ url: chrome.runtime.getURL("Done.html") });
                chrome.storage.session.set({ hours: 0, minutes: 0, seconds: 0, timer: 0, isRunning: false, startText: "Start" });
                chrome.action.setBadgeText({
                    text: "",
                });
                clearBlockingRules(() => { });
            }
        });
    }

    if (timerIntervalId) {
        clearInterval(timerIntervalId);
    }

    if (isRunning) {
        timerIntervalId = setInterval(updateTimer, 1000);
    }

    chrome.storage.session.set({ timer: totalSeconds, isRunning }, () => {
        if (chrome.runtime.lastError) {
            console.error("Error starting timer:", chrome.runtime.lastError.message);
        }
    });
}
