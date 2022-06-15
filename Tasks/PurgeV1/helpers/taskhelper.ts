import { EndpointAuthorization, TaskResult, getBoolInput, getDelimitedInput, getEndpointAuthorization, getEndpointUrl, getInput, setResult } from "azure-pipelines-task-lib/task";

import { ITaskHelper } from "../interfaces/helpers/itaskhelper";
import { IEndpoint } from "../interfaces/common/iendpoint";
import { IParameters } from "../interfaces/common/iparameters";
import { IDebugCreator } from "../interfaces/loggers/idebugcreator";
import { IDebugLogger } from "../interfaces/loggers/idebuglogger";
import { PurgeType } from "./purgeType";
import { PurgeMethod } from "./purgeMethod";

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

            throw new Error("Parameter <network> is empty");

        }

        const purgeType: string | undefined = getInput("purgeType", true);

        if (!purgeType) {

            throw new Error("Parameter <purgeType> is empty");

        }

        const purgeMethod: string | undefined = getInput("purgeMethod", true);

        if (!purgeMethod) {

            throw new Error("Parameter <purgeMethod> is empty");

        }

        const wait: boolean = getBoolInput("wait", false);

        let parameters: IParameters = {

            network,
            purgeType: PurgeType.url,
            purgeMethod: PurgeMethod.invalidate,
            urls: [],
            cpCodes: [],
            wait,

        };

        switch (purgeType.toLowerCase()) {

            case "url": {

                parameters = await this.readUrlInputs(parameters);

                break;

            } case "cpcode": {

                parameters = await this.readCPCodeInputs(parameters);

                break;

            } default : {

                throw new Error("Invalid purge type");

            }

        }

        switch (purgeMethod.toLowerCase()) {

            case "delete": {

                parameters.purgeMethod = PurgeMethod.delete;

                break;

            } case "invalidate": {

                parameters.purgeMethod = PurgeMethod.invalidate;

                break;

            } default : {

                throw new Error("Invalid purge method");

            }

        }

        debug(parameters);

        return parameters;

    }

    public async fail(message: string): Promise<void> {

        setResult(TaskResult.Failed, message);

    }

    private async readUrlInputs(parameters: IParameters): Promise<IParameters> {

        parameters.purgeType = PurgeType.url;

        const urls: string[] | undefined = getDelimitedInput("urls", "\n", true);

        if (Array.isArray(urls) && urls.length < 1) {

            throw new Error("Parameter <urls> is empty");

        }

        parameters.urls = urls;

        return parameters;

    }

    private async readCPCodeInputs(parameters: IParameters): Promise<IParameters> {

        parameters.purgeType = PurgeType.cpCode;

        const cpCodes: string[] | undefined = getDelimitedInput("cpCodes", "\n", true);

        if (Array.isArray(cpCodes) && cpCodes.length < 0) {

            throw new Error("Parameter <cpCodes> is empty");

        }

        for (const value of cpCodes) {

            parameters.cpCodes.push(Number(value));

        }

        return parameters;

    }

}
