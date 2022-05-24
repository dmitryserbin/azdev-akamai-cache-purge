/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { IEdgeGridClient } from "../interfaces/common/iedgegridclient";
import { IDebugCreator } from "../interfaces/loggers/idebugcreator";
import { IDebugLogger } from "../interfaces/loggers/idebuglogger";
import { Retryable } from "./retry";

export class EdgeGridClient implements IEdgeGridClient {

    private edgegrid: any;
    private debugLogger: IDebugLogger;

    constructor(edgegrid: any, debugCreator: IDebugCreator) {

        this.debugLogger = debugCreator.extend(this.constructor.name);
        this.edgegrid = edgegrid;

    }

    @Retryable()
    public async get<T>(path: string): Promise<T> {

        const debug = this.debugLogger.extend(this.get.name);

        debug(`Making <${path}> EdgeGrid API call`);

        const auth: any = this.edgegrid.auth({

            path: path,
            method: "GET",
            headers: {},
            body: {},

        });

        const result: any = new Promise((resolve, reject) => {

            auth.send((error: unknown, response: unknown, body: string) => {

                if (error) {

                    return reject(error);

                } else {

                    return resolve(JSON.parse(body));

                }

            });

        });

        return result;

    }

    @Retryable()
    public async post<T>(path: string, body?: any): Promise<T> {

        const debug = this.debugLogger.extend(this.post.name);

        debug(`Making <${path}> EdgeGrid API call`);

        const auth: any = this.edgegrid.auth({

            path: path,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body ? body : [],

        });

        const result: any = new Promise((resolve, reject) => {

            auth.send((error: unknown, response: unknown, body: string) => {

                if (error) {

                    return reject(error);

                } else {

                    return resolve(JSON.parse(body));

                }

            });

        });

        return result;

    }

}
