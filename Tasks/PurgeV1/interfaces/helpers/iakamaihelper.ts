import { IPurgeResult } from "./ipurgeresult";

export interface IAkamaiHelper {

    deleteUrlCache(network: string, urls: string[]): Promise<IPurgeResult>;
    invalidateUrlCache(network: string, urls: string[]): Promise<IPurgeResult>;
    deleteCPCodeCache(network: string, cpCodes: number[]): Promise<IPurgeResult>;
    invalidateCPCodeCache(network: string, cpCodes: number[]): Promise<IPurgeResult>;

}
