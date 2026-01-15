import React from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import { AppLayout } from '../components/Layout/AppLayout';
import { FilterableTable } from '../components/FilterableTable/FilterableTable';
import {
    sampleDistributions,
    filteringProperties,
    columnDefinitions
} from '../data/sampleDistributions';

/**
 * DistributionsPage
 * Main demo page showing the FilterableTable with saved filters
 */
export function DistributionsPage() {
    const [selectedItems, setSelectedItems] = React.useState([]);

    const handleSelectionChange = (items) => {
        setSelectedItems(items);
    };

    const hasSelection = selectedItems.length > 0;

    return (
        <AppLayout
            breadcrumbs={[{ text: 'Distributions', href: '/distributions' }]}
            activeNavigationHref="/distributions"
            notifications={
                <Alert
                    dismissible
                    type="info"
                    header="This demo is an example of Cloudscape Design System patterns and components"
                >
                    This demo may not reflect the current patterns and components of AWS services.{' '}
                    <Link href="https://cloudscape.design" external>
                        Learn more about Cloudscape
                    </Link>
                </Alert>
            }
        >
            <FilterableTable
                items={sampleDistributions}
                columnDefinitions={columnDefinitions}
                filteringProperties={filteringProperties}
                resourceName="Distributions"
                onSelectionChange={handleSelectionChange}
                selectionType="multi"
                actions={
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button disabled={!hasSelection}>View details</Button>
                        <Button disabled={!hasSelection}>Edit</Button>
                        <Button disabled={!hasSelection}>Delete</Button>
                        <Button variant="primary">Create distribution</Button>
                    </SpaceBetween>
                }
            />
        </AppLayout>
    );
}

export default DistributionsPage;
