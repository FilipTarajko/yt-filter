chrome.storage.local.get(["hideShortsRecommendations"], function (val) {
  document.getElementById("hideShortsRecommendations").checked = val.hideShortsRecommendations;
  document.getElementById("hideShortsRecommendations").addEventListener("change", (e) => {
    chrome.storage.local.set({ hideShortsRecommendations: e.target.checked });
  });
});

chrome.storage.local.get(["hideShortsPageButton"], function (val) {
  document.getElementById("hideShortsPageButton").checked = val.hideShortsPageButton;
  document.getElementById("hideShortsPageButton").addEventListener("change", (e) => {
    chrome.storage.local.set({ hideShortsPageButton: e.target.checked });
  });
});

chrome.storage.local.get(["hideBreakingNewsInRecommendations"], function (val) {
  document.getElementById("hideBreakingNewsInRecommendations").checked = val.hideBreakingNewsInRecommendations;
  document.getElementById("hideBreakingNewsInRecommendations").addEventListener("change", (e) => {
    chrome.storage.local.set({ hideBreakingNewsInRecommendations: e.target.checked });
  });
});

chrome.storage.local.get(["hideTrendingInRecommendations"], function (val) {
  document.getElementById("hideTrendingInRecommendations").checked = val.hideTrendingInRecommendations;
  document.getElementById("hideTrendingInRecommendations").addEventListener("change", (e) => {
    chrome.storage.local.set({ hideTrendingInRecommendations: e.target.checked });
  });
});
