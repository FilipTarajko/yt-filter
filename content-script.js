let MS_BETWEEN_TRIES = 30;

function waitAndHide(type, name, timesNested, tagnameToHide){
    var xpath = `//${type}[contains(text(),'Shorts')]`;
    let interval = setInterval(()=>{
        var matchingElement = document
            .evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue;
        let toHide = matchingElement;
        for (let i=0; i<timesNested; i++){
            toHide = toHide?.parentElement;
        }
        if (toHide?.tagName == tagnameToHide){
            toHide.style.display = "none";
            matchingElement.innerText = "";
            clearInterval(interval);
        }
    }, MS_BETWEEN_TRIES);
}

chrome.storage.local.get(["hideShortsRecommendations", "hideShortsPageButton"], function (val) {
    let url = window.location.href;
    if (url == "https://www.youtube.com/") {
        if (val.hideShortsRecommendations){
            waitAndHide("span", "main", 9, "YTD-RICH-SECTION-RENDERER")
        }
        if (val.hideShortsPageButton){
            waitAndHide("span", "side small", 2, "YTD-MINI-GUIDE-ENTRY-RENDERER")
            waitAndHide("yt-formatted-string", "side big", 2, "A")
        }
    }
});