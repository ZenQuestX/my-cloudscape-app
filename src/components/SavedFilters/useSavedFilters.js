import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'cloudscape-saved-filters';

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
                setSavedFilters(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Failed to load saved filters:', error);
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
