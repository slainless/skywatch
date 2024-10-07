import type { SendMailOptions } from "nodemailer";
import { createAssertGuard, type AssertionGuard } from "typia";
export const assertMail: AssertionGuard<SendMailOptions> = (() => { const $guard = (createAssertGuard as any).guard; const $join = (createAssertGuard as any).join; const $iv9 = new Set(["ascii", "utf8", "utf-8", "utf16le", "utf-16le", "ucs2", "ucs-2", "base64", "base64url", "latin1", "binary", "hex"]); const $av32 = new Set(["ascii", "utf8", "utf-8", "utf16le", "utf-16le", "ucs2", "ucs-2", "base64", "base64url", "latin1", "binary", "hex"]); const $ip0 = (input: any) => {
    const array = input;
    const top = input[0];
    if (0 === input.length)
        return true;
    const arrayPredicators = [
        [
            (top: any[]): any => null !== top && undefined !== top && ("string" === typeof top || "object" === typeof top && null !== top && $io14(top)),
            (entire: any[]): any => entire.every((elem: any) => null !== elem && undefined !== elem && ("string" === typeof elem || "object" === typeof elem && null !== elem && $io14(elem)))
        ] as const,
        [
            (top: any[]): any => Array.isArray(top) && top.every((elem: any) => null !== elem && undefined !== elem && ("string" === typeof elem || "object" === typeof elem && null !== elem && $io14(elem))),
            (entire: any[]): any => entire.every((elem: any) => Array.isArray(elem) && elem.every((elem: any) => null !== elem && undefined !== elem && ("string" === typeof elem || "object" === typeof elem && null !== elem && $io14(elem))))
        ] as const
    ];
    const passed = arrayPredicators.filter((pred: any) => pred[0](top));
    if (1 === passed.length)
        return passed[0]![1](array);
    else if (1 < passed.length)
        for (const pred of passed)
            if (array.every((value: any) => true === pred[0](value)))
                return pred[1](array);
    return false;
}; const $ap1 = (input: any, _path: string, _exceptionable: boolean = true) => {
    const array = input;
    const top = input[0];
    if (0 === input.length)
        return true;
    const arrayPredicators = [
        [
            (top: any[]): any => null !== top && undefined !== top && ("string" === typeof top || "object" === typeof top && null !== top && $ao14(top, _path, false && _exceptionable)),
            (entire: any[]): any => entire.every((elem: any, _index39: number) => (null !== elem || $guard(_exceptionable, {
                path: _path + "[" + _index39 + "]",
                expected: "(__type.o3 | string)",
                value: elem
            }, _errorFactory)) && (undefined !== elem || $guard(_exceptionable, {
                path: _path + "[" + _index39 + "]",
                expected: "(__type.o3 | string)",
                value: elem
            }, _errorFactory)) && ("string" === typeof elem || ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + "[" + _index39 + "]",
                expected: "(__type.o3 | string)",
                value: elem
            }, _errorFactory)) && $ao14(elem, _path + "[" + _index39 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + "[" + _index39 + "]",
                expected: "(__type.o3 | string)",
                value: elem
            }, _errorFactory)))
        ] as const,
        [
            (top: any[]): any => Array.isArray(top) && top.every((elem: any, _index40: number) => null !== elem && undefined !== elem && ("string" === typeof elem || "object" === typeof elem && null !== elem && $ao14(elem, _path + "[" + _index40 + "]", false && _exceptionable))),
            (entire: any[]): any => entire.every((elem: any, _index41: number) => (Array.isArray(elem) || $guard(_exceptionable, {
                path: _path + "[" + _index41 + "]",
                expected: "Array<Mail.ListHeader>",
                value: elem
            }, _errorFactory)) && elem.every((elem: any, _index42: number) => (null !== elem || $guard(_exceptionable, {
                path: _path + "[" + _index41 + "][" + _index42 + "]",
                expected: "(__type.o3 | string)",
                value: elem
            }, _errorFactory)) && (undefined !== elem || $guard(_exceptionable, {
                path: _path + "[" + _index41 + "][" + _index42 + "]",
                expected: "(__type.o3 | string)",
                value: elem
            }, _errorFactory)) && ("string" === typeof elem || ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + "[" + _index41 + "][" + _index42 + "]",
                expected: "(__type.o3 | string)",
                value: elem
            }, _errorFactory)) && $ao14(elem, _path + "[" + _index41 + "][" + _index42 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + "[" + _index41 + "][" + _index42 + "]",
                expected: "(__type.o3 | string)",
                value: elem
            }, _errorFactory))) || $guard(_exceptionable, {
                path: _path + "[" + _index41 + "]",
                expected: "Array<Mail.ListHeader>",
                value: elem
            }, _errorFactory))
        ] as const
    ];
    const passed = arrayPredicators.filter((pred: any) => pred[0](top));
    if (1 === passed.length)
        return passed[0]![1](array);
    else if (1 < passed.length)
        for (const pred of passed)
            if (array.every((value: any) => true === pred[0](value)))
                return pred[1](array);
    return $guard(_exceptionable, {
        path: _path,
        expected: "(Array<Mail.ListHeader> | Array<Array<Mail.ListHeader>>)",
        value: input
    }, _errorFactory);
}; const $io0 = (input: any): boolean => null !== input.from && (undefined === input.from || "string" === typeof input.from || "object" === typeof input.from && null !== input.from && $io1(input.from)) && (null !== input.sender && (undefined === input.sender || "string" === typeof input.sender || "object" === typeof input.sender && null !== input.sender && $io1(input.sender))) && (null !== input.to && (undefined === input.to || "string" === typeof input.to || (Array.isArray(input.to) && input.to.every((elem: any) => null !== elem && undefined !== elem && ("string" === typeof elem || "object" === typeof elem && null !== elem && $io1(elem))) || "object" === typeof input.to && null !== input.to && $io1(input.to)))) && (null !== input.cc && (undefined === input.cc || "string" === typeof input.cc || (Array.isArray(input.cc) && input.cc.every((elem: any) => null !== elem && undefined !== elem && ("string" === typeof elem || "object" === typeof elem && null !== elem && $io1(elem))) || "object" === typeof input.cc && null !== input.cc && $io1(input.cc)))) && (null !== input.bcc && (undefined === input.bcc || "string" === typeof input.bcc || (Array.isArray(input.bcc) && input.bcc.every((elem: any) => null !== elem && undefined !== elem && ("string" === typeof elem || "object" === typeof elem && null !== elem && $io1(elem))) || "object" === typeof input.bcc && null !== input.bcc && $io1(input.bcc)))) && (null !== input.replyTo && (undefined === input.replyTo || "string" === typeof input.replyTo || (Array.isArray(input.replyTo) && input.replyTo.every((elem: any) => null !== elem && undefined !== elem && ("string" === typeof elem || "object" === typeof elem && null !== elem && $io1(elem))) || "object" === typeof input.replyTo && null !== input.replyTo && $io1(input.replyTo)))) && (null !== input.inReplyTo && (undefined === input.inReplyTo || "string" === typeof input.inReplyTo || "object" === typeof input.inReplyTo && null !== input.inReplyTo && $io1(input.inReplyTo))) && (null !== input.references && (undefined === input.references || "string" === typeof input.references || Array.isArray(input.references) && input.references.every((elem: any) => "string" === typeof elem))) && (undefined === input.subject || "string" === typeof input.subject) && (null !== input.text && (undefined === input.text || "string" === typeof input.text || "object" === typeof input.text && null !== input.text && false === Array.isArray(input.text) && $iu0(input.text))) && (null !== input.html && (undefined === input.html || "string" === typeof input.html || "object" === typeof input.html && null !== input.html && false === Array.isArray(input.html) && $iu0(input.html))) && (null !== input.watchHtml && (undefined === input.watchHtml || "string" === typeof input.watchHtml || "object" === typeof input.watchHtml && null !== input.watchHtml && false === Array.isArray(input.watchHtml) && $iu0(input.watchHtml))) && (null !== input.amp && (undefined === input.amp || "string" === typeof input.amp || "object" === typeof input.amp && null !== input.amp && false === Array.isArray(input.amp) && $iu1(input.amp))) && (null !== input.icalEvent && (undefined === input.icalEvent || "string" === typeof input.icalEvent || "object" === typeof input.icalEvent && null !== input.icalEvent && false === Array.isArray(input.icalEvent) && $iu2(input.icalEvent))) && (null !== input.headers && (undefined === input.headers || (Array.isArray(input.headers) && input.headers.every((elem: any) => "object" === typeof elem && null !== elem && $io12(elem)) || "object" === typeof input.headers && null !== input.headers && false === Array.isArray(input.headers) && $io10(input.headers)))) && (undefined === input.list || "object" === typeof input.list && null !== input.list && false === Array.isArray(input.list) && $io13(input.list)) && (undefined === input.attachments || Array.isArray(input.attachments) && input.attachments.every((elem: any) => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && $io15(elem))) && (undefined === input.alternatives || Array.isArray(input.alternatives) && input.alternatives.every((elem: any) => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && $io15(elem))) && (undefined === input.envelope || "object" === typeof input.envelope && null !== input.envelope && false === Array.isArray(input.envelope) && $iu3(input.envelope)) && (undefined === input.messageId || "string" === typeof input.messageId) && (null !== input.date && (undefined === input.date || "string" === typeof input.date || input.date instanceof Date)) && (undefined === input.encoding || "string" === typeof input.encoding) && (null !== input.raw && (undefined === input.raw || "string" === typeof input.raw || "object" === typeof input.raw && null !== input.raw && false === Array.isArray(input.raw) && $iu0(input.raw))) && (undefined === input.textEncoding || "base64" === input.textEncoding || "quoted-printable" === input.textEncoding) && (undefined === input.disableUrlAccess || "boolean" === typeof input.disableUrlAccess) && (undefined === input.disableFileAccess || "boolean" === typeof input.disableFileAccess) && (undefined === input.dkim || "object" === typeof input.dkim && null !== input.dkim && $iu4(input.dkim)) && (undefined === input.priority || "high" === input.priority || "normal" === input.priority || "low" === input.priority) && (undefined === input.attachDataUrls || "boolean" === typeof input.attachDataUrls); const $io1 = (input: any): boolean => "string" === typeof input.name && "string" === typeof input.address; const $io2 = (input: any): boolean => "number" === typeof input.BYTES_PER_ELEMENT && (input.buffer instanceof ArrayBuffer || input.buffer instanceof SharedArrayBuffer) && "number" === typeof input.byteLength && "number" === typeof input.byteOffset && "number" === typeof input.length && "Uint8Array" === input["__@toStringTag@107"] && Object.keys(input).every((key: any) => {
    if (["BYTES_PER_ELEMENT", "buffer", "byteLength", "byteOffset", "length", "__@toStringTag@107"].some((prop: any) => key === prop))
        return true;
    const value = input[key];
    if (undefined === value)
        return true;
    if ("number" === typeof Number(key))
        return "number" === typeof value;
    return true;
}); const $io3 = (input: any): boolean => "boolean" === typeof input.readableAborted && "boolean" === typeof input.readable && "boolean" === typeof input.readableDidRead && (null === input.readableEncoding || true === $iv9.has(input.readableEncoding)) && "boolean" === typeof input.readableEnded && (null === input.readableFlowing || "boolean" === typeof input.readableFlowing) && "number" === typeof input.readableHighWaterMark && "number" === typeof input.readableLength && "boolean" === typeof input.readableObjectMode && "boolean" === typeof input.destroyed && "boolean" === typeof input.closed && (null === input.errored || "object" === typeof input.errored && null !== input.errored && $io4(input.errored)); const $io4 = (input: any): boolean => "string" === typeof input.name && "string" === typeof input.message && (undefined === input.stack || "string" === typeof input.stack) && true; const $io5 = (input: any): boolean => null !== input.content && (undefined === input.content || "string" === typeof input.content || "object" === typeof input.content && null !== input.content && $iu5(input.content)) && (null !== input.path && (undefined === input.path || "string" === typeof input.path || "object" === typeof input.path && null !== input.path && $io6(input.path))); const $io6 = (input: any): boolean => (null === input.auth || "string" === typeof input.auth) && (null === input.hash || "string" === typeof input.hash) && (null === input.host || "string" === typeof input.host) && (null === input.hostname || "string" === typeof input.hostname) && "string" === typeof input.href && (null === input.path || "string" === typeof input.path) && (null === input.pathname || "string" === typeof input.pathname) && (null === input.protocol || "string" === typeof input.protocol) && (null === input.search || "string" === typeof input.search) && (null === input.slashes || "boolean" === typeof input.slashes) && (null === input.port || "string" === typeof input.port) && (undefined !== input.query && (null === input.query || "string" === typeof input.query || "object" === typeof input.query && null !== input.query && false === Array.isArray(input.query) && $io7(input.query))); const $io7 = (input: any): boolean => Object.keys(input).every((key: any) => {
    const value = input[key];
    if (undefined === value)
        return true;
    return null !== value && (undefined === value || "string" === typeof value || Array.isArray(value) && value.every((elem: any) => "string" === typeof elem));
}); const $io8 = (input: any): boolean => (undefined === input.href || "string" === typeof input.href) && (undefined === input.encoding || "string" === typeof input.encoding) && (undefined === input.contentType || "string" === typeof input.contentType) && (null !== input.raw && (undefined === input.raw || "string" === typeof input.raw || "object" === typeof input.raw && null !== input.raw && false === Array.isArray(input.raw) && $iu0(input.raw))) && (null !== input.content && (undefined === input.content || "string" === typeof input.content || "object" === typeof input.content && null !== input.content && $iu5(input.content))) && (null !== input.path && (undefined === input.path || "string" === typeof input.path || "object" === typeof input.path && null !== input.path && $io6(input.path))); const $io9 = (input: any): boolean => (undefined === input.method || "string" === typeof input.method) && (undefined === input.filename || false === input.filename || "string" === typeof input.filename) && (undefined === input.href || "string" === typeof input.href) && (undefined === input.encoding || "string" === typeof input.encoding) && (null !== input.content && (undefined === input.content || "string" === typeof input.content || "object" === typeof input.content && null !== input.content && $iu5(input.content))) && (null !== input.path && (undefined === input.path || "string" === typeof input.path || "object" === typeof input.path && null !== input.path && $io6(input.path))); const $io10 = (input: any): boolean => Object.keys(input).every((key: any) => {
    const value = input[key];
    if (undefined === value)
        return true;
    return null !== value && undefined !== value && ("string" === typeof value || (Array.isArray(value) && value.every((elem: any) => "string" === typeof elem) || "object" === typeof value && null !== value && $io11(value)));
}); const $io11 = (input: any): boolean => "boolean" === typeof input.prepared && "string" === typeof input.value; const $io12 = (input: any): boolean => "string" === typeof input.key && "string" === typeof input.value; const $io13 = (input: any): boolean => Object.keys(input).every((key: any) => {
    const value = input[key];
    if (undefined === value)
        return true;
    return null !== value && undefined !== value && ("string" === typeof value || (Array.isArray(value) && ($ip0(value) || false) || "object" === typeof value && null !== value && $io14(value)));
}); const $io14 = (input: any): boolean => "string" === typeof input.url && "string" === typeof input.comment; const $io15 = (input: any): boolean => (undefined === input.filename || false === input.filename || "string" === typeof input.filename) && (undefined === input.cid || "string" === typeof input.cid) && (undefined === input.encoding || "string" === typeof input.encoding) && (undefined === input.contentType || "string" === typeof input.contentType) && (undefined === input.contentTransferEncoding || false === input.contentTransferEncoding || "base64" === input.contentTransferEncoding || "7bit" === input.contentTransferEncoding || "quoted-printable" === input.contentTransferEncoding) && (undefined === input.contentDisposition || "attachment" === input.contentDisposition || "inline" === input.contentDisposition) && (null !== input.headers && (undefined === input.headers || (Array.isArray(input.headers) && input.headers.every((elem: any) => "object" === typeof elem && null !== elem && $io12(elem)) || "object" === typeof input.headers && null !== input.headers && false === Array.isArray(input.headers) && $io10(input.headers)))) && (null !== input.raw && (undefined === input.raw || "string" === typeof input.raw || "object" === typeof input.raw && null !== input.raw && false === Array.isArray(input.raw) && $iu0(input.raw))) && (null !== input.content && (undefined === input.content || "string" === typeof input.content || "object" === typeof input.content && null !== input.content && $iu5(input.content))) && (null !== input.path && (undefined === input.path || "string" === typeof input.path || "object" === typeof input.path && null !== input.path && $io6(input.path))); const $io16 = (input: any): boolean => (undefined === input.from || "string" === typeof input.from) && (undefined === input.to || "string" === typeof input.to) && (undefined === input.cc || "string" === typeof input.cc) && (undefined === input.bcc || "string" === typeof input.bcc); const $io17 = (input: any): boolean => (false === input.from || "string" === typeof input.from) && (Array.isArray(input.to) && input.to.every((elem: any) => "string" === typeof elem)); const $io18 = (input: any): boolean => "string" === typeof input.domainName && "string" === typeof input.keySelector && (null !== input.privateKey && undefined !== input.privateKey && ("string" === typeof input.privateKey || "object" === typeof input.privateKey && null !== input.privateKey && $io19(input.privateKey))) && (undefined === input.cacheDir || false === input.cacheDir || "string" === typeof input.cacheDir) && (undefined === input.cacheTreshold || "number" === typeof input.cacheTreshold) && (undefined === input.hashAlgo || "string" === typeof input.hashAlgo) && (undefined === input.headerFieldNames || "string" === typeof input.headerFieldNames) && (undefined === input.skipFields || "string" === typeof input.skipFields); const $io19 = (input: any): boolean => "string" === typeof input.key && "string" === typeof input.passphrase; const $io20 = (input: any): boolean => Array.isArray(input.keys) && input.keys.every((elem: any) => "object" === typeof elem && null !== elem && $io18(elem)) && (undefined === input.cacheDir || false === input.cacheDir || "string" === typeof input.cacheDir) && (undefined === input.cacheTreshold || "number" === typeof input.cacheTreshold) && (undefined === input.hashAlgo || "string" === typeof input.hashAlgo) && (undefined === input.headerFieldNames || "string" === typeof input.headerFieldNames) && (undefined === input.skipFields || "string" === typeof input.skipFields); const $iu0 = (input: any): any => (() => {
    if (undefined !== input["__@toStringTag@107"])
        return $io2(input);
    else if (undefined !== input.readableEncoding)
        return $io3(input);
    else
        return $io5(input);
})(); const $iu1 = (input: any): any => (() => {
    if (undefined !== input["__@toStringTag@107"])
        return $io2(input);
    else if (undefined !== input.readableEncoding)
        return $io3(input);
    else
        return $io8(input);
})(); const $iu2 = (input: any): any => (() => {
    if (undefined !== input["__@toStringTag@107"])
        return $io2(input);
    else if (undefined !== input.readableEncoding)
        return $io3(input);
    else
        return $io9(input);
})(); const $iu3 = (input: any): any => (() => {
    if (Array.isArray(input.to) && input.to.every((elem: any) => "string" === typeof elem))
        return $io17(input);
    else
        return $io16(input);
})(); const $iu4 = (input: any): any => (() => {
    if (undefined !== input.domainName)
        return $io18(input);
    else if (undefined !== input.keys)
        return $io20(input);
    else
        return false;
})(); const $iu5 = (input: any): any => (() => {
    if (undefined !== input["__@toStringTag@107"])
        return $io2(input);
    else if (undefined !== input.readableEncoding)
        return $io3(input);
    else
        return false;
})(); const $ao0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (null !== input.from || $guard(_exceptionable, {
    path: _path + ".from",
    expected: "(Mail.Address | string | undefined)",
    value: input.from
}, _errorFactory)) && (undefined === input.from || "string" === typeof input.from || ("object" === typeof input.from && null !== input.from || $guard(_exceptionable, {
    path: _path + ".from",
    expected: "(Mail.Address | string | undefined)",
    value: input.from
}, _errorFactory)) && $ao1(input.from, _path + ".from", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".from",
    expected: "(Mail.Address | string | undefined)",
    value: input.from
}, _errorFactory)) && ((null !== input.sender || $guard(_exceptionable, {
    path: _path + ".sender",
    expected: "(Mail.Address | string | undefined)",
    value: input.sender
}, _errorFactory)) && (undefined === input.sender || "string" === typeof input.sender || ("object" === typeof input.sender && null !== input.sender || $guard(_exceptionable, {
    path: _path + ".sender",
    expected: "(Mail.Address | string | undefined)",
    value: input.sender
}, _errorFactory)) && $ao1(input.sender, _path + ".sender", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".sender",
    expected: "(Mail.Address | string | undefined)",
    value: input.sender
}, _errorFactory))) && ((null !== input.to || $guard(_exceptionable, {
    path: _path + ".to",
    expected: "(Array<string | Address> | Mail.Address | string | undefined)",
    value: input.to
}, _errorFactory)) && (undefined === input.to || "string" === typeof input.to || (Array.isArray(input.to) && input.to.every((elem: any, _index24: number) => (null !== elem || $guard(_exceptionable, {
    path: _path + ".to[" + _index24 + "]",
    expected: "(Mail.Address | string)",
    value: elem
}, _errorFactory)) && (undefined !== elem || $guard(_exceptionable, {
    path: _path + ".to[" + _index24 + "]",
    expected: "(Mail.Address | string)",
    value: elem
}, _errorFactory)) && ("string" === typeof elem || ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
    path: _path + ".to[" + _index24 + "]",
    expected: "(Mail.Address | string)",
    value: elem
}, _errorFactory)) && $ao1(elem, _path + ".to[" + _index24 + "]", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".to[" + _index24 + "]",
    expected: "(Mail.Address | string)",
    value: elem
}, _errorFactory))) || "object" === typeof input.to && null !== input.to && $ao1(input.to, _path + ".to", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".to",
    expected: "(Array<string | Address> | Mail.Address | string | undefined)",
    value: input.to
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".to",
    expected: "(Array<string | Address> | Mail.Address | string | undefined)",
    value: input.to
}, _errorFactory))) && ((null !== input.cc || $guard(_exceptionable, {
    path: _path + ".cc",
    expected: "(Array<string | Address> | Mail.Address | string | undefined)",
    value: input.cc
}, _errorFactory)) && (undefined === input.cc || "string" === typeof input.cc || (Array.isArray(input.cc) && input.cc.every((elem: any, _index25: number) => (null !== elem || $guard(_exceptionable, {
    path: _path + ".cc[" + _index25 + "]",
    expected: "(Mail.Address | string)",
    value: elem
}, _errorFactory)) && (undefined !== elem || $guard(_exceptionable, {
    path: _path + ".cc[" + _index25 + "]",
    expected: "(Mail.Address | string)",
    value: elem
}, _errorFactory)) && ("string" === typeof elem || ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
    path: _path + ".cc[" + _index25 + "]",
    expected: "(Mail.Address | string)",
    value: elem
}, _errorFactory)) && $ao1(elem, _path + ".cc[" + _index25 + "]", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".cc[" + _index25 + "]",
    expected: "(Mail.Address | string)",
    value: elem
}, _errorFactory))) || "object" === typeof input.cc && null !== input.cc && $ao1(input.cc, _path + ".cc", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".cc",
    expected: "(Array<string | Address> | Mail.Address | string | undefined)",
    value: input.cc
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".cc",
    expected: "(Array<string | Address> | Mail.Address | string | undefined)",
    value: input.cc
}, _errorFactory))) && ((null !== input.bcc || $guard(_exceptionable, {
    path: _path + ".bcc",
    expected: "(Array<string | Address> | Mail.Address | string | undefined)",
    value: input.bcc
}, _errorFactory)) && (undefined === input.bcc || "string" === typeof input.bcc || (Array.isArray(input.bcc) && input.bcc.every((elem: any, _index26: number) => (null !== elem || $guard(_exceptionable, {
    path: _path + ".bcc[" + _index26 + "]",
    expected: "(Mail.Address | string)",
    value: elem
}, _errorFactory)) && (undefined !== elem || $guard(_exceptionable, {
    path: _path + ".bcc[" + _index26 + "]",
    expected: "(Mail.Address | string)",
    value: elem
}, _errorFactory)) && ("string" === typeof elem || ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
    path: _path + ".bcc[" + _index26 + "]",
    expected: "(Mail.Address | string)",
    value: elem
}, _errorFactory)) && $ao1(elem, _path + ".bcc[" + _index26 + "]", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".bcc[" + _index26 + "]",
    expected: "(Mail.Address | string)",
    value: elem
}, _errorFactory))) || "object" === typeof input.bcc && null !== input.bcc && $ao1(input.bcc, _path + ".bcc", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".bcc",
    expected: "(Array<string | Address> | Mail.Address | string | undefined)",
    value: input.bcc
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".bcc",
    expected: "(Array<string | Address> | Mail.Address | string | undefined)",
    value: input.bcc
}, _errorFactory))) && ((null !== input.replyTo || $guard(_exceptionable, {
    path: _path + ".replyTo",
    expected: "(Array<string | Address> | Mail.Address | string | undefined)",
    value: input.replyTo
}, _errorFactory)) && (undefined === input.replyTo || "string" === typeof input.replyTo || (Array.isArray(input.replyTo) && input.replyTo.every((elem: any, _index27: number) => (null !== elem || $guard(_exceptionable, {
    path: _path + ".replyTo[" + _index27 + "]",
    expected: "(Mail.Address | string)",
    value: elem
}, _errorFactory)) && (undefined !== elem || $guard(_exceptionable, {
    path: _path + ".replyTo[" + _index27 + "]",
    expected: "(Mail.Address | string)",
    value: elem
}, _errorFactory)) && ("string" === typeof elem || ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
    path: _path + ".replyTo[" + _index27 + "]",
    expected: "(Mail.Address | string)",
    value: elem
}, _errorFactory)) && $ao1(elem, _path + ".replyTo[" + _index27 + "]", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".replyTo[" + _index27 + "]",
    expected: "(Mail.Address | string)",
    value: elem
}, _errorFactory))) || "object" === typeof input.replyTo && null !== input.replyTo && $ao1(input.replyTo, _path + ".replyTo", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".replyTo",
    expected: "(Array<string | Address> | Mail.Address | string | undefined)",
    value: input.replyTo
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".replyTo",
    expected: "(Array<string | Address> | Mail.Address | string | undefined)",
    value: input.replyTo
}, _errorFactory))) && ((null !== input.inReplyTo || $guard(_exceptionable, {
    path: _path + ".inReplyTo",
    expected: "(Mail.Address | string | undefined)",
    value: input.inReplyTo
}, _errorFactory)) && (undefined === input.inReplyTo || "string" === typeof input.inReplyTo || ("object" === typeof input.inReplyTo && null !== input.inReplyTo || $guard(_exceptionable, {
    path: _path + ".inReplyTo",
    expected: "(Mail.Address | string | undefined)",
    value: input.inReplyTo
}, _errorFactory)) && $ao1(input.inReplyTo, _path + ".inReplyTo", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".inReplyTo",
    expected: "(Mail.Address | string | undefined)",
    value: input.inReplyTo
}, _errorFactory))) && ((null !== input.references || $guard(_exceptionable, {
    path: _path + ".references",
    expected: "(Array<string> | string | undefined)",
    value: input.references
}, _errorFactory)) && (undefined === input.references || "string" === typeof input.references || (Array.isArray(input.references) || $guard(_exceptionable, {
    path: _path + ".references",
    expected: "(Array<string> | string | undefined)",
    value: input.references
}, _errorFactory)) && input.references.every((elem: any, _index28: number) => "string" === typeof elem || $guard(_exceptionable, {
    path: _path + ".references[" + _index28 + "]",
    expected: "string",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".references",
    expected: "(Array<string> | string | undefined)",
    value: input.references
}, _errorFactory))) && (undefined === input.subject || "string" === typeof input.subject || $guard(_exceptionable, {
    path: _path + ".subject",
    expected: "(string | undefined)",
    value: input.subject
}, _errorFactory)) && ((null !== input.text || $guard(_exceptionable, {
    path: _path + ".text",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.text
}, _errorFactory)) && (undefined === input.text || "string" === typeof input.text || ("object" === typeof input.text && null !== input.text && false === Array.isArray(input.text) || $guard(_exceptionable, {
    path: _path + ".text",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.text
}, _errorFactory)) && $au0(input.text, _path + ".text", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".text",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.text
}, _errorFactory))) && ((null !== input.html || $guard(_exceptionable, {
    path: _path + ".html",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.html
}, _errorFactory)) && (undefined === input.html || "string" === typeof input.html || ("object" === typeof input.html && null !== input.html && false === Array.isArray(input.html) || $guard(_exceptionable, {
    path: _path + ".html",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.html
}, _errorFactory)) && $au0(input.html, _path + ".html", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".html",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.html
}, _errorFactory))) && ((null !== input.watchHtml || $guard(_exceptionable, {
    path: _path + ".watchHtml",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.watchHtml
}, _errorFactory)) && (undefined === input.watchHtml || "string" === typeof input.watchHtml || ("object" === typeof input.watchHtml && null !== input.watchHtml && false === Array.isArray(input.watchHtml) || $guard(_exceptionable, {
    path: _path + ".watchHtml",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.watchHtml
}, _errorFactory)) && $au0(input.watchHtml, _path + ".watchHtml", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".watchHtml",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.watchHtml
}, _errorFactory))) && ((null !== input.amp || $guard(_exceptionable, {
    path: _path + ".amp",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AmpAttachment | string | undefined)",
    value: input.amp
}, _errorFactory)) && (undefined === input.amp || "string" === typeof input.amp || ("object" === typeof input.amp && null !== input.amp && false === Array.isArray(input.amp) || $guard(_exceptionable, {
    path: _path + ".amp",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AmpAttachment | string | undefined)",
    value: input.amp
}, _errorFactory)) && $au1(input.amp, _path + ".amp", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".amp",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AmpAttachment | string | undefined)",
    value: input.amp
}, _errorFactory))) && ((null !== input.icalEvent || $guard(_exceptionable, {
    path: _path + ".icalEvent",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.IcalAttachment | string | undefined)",
    value: input.icalEvent
}, _errorFactory)) && (undefined === input.icalEvent || "string" === typeof input.icalEvent || ("object" === typeof input.icalEvent && null !== input.icalEvent && false === Array.isArray(input.icalEvent) || $guard(_exceptionable, {
    path: _path + ".icalEvent",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.IcalAttachment | string | undefined)",
    value: input.icalEvent
}, _errorFactory)) && $au2(input.icalEvent, _path + ".icalEvent", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".icalEvent",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.IcalAttachment | string | undefined)",
    value: input.icalEvent
}, _errorFactory))) && ((null !== input.headers || $guard(_exceptionable, {
    path: _path + ".headers",
    expected: "(Array<__type> | __type | undefined)",
    value: input.headers
}, _errorFactory)) && (undefined === input.headers || (Array.isArray(input.headers) && input.headers.every((elem: any, _index29: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
    path: _path + ".headers[" + _index29 + "]",
    expected: "__type.o2",
    value: elem
}, _errorFactory)) && $ao12(elem, _path + ".headers[" + _index29 + "]", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".headers[" + _index29 + "]",
    expected: "__type.o2",
    value: elem
}, _errorFactory)) || "object" === typeof input.headers && null !== input.headers && false === Array.isArray(input.headers) && $ao10(input.headers, _path + ".headers", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".headers",
    expected: "(Array<__type> | __type | undefined)",
    value: input.headers
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".headers",
    expected: "(Array<__type> | __type | undefined)",
    value: input.headers
}, _errorFactory))) && (undefined === input.list || ("object" === typeof input.list && null !== input.list && false === Array.isArray(input.list) || $guard(_exceptionable, {
    path: _path + ".list",
    expected: "(Mail.ListHeaders | undefined)",
    value: input.list
}, _errorFactory)) && $ao13(input.list, _path + ".list", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".list",
    expected: "(Mail.ListHeaders | undefined)",
    value: input.list
}, _errorFactory)) && (undefined === input.attachments || (Array.isArray(input.attachments) || $guard(_exceptionable, {
    path: _path + ".attachments",
    expected: "(Array<Mail.Attachment> | undefined)",
    value: input.attachments
}, _errorFactory)) && input.attachments.every((elem: any, _index30: number) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || $guard(_exceptionable, {
    path: _path + ".attachments[" + _index30 + "]",
    expected: "Mail.Attachment",
    value: elem
}, _errorFactory)) && $ao15(elem, _path + ".attachments[" + _index30 + "]", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".attachments[" + _index30 + "]",
    expected: "Mail.Attachment",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".attachments",
    expected: "(Array<Mail.Attachment> | undefined)",
    value: input.attachments
}, _errorFactory)) && (undefined === input.alternatives || (Array.isArray(input.alternatives) || $guard(_exceptionable, {
    path: _path + ".alternatives",
    expected: "(Array<Mail.Attachment> | undefined)",
    value: input.alternatives
}, _errorFactory)) && input.alternatives.every((elem: any, _index31: number) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || $guard(_exceptionable, {
    path: _path + ".alternatives[" + _index31 + "]",
    expected: "Mail.Attachment",
    value: elem
}, _errorFactory)) && $ao15(elem, _path + ".alternatives[" + _index31 + "]", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".alternatives[" + _index31 + "]",
    expected: "Mail.Attachment",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".alternatives",
    expected: "(Array<Mail.Attachment> | undefined)",
    value: input.alternatives
}, _errorFactory)) && (undefined === input.envelope || ("object" === typeof input.envelope && null !== input.envelope && false === Array.isArray(input.envelope) || $guard(_exceptionable, {
    path: _path + ".envelope",
    expected: "(Mail.Envelope | MimeNode.Envelope | undefined)",
    value: input.envelope
}, _errorFactory)) && $au3(input.envelope, _path + ".envelope", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".envelope",
    expected: "(Mail.Envelope | MimeNode.Envelope | undefined)",
    value: input.envelope
}, _errorFactory)) && (undefined === input.messageId || "string" === typeof input.messageId || $guard(_exceptionable, {
    path: _path + ".messageId",
    expected: "(string | undefined)",
    value: input.messageId
}, _errorFactory)) && ((null !== input.date || $guard(_exceptionable, {
    path: _path + ".date",
    expected: "(Date | string | undefined)",
    value: input.date
}, _errorFactory)) && (undefined === input.date || "string" === typeof input.date || input.date instanceof Date || $guard(_exceptionable, {
    path: _path + ".date",
    expected: "(Date | string | undefined)",
    value: input.date
}, _errorFactory))) && (undefined === input.encoding || "string" === typeof input.encoding || $guard(_exceptionable, {
    path: _path + ".encoding",
    expected: "(string | undefined)",
    value: input.encoding
}, _errorFactory)) && ((null !== input.raw || $guard(_exceptionable, {
    path: _path + ".raw",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.raw
}, _errorFactory)) && (undefined === input.raw || "string" === typeof input.raw || ("object" === typeof input.raw && null !== input.raw && false === Array.isArray(input.raw) || $guard(_exceptionable, {
    path: _path + ".raw",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.raw
}, _errorFactory)) && $au0(input.raw, _path + ".raw", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".raw",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.raw
}, _errorFactory))) && (undefined === input.textEncoding || "base64" === input.textEncoding || "quoted-printable" === input.textEncoding || $guard(_exceptionable, {
    path: _path + ".textEncoding",
    expected: "(\"base64\" | \"quoted-printable\" | undefined)",
    value: input.textEncoding
}, _errorFactory)) && (undefined === input.disableUrlAccess || "boolean" === typeof input.disableUrlAccess || $guard(_exceptionable, {
    path: _path + ".disableUrlAccess",
    expected: "(boolean | undefined)",
    value: input.disableUrlAccess
}, _errorFactory)) && (undefined === input.disableFileAccess || "boolean" === typeof input.disableFileAccess || $guard(_exceptionable, {
    path: _path + ".disableFileAccess",
    expected: "(boolean | undefined)",
    value: input.disableFileAccess
}, _errorFactory)) && (undefined === input.dkim || ("object" === typeof input.dkim && null !== input.dkim || $guard(_exceptionable, {
    path: _path + ".dkim",
    expected: "(DKIM.MultipleKeysOptions | DKIM.SingleKeyOptions | undefined)",
    value: input.dkim
}, _errorFactory)) && $au4(input.dkim, _path + ".dkim", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".dkim",
    expected: "(DKIM.MultipleKeysOptions | DKIM.SingleKeyOptions | undefined)",
    value: input.dkim
}, _errorFactory)) && (undefined === input.priority || "high" === input.priority || "normal" === input.priority || "low" === input.priority || $guard(_exceptionable, {
    path: _path + ".priority",
    expected: "(\"high\" | \"low\" | \"normal\" | undefined)",
    value: input.priority
}, _errorFactory)) && (undefined === input.attachDataUrls || "boolean" === typeof input.attachDataUrls || $guard(_exceptionable, {
    path: _path + ".attachDataUrls",
    expected: "(boolean | undefined)",
    value: input.attachDataUrls
}, _errorFactory)); const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.name || $guard(_exceptionable, {
    path: _path + ".name",
    expected: "string",
    value: input.name
}, _errorFactory)) && ("string" === typeof input.address || $guard(_exceptionable, {
    path: _path + ".address",
    expected: "string",
    value: input.address
}, _errorFactory)); const $ao2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.BYTES_PER_ELEMENT || $guard(_exceptionable, {
    path: _path + ".BYTES_PER_ELEMENT",
    expected: "number",
    value: input.BYTES_PER_ELEMENT
}, _errorFactory)) && (input.buffer instanceof ArrayBuffer || input.buffer instanceof SharedArrayBuffer || $guard(_exceptionable, {
    path: _path + ".buffer",
    expected: "(ArrayBuffer | SharedArrayBuffer)",
    value: input.buffer
}, _errorFactory)) && ("number" === typeof input.byteLength || $guard(_exceptionable, {
    path: _path + ".byteLength",
    expected: "number",
    value: input.byteLength
}, _errorFactory)) && ("number" === typeof input.byteOffset || $guard(_exceptionable, {
    path: _path + ".byteOffset",
    expected: "number",
    value: input.byteOffset
}, _errorFactory)) && ("number" === typeof input.length || $guard(_exceptionable, {
    path: _path + ".length",
    expected: "number",
    value: input.length
}, _errorFactory)) && ("Uint8Array" === input["__@toStringTag@107"] || $guard(_exceptionable, {
    path: _path + "[\"__@toStringTag@107\"]",
    expected: "\"Uint8Array\"",
    value: input["__@toStringTag@107"]
}, _errorFactory)) && (false === _exceptionable || Object.keys(input).every((key: any) => {
    if (["BYTES_PER_ELEMENT", "buffer", "byteLength", "byteOffset", "length", "__@toStringTag@107"].some((prop: any) => key === prop))
        return true;
    const value = input[key];
    if (undefined === value)
        return true;
    if ("number" === typeof Number(key))
        return "number" === typeof value || $guard(_exceptionable, {
            path: _path + $join(key),
            expected: "number",
            value: value
        }, _errorFactory);
    return true;
})); const $ao3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("boolean" === typeof input.readableAborted || $guard(_exceptionable, {
    path: _path + ".readableAborted",
    expected: "boolean",
    value: input.readableAborted
}, _errorFactory)) && ("boolean" === typeof input.readable || $guard(_exceptionable, {
    path: _path + ".readable",
    expected: "boolean",
    value: input.readable
}, _errorFactory)) && ("boolean" === typeof input.readableDidRead || $guard(_exceptionable, {
    path: _path + ".readableDidRead",
    expected: "boolean",
    value: input.readableDidRead
}, _errorFactory)) && (null === input.readableEncoding || true === $av32.has(input.readableEncoding) || $guard(_exceptionable, {
    path: _path + ".readableEncoding",
    expected: "(\"ascii\" | \"base64\" | \"base64url\" | \"binary\" | \"hex\" | \"latin1\" | \"ucs-2\" | \"ucs2\" | \"utf-16le\" | \"utf-8\" | \"utf16le\" | \"utf8\" | null)",
    value: input.readableEncoding
}, _errorFactory)) && ("boolean" === typeof input.readableEnded || $guard(_exceptionable, {
    path: _path + ".readableEnded",
    expected: "boolean",
    value: input.readableEnded
}, _errorFactory)) && (null === input.readableFlowing || "boolean" === typeof input.readableFlowing || $guard(_exceptionable, {
    path: _path + ".readableFlowing",
    expected: "(boolean | null)",
    value: input.readableFlowing
}, _errorFactory)) && ("number" === typeof input.readableHighWaterMark || $guard(_exceptionable, {
    path: _path + ".readableHighWaterMark",
    expected: "number",
    value: input.readableHighWaterMark
}, _errorFactory)) && ("number" === typeof input.readableLength || $guard(_exceptionable, {
    path: _path + ".readableLength",
    expected: "number",
    value: input.readableLength
}, _errorFactory)) && ("boolean" === typeof input.readableObjectMode || $guard(_exceptionable, {
    path: _path + ".readableObjectMode",
    expected: "boolean",
    value: input.readableObjectMode
}, _errorFactory)) && ("boolean" === typeof input.destroyed || $guard(_exceptionable, {
    path: _path + ".destroyed",
    expected: "boolean",
    value: input.destroyed
}, _errorFactory)) && ("boolean" === typeof input.closed || $guard(_exceptionable, {
    path: _path + ".closed",
    expected: "boolean",
    value: input.closed
}, _errorFactory)) && (null === input.errored || ("object" === typeof input.errored && null !== input.errored || $guard(_exceptionable, {
    path: _path + ".errored",
    expected: "(Error | null)",
    value: input.errored
}, _errorFactory)) && $ao4(input.errored, _path + ".errored", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".errored",
    expected: "(Error | null)",
    value: input.errored
}, _errorFactory)); const $ao4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.name || $guard(_exceptionable, {
    path: _path + ".name",
    expected: "string",
    value: input.name
}, _errorFactory)) && ("string" === typeof input.message || $guard(_exceptionable, {
    path: _path + ".message",
    expected: "string",
    value: input.message
}, _errorFactory)) && (undefined === input.stack || "string" === typeof input.stack || $guard(_exceptionable, {
    path: _path + ".stack",
    expected: "(string | undefined)",
    value: input.stack
}, _errorFactory)) && true; const $ao5 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (null !== input.content || $guard(_exceptionable, {
    path: _path + ".content",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | string | undefined)",
    value: input.content
}, _errorFactory)) && (undefined === input.content || "string" === typeof input.content || ("object" === typeof input.content && null !== input.content || $guard(_exceptionable, {
    path: _path + ".content",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | string | undefined)",
    value: input.content
}, _errorFactory)) && $au5(input.content, _path + ".content", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".content",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | string | undefined)",
    value: input.content
}, _errorFactory)) && ((null !== input.path || $guard(_exceptionable, {
    path: _path + ".path",
    expected: "(\"url\".Url | string | undefined)",
    value: input.path
}, _errorFactory)) && (undefined === input.path || "string" === typeof input.path || ("object" === typeof input.path && null !== input.path || $guard(_exceptionable, {
    path: _path + ".path",
    expected: "(\"url\".Url | string | undefined)",
    value: input.path
}, _errorFactory)) && $ao6(input.path, _path + ".path", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".path",
    expected: "(\"url\".Url | string | undefined)",
    value: input.path
}, _errorFactory))); const $ao6 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (null === input.auth || "string" === typeof input.auth || $guard(_exceptionable, {
    path: _path + ".auth",
    expected: "(null | string)",
    value: input.auth
}, _errorFactory)) && (null === input.hash || "string" === typeof input.hash || $guard(_exceptionable, {
    path: _path + ".hash",
    expected: "(null | string)",
    value: input.hash
}, _errorFactory)) && (null === input.host || "string" === typeof input.host || $guard(_exceptionable, {
    path: _path + ".host",
    expected: "(null | string)",
    value: input.host
}, _errorFactory)) && (null === input.hostname || "string" === typeof input.hostname || $guard(_exceptionable, {
    path: _path + ".hostname",
    expected: "(null | string)",
    value: input.hostname
}, _errorFactory)) && ("string" === typeof input.href || $guard(_exceptionable, {
    path: _path + ".href",
    expected: "string",
    value: input.href
}, _errorFactory)) && (null === input.path || "string" === typeof input.path || $guard(_exceptionable, {
    path: _path + ".path",
    expected: "(null | string)",
    value: input.path
}, _errorFactory)) && (null === input.pathname || "string" === typeof input.pathname || $guard(_exceptionable, {
    path: _path + ".pathname",
    expected: "(null | string)",
    value: input.pathname
}, _errorFactory)) && (null === input.protocol || "string" === typeof input.protocol || $guard(_exceptionable, {
    path: _path + ".protocol",
    expected: "(null | string)",
    value: input.protocol
}, _errorFactory)) && (null === input.search || "string" === typeof input.search || $guard(_exceptionable, {
    path: _path + ".search",
    expected: "(null | string)",
    value: input.search
}, _errorFactory)) && (null === input.slashes || "boolean" === typeof input.slashes || $guard(_exceptionable, {
    path: _path + ".slashes",
    expected: "(boolean | null)",
    value: input.slashes
}, _errorFactory)) && (null === input.port || "string" === typeof input.port || $guard(_exceptionable, {
    path: _path + ".port",
    expected: "(null | string)",
    value: input.port
}, _errorFactory)) && ((undefined !== input.query || $guard(_exceptionable, {
    path: _path + ".query",
    expected: "(\"querystring\".ParsedUrlQuery | null | string)",
    value: input.query
}, _errorFactory)) && (null === input.query || "string" === typeof input.query || ("object" === typeof input.query && null !== input.query && false === Array.isArray(input.query) || $guard(_exceptionable, {
    path: _path + ".query",
    expected: "(\"querystring\".ParsedUrlQuery | null | string)",
    value: input.query
}, _errorFactory)) && $ao7(input.query, _path + ".query", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".query",
    expected: "(\"querystring\".ParsedUrlQuery | null | string)",
    value: input.query
}, _errorFactory))); const $ao7 = (input: any, _path: string, _exceptionable: boolean = true): boolean => false === _exceptionable || Object.keys(input).every((key: any) => {
    const value = input[key];
    if (undefined === value)
        return true;
    return (null !== value || $guard(_exceptionable, {
        path: _path + $join(key),
        expected: "(Array<string> | string | undefined)",
        value: value
    }, _errorFactory)) && (undefined === value || "string" === typeof value || (Array.isArray(value) || $guard(_exceptionable, {
        path: _path + $join(key),
        expected: "(Array<string> | string | undefined)",
        value: value
    }, _errorFactory)) && value.every((elem: any, _index33: number) => "string" === typeof elem || $guard(_exceptionable, {
        path: _path + $join(key) + "[" + _index33 + "]",
        expected: "string",
        value: elem
    }, _errorFactory)) || $guard(_exceptionable, {
        path: _path + $join(key),
        expected: "(Array<string> | string | undefined)",
        value: value
    }, _errorFactory));
}); const $ao8 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (undefined === input.href || "string" === typeof input.href || $guard(_exceptionable, {
    path: _path + ".href",
    expected: "(string | undefined)",
    value: input.href
}, _errorFactory)) && (undefined === input.encoding || "string" === typeof input.encoding || $guard(_exceptionable, {
    path: _path + ".encoding",
    expected: "(string | undefined)",
    value: input.encoding
}, _errorFactory)) && (undefined === input.contentType || "string" === typeof input.contentType || $guard(_exceptionable, {
    path: _path + ".contentType",
    expected: "(string | undefined)",
    value: input.contentType
}, _errorFactory)) && ((null !== input.raw || $guard(_exceptionable, {
    path: _path + ".raw",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.raw
}, _errorFactory)) && (undefined === input.raw || "string" === typeof input.raw || ("object" === typeof input.raw && null !== input.raw && false === Array.isArray(input.raw) || $guard(_exceptionable, {
    path: _path + ".raw",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.raw
}, _errorFactory)) && $au0(input.raw, _path + ".raw", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".raw",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.raw
}, _errorFactory))) && ((null !== input.content || $guard(_exceptionable, {
    path: _path + ".content",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | string | undefined)",
    value: input.content
}, _errorFactory)) && (undefined === input.content || "string" === typeof input.content || ("object" === typeof input.content && null !== input.content || $guard(_exceptionable, {
    path: _path + ".content",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | string | undefined)",
    value: input.content
}, _errorFactory)) && $au5(input.content, _path + ".content", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".content",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | string | undefined)",
    value: input.content
}, _errorFactory))) && ((null !== input.path || $guard(_exceptionable, {
    path: _path + ".path",
    expected: "(\"url\".Url | string | undefined)",
    value: input.path
}, _errorFactory)) && (undefined === input.path || "string" === typeof input.path || ("object" === typeof input.path && null !== input.path || $guard(_exceptionable, {
    path: _path + ".path",
    expected: "(\"url\".Url | string | undefined)",
    value: input.path
}, _errorFactory)) && $ao6(input.path, _path + ".path", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".path",
    expected: "(\"url\".Url | string | undefined)",
    value: input.path
}, _errorFactory))); const $ao9 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (undefined === input.method || "string" === typeof input.method || $guard(_exceptionable, {
    path: _path + ".method",
    expected: "(string | undefined)",
    value: input.method
}, _errorFactory)) && (undefined === input.filename || false === input.filename || "string" === typeof input.filename || $guard(_exceptionable, {
    path: _path + ".filename",
    expected: "(false | string | undefined)",
    value: input.filename
}, _errorFactory)) && (undefined === input.href || "string" === typeof input.href || $guard(_exceptionable, {
    path: _path + ".href",
    expected: "(string | undefined)",
    value: input.href
}, _errorFactory)) && (undefined === input.encoding || "string" === typeof input.encoding || $guard(_exceptionable, {
    path: _path + ".encoding",
    expected: "(string | undefined)",
    value: input.encoding
}, _errorFactory)) && ((null !== input.content || $guard(_exceptionable, {
    path: _path + ".content",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | string | undefined)",
    value: input.content
}, _errorFactory)) && (undefined === input.content || "string" === typeof input.content || ("object" === typeof input.content && null !== input.content || $guard(_exceptionable, {
    path: _path + ".content",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | string | undefined)",
    value: input.content
}, _errorFactory)) && $au5(input.content, _path + ".content", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".content",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | string | undefined)",
    value: input.content
}, _errorFactory))) && ((null !== input.path || $guard(_exceptionable, {
    path: _path + ".path",
    expected: "(\"url\".Url | string | undefined)",
    value: input.path
}, _errorFactory)) && (undefined === input.path || "string" === typeof input.path || ("object" === typeof input.path && null !== input.path || $guard(_exceptionable, {
    path: _path + ".path",
    expected: "(\"url\".Url | string | undefined)",
    value: input.path
}, _errorFactory)) && $ao6(input.path, _path + ".path", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".path",
    expected: "(\"url\".Url | string | undefined)",
    value: input.path
}, _errorFactory))); const $ao10 = (input: any, _path: string, _exceptionable: boolean = true): boolean => false === _exceptionable || Object.keys(input).every((key: any) => {
    const value = input[key];
    if (undefined === value)
        return true;
    return (null !== value || $guard(_exceptionable, {
        path: _path + $join(key),
        expected: "(Array<string> | __type.o1 | string)",
        value: value
    }, _errorFactory)) && (undefined !== value || $guard(_exceptionable, {
        path: _path + $join(key),
        expected: "(Array<string> | __type.o1 | string)",
        value: value
    }, _errorFactory)) && ("string" === typeof value || (Array.isArray(value) && value.every((elem: any, _index34: number) => "string" === typeof elem || $guard(_exceptionable, {
        path: _path + $join(key) + "[" + _index34 + "]",
        expected: "string",
        value: elem
    }, _errorFactory)) || "object" === typeof value && null !== value && $ao11(value, _path + $join(key), true && _exceptionable) || $guard(_exceptionable, {
        path: _path + $join(key),
        expected: "(Array<string> | __type.o1 | string)",
        value: value
    }, _errorFactory)) || $guard(_exceptionable, {
        path: _path + $join(key),
        expected: "(Array<string> | __type.o1 | string)",
        value: value
    }, _errorFactory));
}); const $ao11 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("boolean" === typeof input.prepared || $guard(_exceptionable, {
    path: _path + ".prepared",
    expected: "boolean",
    value: input.prepared
}, _errorFactory)) && ("string" === typeof input.value || $guard(_exceptionable, {
    path: _path + ".value",
    expected: "string",
    value: input.value
}, _errorFactory)); const $ao12 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.key || $guard(_exceptionable, {
    path: _path + ".key",
    expected: "string",
    value: input.key
}, _errorFactory)) && ("string" === typeof input.value || $guard(_exceptionable, {
    path: _path + ".value",
    expected: "string",
    value: input.value
}, _errorFactory)); const $ao13 = (input: any, _path: string, _exceptionable: boolean = true): boolean => false === _exceptionable || Object.keys(input).every((key: any) => {
    const value = input[key];
    if (undefined === value)
        return true;
    return (null !== value || $guard(_exceptionable, {
        path: _path + $join(key),
        expected: "(Array<Array<Mail.ListHeader>> | Array<Mail.ListHeader> | __type.o3 | string)",
        value: value
    }, _errorFactory)) && (undefined !== value || $guard(_exceptionable, {
        path: _path + $join(key),
        expected: "(Array<Array<Mail.ListHeader>> | Array<Mail.ListHeader> | __type.o3 | string)",
        value: value
    }, _errorFactory)) && ("string" === typeof value || (Array.isArray(value) && ($ap1(value, _path + $join(key), true && _exceptionable) || $guard(_exceptionable, {
        path: _path + $join(key),
        expected: "Array<Mail.ListHeader> | Array<Array<Mail.ListHeader>>",
        value: value
    }, _errorFactory)) || "object" === typeof value && null !== value && $ao14(value, _path + $join(key), true && _exceptionable) || $guard(_exceptionable, {
        path: _path + $join(key),
        expected: "(Array<Array<Mail.ListHeader>> | Array<Mail.ListHeader> | __type.o3 | string)",
        value: value
    }, _errorFactory)) || $guard(_exceptionable, {
        path: _path + $join(key),
        expected: "(Array<Array<Mail.ListHeader>> | Array<Mail.ListHeader> | __type.o3 | string)",
        value: value
    }, _errorFactory));
}); const $ao14 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.url || $guard(_exceptionable, {
    path: _path + ".url",
    expected: "string",
    value: input.url
}, _errorFactory)) && ("string" === typeof input.comment || $guard(_exceptionable, {
    path: _path + ".comment",
    expected: "string",
    value: input.comment
}, _errorFactory)); const $ao15 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (undefined === input.filename || false === input.filename || "string" === typeof input.filename || $guard(_exceptionable, {
    path: _path + ".filename",
    expected: "(false | string | undefined)",
    value: input.filename
}, _errorFactory)) && (undefined === input.cid || "string" === typeof input.cid || $guard(_exceptionable, {
    path: _path + ".cid",
    expected: "(string | undefined)",
    value: input.cid
}, _errorFactory)) && (undefined === input.encoding || "string" === typeof input.encoding || $guard(_exceptionable, {
    path: _path + ".encoding",
    expected: "(string | undefined)",
    value: input.encoding
}, _errorFactory)) && (undefined === input.contentType || "string" === typeof input.contentType || $guard(_exceptionable, {
    path: _path + ".contentType",
    expected: "(string | undefined)",
    value: input.contentType
}, _errorFactory)) && (undefined === input.contentTransferEncoding || false === input.contentTransferEncoding || "base64" === input.contentTransferEncoding || "7bit" === input.contentTransferEncoding || "quoted-printable" === input.contentTransferEncoding || $guard(_exceptionable, {
    path: _path + ".contentTransferEncoding",
    expected: "(\"7bit\" | \"base64\" | \"quoted-printable\" | false | undefined)",
    value: input.contentTransferEncoding
}, _errorFactory)) && (undefined === input.contentDisposition || "attachment" === input.contentDisposition || "inline" === input.contentDisposition || $guard(_exceptionable, {
    path: _path + ".contentDisposition",
    expected: "(\"attachment\" | \"inline\" | undefined)",
    value: input.contentDisposition
}, _errorFactory)) && ((null !== input.headers || $guard(_exceptionable, {
    path: _path + ".headers",
    expected: "(Array<__type> | __type | undefined)",
    value: input.headers
}, _errorFactory)) && (undefined === input.headers || (Array.isArray(input.headers) && input.headers.every((elem: any, _index43: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
    path: _path + ".headers[" + _index43 + "]",
    expected: "__type.o2",
    value: elem
}, _errorFactory)) && $ao12(elem, _path + ".headers[" + _index43 + "]", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".headers[" + _index43 + "]",
    expected: "__type.o2",
    value: elem
}, _errorFactory)) || "object" === typeof input.headers && null !== input.headers && false === Array.isArray(input.headers) && $ao10(input.headers, _path + ".headers", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".headers",
    expected: "(Array<__type> | __type | undefined)",
    value: input.headers
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".headers",
    expected: "(Array<__type> | __type | undefined)",
    value: input.headers
}, _errorFactory))) && ((null !== input.raw || $guard(_exceptionable, {
    path: _path + ".raw",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.raw
}, _errorFactory)) && (undefined === input.raw || "string" === typeof input.raw || ("object" === typeof input.raw && null !== input.raw && false === Array.isArray(input.raw) || $guard(_exceptionable, {
    path: _path + ".raw",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.raw
}, _errorFactory)) && $au0(input.raw, _path + ".raw", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".raw",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | Mail.AttachmentLike | string | undefined)",
    value: input.raw
}, _errorFactory))) && ((null !== input.content || $guard(_exceptionable, {
    path: _path + ".content",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | string | undefined)",
    value: input.content
}, _errorFactory)) && (undefined === input.content || "string" === typeof input.content || ("object" === typeof input.content && null !== input.content || $guard(_exceptionable, {
    path: _path + ".content",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | string | undefined)",
    value: input.content
}, _errorFactory)) && $au5(input.content, _path + ".content", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".content",
    expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable | string | undefined)",
    value: input.content
}, _errorFactory))) && ((null !== input.path || $guard(_exceptionable, {
    path: _path + ".path",
    expected: "(\"url\".Url | string | undefined)",
    value: input.path
}, _errorFactory)) && (undefined === input.path || "string" === typeof input.path || ("object" === typeof input.path && null !== input.path || $guard(_exceptionable, {
    path: _path + ".path",
    expected: "(\"url\".Url | string | undefined)",
    value: input.path
}, _errorFactory)) && $ao6(input.path, _path + ".path", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".path",
    expected: "(\"url\".Url | string | undefined)",
    value: input.path
}, _errorFactory))); const $ao16 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (undefined === input.from || "string" === typeof input.from || $guard(_exceptionable, {
    path: _path + ".from",
    expected: "(string | undefined)",
    value: input.from
}, _errorFactory)) && (undefined === input.to || "string" === typeof input.to || $guard(_exceptionable, {
    path: _path + ".to",
    expected: "(string | undefined)",
    value: input.to
}, _errorFactory)) && (undefined === input.cc || "string" === typeof input.cc || $guard(_exceptionable, {
    path: _path + ".cc",
    expected: "(string | undefined)",
    value: input.cc
}, _errorFactory)) && (undefined === input.bcc || "string" === typeof input.bcc || $guard(_exceptionable, {
    path: _path + ".bcc",
    expected: "(string | undefined)",
    value: input.bcc
}, _errorFactory)); const $ao17 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (false === input.from || "string" === typeof input.from || $guard(_exceptionable, {
    path: _path + ".from",
    expected: "(false | string)",
    value: input.from
}, _errorFactory)) && ((Array.isArray(input.to) || $guard(_exceptionable, {
    path: _path + ".to",
    expected: "Array<string>",
    value: input.to
}, _errorFactory)) && input.to.every((elem: any, _index44: number) => "string" === typeof elem || $guard(_exceptionable, {
    path: _path + ".to[" + _index44 + "]",
    expected: "string",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".to",
    expected: "Array<string>",
    value: input.to
}, _errorFactory)); const $ao18 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.domainName || $guard(_exceptionable, {
    path: _path + ".domainName",
    expected: "string",
    value: input.domainName
}, _errorFactory)) && ("string" === typeof input.keySelector || $guard(_exceptionable, {
    path: _path + ".keySelector",
    expected: "string",
    value: input.keySelector
}, _errorFactory)) && ((null !== input.privateKey || $guard(_exceptionable, {
    path: _path + ".privateKey",
    expected: "(__type.o4 | string)",
    value: input.privateKey
}, _errorFactory)) && (undefined !== input.privateKey || $guard(_exceptionable, {
    path: _path + ".privateKey",
    expected: "(__type.o4 | string)",
    value: input.privateKey
}, _errorFactory)) && ("string" === typeof input.privateKey || ("object" === typeof input.privateKey && null !== input.privateKey || $guard(_exceptionable, {
    path: _path + ".privateKey",
    expected: "(__type.o4 | string)",
    value: input.privateKey
}, _errorFactory)) && $ao19(input.privateKey, _path + ".privateKey", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".privateKey",
    expected: "(__type.o4 | string)",
    value: input.privateKey
}, _errorFactory))) && (undefined === input.cacheDir || false === input.cacheDir || "string" === typeof input.cacheDir || $guard(_exceptionable, {
    path: _path + ".cacheDir",
    expected: "(false | string | undefined)",
    value: input.cacheDir
}, _errorFactory)) && (undefined === input.cacheTreshold || "number" === typeof input.cacheTreshold || $guard(_exceptionable, {
    path: _path + ".cacheTreshold",
    expected: "(number | undefined)",
    value: input.cacheTreshold
}, _errorFactory)) && (undefined === input.hashAlgo || "string" === typeof input.hashAlgo || $guard(_exceptionable, {
    path: _path + ".hashAlgo",
    expected: "(string | undefined)",
    value: input.hashAlgo
}, _errorFactory)) && (undefined === input.headerFieldNames || "string" === typeof input.headerFieldNames || $guard(_exceptionable, {
    path: _path + ".headerFieldNames",
    expected: "(string | undefined)",
    value: input.headerFieldNames
}, _errorFactory)) && (undefined === input.skipFields || "string" === typeof input.skipFields || $guard(_exceptionable, {
    path: _path + ".skipFields",
    expected: "(string | undefined)",
    value: input.skipFields
}, _errorFactory)); const $ao19 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.key || $guard(_exceptionable, {
    path: _path + ".key",
    expected: "string",
    value: input.key
}, _errorFactory)) && ("string" === typeof input.passphrase || $guard(_exceptionable, {
    path: _path + ".passphrase",
    expected: "string",
    value: input.passphrase
}, _errorFactory)); const $ao20 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ((Array.isArray(input.keys) || $guard(_exceptionable, {
    path: _path + ".keys",
    expected: "Array<DKIM.SingleKeyOptions>",
    value: input.keys
}, _errorFactory)) && input.keys.every((elem: any, _index45: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
    path: _path + ".keys[" + _index45 + "]",
    expected: "DKIM.SingleKeyOptions",
    value: elem
}, _errorFactory)) && $ao18(elem, _path + ".keys[" + _index45 + "]", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".keys[" + _index45 + "]",
    expected: "DKIM.SingleKeyOptions",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".keys",
    expected: "Array<DKIM.SingleKeyOptions>",
    value: input.keys
}, _errorFactory)) && (undefined === input.cacheDir || false === input.cacheDir || "string" === typeof input.cacheDir || $guard(_exceptionable, {
    path: _path + ".cacheDir",
    expected: "(false | string | undefined)",
    value: input.cacheDir
}, _errorFactory)) && (undefined === input.cacheTreshold || "number" === typeof input.cacheTreshold || $guard(_exceptionable, {
    path: _path + ".cacheTreshold",
    expected: "(number | undefined)",
    value: input.cacheTreshold
}, _errorFactory)) && (undefined === input.hashAlgo || "string" === typeof input.hashAlgo || $guard(_exceptionable, {
    path: _path + ".hashAlgo",
    expected: "(string | undefined)",
    value: input.hashAlgo
}, _errorFactory)) && (undefined === input.headerFieldNames || "string" === typeof input.headerFieldNames || $guard(_exceptionable, {
    path: _path + ".headerFieldNames",
    expected: "(string | undefined)",
    value: input.headerFieldNames
}, _errorFactory)) && (undefined === input.skipFields || "string" === typeof input.skipFields || $guard(_exceptionable, {
    path: _path + ".skipFields",
    expected: "(string | undefined)",
    value: input.skipFields
}, _errorFactory)); const $au0 = (input: any, _path: string, _exceptionable: boolean = true): any => (() => {
    if (undefined !== input["__@toStringTag@107"])
        return $ao2(input, _path, true && _exceptionable);
    else if (undefined !== input.readableEncoding)
        return $ao3(input, _path, true && _exceptionable);
    else
        return $ao5(input, _path, true && _exceptionable);
})(); const $au1 = (input: any, _path: string, _exceptionable: boolean = true): any => (() => {
    if (undefined !== input["__@toStringTag@107"])
        return $ao2(input, _path, true && _exceptionable);
    else if (undefined !== input.readableEncoding)
        return $ao3(input, _path, true && _exceptionable);
    else
        return $ao8(input, _path, true && _exceptionable);
})(); const $au2 = (input: any, _path: string, _exceptionable: boolean = true): any => (() => {
    if (undefined !== input["__@toStringTag@107"])
        return $ao2(input, _path, true && _exceptionable);
    else if (undefined !== input.readableEncoding)
        return $ao3(input, _path, true && _exceptionable);
    else
        return $ao9(input, _path, true && _exceptionable);
})(); const $au3 = (input: any, _path: string, _exceptionable: boolean = true): any => (() => {
    if (Array.isArray(input.to) && input.to.every((elem: any, _index46: number) => "string" === typeof elem))
        return $ao17(input, _path, true && _exceptionable);
    else
        return $ao16(input, _path, true && _exceptionable);
})(); const $au4 = (input: any, _path: string, _exceptionable: boolean = true): any => (() => {
    if (undefined !== input.domainName)
        return $ao18(input, _path, true && _exceptionable);
    else if (undefined !== input.keys)
        return $ao20(input, _path, true && _exceptionable);
    else
        return $guard(_exceptionable, {
            path: _path,
            expected: "(DKIM.SingleKeyOptions | DKIM.MultipleKeysOptions)",
            value: input
        }, _errorFactory);
})(); const $au5 = (input: any, _path: string, _exceptionable: boolean = true): any => (() => {
    if (undefined !== input["__@toStringTag@107"])
        return $ao2(input, _path, true && _exceptionable);
    else if (undefined !== input.readableEncoding)
        return $ao3(input, _path, true && _exceptionable);
    else
        return $guard(_exceptionable, {
            path: _path,
            expected: "(\"buffer\".global.Buffer | \"stream\".internal.Readable)",
            value: input
        }, _errorFactory);
})(); const __is = (input: any): input is SendMailOptions => "object" === typeof input && null !== input && false === Array.isArray(input) && $io0(input); let _errorFactory: any; return (input: any, errorFactory?: (p: import("typia").TypeGuardError.IProps) => Error): asserts input is SendMailOptions => {
    if (false === __is(input)) {
        _errorFactory = errorFactory;
        ((input: any, _path: string, _exceptionable: boolean = true) => ("object" === typeof input && null !== input && false === Array.isArray(input) || $guard(true, {
            path: _path + "",
            expected: "Mail.Options",
            value: input
        }, _errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
            path: _path + "",
            expected: "Mail.Options",
            value: input
        }, _errorFactory))(input, "$input", true);
    }
}; })();
