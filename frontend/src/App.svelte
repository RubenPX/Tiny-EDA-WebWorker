<script lang="ts">
  import worker from "@eda/app/src/shared/WorkerManager?worker";
  import {
    ClientWorkerManager,
    clientRoutes,
    APIBuilder,
    APIRunner,
  } from "@eda/app/src/shared/Client/ClientWorkerManager";
  import { onMount } from "svelte";

  let app = new ClientWorkerManager(new worker());

  let num = NaN;
  let numReactivo = NaN;

  function getRandomNumber(): number {
    return parseInt(Math.random() * 100 + "");
  }

  async function runWithReturn() {
    const builder = new APIBuilder(clientRoutes.Counter.SetCount, app);
    const runner = new APIRunner(builder);
    num = await runner.run(getRandomNumber());
  }

  async function runWithSet() {
    const builder = new APIBuilder(clientRoutes.Counter.SetCount, app);
    const runner = new APIRunner(builder);
    await runner.run(getRandomNumber());
  }

  async function runError() {
    const builder = new APIBuilder(clientRoutes.Counter.ErrorCount, app);
    new APIRunner(builder)
      .run()
      .then(() => console.log("Oh oh"))
      .catch(() => console.log("Yeah one error!!!"));
  }

  // app.observe(clientRoutes.Counter.SetCount(), (ev) => {
  //   numReactivo = ev.returnData;
  // });

  onMount(async () => {
    const builder = new APIBuilder(clientRoutes.Counter.GetCount, app);
    const runner = new APIRunner(builder);
    numReactivo = await runner.run();

    const b2 = new APIBuilder(clientRoutes.Counter.SetCount, app);
    const r2 = new APIRunner(b2);
    r2.observe((evMsg) => {
      numReactivo = evMsg.returnData ?? -1;
    });
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
