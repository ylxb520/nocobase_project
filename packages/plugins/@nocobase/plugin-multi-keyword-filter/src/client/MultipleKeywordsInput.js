/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useLazy } from '@nocobase/client';
import { Alert, Button, message, Modal, Select, Space, Tooltip, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { useT } from './locale';
import { UploadOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { useField } from '@formily/react';
const tokenSeparator = '\n';
const trim = (str) => (_.isString(str) ? str.trim() : str);
export const MultipleKeywordsInput = (props) => {
    const fileInputRef = useRef(null);
    const [importLoading, setImportLoading] = useState(false);
    const [columnModal, setColumnModal] = useState(false);
    const [columns, setColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const t = useT();
    const XLSX = useLazy(() => import('xlsx'), (module) => module);
    const field = useField();
    // remove validator to prevent error
    if (field?.validator) {
        field.validator = null;
    }
    const onChange = (...arg) => {
        if (['integer', 'number'].includes(props.fieldInterface)) {
            arg[0] = arg[0]
                .map(trim)
                .map((item) => parseInt(item, 10))
                .filter((item) => !isNaN(item));
        }
        if (['percent'].includes(props.fieldInterface)) {
            arg[0] = arg[0]
                .map(trim)
                .map((item) => parseFloat(item))
                .filter((item) => !isNaN(item));
        }
        if (props.onChange) {
            arg[0] = arg[0].map(trim).filter((item) => item !== '');
            props.onChange(...arg);
        }
    };
    const handleImportButtonClick = () => {
        fileInputRef.current?.click();
    };
    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                setImportLoading(true);
                // Read Excel file
                const data = await readExcel(file);
                if (data.length === 0) {
                    message.error(t('excelFileEmpty'));
                    setImportLoading(false);
                    return;
                }
                // Extract all column names
                const extractedColumns = Object.keys(data[0]);
                setColumns(extractedColumns);
                setExcelData(data);
                // If there is only one column, import directly
                if (extractedColumns.length === 1) {
                    const keywords = extractKeywordsFromColumn(data, extractedColumns[0]);
                    handleImportKeywords(keywords);
                }
                else {
                    // If there are multiple columns, open selection dialog
                    setColumnModal(true);
                }
            }
            catch (error) {
                console.error(t('errorParsingExcel'), error);
                message.error(t('failedToParseExcel'));
            }
            finally {
                setImportLoading(false);
                // Clear file input to enable trigger of change event when selecting the same file again
                event.target.value = '';
            }
        }
    };
    // Read Excel file content
    const readExcel = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
                    resolve(jsonData);
                }
                catch (error) {
                    reject(error);
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    };
    // Extract keywords from specified column
    const extractKeywordsFromColumn = (data, columnName) => {
        return data
            .map((row) => row[columnName])
            .filter((value) => value !== undefined && value !== null && value !== '')
            .join(tokenSeparator);
    };
    // Extract keywords from multiple columns
    const extractKeywordsFromColumns = (data, columnNames) => {
        const keywordSet = new Set();
        data.forEach((row) => {
            columnNames.forEach((column) => {
                const value = row[column];
                if (value !== undefined && value !== null && value !== '') {
                    keywordSet.add(value.toString());
                }
            });
        });
        return Array.from(keywordSet).join(tokenSeparator);
    };
    // Handle importing keywords into the input field
    const handleImportKeywords = (keywords) => {
        if (!keywords) {
            message.warning(t('noValidKeywords'));
            return;
        }
        // Set keywords to the input field
        if (props.onChange) {
            const keywordArray = keywords.split(tokenSeparator).filter(Boolean);
            props.onChange(keywordArray);
            message.success(t('importSuccess', { count: keywordArray.length }));
        }
    };
    // Handle column selection confirmation
    const handleColumnSelectConfirm = () => {
        if (selectedColumns.length === 0) {
            message.warning(t('selectAtLeastOneColumn'));
            return;
        }
        const keywords = extractKeywordsFromColumns(excelData, selectedColumns);
        handleImportKeywords(keywords);
        setColumnModal(false);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Space.Compact, { block: true },
            React.createElement(Select, { mode: "tags", tokenSeparators: [tokenSeparator], placeholder: t('keywordsInputPlaceholder'), allowClear: true, suffixIcon: null, maxTagCount: "responsive", open: _.isEmpty(props.value) ? false : undefined, ...props, onChange: onChange }),
            React.createElement(Tooltip, { title: t('importExcel') },
                React.createElement(Button, { onClick: handleImportButtonClick, loading: importLoading, icon: React.createElement(UploadOutlined, null) }))),
        React.createElement("input", { type: "file", ref: fileInputRef, style: { display: 'none' }, accept: ".xlsx,.xls", onChange: handleFileChange }),
        React.createElement(Modal, { title: t('selectExcelColumns'), open: columnModal, onOk: handleColumnSelectConfirm, onCancel: () => setColumnModal(false), okText: t('confirm'), cancelText: t('cancel') },
            React.createElement(Alert, { type: "info", style: { marginBottom: '10px', whiteSpace: 'pre-line', padding: '4px 8px' }, description: React.createElement(Typography, null,
                    React.createElement("ul", { style: { marginBottom: 0 } }, t('tips')
                        .split('\n')
                        .map((item) => (React.createElement("li", { key: item }, item))))) }),
            React.createElement(Select, { mode: "multiple", value: selectedColumns, onChange: (values) => setSelectedColumns(values), style: { width: '100%' }, placeholder: t('selectColumnsPlaceholder') }, columns.map((column) => (React.createElement(Select.Option, { key: column, value: column }, column)))))));
};
//# sourceMappingURL=MultipleKeywordsInput.js.map