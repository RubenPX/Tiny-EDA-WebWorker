<script lang="ts">
  import worker from "@eda/app/src/shared/WorkerManager?worker";
  import {
    ClientWorkerManager,
    clientRoutes,
  } from "@eda/app/src/shared/ClientWorkerManager";
  import { onMount } from "svelte";

  let app = new ClientWorkerManager(new worker());

  let num = NaN;
  let numReactivo = NaN;

  function getRandomNumber(): number {
    return parseInt(Math.random() * 100 + "");
  }

  async function runWithReturn() {
    const setCountMsg = clientRoutes.Counter.SetCount(getRandomNumber());
    let data = await app.postMessageReturn<number, number>(setCountMsg);

    num = data.returnData ?? -1;
  }

  async function runWithSet() {
    const setCountMsg = clientRoutes.Counter.SetCount(getRandomNumber());
    app.postMessage(setCountMsg);
  }

  async function runError() {
    const errCountMsg = clientRoutes.Counter.ErrorCount();
    app
      .postMessageReturn<number, number>(errCountMsg)
      .then((ev) => console.log("Oh no", ev))
      .catch((ev) => console.error("Yeah it's a error", ev));
  }

  app.observe(clientRoutes.Counter.SetCount(), (ev) => {
    numReactivo = ev.returnData;
  });

  onMount(async () => {
    const getCount = clientRoutes.Counter.GetCount();
    let data = await app.postMessageReturn<number, undefined>(getCount);

    num = data.returnData ?? -1;
  });
</script>

<main style="display: flex; width: 100%">
  <u style="margin: 10px">
    It's necessary to see console to view worker events
  </u>

  <div style="display: flex; align-items: center;">
    <button style="margin: 10px;" on:click={runWithSet}>
      Randomize Observe
    </button>
    <h3 style="text-align: left; padding: 0; margin: 0;">
      Reactivo: {numReactivo}
    </h3>
  </div>

  <div style="display: flex; align-items: center;">
    <button style="margin: 10px;" on:click={runWithReturn}>
      Randomize Set
    </button>
    <h3 style="text-align: left; padding: 0; margin: 0;">
      Return: {num}
    </h3>
  </div>

  <button style="margin: 10px;" on:click={runError}> Run test error </button>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
  }
</style>
