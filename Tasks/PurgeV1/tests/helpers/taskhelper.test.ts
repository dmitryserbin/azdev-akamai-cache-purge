/* eslint-disable @typescript-eslint/no-explicit-any */

import "mocha";

import * as chai from "chai";
import * as TypeMoq from "typemoq";
import * as TaskLibrary from "azure-pipelines-task-lib/task";

import { ImportMock } from "ts-mock-imports";

import { IDebugCreator } from "../../interfaces/loggers/idebugcreator";
import { IDebugLogger } from "../../interfaces/loggers/idebuglogger";
import { TaskHelper } from "../../helpers/taskhelper";
import { ITaskHelper } from "../../interfaces/helpers/itaskhelper";
import { PurgeType } from "../../helpers/purgeType";
import { PurgeMethod } from "../../helpers/purgeMethod";

describe("TaskHelper", ()  => {

    const debugLoggerMock = TypeMoq.Mock.ofType<IDebugLogger>();
    const debugCreatorMock = TypeMoq.Mock.ofType<IDebugCreator>();

    debugCreatorMock.setup((x) => x.extend(TypeMoq.It.isAnyString())).returns(() => debugLoggerMock.target);
    debugLoggerMock.setup((x) => x.extend(TypeMoq.It.isAnyString())).returns(() => debugLoggerMock.target);

    const endpointNameMock: string = "My-Endpoint";
    const endpointUrlMock: string = `https://domain.com`;

    const clientTokenMock: string = "My-Token";
    const clientSecretMock: string = "My-Token";
    const accessTokenMock: string = "My-Token";

    const networkMock: string = "My-Network";
    const waitMock: boolean = true;

    let inputs: {[key: string]: string | string[] | boolean | number[]};
    let variables: {[key: string]: string};

    const taskHelper: ITaskHelper = new TaskHelper(debugCreatorMock.target);

    beforeEach(async () => {

        const getInputMock = ImportMock.mockFunction(TaskLibrary, "getInput");
        getInputMock.callsFake((i: string | number) => { return inputs[i] || null; });

        const getBoolInputMock = ImportMock.mockFunction(TaskLibrary, "getBoolInput");
        getBoolInputMock.callsFake((i: string | number) => { return (typeof inputs[i] === "boolean") ? inputs[i] : false; });

        const getDelimitedInputMock = ImportMock.mockFunction(TaskLibrary, "getDelimitedInput");
        getDelimitedInputMock.callsFake((i: string | number) => { return inputs[i] ? inputs[i].toString().split(",") : []; });

        const getVariableMock = ImportMock.mockFunction(TaskLibrary, "getVariable");
        getVariableMock.callsFake((i: string | number) => { return variables[i] || null; });

        inputs = {};
        variables = {};

    });

    afterEach(async () => {

        ImportMock.restore();

    });

    it("Should get endpoint", async () => {

        //#region ARRANGE

        inputs["edgegridEndpoint"] = endpointNameMock;

        const endpointAuthorizationMock: any = {

            parameters: {
                clientsecret: clientSecretMock,
                clienttoken: clientTokenMock,
                accesstoken: accessTokenMock,
            },

        }

        const getEndpointUrlMock = ImportMock.mockFunction(TaskLibrary, "getEndpointUrl");
        getEndpointUrlMock.callsFake(() => endpointUrlMock);

        const getEndpointAuthorizationMock = ImportMock.mockFunction(TaskLibrary, "getEndpointAuthorization");
        getEndpointAuthorizationMock.callsFake(() => endpointAuthorizationMock);

        //#endregion

        //#region ACT

        const result = await taskHelper.getEndpoint("edgegridEndpoint");

        //#endregion

        //#region ASSERT

        chai.expect(result).to.not.eq(null);
        chai.expect(result.url).to.eq(endpointUrlMock);
        chai.expect(result.clientToken).to.eq(clientTokenMock);
        chai.expect(result.clientSecret).to.eq(clientSecretMock);
        chai.expect(result.accessToken).to.eq(accessTokenMock);

        //#endregion

    });

    it("Should get parameters for URL cache purge with invalidate method", async () => {

        //#region ARRANGE

        const urlsMock: string[] = [ "https://one.com", "http://two.com" ];
        const cpcodesMock: number[] = [];

        inputs["network"] = networkMock;
        inputs["purgeType"] = PurgeType.url;
        inputs["purgeMethod"] = PurgeMethod.Invalidate;
        inputs["urls"] = urlsMock;
        inputs["cpCodes"] = cpcodesMock;
        inputs["wait"] = waitMock;

        //#endregion

        //#region ACT

        const result = await taskHelper.getParameters();

        //#endregion

        //#region ASSERT

        chai.expect(result).to.not.eq(null);
        chai.expect(result.network).to.eq(networkMock);
        chai.expect(result.purgeType).to.eq(PurgeType.url);
        chai.expect(result.purgeMethod).to.eq(PurgeMethod.Invalidate);
        chai.expect(result.urls).to.include.members(urlsMock);
        chai.expect(result.cpCodes).to.include.members(cpcodesMock);
        chai.expect(result.wait).to.eq(waitMock);

        //#endregion

    });

    it("Should get parameters for URL cache purge with delete method", async () => {

        //#region ARRANGE

        const urlsMock: string[] = [ "https://one.com", "http://two.com" ];
        const cpcodesMock: number[] = [];

        inputs["network"] = networkMock;
        inputs["purgeType"] = PurgeType.url;
        inputs["purgeMethod"] = PurgeMethod.Delete;
        inputs["urls"] = urlsMock;
        inputs["cpCodes"] = cpcodesMock;
        inputs["wait"] = waitMock;

        //#endregion

        //#region ACT

        const result = await taskHelper.getParameters();

        //#endregion

        //#region ASSERT

        chai.expect(result).to.not.eq(null);
        chai.expect(result.network).to.eq(networkMock);
        chai.expect(result.purgeType).to.eq(PurgeType.url);
        chai.expect(result.purgeMethod).to.eq(PurgeMethod.Delete);
        chai.expect(result.urls).to.include.members(urlsMock);
        chai.expect(result.cpCodes).to.include.members(cpcodesMock);
        chai.expect(result.wait).to.eq(waitMock);

        //#endregion

    });

    it("Should get parameters for CP Code cache purge with Invalidate method", async () => {

        //#region ARRANGE

        const urlsMock: string[] = [];
        const cpcodesMock: number[] = [ 12345, 67891 ];

        inputs["network"] = networkMock;
        inputs["purgeType"] = PurgeType.cpcode;
        inputs["purgeMethod"] = PurgeMethod.Invalidate;
        inputs["urls"] = urlsMock;
        inputs["cpCodes"] = cpcodesMock;
        inputs["wait"] = waitMock;

        //#endregion

        //#region ACT

        const result = await taskHelper.getParameters();

        //#endregion

        //#region ASSERT

        chai.expect(result).to.not.eq(null);
        chai.expect(result.network).to.eq(networkMock);
        chai.expect(result.purgeType).to.eq(PurgeType.cpcode);
        chai.expect(result.purgeMethod).to.eq(PurgeMethod.Invalidate);
        chai.expect(result.urls).to.include.members(urlsMock);
        chai.expect(result.cpCodes).to.include.members(cpcodesMock);
        chai.expect(result.wait).to.eq(waitMock);

        //#endregion

    });

    it("Should get parameters for CP Code cache purge with delete method", async () => {

        //#region ARRANGE

        const urlsMock: string[] = [];
        const cpcodesMock: number[] = [ 12345, 67891 ];

        inputs["network"] = networkMock;
        inputs["purgeType"] = PurgeType.cpcode;
        inputs["purgeMethod"] = PurgeMethod.Delete;
        inputs["urls"] = urlsMock;
        inputs["cpCodes"] = cpcodesMock;
        inputs["wait"] = waitMock;

        //#endregion

        //#region ACT

        const result = await taskHelper.getParameters();

        //#endregion

        //#region ASSERT

        chai.expect(result).to.not.eq(null);
        chai.expect(result.network).to.eq(networkMock);
        chai.expect(result.purgeType).to.eq(PurgeType.cpcode);
        chai.expect(result.purgeMethod).to.eq(PurgeMethod.Delete);
        chai.expect(result.urls).to.include.members(urlsMock);
        chai.expect(result.cpCodes).to.include.members(cpcodesMock);
        chai.expect(result.wait).to.eq(waitMock);

        //#endregion

    });
});
