import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

export function useDeferredData(source, initialData, deps = []) {
    const [state, setState] = useState(() => ({ isLoading: true, data: initialData }));
    const memoizedSource = useCallback(source, deps);

    useEffect(() => {
        let canceled = false;

        setState((curState) => {
            if (!curState.isLoading) {
                return { ...curState, isLoading: true };
            }

            return curState;
        });

        memoizedSource().then((data) => {
            if (canceled) {
                return;
            }

            setState(() => ({ isLoading: false, data }));
        });

        return () => {
            canceled = true;
        };
    }, [memoizedSource]);

    return state;
}

export function useProductTabs(tabs, productsSource) {
    const [currentTabId, setCurrentTabId] = useState(1);
    const memoizedTabs = useMemo(() => (
        tabs.map((tab) => ({
            ...tab,
            current: currentTabId === tab.id,
        }))
    ), [tabs, currentTabId]);
    const currentTab = memoizedTabs.find((x) => x.current);
    const products = useDeferredData(() => productsSource(currentTab), [], [currentTab]);
    const handleTabChange = useCallback((tab) => {
        setCurrentTabId(tab.id);
    }, [setCurrentTabId]);

    return useMemo(() => ({
        tabs: memoizedTabs,
        handleTabChange,
        ...products,
    }), [memoizedTabs, handleTabChange, products]);
}

export function useProductColumns(columns) {
    const products = useDeferredData(() => (
        Promise.all(columns.map((column) => column.source()))
    ), [], [columns]);

    return useMemo(() => (
        columns.map((column, index) => ({
            ...column,
            products: products.data[index] || [],
        }))
    ), [columns, products]);
}
