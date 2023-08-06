import Options from '../components/Options.svelte';

const target = document.getElementById('app');

async function render() {
  let {
    isExtensionActive, hideSections, filterSets
  } = await chrome.storage.local.get(
    {isExtensionActive: false,
    hideSections: {
      shortsRecommendations: false,
      shortsPageButton: false,
      trendingRecommendations: false,
      breakingNewsRecommendations: false
    },
    filterSets: []
    }
  );
  new Options({target,props: {
    isExtensionActive,
    hideSections,
    filterSets
    }
  });
}

document.addEventListener('DOMContentLoaded', render);