<script lang="ts">
  import worker from "app-counter/src/Worker?worker";

  import { ClientWorker } from "app-counter/src/Client/ClientWorker";
  import { onMount } from "svelte";
  import type { EventMessage } from "app-counter/src/shared/EventMessage";

  let cli = new ClientWorker(new worker());

  let num: number = 0;
  let numReactivo: number = 0;

  function runError() {
    cli.postEvent("TestApp", "runTest");
  }

  function generateNumber(): number {
    return parseInt(Math.random() * 100);
  }

  async function randomizeGET() {
    let dat = await cli.postEventReturn(
      "Counter",
      "SetCount",
      generateNumber()
    );
    num = dat.returnData;
  }

  async function randomizeSET() {
    let dat = await cli.postEvent("Counter", "SetCount", generateNumber());
  }

  onMount(initializeReactive);
  function initializeReactive() {
    cli.observeEvent("Counter", "SetCount", (ev: EventMessage<number>) => {
      if (ev.returnData !== undefined) numReactivo = ev.returnData;
    });
  }
</script>

<main style="display: flex; width: 100%">
  <u style="margin: 10px">
    It's necessary to see console to view worker events
  </u>

  <div style="display: flex; align-items: center;">
    <button style="margin: 10px;" on:click={randomizeSET}>
      Randomize Async
    </button>
    <h3 style="text-align: left; padding: 0; margin: 0;">
      Reactivo: {numReactivo}
    </h3>
  </div>

  <div style="display: flex; align-items: center;">
    <button style="margin: 10px;" on:click={randomizeGET}>
      Randomize Sync
    </button>
    <h3 style="text-align: left; padding: 0; margin: 0;">
      Return: {num}
    </h3>
  </div>

  <button on:click={runError} style="margin: 10px;"> Run test error </button>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
  }
</style>
