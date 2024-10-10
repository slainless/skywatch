import type { GlobalCity } from "@deweazer/city-list";
import type { QueryLocation } from "@deweazer/weather";
import { createAssertGuard, type AssertionGuard } from "typia";
export type WeathersQuery = Array<GlobalCity | QueryLocation>;
export const assertWeathersQuery: AssertionGuard<WeathersQuery> = (() => { const $guard = (createAssertGuard as any).guard; const $iv2 = new Set(["london", "new-york-city", "beijing", "dubai", "hong-kong", "paris", "shanghai", "singapore", "tokyo", "amsterdam", "brussels", "chicago", "frankfurt", "istanbul", "jakarta", "kuala-lumpur", "los-angeles", "luxembourg-city", "madrid", "mexico-city", "milan", "mumbai", "sao-paulo", "seoul", "sydney", "toronto", "warsaw"]); const $av4 = new Set(["london", "new-york-city", "beijing", "dubai", "hong-kong", "paris", "shanghai", "singapore", "tokyo", "amsterdam", "brussels", "chicago", "frankfurt", "istanbul", "jakarta", "kuala-lumpur", "los-angeles", "luxembourg-city", "madrid", "mexico-city", "milan", "mumbai", "sao-paulo", "seoul", "sydney", "toronto", "warsaw"]); const $io0 = (input: any): boolean => "number" === typeof input.latitude && "number" === typeof input.longitude && (undefined === input.altitude || "number" === typeof input.altitude); const $ao0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.latitude || $guard(_exceptionable, {
    path: _path + ".latitude",
    expected: "number",
    value: input.latitude
}, _errorFactory)) && ("number" === typeof input.longitude || $guard(_exceptionable, {
    path: _path + ".longitude",
    expected: "number",
    value: input.longitude
}, _errorFactory)) && (undefined === input.altitude || "number" === typeof input.altitude || $guard(_exceptionable, {
    path: _path + ".altitude",
    expected: "(number | undefined)",
    value: input.altitude
}, _errorFactory)); const __is = (input: any): input is WeathersQuery => Array.isArray(input) && input.every((elem: any) => null !== elem && undefined !== elem && (true === $iv2.has(elem) || "object" === typeof elem && null !== elem && $io0(elem))); let _errorFactory: any; return (input: any, errorFactory?: (p: import("typia").TypeGuardError.IProps) => Error): asserts input is WeathersQuery => {
    if (false === __is(input)) {
        _errorFactory = errorFactory;
        ((input: any, _path: string, _exceptionable: boolean = true) => (Array.isArray(input) || $guard(true, {
            path: _path + "",
            expected: "WeathersQuery",
            value: input
        }, _errorFactory)) && input.every((elem: any, _index3: number) => (null !== elem || $guard(true, {
            path: _path + "[" + _index3 + "]",
            expected: "(\"amsterdam\" | \"beijing\" | \"brussels\" | \"chicago\" | \"dubai\" | \"frankfurt\" | \"hong-kong\" | \"istanbul\" | \"jakarta\" | \"kuala-lumpur\" | \"london\" | \"los-angeles\" | \"luxembourg-city\" | \"madrid\" | \"mexico-city\" | \"milan\" | \"mumbai\" | \"new-york-city\" | \"paris\" | \"sao-paulo\" | \"seoul\" | \"shanghai\" | \"singapore\" | \"sydney\" | \"tokyo\" | \"toronto\" | \"warsaw\" | Point3D)",
            value: elem
        }, _errorFactory)) && (undefined !== elem || $guard(true, {
            path: _path + "[" + _index3 + "]",
            expected: "(\"amsterdam\" | \"beijing\" | \"brussels\" | \"chicago\" | \"dubai\" | \"frankfurt\" | \"hong-kong\" | \"istanbul\" | \"jakarta\" | \"kuala-lumpur\" | \"london\" | \"los-angeles\" | \"luxembourg-city\" | \"madrid\" | \"mexico-city\" | \"milan\" | \"mumbai\" | \"new-york-city\" | \"paris\" | \"sao-paulo\" | \"seoul\" | \"shanghai\" | \"singapore\" | \"sydney\" | \"tokyo\" | \"toronto\" | \"warsaw\" | Point3D)",
            value: elem
        }, _errorFactory)) && (true === $av4.has(elem) || ("object" === typeof elem && null !== elem || $guard(true, {
            path: _path + "[" + _index3 + "]",
            expected: "(\"amsterdam\" | \"beijing\" | \"brussels\" | \"chicago\" | \"dubai\" | \"frankfurt\" | \"hong-kong\" | \"istanbul\" | \"jakarta\" | \"kuala-lumpur\" | \"london\" | \"los-angeles\" | \"luxembourg-city\" | \"madrid\" | \"mexico-city\" | \"milan\" | \"mumbai\" | \"new-york-city\" | \"paris\" | \"sao-paulo\" | \"seoul\" | \"shanghai\" | \"singapore\" | \"sydney\" | \"tokyo\" | \"toronto\" | \"warsaw\" | Point3D)",
            value: elem
        }, _errorFactory)) && $ao0(elem, _path + "[" + _index3 + "]", true) || $guard(true, {
            path: _path + "[" + _index3 + "]",
            expected: "(\"amsterdam\" | \"beijing\" | \"brussels\" | \"chicago\" | \"dubai\" | \"frankfurt\" | \"hong-kong\" | \"istanbul\" | \"jakarta\" | \"kuala-lumpur\" | \"london\" | \"los-angeles\" | \"luxembourg-city\" | \"madrid\" | \"mexico-city\" | \"milan\" | \"mumbai\" | \"new-york-city\" | \"paris\" | \"sao-paulo\" | \"seoul\" | \"shanghai\" | \"singapore\" | \"sydney\" | \"tokyo\" | \"toronto\" | \"warsaw\" | Point3D)",
            value: elem
        }, _errorFactory))) || $guard(true, {
            path: _path + "",
            expected: "WeathersQuery",
            value: input
        }, _errorFactory))(input, "$input", true);
    }
}; })();
