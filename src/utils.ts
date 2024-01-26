import * as vscode from "vscode";
import showDialog = vscode.window.showInformationMessage;
import showWarning = vscode.window.showWarningMessage;

export function getAvaliableExtensionPacks(context: vscode.ExtensionContext) {
  const extNames: string[] = context.extension.packageJSON.extensionPack;
  const extensions = extNames.map(name => ({
    name: name.split(".")[1],
    value: vscode.extensions.getExtension(name)
  }));

  const missingExtensions = extensions
    .filter(ext => !ext.value)
    .map(ext => ext.name);
  if (missingExtensions.length) {
    showWarning(
      `Warning: These extensions are missing: "${missingExtensions.join(", ")}`
    );
  }

  return extensions
    .map(ext => ext.value)
    .filter(ext => ext) as vscode.Extension<any>[];
}
export function extensionActivation(
  context: vscode.ExtensionContext,
  state: "activate" | "install" | "deactivate" = "activate"
) {
  getAvaliableExtensionPacks(context).forEach(extension =>
    extension
      .activate()
      .then(() =>
        vscode.commands.executeCommand(`${extension.packageJSON.name}.${state}`)
      )
  );
  showDialog(`${context.extension.packageJSON.displayName} is ${state}d!`);
}

export function firstTimeActivation(context: vscode.ExtensionContext) {
  const version = context.extension.packageJSON.version ?? "0.0.1";
  const previousVersion = context.globalState.get(context.extension.id);

  if (previousVersion === version) return;

  extensionActivation(context);
  context.globalState.update(context.extension.id, version);
}

export function extensionReset(context: vscode.ExtensionContext) {
  context.globalState.update(context.extension.id, undefined);
  extensionActivation(context, "deactivate");
}
