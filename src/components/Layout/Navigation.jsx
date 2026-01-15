import React from 'react';
import SideNavigation from '@cloudscape-design/components/side-navigation';

/**
 * Navigation Component
 * Provides side navigation similar to AWS console layout
 */
export function Navigation({ activeHref = '/', onNavigate }) {
    const handleFollow = (event) => {
        if (!event.detail.external) {
            event.preventDefault();
            onNavigate?.(event.detail.href);
        }
    };

    return (
        <SideNavigation
            activeHref={activeHref}
            header={{
                href: '/',
                text: 'Service',
            }}
            onFollow={handleFollow}
            items={[
                {
                    type: 'section',
                    text: 'Reports and analytics',
                    items: [
                        { type: 'link', text: 'Distributions', href: '/distributions' },
                        { type: 'link', text: 'Cache statistics', href: '/cache-statistics' },
                        { type: 'link', text: 'Monitoring and alarms', href: '/monitoring' },
                        { type: 'link', text: 'Popular objects', href: '/popular-objects' },
                        { type: 'link', text: 'Top referrers', href: '/top-referrers' },
                        { type: 'link', text: 'Usage', href: '/usage' },
                        { type: 'link', text: 'Viewers', href: '/viewers' },
                    ],
                },
                {
                    type: 'section',
                    text: 'Private content',
                    items: [
                        { type: 'link', text: 'How-to guide', href: '/how-to-guide' },
                        { type: 'link', text: 'Origin access identity', href: '/origin-access' },
                    ],
                },
            ]}
        />
    );
}

export default Navigation;
