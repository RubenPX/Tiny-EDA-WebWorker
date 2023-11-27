abstract class EventObservable<dataType> {
    abstract methodName: string;

    constructor() {

    }

    abstract publishChange: (publisher: (data: dataType) => void) => void;
}
