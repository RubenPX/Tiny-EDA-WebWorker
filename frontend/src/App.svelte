<script lang="ts">
  import worker from "@eda/app/src/shared/WorkerManager?worker";
  import { ClientWorkerManager } from "@eda/app/src/shared/Client/ClientWorkerManager";
  import { APIBuilder } from "@eda/app/src/shared/Client/APIBuilder";
  import { APIRunner } from "@eda/app/src/shared/Client/APIRunner";

  let app = new ClientWorkerManager(new worker(), async (routes) => {
    console.log({ routes });

    // Getting first value
    let runner = APIRunner.instanceBasic(app, app.Routes.CounterFeature.GetCount);
    numReactivo = (await runner.run()) ?? -1;

    // Example observer
    APIRunner.instanceBasic(app, app.Routes.CounterFeature.SetCount).observe(
      (evMsg) => {
        numReactivo = evMsg.returnData ?? NaN;
      }
    );
  });

  let num = NaN;
  let numReactivo = NaN;

  function getRandomNumber(): number {
    return parseInt(Math.random() * 100 + "");
  }

  async function runWithReturn() {
    const builder = new APIBuilder(app.Routes.CounterFeature.SetCount, app);
    const runner = new APIRunner(builder);
    num = (await runner.run(getRandomNumber())) ?? -1;
  }

  async function runWithSet() {
    const builder = new APIBuilder(app.Routes.CounterFeature.SetCount, app);
    const runner = new APIRunner(builder);
    await runner.run(getRandomNumber());
  }

  async function runError() {
    const builder = new APIBuilder(app.Routes.CounterFeature.ErrorCount, app);
    new APIRunner(builder)
      .run()
      .then(() => console.log("Oh oh"))
      .catch((err) => console.error("Yeah one error!!!", err));
  }
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
