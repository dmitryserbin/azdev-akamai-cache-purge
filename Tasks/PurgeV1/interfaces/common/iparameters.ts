import { PurgeType } from "../../helpers/purgeType";
import { PurgeMethod } from "../../helpers/purgeMethod";

export interface IParameters {

    network: string;
    purgeType: PurgeType;
    purgeMethod: PurgeMethod;
    urls: string[];
    cpCodes: number[];
    wait: boolean;

}
