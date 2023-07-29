chrome.storage.local.get(["hideShorts"], function (val) {
  document.getElementById("hideShorts").checked = val.hideShorts ?? true;
  document.getElementById("hideShorts").addEventListener("change", (e) => {
    console.log("4");
    chrome.storage.local.set({ hideShorts: document.getElementById("hideShorts").checked });
  });
});