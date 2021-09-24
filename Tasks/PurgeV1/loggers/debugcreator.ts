
import Debug from "debug";

import { IDebugCreator } from "../interfaces/loggers/idebugcreator";
import { IDebugLogger } from "../interfaces/loggers/idebuglogger";

export class DebugCreator implements IDebugCreator {

    private debugLogger: IDebugLogger;

    constructor(name: string) {

        this.debugLogger = Debug(name);

    }

    public extend(name: string): IDebugLogger {

        return this.debugLogger.extend(name);

    }

}
