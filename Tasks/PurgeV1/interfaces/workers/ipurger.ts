import { IParameters } from "../common/iparameters";

export interface IPurger {

    purge(parameters: IParameters): Promise<void>;

}
