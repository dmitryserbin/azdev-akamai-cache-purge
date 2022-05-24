import "mocha";

import { IEndpoint } from "../../interfaces/common/iendpoint";
import { IParameters } from "../../interfaces/common/iparameters";
import { IApiFactory } from "../../interfaces/factories/iapifactory";
import { ApiFactory } from "../../factories/apifactory";
import { HelperFactory } from "../../factories/helperfactory";
import { IHelperFactory } from "../../interfaces/factories/ihelperfactory";
import { IAkamaiHelper } from "../../interfaces/helpers/iakamaihelper";
import { IDebugCreator } from "../../interfaces/loggers/idebugcreator";
import { IConsoleLogger } from "../../interfaces/loggers/iconsolelogger";
import { ConsoleLogger } from "../../loggers/consolelogger";
import { DebugCreator } from "../../loggers/debugcreator";
import { IPurger } from "../../interfaces/workers/ipurger";
import { Purger } from "../../workers/purger";
import { IReportHelper } from "../../interfaces/helpers/ireporthelper";
import { PurgeType } from "../../helpers/purgeType";
import { PurgeMethod } from "../../helpers/purgeMethod";

describe("Purger", async () => {

    const endpoint: IEndpoint = {

        url: process.env.url ?? "",
        clientSecret: process.env.clientSecret ?? "",
        clientToken: process.env.clientToken ?? "",
        accessToken: process.env.accessToken ?? "",

    };

    const parameters: IParameters = {

        network: "staging",
        purgeType: PurgeType.url,
        purgeMethod: PurgeMethod.invalidate,
        urls: [
            "http://time.akau.devops.akademo.it/one",
            "http://time.akau.devops.akademo.it/two",
        ],
        cpCodes: [],
        wait: true,

    };

    beforeEach(async () => {

        // TBU

    });

    afterEach(async () => {

        // TBU

    });

    it("Run @manual", async () => {

        const debugCreator: IDebugCreator = new DebugCreator("akamaicachepurge");
        const consoleLogger: IConsoleLogger = new ConsoleLogger();

        const apiFactory: IApiFactory = new ApiFactory(endpoint, debugCreator);
        const helperFactory: IHelperFactory = new HelperFactory(apiFactory, debugCreator);

        const akamaiHelper: IAkamaiHelper = await helperFactory.createAkamaiHelper();
        const reportHelper: IReportHelper = await helperFactory.createReportHelper();

        const purger: IPurger = new Purger(akamaiHelper, reportHelper, debugCreator, consoleLogger);

        await purger.purge(parameters);

    });

});
