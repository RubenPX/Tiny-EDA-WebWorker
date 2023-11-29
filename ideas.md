# Borrador de ideas para pensar

## 1. [Patrón builder](https://refactoring.guru/design-patterns/builder)

> [!note]
> La idea del patrón de código builder es ir construyendo la request poco a poco

```typescript
let builder = ApiBuilder();

// Cada setFilter se comporta como un OR y su lista de propiedades se comporta como un AND
// Un filtro se puede volver a modificar 
builder.setFilter("id_filtro", (objeto: any) => { ... })

// Este sort tiene que devolver UNO de los siguientes valores (-1: A es inferior a B) (0: A es lo mismo que B) (1: A es superior a B)
builder.sort((a: any, b: any) => { ... })


let executor = new ApiRunner(builder);

// Esto define que los datos cadavez que cambien se notificaran y ejecutaran el lambda
executor.observe((datos: any) => { ... });

// Se espera que el valor se conseguira de forma manual
let data = await executor.getData();
```

> ## Caso de uso de ejemplo
>
> Se desea crear una request que consiga las 10 primeras preguntas de una programa enfocado a preguntas tipo test
```typescript
/** PreguntaDTO[]
 * id: id unico de la pregunta
 * opciones: lista de posibles opciones
 * resuesta: indice de la opción correcta en la lista de opciones
 */
type pregunta { id: number, opciones: string[], respuesta: number }

let builder = ApiBuilder('GetPreguntas');
builder.setFilter("preguntas", (objeto: any) => { 
    if (objeto.id > 0 && 10 < objeto.id) return true
    return false;
})

let executor = new ApiRunner(builder);
let listaPreguntas = await executor.getData();

// Se puede simlificar tambien asi
let listaPreguntas = await new ApiRunner(builder).getData();
```

La ventaja de este patrón es que el desarrollador puede facilmente desarrollar las requests sin tener que preocuparse de hacerlo manualmente. Ademas otra ventaja es que el creador de la libreria tiene libre decision de crear el comportamiento como quiera