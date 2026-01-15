import React, { useMemo, useState } from 'react';
import Table from '@cloudscape-design/components/table';
import PropertyFilter from '@cloudscape-design/components/property-filter';
import Pagination from '@cloudscape-design/components/pagination';
import Header from '@cloudscape-design/components/header';
import Box from '@cloudscape-design/components/box';
import Select from '@cloudscape-design/components/select';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import Modal from '@cloudscape-design/components/modal';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import DatePicker from '@cloudscape-design/components/date-picker';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { useCollection } from '@cloudscape-design/collection-hooks';
import { useSavedFilters } from '../SavedFilters/useSavedFilters';

/**
 * FilterableTable - A reusable table component with PropertyFilter and saved filter sets
 * 
 * @param {Object} props
 * @param {Array} props.items - Data items to display
 * @param {Array} props.columnDefinitions - Column definitions for the table
 * @param {Array} props.filteringProperties - Property definitions for PropertyFilter
 * @param {string} props.resourceName - Name of the resource (e.g., "Distributions")
 * @param {React.ReactNode} props.actions - Action buttons to display in header
 * @param {Function} props.onSelectionChange - Callback when selection changes
 * @param {string} props.selectionType - "single" | "multi" | undefined
 */
export function FilterableTable({
    items = [],
    columnDefinitions = [],
    filteringProperties = [],
    resourceName = 'Items',
    actions,
    onSelectionChange,
    selectionType = 'multi',
    pageSize = 20,
}) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [filterName, setFilterName] = useState('');
    const [dateValue, setDateValue] = useState("");
    console.log("FilterableTable rendered, dateValue:", dateValue);

    // Saved filters management
    const {
        savedFilters,
        selectedFilterId,
        saveFilter,
        deleteFilter,
        selectFilter,
        getSelectedFilter,
    } = useSavedFilters();

    // Initial query state for PropertyFilter
    const [query, setQuery] = useState({
        tokens: [],
        operation: 'and',
    });

    // Custom filtering function to support numeric, boolean, and date operators
    const applyFiltering = (items, query, dateValue) => {
        const { tokens, operation } = query;

        let filtered = items;

        // Date Picker filtering
        if (dateValue) {
            filtered = filtered.filter(item => item.lastModified === dateValue);
        }

        // 1. Text search (if query.filteringText existed, but PropertyFilter uses tokens mainly. 
        // If we attached a text filter search bar, we would handle it here. 
        // Current PropertyFilter setup puts everything in tokens unless free text is enabled/handled separately)
        // PropertyFilter's query object has { tokens, operation }. 

        // 2. Token filtering
        if (tokens && tokens.length > 0) {
            const matchesToken = (item, token) => {
                const { propertyKey, operator, value } = token;
                const itemValue = item[propertyKey];

                if (itemValue === undefined || itemValue === null) return false;

                // Numeric comparison
                if (typeof itemValue === 'number' || propertyKey === 'requests') {
                    const numItem = Number(itemValue);
                    const numValue = Number(value);
                    if (isNaN(numItem) || isNaN(numValue)) return false;

                    switch (operator) {
                        case '=': return numItem === numValue;
                        case '!=': return numItem !== numValue;
                        case '>': return numItem > numValue;
                        case '>=': return numItem >= numValue;
                        case '<': return numItem < numValue;
                        case '<=': return numItem <= numValue;
                        default: return false;
                    }
                }

                // Boolean comparison
                if (typeof itemValue === 'boolean' || propertyKey === 'logging') {
                    const strValue = String(value).toLowerCase();
                    const boolValue = strValue === 'true' || strValue === 'enabled';
                    const boolItem = Boolean(itemValue);

                    if (operator === '!=') return boolItem !== boolValue;
                    return boolItem === boolValue;
                }

                // Date comparison (iso string)
                if (propertyKey === 'lastModified') {
                    // Date string comparison works for ISO format
                    switch (operator) {
                        case '=': return itemValue === value;
                        case '!=': return itemValue !== value;
                        case '>': return itemValue > value;
                        case '>=': return itemValue >= value;
                        case '<': return itemValue < value;
                        case '<=': return itemValue <= value;
                        default: return false;
                    }
                }

                // Default string comparison
                const strItem = String(itemValue).toLowerCase();
                const strValue = String(value).toLowerCase();

                switch (operator) {
                    case '=': return strItem === strValue;
                    case '!=': return strItem !== strValue;
                    case ':': return strItem.indexOf(strValue) !== -1;
                    case '!:': return strItem.indexOf(strValue) === -1;
                    case '^': return strItem.startsWith(strValue);
                    case '!^': return !strItem.startsWith(strValue);
                    default: return strItem === strValue;
                }
            };

            filtered = filtered.filter(item => {
                if (operation === 'or') {
                    return tokens.some(token => matchesToken(item, token));
                } else {
                    return tokens.every(token => matchesToken(item, token));
                }
            });
        }
        return filtered;
    };

    // Apply filtering manually
    const filteredItems = useMemo(() => applyFiltering(items, query, dateValue), [items, query, dateValue]);

    // Use useCollection ONLY for pagination and sorting
    const {
        items: displayedItems, // Items to be displayed (paginated/sorted)
        collectionProps,
        paginationProps,
    } = useCollection(filteredItems, {
        pagination: { pageSize },
        sorting: {},
        selection: {},
    });

    const isFiltering = query.tokens && query.tokens.length > 0;

    // Handle selection changes
    const handleSelectionChange = ({ detail }) => {
        setSelectedItems(detail.selectedItems);
        onSelectionChange?.(detail.selectedItems);
    };

    // Handle save filter
    const handleSaveFilter = () => {
        if (filterName.trim()) {
            saveFilter(filterName.trim(), query);
            setFilterName('');
            setShowSaveModal(false);
        }
    };

    // Filter actions dropdown items
    const filterActionItems = [
        {
            id: 'clear',
            text: 'フィルターをクリア',
        },
        {
            id: 'save',
            text: '新規フィルターセットとして保存',
            disabled: query.tokens.length === 0,
        },
        ...(selectedFilterId ? [{
            id: 'delete',
            text: '選択中のフィルターセットを削除',
        }] : []),
    ];

    // Handle filter action click
    const handleFilterAction = ({ detail }) => {
        switch (detail.id) {
            case 'clear':
                setQuery({ tokens: [], operation: 'and' });
                selectFilter(null);
                setDateValue("");
                break;
            case 'save':
                setShowSaveModal(true);
                break;
            case 'delete':
                if (selectedFilterId) {
                    deleteFilter(selectedFilterId);
                    setQuery({ tokens: [], operation: 'and' });
                }
                break;
        }
    };

    // Generate unique filtering options from data
    const filteringOptions = useMemo(() => {
        const options = [];
        filteringProperties.forEach(prop => {
            // Use filteredItems instead of items to implement dependent filtering
            const uniqueValues = [...new Set(filteredItems.map(item => item[prop.key]))];
            uniqueValues.forEach(value => {
                if (value !== undefined && value !== null) {
                    options.push({
                        propertyKey: prop.key,
                        value: String(value),
                    });
                }
            });
        });
        return options;
    }, [filteredItems, filteringProperties]);

    return (
        <>
            <Table
                {...collectionProps}
                selectionType={selectionType}
                selectedItems={selectedItems}
                onSelectionChange={handleSelectionChange}
                columnDefinitions={columnDefinitions}
                items={displayedItems}
                trackBy="id"
                variant="full-page"
                stickyHeader
                header={
                    <Header
                        counter={`(${filteredItems.length})`}
                        actions={actions}
                        info={<span> Info</span>}
                    >

                        {resourceName}
                    </Header>
                }
                filter={
                    <PropertyFilter
                        query={query}
                        onChange={({ detail }) => setQuery(detail)}
                        filteringOptions={filteringOptions}
                        filteringProperties={filteringProperties}
                        customControl={
                            <Select
                                inlineLabelText="保存済みフィルターセット"
                                placeholder="フィルターセットを選択"
                                options={savedFilters.map(f => ({
                                    value: f.id,
                                    label: f.name,
                                    labelTag: f.isDefault ? 'デフォルト' : undefined,
                                }))}
                                selectedOption={
                                    selectedFilterId
                                        ? { value: selectedFilterId, label: savedFilters.find(f => f.id === selectedFilterId)?.name }
                                        : null
                                }
                                onChange={({ detail }) => {
                                    const filterId = detail.selectedOption?.value || null;
                                    selectFilter(filterId);
                                    if (filterId) {
                                        const filter = savedFilters.find(f => f.id === filterId);
                                        if (filter?.query) {
                                            setQuery(filter.query);
                                        }
                                    } else {
                                        setQuery({ tokens: [], operation: 'and' });
                                    }
                                }}
                                empty="保存済みフィルターなし"
                            />
                        }
                        customFilterActions={
                            <SpaceBetween direction="horizontal" size="xs">
                                <DatePicker
                                    onChange={({ detail }) => setDateValue(detail.value)}
                                    value={dateValue}
                                    placeholder="YYYY/MM/DD(JP)"
                                />
                                <ButtonDropdown
                                    items={filterActionItems}
                                    onItemClick={handleFilterAction}
                                    ariaLabel="フィルター操作"
                                />
                            </SpaceBetween>
                        }
                        i18nStrings={{
                            filteringAriaLabel: 'リソースをフィルター',
                            filteringPlaceholder: 'リソースを検索',
                            groupValuesText: '値',
                            groupPropertiesText: 'プロパティ',
                            operatorsText: '演算子',
                            operationAndText: 'かつ',
                            operationOrText: 'または',
                            tokenOperatorAriaLabel: '演算子',
                            operatorEqualsText: '等しい',
                            operatorDoesNotEqualText: '等しくない',
                            operatorContainsText: '含む',
                            operatorDoesNotContainText: '含まない',
                            operatorGreaterText: 'より大きい',
                            operatorGreaterOrEqualText: '以上',
                            operatorLessText: 'より小さい',
                            operatorLessOrEqualText: '以下',
                            operatorStartsWithText: 'で始まる',
                            operatorDoesNotStartWithText: 'で始まらない',
                            clearFiltersText: 'フィルターをクリア',
                            applyActionText: '適用',
                            cancelActionText: 'キャンセル',
                            enteredTextLabel: (text) => `使用: "${text}"`,
                            tokenLimitShowMore: 'もっと見る',
                            tokenLimitShowFewer: '折りたたむ',
                            removeTokenButtonAriaLabel: (token) =>
                                `トークンを削除 ${token.propertyKey} ${token.operator} ${token.value}`,
                        }}
                    />
                }

                pagination={
                    <Pagination
                        {...paginationProps}
                        ariaLabels={{
                            nextPageLabel: 'Next page',
                            previousPageLabel: 'Previous page',
                            pageLabel: (pageNumber) => `Page ${pageNumber}`,
                        }}
                    />
                }
            />

            {/* Save Filter Modal */}
            <Modal
                visible={showSaveModal}
                onDismiss={() => setShowSaveModal(false)}
                header="フィルターセットを保存"
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button variant="link" onClick={() => setShowSaveModal(false)}>
                                キャンセル
                            </Button>
                            <Button variant="primary" onClick={handleSaveFilter} disabled={!filterName.trim()}>
                                保存
                            </Button>
                        </SpaceBetween>
                    </Box>
                }
            >
                <FormField label="フィルターセット名">
                    <Input
                        value={filterName}
                        onChange={({ detail }) => setFilterName(detail.value)}
                        placeholder="フィルターセットの名前を入力"
                    />
                </FormField>
            </Modal>
        </>
    );
}

export default FilterableTable;
