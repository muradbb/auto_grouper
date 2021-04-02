function urlTrimmer(url) {
    let re = /(?<=\/\/).*?(?=\/)/
    return re.exec(url)
}
console.log("asd");

chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
    if (command == "toggle-feature-group-current-url") {
        console.log(1)
    } else if (command == "toggle-feature-group-all") {
        console.log(2)
        groupAll()
    }
});

function groupAll() {
    chrome.tabs.query({
        windowId: chrome.windows.WINDOW_ID_CURRENT
    }, (tabs) => {
        var groupingMap = new Map()
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].groupId == -1) {
                if (!groupingMap.has(urlTrimmer(tabs[i].url)[0])) {
                    groupingMap.set((urlTrimmer(tabs[i].url)[0]), [tabs[i]])
                } else {
                    groupingMap.get((urlTrimmer(tabs[i].url)[0])).push(tabs[i])
                }
            }
        }

        groupingMap.forEach((tabsArr, key) => {
            if (tabsArr.length > 1) {
                let ids = new Array()
                for (var i = 0; i < tabsArr.length; i++) {
                    ids.push(tabsArr[i].id)
                }
                chrome.tabs.group({
                    tabIds: ids
                })
            }
        });
    })
}
