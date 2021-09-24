import { IAkamaiHelper } from "../helpers/iakamaihelper";
import { IReportHelper } from "../helpers/ireporthelper";

export interface IHelperFactory {

    createAkamaiHelper(): Promise<IAkamaiHelper>;
    createReportHelper(): Promise<IReportHelper>;

}
