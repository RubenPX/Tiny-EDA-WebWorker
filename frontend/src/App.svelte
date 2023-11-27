<script lang="ts">
  import worker from "app-counter/src/Worker?worker";

  import { ClientWorker } from "app-counter/src/ClientWorker";

  let cli = new ClientWorker(new worker());

  function runError() {
    cli.postEvent("TestApp", "runTest");
  }
</script>

<main>
  <button on:click={runError}>Run test error</button>
</main>
