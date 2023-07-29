chrome.storage.local.get(["hideShortsRecommendations"], function (val) {
  document.getElementById("hideShortsRecommendations").checked = val.hideShortsRecommendations;
  document.getElementById("hideShortsRecommendations").addEventListener("change", (e) => {
    chrome.storage.local.set({ hideShortsRecommendations: document.getElementById("hideShortsRecommendations").checked });
  });
});

chrome.storage.local.get(["hideShortsPageButton"], function (val) {
  document.getElementById("hideShortsPageButton").checked = val.hideShortsPageButton;
  document.getElementById("hideShortsPageButton").addEventListener("change", (e) => {
    chrome.storage.local.set({ hideShortsPageButton: document.getElementById("hideShortsPageButton").checked });
  });
});
