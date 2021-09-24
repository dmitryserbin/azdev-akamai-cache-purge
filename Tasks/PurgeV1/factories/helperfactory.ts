import { AkamaiHelper } from "../helpers/akamaihelper";
import { ReportHelper } from "../helpers/reporthelper";
import { IEdgeGridClient } from "../interfaces/common/iedgegridclient";
import { IApiFactory } from "../interfaces/factories/iapifactory";
import { IHelperFactory } from "../interfaces/factories/ihelperfactory";
import { IAkamaiHelper } from "../interfaces/helpers/iakamaihelper";
import { IReportHelper } from "../interfaces/helpers/ireporthelper";
import { IDebugCreator } from "../interfaces/loggers/idebugcreator";
import { IDebugLogger } from "../interfaces/loggers/idebuglogger";

export class HelperFactory implements IHelperFactory {

    private apiFactory: IApiFactory;
    private debugLogger: IDebugLogger;

    constructor(apiFactory: IApiFactory, debugCreator: IDebugCreator) {

        this.debugLogger = debugCreator.extend(this.constructor.name);

        this.apiFactory = apiFactory;

    }

    public async createAkamaiHelper(): Promise<IAkamaiHelper> {

        const edgegridClient: IEdgeGridClient = await this.apiFactory.createEdgegridClient();

        return new AkamaiHelper(edgegridClient, this.debugLogger);

    }

    public async createReportHelper(): Promise<IReportHelper> {

        return new ReportHelper(this.debugLogger);

    }

}
