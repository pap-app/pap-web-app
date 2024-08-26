// middleware/authMiddleware.js

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUserContext } from '../poviders/user-context';

const withAuth = (WrappedComponent) => {
    const ComponentWithAuth = (props) => {
        const { userProfile } = useUserContext();
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem('kbg4_accessToken');
            if (!userProfile  && ! token) {
                router.push('/login');
            }
        }, [userProfile, router]);

        if (!userProfile) {
            return "Redireting to login page "; // Render a loading spinner or nothing while redirecting
        }

        return <WrappedComponent {...props} />;
    };

    // Set the display name for easier debugging
    ComponentWithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return ComponentWithAuth;
};

export default withAuth;

