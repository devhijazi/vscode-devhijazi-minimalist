"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extensionReset = exports.firstTimeActivation = exports.extensionActivation = exports.getAvaliableExtensionPacks = void 0;
const vscode = require("vscode");
var showDialog = vscode.window.showInformationMessage;
var showWarning = vscode.window.showWarningMessage;
function getAvaliableExtensionPacks(context) {
    const extNames = context.extension.packageJSON.extensionPack;
    const extensions = extNames.map(name => ({
        name: name.split(".")[1],
        value: vscode.extensions.getExtension(name)
    }));
    const missingExtensions = extensions
        .filter(ext => !ext.value)
        .map(ext => ext.name);
    if (missingExtensions.length) {
        showWarning(`Warning: These extensions are missing: "${missingExtensions.join(", ")}`);
    }
    return extensions
        .map(ext => ext.value)
        .filter(ext => ext);
}
exports.getAvaliableExtensionPacks = getAvaliableExtensionPacks;
function extensionActivation(context, state = "activate") {
    getAvaliableExtensionPacks(context).forEach(extension => extension
        .activate()
        .then(() => vscode.commands.executeCommand(`${extension.packageJSON.name}.${state}`)));
    showDialog(`${context.extension.packageJSON.displayName} is ${state}d!`);
}
exports.extensionActivation = extensionActivation;
function firstTimeActivation(context) {
    var _a;
    const version = (_a = context.extension.packageJSON.version) !== null && _a !== void 0 ? _a : "0.0.1";
    const previousVersion = context.globalState.get(context.extension.id);
    if (previousVersion === version)
        return;
    extensionActivation(context);
    context.globalState.update(context.extension.id, version);
}
exports.firstTimeActivation = firstTimeActivation;
function extensionReset(context) {
    context.globalState.update(context.extension.id, undefined);
    extensionActivation(context, "deactivate");
}
exports.extensionReset = extensionReset;
//# sourceMappingURL=utils.js.map