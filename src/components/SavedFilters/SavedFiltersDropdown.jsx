import React, { useState } from 'react';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import Modal from '@cloudscape-design/components/modal';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';

/**
 * Saved Filters Dropdown Component
 * 
 * Provides a dropdown menu for:
 * - Selecting saved filter sets
 * - Saving current filter as new set
 * - Deleting existing filter sets
 */
export function SavedFiltersDropdown({
    savedFilters,
    selectedFilterId,
    onSelectFilter,
    onSaveFilter,
    onDeleteFilter,
    currentQuery,
    disabled = false,
}) {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [filterName, setFilterName] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [filterToDelete, setFilterToDelete] = useState(null);

    const selectedFilter = savedFilters.find(f => f.id === selectedFilterId);

    const handleSaveFilter = () => {
        if (filterName.trim()) {
            onSaveFilter(filterName.trim(), currentQuery);
            setFilterName('');
            setShowSaveModal(false);
        }
    };

    const handleDeleteConfirm = () => {
        if (filterToDelete) {
            onDeleteFilter(filterToDelete.id);
            setFilterToDelete(null);
            setShowDeleteModal(false);
        }
    };

    const handleItemClick = ({ detail }) => {
        const itemId = detail.id;

        if (itemId === 'save-new') {
            setShowSaveModal(true);
        } else if (itemId.startsWith('delete-')) {
            const filterId = itemId.replace('delete-', '');
            const filter = savedFilters.find(f => f.id === filterId);
            setFilterToDelete(filter);
            setShowDeleteModal(true);
        } else if (itemId === 'clear') {
            onSelectFilter(null);
        } else {
            onSelectFilter(itemId);
        }
    };

    const buildDropdownItems = () => {
        const items = [];

        // Saved filter sets
        if (savedFilters.length > 0) {
            items.push({
                id: 'saved-filters',
                text: 'Saved filter sets',
                items: savedFilters.map(filter => ({
                    id: filter.id,
                    text: filter.name,
                    iconName: filter.id === selectedFilterId ? 'check' : undefined,
                })),
            });

            items.push({
                id: 'delete-filters',
                text: 'Delete filter set',
                items: savedFilters.map(filter => ({
                    id: `delete-${filter.id}`,
                    text: filter.name,
                    iconName: 'remove',
                })),
            });
        }

        // Actions
        items.push({
            id: 'actions',
            text: 'Actions',
            items: [
                { id: 'save-new', text: 'Save current filter as new set', iconName: 'add-plus' },
                ...(selectedFilterId ? [{ id: 'clear', text: 'Clear selection', iconName: 'close' }] : []),
            ],
        });

        return items;
    };

    return (
        <>
            <ButtonDropdown
                items={buildDropdownItems()}
                onItemClick={handleItemClick}
                disabled={disabled}
                expandableGroups
            >
                {selectedFilter ? selectedFilter.name : 'Saved filter sets'}
            </ButtonDropdown>

            {/* Save Filter Modal */}
            <Modal
                visible={showSaveModal}
                onDismiss={() => setShowSaveModal(false)}
                header="Save filter set"
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button variant="link" onClick={() => setShowSaveModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSaveFilter} disabled={!filterName.trim()}>
                                Save
                            </Button>
                        </SpaceBetween>
                    </Box>
                }
            >
                <FormField label="Filter set name">
                    <Input
                        value={filterName}
                        onChange={({ detail }) => setFilterName(detail.value)}
                        placeholder="Enter a name for this filter set"
                    />
                </FormField>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                visible={showDeleteModal}
                onDismiss={() => setShowDeleteModal(false)}
                header="Delete filter set"
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button variant="link" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleDeleteConfirm}>
                                Delete
                            </Button>
                        </SpaceBetween>
                    </Box>
                }
            >
                <Box>
                    Are you sure you want to delete the filter set "{filterToDelete?.name}"?
                </Box>
            </Modal>
        </>
    );
}

export default SavedFiltersDropdown;
