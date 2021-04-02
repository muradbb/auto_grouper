function urlTrimmer(url) {
    let re = /(?<=\/\/).*?(?=\/)/
    return re.exec(url)
}

chrome.commands.onCommand.addListener(function(command) {
    if (command == "toggle-feature-group-current-url") {
        groupThisUrl()
    } else if (command == "toggle-feature-group-all") {
        groupAll()
    }
});


function groupThisUrl(){
  chrome.tabs.query({
      windowId: chrome.windows.WINDOW_ID_CURRENT
  }, (tabs) => {
      var groupingMap = new Map()
      var currentUrl
      for (var i = 0; i < tabs.length; i++) {
        if(tabs[i].active==true){
          currentUrl=urlTrimmer((tabs[i].url))[0]
        }
          if (tabs[i].groupId == -1) {
              if (!groupingMap.has(urlTrimmer(tabs[i].url)[0])) {
                  groupingMap.set((urlTrimmer(tabs[i].url)[0]), [tabs[i]])
              } else {
                  groupingMap.get((urlTrimmer(tabs[i].url)[0])).push(tabs[i])
              }
          }
      }
        if(groupingMap.get(currentUrl).length>1){
          let ids = new Array()
          for (var i = 0; i < groupingMap.get(currentUrl).length; i++) {
            ids.push(groupingMap.get(currentUrl)[i].id)
          }
          chrome.tabs.group({
            tabIds: ids
          })
      }
  })
}

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
