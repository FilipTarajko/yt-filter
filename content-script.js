let MS_BETWEEN_TRIES = 30;
let debug = true;

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
            console.log(`found - ${name}`);
        } else {
            console.log(`not found - ${name}`);
        }
    }, MS_BETWEEN_TRIES);
}

chrome.storage.local.get(["hideShortsRecommendations", "hideShortsPageButton"], function (val) {
    let url = window.location.href;
    if (url == "https://www.youtube.com/") {
        if (val.hideShortsRecommendations){
            //<ytd-rich-section-renderer class="style-scope ytd-rich-grid-renderer">
            waitAndHide("span", "main", 9, "YTD-RICH-SECTION-RENDERER")
        }
        if (val.hideShortsPageButton){
            // <a id="endpoint" tabindex="-1" class="yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer" title="Shorts">
            waitAndHide("span", "side small", 2, "YTD-MINI-GUIDE-ENTRY-RENDERER")
            waitAndHide("yt-formatted-string", "side big", 2, "A")
        }
    } else {
        console.log("not main page");
    }
});