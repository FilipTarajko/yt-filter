let MS_BETWEEN_TRIES = 100;
let debug = true;

function waitAndHide(type, name, timesNested = 2){
    var xpath = `//${type}[contains(text(),'Shorts')]`;
    let interval = setInterval(()=>{
        var matchingElement = document
            .evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue;
        let toHide = matchingElement;
        for (let i=0; i<timesNested; i++){
            toHide = toHide?.parentElement;
        }
        if (toHide){
            toHide.style.display = "none";
            matchingElement.innerText = "";
            clearInterval(interval);
            console.log(`found - ${name}`);
        } else {
            console.log(`not found - ${name}`);
        }
    }, MS_BETWEEN_TRIES);
}

function hideShorts(){
    waitAndHide("span", "main", timesNested = 9)
    waitAndHide("span", "side small", timesNested = 2)
    waitAndHide("yt-formatted-string", "side big", timesNested = 2)
}

chrome.storage.local.get(["hideShorts"], function (val) {
    let url = window.location.href;
    if (url == "https://www.youtube.com/") {
        val.hideShorts && hideShorts();
    } else {
        console.log("not main page");
    }
});