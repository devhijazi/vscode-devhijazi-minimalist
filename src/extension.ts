import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

import { extensionActivation, firstTimeActivation } from "./utils";

export async function activate(context: vscode.ExtensionContext) {
  console.log(
    `Congratulations, your extension "${context.extension.packageJSON.displayName}" has been installed!`
  );
  firstTimeActivation(context);

  const activateCommand = vscode.commands.registerCommand(
    "devhijazi-minimalist.activate",
    () => extensionActivation(context, "activate")
  );

  const deactivateCommand = vscode.commands.registerCommand(
    "devhijazi-minimalist.deactivate",
    () => extensionActivation(context, "deactivate")
  );

  const resetCommand = vscode.commands.registerCommand(
    "devhijazi-minimalist.reset",
    () => extensionActivation(context, "deactivate")
  );

  const installSettingsCommand = vscode.commands.registerCommand(
    "devhijazi-minimalist.installSettings",
    () => installSettings(context)
  );

  context.subscriptions.push(
    activateCommand,
    deactivateCommand,
    resetCommand,
    installSettingsCommand
  );
}

function installSettings(context: vscode.ExtensionContext) {
  const extensionPath = context.extensionPath;

  if (!extensionPath) {
    vscode.window.showErrorMessage("Failed to get extension path.");
    return;
  }

  const settingsPath = path.join(
    extensionPath,
    "src",
    "settings",
    "default-settings.json"
  );
  const targetSettingsPath = path.join(
    getUserDir(),
    ".config",
    "Code",
    "User",
    "settings.json"
  );

  try {
    const settingsContent = fs.readFileSync(settingsPath, "utf-8");
    const existingSettings = fs.existsSync(targetSettingsPath)
      ? fs.readFileSync(targetSettingsPath, "utf-8")
      : "";

    const mergedSettings = mergeSettings(existingSettings, settingsContent);

    fs.writeFileSync(targetSettingsPath, mergedSettings);

    vscode.window.showInformationMessage("Settings installed successfully.");
  } catch (error: any) {
    vscode.window.showErrorMessage(
      `Failed to install settings: ${error.message}`
    );
  }
}

function getUserDir() {
  return process.env.HOME || process.env.USERPROFILE || "";
}

function mergeSettings(existing: string, newSettings: string) {
  const existingObject = JSON.parse(existing || "{}");
  const newObject = JSON.parse(newSettings);

  const mergedObject = { ...existingObject, ...newObject };

  return JSON.stringify(mergedObject, null, 2);
}

export function deactivate(context: vscode.ExtensionContext) {
  extensionActivation(context, "deactivate");
}
