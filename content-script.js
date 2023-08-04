let MS_BETWEEN_TRIES = 30;
let approved_videos = [];

function waitAndHide(content, type, name, timesNested, tagnameToHide){
    var xpath = `//${type}[contains(text(),"${content}")]`;
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

function handleVideoTitles(){
    let titles = document.querySelectorAll('yt-formatted-string#video-title:not(.filtered)');
    for (let titleElem of titles){
        let title = titleElem.innerText;
        let lowercased = title.toLowerCase();
        let videoBlock = titleElem;
        for (let i=0; i<8; i++){
            videoBlock = videoBlock.parentElement;
        }
        if (!lowercased.includes("-") || approved_videos.includes(title)){
            videoBlock.style.display = "none";
        } else {
            approved_videos.push(title);
            filteredVideosParent.appendChild(videoBlock);
        }
        titleElem.classList.add("filtered");
    }
}

chrome.storage.local.get(
    [
        "hideShortsRecommendations",
        "hideShortsPageButton",
        "hideBreakingNewsInRecommendations",
        "hideTrendingInRecommendations"
    ], function (val) {
    let url = window.location.href;
    if (url == "https://www.youtube.com/") {
        if (val.hideShortsRecommendations){
            waitAndHide("Shorts", "span", "main", 9, "YTD-RICH-SECTION-RENDERER");
        }
        if (val.hideShortsPageButton){
            waitAndHide("Shorts", "span", "side small", 2, "YTD-MINI-GUIDE-ENTRY-RENDERER");
            waitAndHide("Shorts", "yt-formatted-string", "side big", 2, "A");
        }
        if (val.hideTrendingInRecommendations){
            waitAndHide("Trending", "span", "trending on main", 11, "YTD-RICH-SECTION-RENDERER");
        }
        if (val.hideBreakingNewsInRecommendations){
            waitAndHide("Breaking news", "span", "breaking news on main", 9, "YTD-RICH-SECTION-RENDERER");
        }
        let contentsInterval = setInterval(()=>{
            contents = document.getElementById("contents");
            if (contents){
                clearInterval(contentsInterval);
                contents.insertAdjacentHTML('beforebegin', '<div id="filteredVideosParent"></div>');
                contents.style.display = "hidden";
                let filteredVideosParent = document.getElementById("filteredVideosParent");
                filteredVideosParent.style.display="flex";
                filteredVideosParent.style.displayDirection="horizontal";
                filteredVideosParent.style.width="100%";
                filteredVideosParent.style.flexWrap="wrap";
                setInterval(()=>{
                    handleVideoTitles(filteredVideosParent);
                }, MS_BETWEEN_TRIES)
            }
        }, MS_BETWEEN_TRIES);
    }
});