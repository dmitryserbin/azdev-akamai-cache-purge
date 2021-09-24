import { getInput, getEndpointUrl, setResult, TaskResult, getEndpointAuthorization, EndpointAuthorization, getDelimitedInput, getBoolInput } from "azure-pipelines-task-lib/task";

import { ITaskHelper } from "../interfaces/helpers/itaskhelper";
import { IEndpoint } from "../interfaces/common/iendpoint";
import { IParameters } from "../interfaces/common/iparameters";
import { IDebugCreator } from "../interfaces/loggers/idebugcreator";
import { IDebugLogger } from "../interfaces/loggers/idebuglogger";

export class TaskHelper implements ITaskHelper {

    private debugLogger: IDebugLogger;

    constructor(debugCreator: IDebugCreator) {

        this.debugLogger = debugCreator.extend(this.constructor.name);

    }

    public async getEndpoint(parameterName: string): Promise<IEndpoint> {

        const debug = this.debugLogger.extend(this.getEndpoint.name);

        const endpointName: string | undefined = getInput(parameterName, true);

        if (!endpointName) {

            throw new Error(`Unable to get <${parameterName}> input parameter`);

        }

        const endpointUrl: string | undefined = getEndpointUrl(endpointName, false);

        if (!endpointUrl) {

            throw new Error(`Unable to get <${endpointName}> endpoint URL`);

        }

        const endpointAuthorization: EndpointAuthorization | undefined = getEndpointAuthorization(endpointName, false);

        if (!endpointAuthorization) {

            throw new Error(`Unable to get <${endpointName}> endpoint authorization`);

        }

        const clientSecret: string | undefined = endpointAuthorization.parameters["clientsecret"];
        const clientToken: string | undefined = endpointAuthorization.parameters["clienttoken"];
        const accessToken: string | undefined = endpointAuthorization.parameters["accesstoken"];

        if (!clientSecret) {

            throw new Error(`Unable to get <${endpointName}> client secret`);

        }

        if (!clientToken) {

            throw new Error(`Unable to get <${endpointName}> client token`);

        }

        if (!accessToken) {

            throw new Error(`Unable to get <${endpointName}> access token`);

        }

        const endpoint: IEndpoint = {

            url: endpointUrl,
            clientSecret,
            clientToken,
            accessToken,

        };

        debug(endpoint);

        return endpoint;

    }

    public async getParameters(): Promise<IParameters> {

        const debug = this.debugLogger.extend(this.getParameters.name);

        const network: string | undefined = getInput("network", true);

        if (!network) {

            throw new Error(`Parameter <network> is empty`);

        }

        const urls: string[] | undefined = getDelimitedInput("urls", "\n", true);

        if (Array.isArray(urls) && urls.length < 0) {

            throw new Error(`Parameter <urls> is empty`);

        }

        const wait: boolean = getBoolInput("wait", false);

        const parameters: IParameters = {

            network,
            urls,
            wait,

        };

        debug(parameters);

        return parameters;

    }

    public async fail(message: string): Promise<void> {

        setResult(TaskResult.Failed, message);

    }

}
