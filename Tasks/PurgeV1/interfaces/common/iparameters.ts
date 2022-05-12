import { PurgeType } from "../../helpers/purgetype";
import { PurgeMethod } from "../../helpers/purgemethod";

export interface IParameters {

    network: string;
    purgetype: PurgeType;
    purgemethod: PurgeMethod;
    hostname: string;
    urls: string[];
    cpcodes: string[];
    wait: boolean;

}
