import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import EmptyState from './EmptyState';
import SingleScreen from './SingleScreen';

const Screens = () => {
    const activeUrl = useSelector((state) => state.app.activeUrl);
    const syncScroll = useSelector((state) => state.app.syncScroll);
    const reload = useSelector((state) => state.app.reload);
    const zoomLevel = useSelector((state) => state.app.zoomLevel);
    const visibleDeviceIds = useSelector((state) => state.screen?.visibleDeviceIds || []);
    const allDevices = useSelector((state) => state.screen?.devices || []);

    const iframeRefs = useRef({});
    const scrollingScreen = useRef(null);
    const scrollTimeouts = useRef({});
    const syncScrollRef = useRef(syncScroll);
    const loadStartTimeRefs = useRef({});

    useEffect(() => {
        syncScrollRef.current = syncScroll;
    }, [syncScroll]);

    const [loadingStates, setLoadingStates] = useState({});
    const [errorStates, setErrorStates] = useState({});
    const [localReloadKeys, setLocalReloadKeys] = useState({});
    const timeoutRefs = useRef({});

    // Reset all loading and error states when URL or Reload trigger changes
    useEffect(() => {
        if (activeUrl) {
            const newLoading = {};
            const newErrors = {};

            // Clear any existing timeouts
            Object.values(timeoutRefs.current).forEach(clearTimeout);
            timeoutRefs.current = {};

            visibleDeviceIds.forEach(id => {
                newLoading[id] = true;
                newErrors[id] = false;
                loadStartTimeRefs.current[id] = Date.now();

                // Set a timeout to detect if iframe fails to load
                // 10 seconds is usually enough for a successful load
                timeoutRefs.current[id] = setTimeout(() => {
                    setLoadingStates(prev => ({ ...prev, [id]: false }));
                    setErrorStates(prev => ({ ...prev, [id]: true }));
                }, 10000);
            });

            setLoadingStates(newLoading);
            setErrorStates(newErrors);
        }

        return () => {
            Object.values(timeoutRefs.current).forEach(clearTimeout);
        };
    }, [activeUrl, reload, visibleDeviceIds]);

    const handleRetry = (screenId) => {
        setLoadingStates(prev => ({ ...prev, [screenId]: true }));
        setErrorStates(prev => ({ ...prev, [screenId]: false }));
        setLocalReloadKeys(prev => ({ ...prev, [screenId]: (prev[screenId] || 0) + 1 }));
        loadStartTimeRefs.current[screenId] = Date.now();

        if (timeoutRefs.current[screenId]) clearTimeout(timeoutRefs.current[screenId]);

        timeoutRefs.current[screenId] = setTimeout(() => {
            setLoadingStates(prev => ({ ...prev, [screenId]: false }));
            setErrorStates(prev => ({ ...prev, [screenId]: true }));
        }, 10000);
    };

    const handleScroll = (sourceId) => {
        if (!syncScrollRef.current) return;
        if (scrollingScreen.current && scrollingScreen.current !== sourceId) return;

        const sourceIframe = iframeRefs.current[sourceId];
        if (!sourceIframe || !sourceIframe.contentWindow) return;

        try {
            const sourceDoc = sourceIframe.contentDocument || sourceIframe.contentWindow.document;
            if (!sourceDoc) return;

            const scrollY = sourceIframe.contentWindow.scrollY;
            const maxScrollY = sourceDoc.documentElement.scrollHeight - sourceIframe.contentWindow.innerHeight;
            const scrollPercentY = maxScrollY > 0 ? scrollY / maxScrollY : 0;

            scrollingScreen.current = sourceId;

            visibleDeviceIds.forEach(screenId => {
                if (screenId !== sourceId) {
                    const targetIframe = iframeRefs.current[screenId];
                    if (targetIframe && targetIframe.contentWindow) {
                        const targetDoc = targetIframe.contentDocument || targetIframe.contentWindow.document;
                        if (targetDoc) {
                            const targetMaxScrollY = targetDoc.documentElement.scrollHeight - targetIframe.contentWindow.innerHeight;
                            targetIframe.contentWindow.scrollTo(
                                targetIframe.contentWindow.scrollX,
                                targetMaxScrollY * scrollPercentY
                            );
                        }
                    }
                }
            });

            clearTimeout(scrollTimeouts.current[sourceId]);
            scrollTimeouts.current[sourceId] = setTimeout(() => {
                scrollingScreen.current = null;
            }, 20);
        } catch (err) {
            // Restricted by cross-origin policy
        }
    };

    const handleIframeLoad = (screenId) => {
        const loadTime = Date.now() - loadStartTimeRefs.current[screenId];

        if (timeoutRefs.current[screenId]) {
            clearTimeout(timeoutRefs.current[screenId]);
            delete timeoutRefs.current[screenId];
        }

        // HEURISTIC: If the iframe triggers 'onLoad' almost immediately (< 1500ms)
        // and we cannot access its contentWindow.location (SecurityError),
        // it's highly likely that the browser blocked it (e.g. X-Frame-Options: SAMEORIGIN).
        if (loadTime < 1500) {
            try {
                // If this doesn't throw, it's either the same origin OR the browser allowed it.
                const href = iframeRefs.current[screenId].contentWindow.location.href;
                if (!href || href === 'about:blank') {
                    // Still loading or empty, let the timeout handle it
                    return;
                }
            } catch (err) {
                // SecurityError: Browser blocked access. Since it was fast, it's a block page.
                setLoadingStates(prev => ({ ...prev, [screenId]: false }));
                setErrorStates(prev => ({ ...prev, [screenId]: true }));
                return;
            }
        }

        setLoadingStates(prev => ({ ...prev, [screenId]: false }));
        setErrorStates(prev => ({ ...prev, [screenId]: false }));

        try {
            const iframe = iframeRefs.current[screenId];
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.addEventListener('scroll', () => handleScroll(screenId));
            }
        } catch (err) {
            console.log('Scroll sync restricted by cross-origin policy');
        }
    };

    const scale = 0.35 * (zoomLevel / 100);

    if (!activeUrl) {
        return <EmptyState />;
    }

    return (
        <div className="w-full h-[calc(100vh-140px)] bg-[#0a0a0a] p-6 overflow-x-auto">
            <div id="all-screens-container" className="flex items-start gap-8 min-w-max">
                {visibleDeviceIds.map((screenId) => (
                    <SingleScreen
                        key={screenId}
                        screenId={screenId}
                        config={allDevices.find(d => d.id === screenId)}
                        scale={scale}
                        isLoading={loadingStates[screenId] !== false}
                        activeUrl={activeUrl}
                        reload={`${reload}-${localReloadKeys[screenId] || 0}`}
                        iframeRef={(el) => { iframeRefs.current[screenId] = el; }}
                        onIframeLoad={() => handleIframeLoad(screenId)}
                        isError={errorStates[screenId]}
                        onRetry={() => handleRetry(screenId)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Screens;