/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare const locales: {
    'en-US': {
        Add: string;
        "Are you sure you want to delete this item? This action cannot be undone.": string;
        "Are you sure to convert this template block to copy mode?": string;
        "Array index out of bounds": string;
        Cancel: string;
        "Convert to copy": string;
        "Convert to copy is unavailable": string;
        "Save as template": string;
        "Common actions": string;
        "Complete configuration": string;
        Configuration: string;
        "Configuration popup cancelled or error": string;
        "Configuration saved": string;
        "Confirm delete": string;
        "Copy UID": string;
        "Copy error info": string;
        "Copy failed": string;
        "Copy failed under HTTP. Clipboard API is unavailable on non-HTTPS pages. Please copy [{{uid}}] manually.": string;
        "Copy failed, please copy [{{uid}}] manually.": string;
        "Data blocks": string;
        Delete: string;
        "Delete failed": string;
        "Delete operation failed": string;
        "Delete operation failed, please check the console for details.": string;
        "Download logs": string;
        "Drawer API is not available, please ensure it is used within FlowEngineGlobalsContextProvider": string;
        "Error saving configuration": string;
        "Error saving configuration, please check console": string;
        "Error submitting form": string;
        "Expected array for subModel": string;
        "Expected object for subModel": string;
        "Failed to add sub model": string;
        "Failed to destroy model after creation error": string;
        "Failed to get action {{action}}": string;
        "Failed to get configurable flows for model {{model}}": string;
        "Failed to import FormDialog": string;
        "Failed to import FormDialog or FormStep": string;
        "Failed to import Formily components": string;
        Feedback: string;
        "Filter blocks": string;
        "Flow with key {{flowKey}} not found": string;
        "Form validation failed": string;
        "Invalid input parameters": string;
        "Invalid model provided": string;
        "Invalid subModelKey format": string;
        "Model with ID {{uid}} not found": string;
        Name: string;
        "Next step": string;
        "No createModelOptions found for item": string;
        OK: string;
        "Other blocks": string;
        "Parent not found, cannot replace block": string;
        "Previous step": string;
        "Replace current block with template?": string;
        "Replaced with template block": string;
        "Render failed": string;
        "Step configuration": string;
        "Step parameter configuration": string;
        "Step with key {{stepKey}} not found": string;
        "Submodel not found": string;
        "This is likely a NocoBase internals bug. Please open an issue at": string;
        "This step has no configurable parameters": string;
        "This variable is not available": string;
        "Use return to output value": string;
        "Try again": string;
        "Template created": string;
        "Template description": string;
        "Template name": string;
        "Template name is required": string;
        "UID copied to clipboard": string;
        "createModelOptions must specify use property": string;
        here: string;
        "RunJS deprecated warning": string;
        "RunJS deprecated warning with message": string;
        "RunJS deprecated separator": string;
        "RunJS deprecated replacedBy": string;
        "RunJS deprecated since": string;
        "RunJS deprecated removedIn": string;
    };
    'zh-CN': {
        Add: string;
        "Are you sure you want to delete this item? This action cannot be undone.": string;
        "Are you sure to convert this template block to copy mode?": string;
        "Array index out of bounds": string;
        Cancel: string;
        "Common actions": string;
        "Complete configuration": string;
        Configuration: string;
        "Configuration popup cancelled or error": string;
        "Configuration saved": string;
        "Confirm delete": string;
        "Copy UID": string;
        "Copy error info": string;
        "Copy failed": string;
        "Copy failed under HTTP. Clipboard API is unavailable on non-HTTPS pages. Please copy [{{uid}}] manually.": string;
        "Copy failed, please copy [{{uid}}] manually.": string;
        "Data blocks": string;
        Delete: string;
        "Delete failed": string;
        "Delete operation failed": string;
        "Delete operation failed, please check the console for details.": string;
        "Download logs": string;
        "Drawer API is not available, please ensure it is used within FlowEngineGlobalsContextProvider": string;
        "Error saving configuration": string;
        "Error saving configuration, please check console": string;
        "Error submitting form": string;
        "Expected array for subModel": string;
        "Expected object for subModel": string;
        "Failed to add sub model": string;
        "Failed to destroy model after creation error": string;
        "Failed to get action {{action}}": string;
        "Failed to get configurable flows for model {{model}}": string;
        "Failed to import FormDialog": string;
        "Failed to import FormDialog or FormStep": string;
        "Failed to import Formily components": string;
        Feedback: string;
        "Filter blocks": string;
        "Flow with key {{flowKey}} not found": string;
        "Form validation failed": string;
        "Invalid input parameters": string;
        "Invalid model provided": string;
        "Invalid subModelKey format": string;
        "Model with ID {{uid}} not found": string;
        Name: string;
        "Save as template": string;
        "Convert to copy": string;
        "Convert to copy is unavailable": string;
        "Parent not found, cannot replace block": string;
        "Replace current block with template?": string;
        "Replaced with template block": string;
        "Template created": string;
        "Template description": string;
        "Template name": string;
        "Template name is required": string;
        "Next step": string;
        "No createModelOptions found for item": string;
        OK: string;
        "Other blocks": string;
        "Previous step": string;
        "Render failed": string;
        "Step configuration": string;
        "Step parameter configuration": string;
        "Step with key {{stepKey}} not found": string;
        "Submodel not found": string;
        "This is likely a NocoBase internals bug. Please open an issue at": string;
        "This step has no configurable parameters": string;
        "This variable is not available": string;
        "Use return to output value": string;
        "Try again": string;
        "UID copied to clipboard": string;
        "createModelOptions must specify use property": string;
        here: string;
        "RunJS deprecated warning": string;
        "RunJS deprecated warning with message": string;
        "RunJS deprecated separator": string;
        "RunJS deprecated replacedBy": string;
        "RunJS deprecated since": string;
        "RunJS deprecated removedIn": string;
    };
};
/**
 * Get translation for a key with fallback
 */
export declare function getFlowEngineTranslation(key: string, locale?: string): string;
/**
 * Initialize flow-engine locale resources
 * This should be called when the flow-engine is initialized
 */
export declare function initFlowEngineLocale(i18nInstance?: any): void;
