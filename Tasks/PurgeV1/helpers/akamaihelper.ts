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

    public async deleteUrlCache(network: string, hostname: string, objects: string[]): Promise<IPurgeResult> {

        const debug = this.debugLogger.extend(this.deleteUrlCache.name);

        const path: string = `/ccu/v3/delete/url/${network}`;

        const body: unknown = {

            hostname,
            objects,

        };

        const result: IPurgeResult = await this.edgegridClient.post<IPurgeResult>(path, body);

        if (!result) {

            throw new Error(`No purge results received`);

        }

        debug(result);

        return result;

    }

    public async invalidateUrlCache(network: string, urls: string[]): Promise<IPurgeResult> {

        const debug = this.debugLogger.extend(this.invalidateUrlCache.name);

        const path: string = `/ccu/v3/invalidate/url/${network}`;

        const body: unknown = {

            objects: urls,

        };

        const result: IPurgeResult = await this.edgegridClient.post<IPurgeResult>(path, body);

        if (!result) {

            throw new Error(`No purge results received`);

        }

        debug(result);

        return result;

    }

    public async deleteCPCodeCache(network: string, hostname: string, objects: string[]): Promise<IPurgeResult> {

        const debug = this.debugLogger.extend(this.deleteCPCodeCache.name);

        const path: string = `/ccu/v3/delete/cpcode/${network}`;

        const body: unknown = {

            hostname,
            objects,

        };

        const result: IPurgeResult = await this.edgegridClient.post<IPurgeResult>(path, body);

        if (!result) {

            throw new Error(`No purge results received`);

        }

        debug(result);

        return result;

    }

    public async invalidateCPCodeCache(network: string, cpcodes: string[]): Promise<IPurgeResult> {

        const debug = this.debugLogger.extend(this.invalidateCPCodeCache.name);

        const path: string = `/ccu/v3/invalidate/cpcode/${network}`;

        const body: unknown = {

            objects: cpcodes,

        };

        const result: IPurgeResult = await this.edgegridClient.post<IPurgeResult>(path, body);

        if (!result) {

            throw new Error(`No purge results received`);

        }

        debug(result);

        return result;

    }
}
