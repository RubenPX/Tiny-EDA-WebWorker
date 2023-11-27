<script lang="ts">
  import worker from "app-counter/src/Worker?worker";

  import { ClientWorker } from "app-counter/src/ClientWorker";

  let cli = new ClientWorker(new worker());

  function runError() {
    cli.postEvent("TestApp", "runTest");
  }

  function plusOneCount() {
    cli.postEvent("Counter", "SetCount", Math.random());
  }

  function minusOneCount() {}

  function initializeReactive() {}
</script>

<main>
  <button on:click={runError}>Run test error</button>
  <div style="display: flex; justify-content: space-around; margin-top: 15px;">
    <button on:click={minusOneCount}>-1</button>
    <button on:click={plusOneCount}>+1</button>
  </div>
  <h3>Contador: 2</h3>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
  }
</style>
