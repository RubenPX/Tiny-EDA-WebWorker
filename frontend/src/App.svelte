<script lang="ts">
  import worker from "app-counter/src/Worker?worker";

  import { ClientWorker } from "app-counter/src/ClientWorker";

  let cli = new ClientWorker(new worker());

  let num: number = 0;

  function runError() {
    cli.postEvent("TestApp", "runTest");
  }

  function plusOneCount() {
    let num = parseInt(Math.random() * 100);
    cli.postEvent("Counter", "SetCount", num);
  }

  async function minusOneCount() {
    let newNum = parseInt(Math.random() * 100);
    let dat = await cli.postEventReturn("Counter", "SetCount", newNum);
    num = dat.returnData;
  }

  function initializeReactive() {}
</script>

<main style="margin: 10px;">
  <button on:click={runError} style="margin-bottom: 20px;">
    Reset count to 0
  </button>
  <div
    style="display: flex; align-items: center; justify-content: space-around;"
  >
    <button on:click={minusOneCount}>-1</button>
    <h3 style="text-align: center; padding: 0; margin: 0;">Contador: {num}</h3>
    <button on:click={plusOneCount}>+1</button>
  </div>
  <button on:click={runError} style="margin-top: 20px;">Run test error</button>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
  }
</style>
