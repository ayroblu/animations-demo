<script lang="ts">
  let isVisible = $state(false);

  type Deferred = ReturnType<typeof deferred>;
  function deferred() {
    const result = {
      resolve: () => {},
      reject: () => {},
      promise: Promise.resolve(),
    };
    result.promise = new Promise<void>((resolve, reject) => {
      result.resolve = resolve;
      result.reject = reject;
    });
    return result;
  }
  function wrapInViewTransition(func: () => void) {
    if (!document.startViewTransition) {
      func();
    } else {
      document.startViewTransition(async () => {
        const def = deferred();
        deferredItems.push(def);
        func();
        await def.promise;
      });
    }
  }
  function toggleVisible() {
    wrapInViewTransition(() => {
      isVisible = !isVisible;
    });
  }
  let deferredItems: Deferred[] = [];
  $effect(() => {
    deferredItems.forEach((p) => {
      p.resolve();
    });
    deferredItems = [];
    isVisible;
  });
</script>

<h1>Half Sheet demo</h1>

<button on:click={toggleVisible}
  >Tap this button to make the half sheet appear</button
>

{#if isVisible}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="cover"
    on:click={(e) => {
      if (e.target == e.currentTarget) {
        toggleVisible();
      }
    }}
  >
    <div class="half-sheet">
      <div class="half-sheet-header">
        <div></div>
        <div><h3>Title</h3></div>
        <div>
          <button on:click={toggleVisible}>Close</button>
        </div>
      </div>
      <div class="content">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Odio
          facilisis mauris sit amet massa vitae tortor. Ipsum faucibus vitae
          aliquet nec ullamcorper sit amet. At tempor commodo ullamcorper a
          lacus vestibulum. Tempor id eu nisl nunc mi ipsum faucibus vitae
          aliquet. Netus et malesuada fames ac turpis. Nullam vehicula ipsum a
          arcu cursus. Justo donec enim diam vulputate ut. Molestie at elementum
          eu facilisis sed odio. Ac orci phasellus egestas tellus rutrum tellus
          pellentesque. Dignissim suspendisse in est ante. Et odio pellentesque
          diam volutpat commodo sed. Feugiat nisl pretium fusce id velit ut.
          Duis tristique sollicitudin nibh sit amet.
        </p>
      </div>
    </div>
  </div>
{/if}

<style>
  .half-sheet {
    /* transition: transform 0.2s; */
    position: fixed;
    width: 600px;
    max-width: 100%;
  }
  @media only screen and (max-width: 600px) {
    .half-sheet {
      bottom: 0;
      left: 0;
      right: 0;
      border-top: 1px solid #555;
      border-radius: 16px 16px 0 0;
    }
  }
  @media only screen and (min-width: 601px) {
    .half-sheet {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid #555;
      border-radius: 16px;
    }
  }
  .half-sheet-header {
    display: flex;
  }
  .half-sheet-header > * {
    flex: 1 1 1px;
  }
  .half-sheet-header > *:nth-child(2) {
    text-align: center;
  }
  .half-sheet-header > *:nth-child(3) {
    text-align: right;
  }
  h3 {
    margin: 0;
  }
  .half-sheet h3 {
    padding: 4px 0;
  }
  button {
    font-size: 1rem;
  }
  .cover {
    position: fixed;
    inset: 0 0 0 0;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .content {
    padding: 0 16px;
  }
</style>
