let MS_BETWEEN_TRIES = 30;
let approved_videos = [];

function waitAndHide(content, type, timesNested, tagnameToHide){
    var xpath = `//${type}[contains(text(),"${content}")]`;
    let interval = setInterval(()=>{
        var matchingElement = document
            .evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue;
        let toHide = matchingElement;
        for (let i=0; i<timesNested; i++){
            toHide = toHide?.parentElement;
        }
        // @ts-ignore
        if (toHide?.tagName == tagnameToHide){
            // @ts-ignore
            toHide.style.display = "none";
            // @ts-ignore
            matchingElement.innerText = "";
            clearInterval(interval);
        }
    }, MS_BETWEEN_TRIES);
}

function handleVideos(filteredVideosParent){
    let titles = document.querySelectorAll('yt-formatted-string#video-title:not(.filtered)');
    for (let titleElem of titles){
        // @ts-ignore
        let title = titleElem.innerText;
        let lowercased = title.toLowerCase();
        let videoBlock = titleElem;
        for (let i=0; i<8; i++){
            videoBlock = videoBlock.parentElement;
        }
        if (!lowercased.includes("-") || approved_videos.includes(title)){
            // @ts-ignore
            videoBlock.style.display = "none";
        } else {
            approved_videos.push(title);
            filteredVideosParent.appendChild(videoBlock);
        }
        titleElem.classList.add("filtered");
    }
}

function mainPage(val){
    if (val.hideSections.shortsRecommendations){
        waitAndHide("Shorts", "span", 9, "YTD-RICH-SECTION-RENDERER");
    }
    if (val.hideSections.shortsPageButton){
        waitAndHide("Shorts", "span", 2, "YTD-MINI-GUIDE-ENTRY-RENDERER");
        waitAndHide("Shorts", "yt-formatted-string", 2, "A");
    }
    if (val.hideSections.trendingRecommendations){
        waitAndHide("Trending", "span", 11, "YTD-RICH-SECTION-RENDERER");
    }
    if (val.hideSections.breakingNewsRecommendations){
        waitAndHide("Breaking news", "span", 9, "YTD-RICH-SECTION-RENDERER");
    }
    let contentsInterval = setInterval(()=>{
        let contents = document.getElementById("contents");
        if (contents){
            clearInterval(contentsInterval);
            contents.insertAdjacentHTML('beforebegin', '<div id="filteredVideosParent"></div>');
            contents.style.display = "hidden";
            let filteredVideosParent = document.getElementById("filteredVideosParent");
            filteredVideosParent.style.display="flex";
            // @ts-ignore
            filteredVideosParent.style.displayDirection="horizontal";
            filteredVideosParent.style.width="100%";
            filteredVideosParent.style.flexWrap="wrap";
            setInterval(()=>{
                handleVideos(filteredVideosParent);
            }, MS_BETWEEN_TRIES)
        }
    }, MS_BETWEEN_TRIES);
}

chrome.storage.local.get([
    "isExtensionActive",
    "hideSections",
], function (val) {
    if (!val.isExtensionActive){
        return;
    }
    let url = window.location.href;
    if (url == "https://www.youtube.com/") {
        mainPage(val);
    }
});