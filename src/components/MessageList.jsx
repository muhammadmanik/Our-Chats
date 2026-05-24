import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import Message from './Message';

export default function MessageList({ messages, allMessages, visibleCount, loadMore, registerRef, listRef }) {
  const sentinelRef = useRef(null);
  const bottomRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const previousScrollHeight = useRef(0);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && visibleCount < allMessages.length && !isLoading) {
        setIsLoading(true);
        previousScrollHeight.current = listRef.current.scrollHeight;
        loadMore();
      }
    }, { rootMargin: '400px' });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, allMessages.length, loadMore, listRef, isLoading]);

  useLayoutEffect(() => {
    if (isLoading && listRef.current && previousScrollHeight.current > 0) {
      const heightDifference = listRef.current.scrollHeight - previousScrollHeight.current;
      if (heightDifference > 0) {
        listRef.current.scrollTop += heightDifference;
      }
      previousScrollHeight.current = 0;
      setIsLoading(false);
    }
  });

  const isMe = (sender) => sender === 'Muhammad Manik';
  const isYou = (sender) => sender === 'You';
  const startIdx = allMessages.length - visibleCount;

  return (
    <div id="chat-message-container" className="message-list" ref={listRef}>
      {visibleCount < allMessages.length && (
        <div ref={sentinelRef} className="scroll-sentinel">
          <span className="load-more-hint">Scroll up to load more...</span>
        </div>
      )}
      {isLoading && (
        <div className="loading-spinner-container" style={{ display: 'flex', justifyContent: 'center', padding: '15px', background: '#ffffff' }}>
          <div className="spinner" style={{ width: '24px', height: '24px', border: '3px solid #f3f3f3', borderTop: '3px solid #000000', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      )}
      {messages.map((msg, i) => {
        const globalIdx = startIdx + i;
        const nextMsg = messages[i + 1];
        const isNormal = (m) => m.type !== 'call' && m.type !== 'unsent';
        const hasGap = !isNormal(msg) || !nextMsg || !isNormal(nextMsg) || nextMsg.sender !== msg.sender;
        return (
          <Message
            key={globalIdx}
            message={msg}
            isMe={isMe(msg.sender) || isYou(msg.sender)}
            globalIndex={globalIdx}
            registerRef={registerRef}
            isGap={hasGap}
            isLast={i === messages.length - 1}
          />
        );
      })}
      <div ref={bottomRef} className="scroll-bottom" />
    </div>
  );
}
