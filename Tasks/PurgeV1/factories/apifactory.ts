/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-var-requires */

const EdgeGrid = require("edgegrid");

import { IApiFactory } from "../interfaces/factories/iapifactory";
import { IDebugCreator } from "../interfaces/loggers/idebugcreator";
import { IDebugLogger } from "../interfaces/loggers/idebuglogger";
import { IEndpoint } from "../interfaces/common/iendpoint";
import { IEdgeGridClient } from "../interfaces/common/iedgegridclient";
import { EdgeGridClient } from "../common/edgegridclient";

export class ApiFactory implements IApiFactory {

    private edgeGrid: object;
    private debugLogger: IDebugLogger;

    constructor(endpoint: IEndpoint, debugCreator: IDebugCreator) {

        this.debugLogger = debugCreator.extend(this.constructor.name);

        this.debugLogger(`Initializing <${endpoint.url}> EdgeGrid API`);

        this.edgeGrid = new EdgeGrid(endpoint.clientToken, endpoint.clientSecret, endpoint.accessToken, endpoint.url);

    }

    public async createEdgegridClient(): Promise<IEdgeGridClient> {

        const debug = this.debugLogger.extend(this.createEdgegridClient.name);

        debug("Creating EdgeGrid API client");

        const edgegridClient: IEdgeGridClient = new EdgeGridClient(this.edgeGrid, this.debugLogger);

        return edgegridClient;

    }

}
