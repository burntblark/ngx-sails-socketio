import { SailsIOClient } from "./sails.io.client";
/**
 * Library specific configuration options
 * @extends SailsIOClient.Options
 */
export interface SailsOptions extends SailsIOClient.Options {
    prefix?: string;
}
