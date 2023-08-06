<script lang="ts">
  enum FilteringMode {
      blacklist,
      off,
      whitelist,
  }

  export let isExtensionActive: boolean;
  export let hideSections: any;
  export let filterSets: FilterSet[];

  let newFilterSetName = "";
  let editedFilterSet = null;
  let editedIndex = null;
  let newFilter: Filter = {
    text: "",
    asFull: false,
    refersToTitle: true,
    refersToChannel: true,
    isOn: true,
  };

  function saveIsExtensionActive(){
    chrome.storage.local.set({ isExtensionActive });
  };

  function saveHideSections(){
    chrome.storage.local.set({ hideSections });
  };

  function saveFilterSets(){
    chrome.storage.local.set({ filterSets });
  };
  
  function addNewFilterSet(){
    filterSets = [...filterSets , {
      name: newFilterSetName,
      filters: [],
      currentMode: FilteringMode.off
    }]
    newFilterSetName = "";
    saveFilterSets();
  }
</script>

<div style="width: 400px;">
  <h1>YT filter - options</h1>
  <hr>
  <input id="isExtensionActive" type="checkbox" bind:checked={isExtensionActive} on:change={saveIsExtensionActive} />
  <label for="isExtensionActive">extension</label>
  <hr>
  <h2>Hide sections</h2>
  {#each Object.entries(hideSections) as [title, value]}
    <div>
      <input id={title} type="checkbox" bind:checked={hideSections[title]} on:change={saveHideSections} />
      <label for={title}>hide {title.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}</label>
    </div>
  {/each}
  <hr>
  <h2>Filter recommended videos</h2>

  <div id="filterSetsGrid">
    <div class="header"><abbr title="blocks any videos that aren't selected by this filter">allow</abbr></div>
    <div class="header"><abbr title="filter turned off - doesn't currently do anything">off</abbr></div>
    <div class="header"><abbr title="blocks any videos selected by this filter">block</abbr></div>
    <div class="header left">
      <div style="padding-left: 8px;">name</div>
    </div>
    <div class="header">↑</div>
    <div class="header">↓</div>
    <div class="header">edit</div>
    <div class="header">delete</div>
    
    {#each filterSets as filterSet, i}
      <input type="radio" bind:group={filterSet.currentMode} value={FilteringMode.whitelist} on:change={saveFilterSets}>
      <input type="radio" bind:group={filterSet.currentMode} value={FilteringMode.off} on:change={saveFilterSets}>
      <input type="radio" bind:group={filterSet.currentMode} value={FilteringMode.blacklist} on:change={saveFilterSets}>
      <div style="padding-left: 8px;">
        {filterSet.name}
      </div>
      <button disabled={i==0 || editedFilterSet} on:click={()=>{
        let temp = filterSets[i];
        filterSets[i] = filterSets[i-1];
        filterSets[i-1] = temp;
      }}>↑</button>
      <button disabled={i==filterSets.length-1 || editedFilterSet} on:click={()=>{
        let temp = filterSets[i];
        filterSets[i] = filterSets[i+1];
        filterSets[i+1] = temp;
      }}>↓</button>
      {#if editedIndex != i}
        <button on:click={()=>{}} on:click={()=>{
          editedFilterSet = filterSet;
          editedIndex = i;
        }}>...</button>
      {:else}
        <button on:click={()=>{}} on:click={()=>{
          editedFilterSet = undefined;
          editedIndex = undefined;
        }}>O</button>
      {/if}
      <button on:click={()=>{
        filterSets = filterSets.filter(e=>e!=filterSet)
        saveFilterSets();
      }}>X</button>
    {/each}

    <div style="grid-column: 1 / span 3"></div>
    <div style="padding: 0px 6px;">
      <input type="text" style="width: 126px;" bind:value={newFilterSetName}>
    </div>
    <button style="grid-column: 5 / span 2;" on:click={addNewFilterSet}>+</button>
  </div>
  {#if editedFilterSet}
    <hr/>
    <h2>Edited filter set: <input type="text" bind:value={editedFilterSet.name} on:input={()=>{
      filterSets[editedIndex] = editedFilterSet;
      saveFilterSets();
    }}></h2>
    <div class="filtersGrid">
      <div class="header">on</div>
      <div class="header">text</div>
      <div class="header left"><abbr title="by default only needs to be included">only equal</abbr></div>
      <div class="header">in title</div>
      <div class="header">in channel</div>
      <div class="header">delete</div>
      {#each editedFilterSet.filters as filter}
      <input type="checkbox" bind:checked={filter.isOn} on:change={saveFilterSets}>
      <input type="text" bind:value={filter.text} on:input={saveFilterSets}>
      <input type="checkbox" bind:checked={filter.asFull} on:change={saveFilterSets}>
      <input type="checkbox" bind:checked={filter.refersToTitle} on:change={saveFilterSets}>
      <input type="checkbox" bind:checked={filter.refersToChannel} on:change={saveFilterSets}>
      <button on:click={()=>{
        editedFilterSet.filters = editedFilterSet.filters.filter((e)=>e!=filter);
        saveFilterSets();
      }}>X</button>
      {/each}
    </div>
    <h3>new filter for {editedFilterSet.name}</h3>
    <div class="filtersGrid">
      <input type="checkbox" bind:checked={newFilter.isOn}>
      <input type="text" bind:value={newFilter.text}>
      <input type="checkbox" bind:checked={newFilter.asFull}>
      <input type="checkbox" bind:checked={newFilter.refersToTitle}>
      <input type="checkbox" bind:checked={newFilter.refersToChannel}>
      <button on:click={()=>{
        editedFilterSet.filters = [...editedFilterSet.filters, JSON.parse(JSON.stringify(newFilter))];
        saveFilterSets();
      }}>+</button>
    </div>
  {/if}
</div>

<style scoped>
  #filterSetsGrid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 40px) 140px repeat(2, 25px) 35px 40px;
    column-gap: 2px;
    row-gap: 2px;
  }

  .filtersGrid {
    width: 100%;
    display: grid;
    grid-template-columns: 40px 120px 70px 50px 70px 40px;
    column-gap: 2px;
    row-gap: 2px;
  }

  .header{
    margin-bottom: 6px;
    float: center;
    display: flex;
    justify-content: center;
  }

  .left{
    justify-content: start;
  }

  h2 {
    margin: 6px 0;
  }
</style>
