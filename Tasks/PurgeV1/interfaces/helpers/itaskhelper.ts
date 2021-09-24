import { IEndpoint } from "../common/iendpoint";
import { IParameters } from "../common/iparameters";

export interface ITaskHelper {

    getEndpoint(parameterName: string): Promise<IEndpoint>;
    getParameters(): Promise<IParameters>;
    fail(message: string): Promise<void>;

}
