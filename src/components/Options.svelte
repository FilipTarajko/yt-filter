<script lang="ts">
  export let isExtensionActive: boolean;
  export let hideSections: any;

  const handleSave = () => {
    chrome.storage.local.set({
      isExtensionActive,
      hideSections,
    });
  };
</script>

<div style="width: 300px;">
  <h1>YT filter - options</h1>
  <hr>
  <input id="isExtensionActive" type="checkbox" bind:checked={isExtensionActive} on:change={handleSave} />
  <label for="isExtensionActive">extension</label>
  <hr>
  {#each Object.entries(hideSections) as [title, value]}
    <div>
      <input id={title} type="checkbox" bind:checked={hideSections[title]} on:change={handleSave} />
      <label for={title}>hide {title.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}</label>
    </div>
  {/each}
  <hr>
</div>

<style scoped>
</style>
