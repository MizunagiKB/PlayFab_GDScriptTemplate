var path = require("path");

if (typeof (getCompiledTemplate) === "undefined") getCompiledTemplate = function () { };
if (typeof (templatizeTree) === "undefined") templatizeTree = function () { };


function getVerticalNameDefault() {
    if (sdkGlobals.verticalName) {
        return "\"" + sdkGlobals.verticalName + "\"";
    }

    return "null";
}


function getRequestActions(apiCall) {
    if (apiCall.result === "LoginResult" || apiCall.request === "RegisterPlayFabUserRequest") {
        return "[PlayFab.E_PRO.USE_TITLE_ID]";
    }
    if (apiCall.auth === "EntityToken") {
        return "[PlayFab.E_PRO.CHK_ENTITY_TOKEN, PlayFab.E_PRO.USE_AUTH_ENTITY_TOKEN]";
    }
    if (apiCall.auth === "SessionTicket") {
        return "[PlayFab.E_PRO.CHK_SESSION_TICKET, PlayFab.E_PRO.USE_AUTH_AUTHORIZATION]";
    }
    if (apiCall.auth === "SecretKey") {
        return "[PlayFab.E_PRO.CHK_SECRET_KEY, PlayFab.E_PRO.USE_AUTH_SECRET_KEY]";
    }
    if (apiCall.url === "/Authentication/GetEntityToken") {
        return "[PlayFab.E_PRO.CHK_ENTITY_TOKEN, PlayFab.E_PRO.USE_AUTH_ENTITY_TOKEN]";
    }

    return "[]";
}


function getResultActions(apiCall, api) {

    if (apiCall.result === "LoginResult") {
        return "[PlayFab.E_EPI.UPD_SESSION_TICKET, PlayFab.E_EPI.UPD_ENTITY_TOKEN, PlayFab.E_EPI.REQ_MULTI_STEP_CLIENT_LOGIN]";
    }
    else if (apiCall.result === "RegisterPlayFabUserResult") {
        return "[PlayFab.E_EPI.UPD_SESSION_TICKET, PlayFab.E_EPI.REQ_MULTI_STEP_CLIENT_LOGIN]";
    }
    else if (apiCall.result === "AttributeInstallResult") {
        return "[PlayFab.E_EPI.UPD_ATTRIBUTE]";
    }
    else if (apiCall.result === "GetEntityTokenResponse") {
        return "[PlayFab.E_EPI.UPD_ENTITY_TOKEN]";
    }

    return "[]";
}


function generateApiSummary(tabbing, apiElement, summaryParam, extraLines) {
    var lines = generateApiSummaryLines(apiElement, summaryParam, extraLines);
    var tabbedLineComment = tabbing + "\"\"\"";

    var output;
    if (lines.length === 1) {
        output = tabbing + lines.join("\n" + tabbing) + "\n" + tabbedLineComment;
    } else if (lines.length > 0) {
        output = tabbing + lines.join("\n" + tabbing) + "\n" + tabbedLineComment;
    } else {
        output = "";
    }
    return tabbedLineComment + "\n" + output;
}


exports.makeCombinedAPI = function (apis, sourceDir, apiOutputDir) {
    var locals = {
        apis: apis,
        buildIdentifier: sdkGlobals.buildIdentifier,
        friendlyName: "PlayFab GDScript Combined Sdk",
        errorList: apis[0].errorList,
        errors: apis[0].errors,
        sdkVersion: sdkGlobals.sdkVersion,
        getVerticalNameDefault: getVerticalNameDefault
    };

    // console.log(sdkGlobals)

    for (var i = 0; i < apis.length; i++) {
        // console.log("API >>> " + apis[i].url + " " + apis[i].name);

        for (var j = 0; j < apis[i].calls.length; j++) {
            // console.log("    CALL >>> " + apis[i].calls[j].url + " " + apis[i].calls[j].name);

            var api_locals = {
                api: apis[i],
                getRequestActions: getRequestActions,
                getResultActions: getResultActions,
                generateApiSummary: generateApiSummary,
                hasClientOptions: getAuthMechanisms([apis[i]]).includes("SessionTicket")
            }

            var apiTemplate = getCompiledTemplate(path.resolve(sourceDir, "templates/API.gd.ejs"));
            writeFile(path.resolve(apiOutputDir, "PlayFabSDK/PlayFabAPI_" + apis[i].name + ".gd"), apiTemplate(api_locals));
        }
    }

    templatizeTree(locals, path.resolve(sourceDir, "source"), apiOutputDir);
}
