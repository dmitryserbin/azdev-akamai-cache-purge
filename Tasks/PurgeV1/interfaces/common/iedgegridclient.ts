/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IEdgeGridClient {

    get<T>(path: string): Promise<T>;
    post<T>(path: string, body: any): Promise<T>;

}
