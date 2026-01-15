import React, { useState } from 'react';
import AppLayoutComponent from '@cloudscape-design/components/app-layout';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import { Navigation } from './Navigation';

/**
 * AppLayout Component
 * Main layout wrapper with top navigation, side navigation, and breadcrumbs
 */
export function AppLayout({
    children,
    breadcrumbs = [],
    activeNavigationHref = '/distributions',
    notifications,
}) {
    const [navigationOpen, setNavigationOpen] = useState(true);

    const breadcrumbItems = [
        { text: 'Service', href: '/' },
        ...breadcrumbs,
    ];

    return (
        <>
            <div id="top-nav">
                <TopNavigation
                    identity={{
                        href: '/',
                        title: 'Service',
                    }}
                    utilities={[
                        {
                            type: 'button',
                            iconName: 'notification',
                            title: 'Notifications',
                            ariaLabel: 'Notifications',
                            badge: true,
                            disableUtilityCollapse: false,
                        },
                        {
                            type: 'menu-dropdown',
                            iconName: 'settings',
                            ariaLabel: 'Settings',
                            title: 'Settings',
                            items: [
                                { id: 'settings', text: 'Settings' },
                                { id: 'preferences', text: 'Preferences' },
                            ],
                        },
                        {
                            type: 'menu-dropdown',
                            text: 'User',
                            iconName: 'user-profile',
                            items: [
                                { id: 'profile', text: 'Profile' },
                                { id: 'signout', text: 'Sign out' },
                            ],
                        },
                    ]}
                />
            </div>
            <AppLayoutComponent
                headerSelector="#top-nav"
                navigation={<Navigation activeHref={activeNavigationHref} />}
                navigationOpen={navigationOpen}
                onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
                breadcrumbs={
                    <BreadcrumbGroup
                        items={breadcrumbItems}
                        ariaLabel="Breadcrumbs"
                    />
                }
                notifications={notifications}
                content={children}
                toolsHide
            />
        </>
    );
}

export default AppLayout;
