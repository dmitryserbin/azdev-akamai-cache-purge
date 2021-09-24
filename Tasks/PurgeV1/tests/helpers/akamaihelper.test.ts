/* eslint-disable @typescript-eslint/no-explicit-any */

import "mocha";

import * as chai from "chai";
import * as TypeMoq from "typemoq";

import { IDebugCreator } from "../../interfaces/loggers/idebugcreator";
import { IDebugLogger } from "../../interfaces/loggers/idebuglogger";
import { IAkamaiHelper } from "../../interfaces/helpers/iakamaihelper";
import { AkamaiHelper } from "../../helpers/akamaihelper";
import { IEdgeGridClient } from "../../interfaces/common/iedgegridclient";
import { IPurgeResult } from "../../interfaces/helpers/ipurgeresult";

describe("AkamaiHelper", ()  => {

    const debugLoggerMock = TypeMoq.Mock.ofType<IDebugLogger>();
    const debugCreatorMock = TypeMoq.Mock.ofType<IDebugCreator>();
    const edgegridClientMock = TypeMoq.Mock.ofType<IEdgeGridClient>();

    debugCreatorMock.setup((x) => x.extend(TypeMoq.It.isAnyString())).returns(() => debugLoggerMock.target);
    debugLoggerMock.setup((x) => x.extend(TypeMoq.It.isAnyString())).returns(() => debugLoggerMock.target);

    const akamaiHelper: IAkamaiHelper = new AkamaiHelper(edgegridClientMock.target, debugCreatorMock.target);

    it("Should delete cache", async () => {

        //#region ARRANGE

        const purgeResultMock: IPurgeResult = {

            httpStatus: 201,
            detail: ``,
            supportId: ``,
            purgeId: ``,
            estimatedSeconds: 1,

        };

        const networkMock: string = `My-Network`;
        const hostnameMock: string = `My-Hostname`;
        const objectsMock: string[] = [ `/One`, `/Two` ];

        edgegridClientMock.setup((x) => x.post(TypeMoq.It.isAnyString(), TypeMoq.It.isAny())).returns(
            () => Promise.resolve(purgeResultMock));

        //#endregion

        //#region ACT

        const result = await akamaiHelper.deleteUrlCache(networkMock, hostnameMock, objectsMock);

        //#endregion

        //#region ASSERT

        chai.expect(result).to.not.eq(null);

        //#endregion

    });

    it("Should invalidate cache", async () => {

        //#region ARRANGE

        const purgeResultMock: IPurgeResult = {

            httpStatus: 201,
            detail: ``,
            supportId: ``,
            purgeId: ``,
            estimatedSeconds: 1,

        };

        const networkMock: string = `My-Network`;
        const urlsMock: string[] = [ "https://one.com", "http://two.com" ];

        edgegridClientMock.setup((x) => x.post(TypeMoq.It.isAnyString(), TypeMoq.It.isAny())).returns(
            () => Promise.resolve(purgeResultMock));

        //#endregion

        //#region ACT

        const result = await akamaiHelper.invalidateUrlCache(networkMock, urlsMock);

        //#endregion

        //#region ASSERT

        chai.expect(result).to.not.eq(null);

        //#endregion

    });

});
