"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const utils_1 = require("./utils");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Congratulations, your extension "${context.extension.packageJSON.displayName}" has been installed!`);
        (0, utils_1.firstTimeActivation)(context);
        const activateCommand = vscode.commands.registerCommand("devhijazi-minimalist.activate", () => (0, utils_1.extensionActivation)(context, "activate"));
        const deactivateCommand = vscode.commands.registerCommand("devhijazi-minimalist.deactivate", () => (0, utils_1.extensionActivation)(context, "deactivate"));
        const resetCommand = vscode.commands.registerCommand("devhijazi-minimalist.reset", () => (0, utils_1.extensionActivation)(context, "deactivate"));
        const installSettingsCommand = vscode.commands.registerCommand("devhijazi-minimalist.installSettings", () => installSettings(context));
        context.subscriptions.push(activateCommand, deactivateCommand, resetCommand, installSettingsCommand);
    });
}
exports.activate = activate;
function installSettings(context) {
    const extensionPath = context.extensionPath;
    if (!extensionPath) {
        vscode.window.showErrorMessage("Failed to get extension path.");
        return;
    }
    const settingsPath = path.join(extensionPath, "src", "settings", "default-settings.json");
    const targetSettingsPath = path.join(getUserDir(), ".config", "Code", "User", "settings.json");
    try {
        const settingsContent = fs.readFileSync(settingsPath, "utf-8");
        const existingSettings = fs.existsSync(targetSettingsPath)
            ? fs.readFileSync(targetSettingsPath, "utf-8")
            : "";
        const mergedSettings = mergeSettings(existingSettings, settingsContent);
        fs.writeFileSync(targetSettingsPath, mergedSettings);
        vscode.window.showInformationMessage("Settings installed successfully.");
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to install settings: ${error.message}`);
    }
}
function getUserDir() {
    return process.env.HOME || process.env.USERPROFILE || "";
}
function mergeSettings(existing, newSettings) {
    const existingObject = JSON.parse(existing || "{}");
    const newObject = JSON.parse(newSettings);
    const mergedObject = Object.assign(Object.assign({}, existingObject), newObject);
    return JSON.stringify(mergedObject, null, 2);
}
function deactivate(context) {
    (0, utils_1.extensionActivation)(context, "deactivate");
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map