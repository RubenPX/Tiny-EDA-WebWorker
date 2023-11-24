<script lang="ts">
  import worker from "app-counter/src/Worker?worker";

  import { ClientWorker } from "app-counter/src/ClientWorker";

  let cli = new ClientWorker(new worker());
</script>

<main></main>
