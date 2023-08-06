let MS_BETWEEN_TRIES = 30;
let approved_videos = [];

enum FilteringMode {
    blacklist,
    off,
    whitelist,
}

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

function handleVideos(filteredVideosParent, filterSets: FilterSet[]){
    // GET VIDEOS
    let titles = document.querySelectorAll('yt-formatted-string#video-title:not(.filtered)');

    // CHECK WHITE/BLACK-LIST MODE
    let current_mode = FilteringMode.blacklist;
    for (let i=0; i<filterSets.length; i++){
        if (filterSets[i].currentMode == FilteringMode.whitelist){
            current_mode = FilteringMode.whitelist;
            break;
        }
    }

    // GO OVER EACH VIDEO
    for (let titleElem of titles){
        // GET VIDEO NAME
        // @ts-ignore
        let titleLowercased = titleElem.innerText.toLowerCase();
        let videoBlock = titleElem;
        for (let i=0; i<8; i++){
            videoBlock = videoBlock.parentElement;
        }

        // GET CHANNEL NAME
        let channelNameElem = titleElem.parentElement.parentElement.parentElement?.children[1];
        for (let i=0; i<7; i++){
            channelNameElem = channelNameElem.children[0];
        }
        // @ts-ignore
        let channelNameLowercased = channelNameElem?.innerText?.toLowerCase();

        // FILTER
        // by default allowed in blacklist, not allowed in whitelist
        let video_allowed: boolean = current_mode == FilteringMode.blacklist;
        loop1: for (let i=0; i<filterSets.length; i++){
            if (approved_videos.includes(titleLowercased)){
                video_allowed = false;
                break;
            }
            else if (filterSets[i].currentMode == current_mode){
                for (let j=0; j<filterSets[i].filters.length; j++){
                    // CHECK A SINGLE FILTER
                    let filter = filterSets[i].filters[j]; 
                    if (!filter.isOn){
                        continue;
                    }
                    let searchedText = filter.text.toLocaleLowerCase();
                    if (filter.asFull){
                        if ((filter.refersToTitle && titleLowercased == searchedText)
                        || (filter.refersToChannel && channelNameLowercased == searchedText)
                        ){
                            let titleAndAuthor = `${titleLowercased} by ${channelNameLowercased}`.replace(searchedText, searchedText.toUpperCase());
                            console.log(`found ${searchedText} in ${titleAndAuthor}`);
                            video_allowed = !video_allowed;
                            break loop1;
                        }
                    } else {
                        if ((filter.refersToTitle && titleLowercased.includes(searchedText))
                        || (filter.refersToChannel && channelNameLowercased?.includes(searchedText))
                        ){
                            let titleAndAuthor = `${titleLowercased} by ${channelNameLowercased}`.replace(searchedText, searchedText.toUpperCase());
                            console.log(`found ${searchedText} in ${titleAndAuthor}`);
                            video_allowed = !video_allowed;
                            break loop1;
                        }
                    }
                }
            }
        }

        if (video_allowed){
            approved_videos.push(titleLowercased);
            filteredVideosParent.appendChild(videoBlock);
        } else {
            // @ts-ignore
            videoBlock.style.display = "none";
        }

        // MARK TITLE AND IMAGE AS FILTERED
        titleElem.classList.add("filtered");
        let thumbnailElem = titleElem;
        for (let i=0; i<5; i++){
            thumbnailElem = thumbnailElem?.parentElement;
        }
        for (let i=0; i<5; i++){
            thumbnailElem = thumbnailElem?.children[0];
        }
        thumbnailElem?.classList.add("filtered");
    }
}

function mainPage(val){
    let styleSheet = document.createElement("style");
    styleSheet.innerText = `#video-title:not(.filtered){display: none;}
    .yt-core-image:not(.filtered){display:none;}`
    ;
    document.head.appendChild(styleSheet);
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
                handleVideos(filteredVideosParent, val.filterSets);
            }, MS_BETWEEN_TRIES)
        }
    }, MS_BETWEEN_TRIES);
}

chrome.storage.local.get([
    "isExtensionActive",
    "hideSections",
    "filterSets"
], function (val) {
    if (!val.isExtensionActive){
        return;
    }
    let url = window.location.href;
    if (url == "https://www.youtube.com/") {
        mainPage(val);
    }
});