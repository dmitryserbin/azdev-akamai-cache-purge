/* eslint-disable @typescript-eslint/no-explicit-any */

import { IAkamaiHelper } from "../interfaces/helpers/iakamaihelper";
import { IParameters } from "../interfaces/common/iparameters";
import { IConsoleLogger } from "../interfaces/loggers/iconsolelogger";
import { IDebugCreator } from "../interfaces/loggers/idebugcreator";
import { IDebugLogger } from "../interfaces/loggers/idebuglogger";
import { IPurgeResult } from "../interfaces/helpers/ipurgeresult";
import { IReportHelper } from "../interfaces/helpers/ireporthelper";
import { IPurger } from "../interfaces/workers/ipurger";
import { PurgeType } from "../helpers/purgeType";
import { PurgeMethod } from "../helpers/purgeMethod";

export class Purger implements IPurger {

    private debugLogger: IDebugLogger;
    private consoleLogger: IConsoleLogger;
    private akamaiHelper: IAkamaiHelper;
    private reportHelper: IReportHelper;

    constructor(akamaiHelper: IAkamaiHelper, reportHelper: IReportHelper, debugCreator: IDebugCreator, consoleLogger: IConsoleLogger) {

        this.akamaiHelper = akamaiHelper;
        this.reportHelper = reportHelper;
        this.debugLogger = debugCreator.extend(this.constructor.name);
        this.consoleLogger = consoleLogger;

    }

    public async purge(parameters: IParameters): Promise<void> {

        const debug = this.debugLogger.extend(this.purge.name);
        let purge: IPurgeResult;

        this.consoleLogger.log(`Purging Akamai Edge <${parameters.network}> network content cache`);

        debug(`Starting <${PurgeType[parameters.purgeType]}> Akamai purge process`)

        switch (parameters.purgeType) {

            case PurgeType.url: {

                this.consoleLogger.log(this.reportHelper.getUrls(parameters.urls, parameters.network));

                switch (parameters.purgeMethod) {

                    case PurgeMethod.delete: {

                        this.consoleLogger.log(`Performing <Delete> purge method on provided URLs`)

                         purge = await this.akamaiHelper.deleteUrlCache(parameters.network, parameters.urls);

                        break;

                    } case PurgeMethod.invalidate: {

                        this.consoleLogger.log(`Performing <Invalidate> purge method on provided URLs`)

                        purge = await this.akamaiHelper.invalidateUrlCache(parameters.network, parameters.urls);

                        break;

                    }
                }

                break;

            } case PurgeType.cpCode: {

                this.consoleLogger.log(this.reportHelper.getCPCodes(parameters.cpCodes, parameters.network));

                switch (parameters.purgeMethod) {

                    case PurgeMethod.delete: {

                        this.consoleLogger.log(`Performing <Delete> purge method on provided CP Codes`)

                        purge = await this.akamaiHelper.deleteCPCodeCache(parameters.network, parameters.cpCodes);

                        break;

                    } case PurgeMethod.invalidate: {

                        this.consoleLogger.log(`Performing <Invalidate> purge method on provided CP Codes`)

                        purge = await this.akamaiHelper.invalidateCPCodeCache(parameters.network, parameters.cpCodes);

                        break;

                    }
                }
            }
        }

        if (purge.httpStatus !== 201) {

            throw new Error(`Purge request was not accepted. Response: ${purge.httpStatus} (${purge.title})`);

        }

        this.consoleLogger.log(`Purge request <${purge.purgeId}>  has been accepted`);

        if (parameters.wait) {

            this.consoleLogger.log(`Waiting <${purge.estimatedSeconds}> seconds for purge activation`);

            await this.wait(purge.estimatedSeconds * 1000);

        }

    }

    private async wait(count: number): Promise<void> {

        const debug = this.debugLogger.extend(this.wait.name);

        debug(`Waiting <${count}> milliseconds`);

        return new Promise((resolve) => setTimeout(resolve, count));

    }

}
