abstract class Observable<dataType> {
    abstract methodName: string;

    constructor() {

    }

    abstract publishChange: (publisher: (data: dataType) => void) => void;
}
