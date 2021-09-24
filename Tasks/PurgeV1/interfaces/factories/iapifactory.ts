import { IEdgeGridClient } from "../common/iedgegridclient";

export interface IApiFactory {

    createEdgegridClient(): Promise<IEdgeGridClient>;

}
