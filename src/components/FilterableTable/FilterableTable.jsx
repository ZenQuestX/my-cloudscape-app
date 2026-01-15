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

    // Collection hooks for filtering, sorting, and pagination
    const {
        items: filteredItems,
        filteredItemsCount,
        collectionProps,
        paginationProps,
    } = useCollection(items, {
        propertyFiltering: {
            filteringProperties,
            query,
            onChange: ({ detail }) => setQuery(detail),
            empty: (
                <Box textAlign="center" color="inherit">
                    <b>No resources</b>
                    <Box color="inherit" padding={{ bottom: 's' }}>
                        No {resourceName.toLowerCase()} to display.
                    </Box>
                </Box>
            ),
            noMatch: (
                <Box textAlign="center" color="inherit">
                    <b>No matches</b>
                    <Box color="inherit" padding={{ bottom: 's' }}>
                        No {resourceName.toLowerCase()} match the filter criteria.
                    </Box>
                </Box>
            ),
        },
        pagination: { pageSize },
        sorting: {},
        selection: {},
    });

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
            const uniqueValues = [...new Set(items.map(item => item[prop.key]))];
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
    }, [items, filteringProperties]);

    return (
        <>
            <Table
                {...collectionProps}
                selectionType={selectionType}
                selectedItems={selectedItems}
                onSelectionChange={handleSelectionChange}
                columnDefinitions={columnDefinitions}
                items={filteredItems}
                trackBy="id"
                variant="full-page"
                stickyHeader
                header={
                    <Header
                        counter={`(${filteredItemsCount})`}
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
                        enableTokenGroups
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
                            <ButtonDropdown
                                items={filterActionItems}
                                onItemClick={handleFilterAction}
                                ariaLabel="フィルター操作"
                            />
                        }
                        i18nStrings={{
                            filteringAriaLabel: 'リソースをフィルター',
                            filteringPlaceholder: 'リソースを検索',
                            groupValuesText: '値',
                            groupPropertiesText: 'プロパティ',
                            operatorsText: '演算子',
                            // and/or選択の表示テキスト
                            operationAndText: 'かつ',
                            operationOrText: 'または',
                            tokenOperatorAriaLabel: '演算子',
                            // 演算子の説明テキスト（記号の横に表示される）
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
                        expandToViewport
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
