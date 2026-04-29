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

    useEffect(() => {
        syncScrollRef.current = syncScroll;
    }, [syncScroll]);

    // Track loading state for each screen independently
    const [loadingStates, setLoadingStates] = useState({});

    // Reset all loading states when URL or Reload trigger changes
    useEffect(() => {
        if (activeUrl) {
            const newStates = {};
            visibleDeviceIds.forEach(id => newStates[id] = true);
            setLoadingStates(newStates);
        }
    }, [activeUrl, reload]);

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
        setLoadingStates(prev => ({ ...prev, [screenId]: false }));
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
            <div className="flex items-start gap-8 min-w-max">
                {visibleDeviceIds.map((screenId) => (
                    <SingleScreen
                        key={screenId}
                        screenId={screenId}
                        config={allDevices.find(d => d.id === screenId)}
                        scale={scale}
                        isLoading={loadingStates[screenId] !== false}
                        activeUrl={activeUrl}
                        reload={reload}
                        iframeRef={(el) => { iframeRefs.current[screenId] = el; }}
                        onIframeLoad={() => handleIframeLoad(screenId)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Screens;