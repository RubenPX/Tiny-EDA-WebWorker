# Tiny WebWorker Event Driven Architecture

[![wakatime](https://wakatime.com/badge/user/3ea03d5e-dec1-4bb5-a47d-7e8b1813388b/project/018bd4f5-a300-4078-8ede-68ffb2a17c5c.svg)](https://wakatime.com/@RubenPX/projects/lollcpagon)

La idea de este proyecto es crear un proyecto base donde se use una arquitectura basada en eventos para usarlo con WebWorker

## Comunicación entre el navegador y el WebWorker (Sincrono)

```mermaid
stateDiagram-v2
    state client_start <<fork>>
    note left of client_start : Send event to worker

    state worker_start <<join>>
    note left of worker_start : Recive event to worker

    state worker_end <<join>>
    note right of worker_end : Send event to client

    state client_end <<fork>>
    note right of client_end : Recive event from worker
    
    %% Request flow

    [*] --> client_start: Request 
    
    state client {
        client_start --> worker_start
    }

    state is_observer <<choice>>

    state Worker {
        worker_start --> is_observer: is observer?
        is_observer --> worker_end

        is_observer --> observer
        observer --> worker_end
        note left of observer : If observer detect\n value has changed\n it will trigger

        worker_end --> client_end
    }

    state client {
        client_end
    }

    client_end --> [*]: Response

class observer badBadEvent
classDef badBadEvent fill:#058,color:white,font-weight:bold
```

> [!note]
> Descripción aun por terminar (Probablemente se hara en inglés)
