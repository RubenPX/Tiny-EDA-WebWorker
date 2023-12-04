<script lang="ts">
  import worker from "@eda/app/src/shared/WorkerManager?worker";
  import {
    ClientWorkerManager,
    clientRoutes,
  } from "@eda/app/src/shared/ClientWorkerManager";
  import { onMount } from "svelte";

  let app = new ClientWorkerManager(new worker());

  onMount(() => {
    console.log(clientRoutes.Counter.GetCount(undefined));
  });
</script>

<main style="display: flex; width: 100%">
  <u style="margin: 10px">
    It's necessary to see console to view worker events
  </u>

  <!-- <div style="display: flex; align-items: center;">
    <button style="margin: 10px;" on:click={randomizeSET}>
      Randomize ASync
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

  <button on:click={runError} style="margin: 10px;"> Run test error </button> -->
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
  }
</style>
