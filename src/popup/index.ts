import Options from '../components/Options.svelte';

const target = document.getElementById('app');

async function render() {
  let {
    isExtensionActive, hideSections
  } = await chrome.storage.local.get(
    {isExtensionActive: false,
    hideSections: {
      shortsRecommendations: false,
      shortsPageButton: false,
      trendingRecommendations: false,
      breakingNewsRecommendations: false
    }}
  );
  new Options({target
    , props: {
    isExtensionActive: isExtensionActive,
    hideSections: hideSections
  }
});
}

document.addEventListener('DOMContentLoaded', render);