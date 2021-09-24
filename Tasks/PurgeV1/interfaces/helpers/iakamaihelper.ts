import { IPurgeResult } from "./ipurgeresult";

export interface IAkamaiHelper {

    deleteUrlCache(network: string, hostname: string, objects: string[]): Promise<IPurgeResult>;
    invalidateUrlCache(network: string, urls: string[]): Promise<IPurgeResult>;

}
