import {useCallback, useState} from 'react';
import {ONE, ZERO} from '@/components/common/const';

export const useRefresh = () => {
    const [refreshCounter, setRefreshCounter] = useState(ZERO);

    const refresh = useCallback(() => {
        setRefreshCounter(counter => counter + ONE);
    }, []);

    return {
        refreshCounter,
        refresh,
    };
};