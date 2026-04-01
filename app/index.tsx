import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';

const StartPage = () => {
    const { session, loading } = useAuth();

    if (loading) return null;

    if (!session) {
        return <Redirect href="/(auth)/login" />;
    }

    return <Redirect href="/(main)/(tabs)/home" />;
};

export default StartPage;