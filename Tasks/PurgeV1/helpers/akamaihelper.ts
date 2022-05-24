import { IEdgeGridClient } from "../interfaces/common/iedgegridclient";
import { IAkamaiHelper } from "../interfaces/helpers/iakamaihelper";
import { IPurgeResult } from "../interfaces/helpers/ipurgeresult";
import { IDebugCreator } from "../interfaces/loggers/idebugcreator";
import { IDebugLogger } from "../interfaces/loggers/idebuglogger";

export class AkamaiHelper implements IAkamaiHelper {

    private edgegridClient: IEdgeGridClient;
    private debugLogger: IDebugLogger;

    constructor(edgegridClient: IEdgeGridClient, debugCreator: IDebugCreator) {

        this.edgegridClient = edgegridClient;
        this.debugLogger = debugCreator.extend(this.constructor.name);

    }

    public async deleteUrlCache(network: string, urls: string[]): Promise<IPurgeResult> {

        const debug = this.debugLogger.extend(this.deleteUrlCache.name);

        const path = `/ccu/v3/delete/url/${network}`;

        const body: unknown = {

            objects: urls,

        };

        const result: IPurgeResult = await this.edgegridClient.post<IPurgeResult>(path, body);

        if (!result) {

            throw new Error("No purge results received");

        }

        debug(result);

        return result;

    }

    public async invalidateUrlCache(network: string, urls: string[]): Promise<IPurgeResult> {

        const debug = this.debugLogger.extend(this.invalidateUrlCache.name);

        const path = `/ccu/v3/invalidate/url/${network}`;

        const body: unknown = {

            objects: urls,

        };

        const result: IPurgeResult = await this.edgegridClient.post<IPurgeResult>(path, body);

        if (!result) {

            throw new Error("No purge results received");

        }

        debug(result);

        return result;

    }

    public async deleteCPCodeCache(network: string, cpCodes: number[]): Promise<IPurgeResult> {

        const debug = this.debugLogger.extend(this.deleteCPCodeCache.name);

        const path = `/ccu/v3/delete/cpcode/${network}`;

        const body: unknown = {

            objects: cpCodes,

        };

        const result: IPurgeResult = await this.edgegridClient.post<IPurgeResult>(path, body);

        if (!result) {

            throw new Error("No purge results received");

        }

        debug(result);

        return result;

    }

    public async invalidateCPCodeCache(network: string, cpCodes: number[]): Promise<IPurgeResult> {

        const debug = this.debugLogger.extend(this.invalidateCPCodeCache.name);

        const path = `/ccu/v3/invalidate/cpcode/${network}`;

        const body: unknown = {

            objects: cpCodes,

        };

        const result: IPurgeResult = await this.edgegridClient.post<IPurgeResult>(path, body);

        if (!result) {

            throw new Error("No purge results received");

        }

        debug(result);

        return result;

    }

}
