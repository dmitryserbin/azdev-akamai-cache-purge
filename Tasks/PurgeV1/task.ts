/* eslint-disable @typescript-eslint/no-explicit-any */

import { IEndpoint } from "./interfaces/common/iendpoint";
import { IParameters } from "./interfaces/common/iparameters";
import { ITaskHelper } from "./interfaces/helpers/itaskhelper";
import { TaskHelper } from "./helpers/taskhelper";
import { IDebugCreator } from "./interfaces/loggers/idebugcreator";
import { DebugCreator } from "./loggers/debugcreator";
import { ConsoleLogger } from "./loggers/consolelogger";
import { IConsoleLogger } from "./interfaces/loggers/iconsolelogger";
import { IApiFactory } from "./interfaces/factories/iapifactory";
import { ApiFactory } from "./factories/apifactory";
import { IHelperFactory } from "./interfaces/factories/ihelperfactory";
import { HelperFactory } from "./factories/helperfactory";
import { IAkamaiHelper } from "./interfaces/helpers/iakamaihelper";
import { IReportHelper } from "./interfaces/helpers/ireporthelper";
import { IPurger } from "./interfaces/workers/ipurger";
import { Purger } from "./workers/purger";

async function run() {

    const debugCreator: IDebugCreator = new DebugCreator("akamaicachepurge");
    const consoleLogger: IConsoleLogger = new ConsoleLogger();

    const taskHelper: ITaskHelper = new TaskHelper(debugCreator);

    try {

        const endpoint: IEndpoint = await taskHelper.getEndpoint("edgegridEndpoint");
        const parameters: IParameters = await taskHelper.getParameters();

        const apiFactory: IApiFactory = new ApiFactory(endpoint, debugCreator);
        const helperFactory: IHelperFactory = new HelperFactory(apiFactory, debugCreator);
        const akamaiHelper: IAkamaiHelper = await helperFactory.createAkamaiHelper();
        const reportHelper: IReportHelper = await helperFactory.createReportHelper();

        const purger: IPurger = new Purger(akamaiHelper, reportHelper, debugCreator, consoleLogger);

        await purger.purge(parameters);

    } catch (error: any) {

        await taskHelper.fail(error.message);

    }

}

run();
