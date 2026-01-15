import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'cloudscape-saved-filters';

// Default filter sets (similar to Cloudscape demo)
const DEFAULT_FILTERS = [
    {
        id: 'default-active-web',
        name: 'Active web distributions',
        query: {
            operation: 'and',
            tokens: [
                { propertyKey: 'deliveryMethod', operator: '=', value: 'Web' },
                { propertyKey: 'state', operator: '=', value: 'Activated' },
            ],
        },
        isDefault: true,
    },
    {
        id: 'default-custom-ssl',
        name: 'Custom SSL certificates',
        query: {
            operation: 'and',
            tokens: [
                { propertyKey: 'sslCertificate', operator: '=', value: 'Custom' },
            ],
        },
        isDefault: false,
    },
];

/**
 * Custom hook for managing saved filter sets
 * Provides persistence to localStorage and CRUD operations
 */
export function useSavedFilters() {
    const [savedFilters, setSavedFilters] = useState([]);
    const [selectedFilterId, setSelectedFilterId] = useState(null);

    // Load saved filters from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge with defaults if needed
                setSavedFilters(parsed.length > 0 ? parsed : DEFAULT_FILTERS);
            } else {
                // First time - use default filters
                setSavedFilters(DEFAULT_FILTERS);
            }
        } catch (error) {
            console.error('Failed to load saved filters:', error);
            setSavedFilters(DEFAULT_FILTERS);
        }
    }, []);

    // Persist to localStorage when filters change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedFilters));
        } catch (error) {
            console.error('Failed to save filters:', error);
        }
    }, [savedFilters]);

    const saveFilter = useCallback((name, query) => {
        const newFilter = {
            id: `filter-${Date.now()}`,
            name,
            query,
            createdAt: new Date().toISOString(),
        };
        setSavedFilters(prev => [...prev, newFilter]);
        return newFilter;
    }, []);

    const deleteFilter = useCallback((filterId) => {
        setSavedFilters(prev => prev.filter(f => f.id !== filterId));
        if (selectedFilterId === filterId) {
            setSelectedFilterId(null);
        }
    }, [selectedFilterId]);

    const updateFilter = useCallback((filterId, updates) => {
        setSavedFilters(prev =>
            prev.map(f => f.id === filterId ? { ...f, ...updates } : f)
        );
    }, []);

    const selectFilter = useCallback((filterId) => {
        setSelectedFilterId(filterId);
    }, []);

    const getSelectedFilter = useCallback(() => {
        return savedFilters.find(f => f.id === selectedFilterId) || null;
    }, [savedFilters, selectedFilterId]);

    const clearSelection = useCallback(() => {
        setSelectedFilterId(null);
    }, []);

    return {
        savedFilters,
        selectedFilterId,
        saveFilter,
        deleteFilter,
        updateFilter,
        selectFilter,
        getSelectedFilter,
        clearSelection,
    };
}
