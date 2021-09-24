/* eslint-disable @typescript-eslint/no-explicit-any */

import Table from "cli-table";

import { IReportHelper } from "../interfaces/helpers/ireporthelper";
import { IDebugCreator } from "../interfaces/loggers/idebugcreator";
import { IDebugLogger } from "../interfaces/loggers/idebuglogger";

export class ReportHelper implements IReportHelper {

    private debugLogger: IDebugLogger;

    constructor(debugCreator: IDebugCreator) {

        this.debugLogger = debugCreator.extend(this.constructor.name);

    }

    public getUrls(urls: string[], network: string): string {

        const table: Table = this.newTable([

            "URL",
            "Network",

        ]);

        for (const url of urls) {

            const result: any[] = [

                url,
                network,
    
            ];

            table.push(result);

        }

        return table.toString();

    }

    private newTable(headers: string[], widths: number[] = []): Table {

        const options: any = {

            head: headers,
            widths,

        };

        const table: Table = new Table(options);

        return table;

    }

}
