/* tslint:disable */
/* eslint-disable */
/**
 * Red Hat Openshift Smart Events Fleet Manager
 * The api exposed by the fleet manager of the RHOSE service.
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: openbridge-dev@redhat.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { BridgeErrorType } from './bridge-error-type';

/**
 * 
 * @export
 * @interface InlineResponse2003
 */
export interface InlineResponse2003 {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse2003
     */
    'id'?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2003
     */
    'code'?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2003
     */
    'reason'?: string;
    /**
     * 
     * @type {BridgeErrorType}
     * @memberof InlineResponse2003
     */
    'type'?: BridgeErrorType;
}
