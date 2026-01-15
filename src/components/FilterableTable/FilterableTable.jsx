import React, { useMemo, useState } from 'react';
import Table from '@cloudscape-design/components/table';
import PropertyFilter from '@cloudscape-design/components/property-filter';
import Pagination from '@cloudscape-design/components/pagination';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { SavedFiltersDropdown } from '../SavedFilters/SavedFiltersDropdown';
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

    // Apply saved filter when selected
    const handleSelectFilter = (filterId) => {
        selectFilter(filterId);
        if (filterId) {
            const filter = savedFilters.find(f => f.id === filterId);
            if (filter?.query) {
                setQuery(filter.query);
            }
        } else {
            // Clear selection - reset to empty query
            setQuery({ tokens: [], operation: 'and' });
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
                <SpaceBetween direction="horizontal" size="xs">
                    <SavedFiltersDropdown
                        savedFilters={savedFilters}
                        selectedFilterId={selectedFilterId}
                        onSelectFilter={handleSelectFilter}
                        onSaveFilter={saveFilter}
                        onDeleteFilter={deleteFilter}
                        currentQuery={query}
                    />
                    <PropertyFilter
                        query={query}
                        onChange={({ detail }) => setQuery(detail)}
                        filteringOptions={filteringOptions}
                        filteringProperties={filteringProperties}
                        i18nStrings={{
                            filteringAriaLabel: 'Filter resources',
                            filteringPlaceholder: 'Find resources',
                            groupValuesText: 'Values',
                            groupPropertiesText: 'Properties',
                            operatorsText: 'Operators',
                            clearFiltersText: 'Clear filters',
                            applyActionText: 'Apply',
                            cancelActionText: 'Cancel',
                            enteredTextLabel: (text) => `Use: "${text}"`,
                            tokenLimitShowMore: 'Show more',
                            tokenLimitShowFewer: 'Show fewer',
                            removeTokenButtonAriaLabel: (token) =>
                                `Remove token ${token.propertyKey} ${token.operator} ${token.value}`,
                        }}
                        expandToViewport
                    />
                </SpaceBetween>
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
    );
}

export default FilterableTable;
