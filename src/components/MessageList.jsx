import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Message from './Message';

export default function MessageList({ messages, allMessages, visibleCount, loadMore, registerRef, listRef }) {
  const [isLoading, setIsLoading] = useState(false);
  const initialScrollDone = useRef(false);

  useLayoutEffect(() => {
    if (initialScrollDone.current) return;
    const container = listRef.current;
    if (container && container.scrollHeight > 0) {
      container.scrollTop = container.scrollHeight;
      initialScrollDone.current = true;
    }
  }, []);

  useEffect(() => {
    if (isLoading) setIsLoading(false);
  }, [messages]);

  const handleScroll = (e) => {
    const container = e.target;
    if (isLoading || visibleCount >= allMessages.length) return;
    if (container.scrollTop < 100) {
      setIsLoading(true);
      loadMore();
    }
  };

  const isMe = (sender) => sender === 'Muhammad Manik';
  const isYou = (sender) => sender === 'You';
  const startIdx = allMessages.length - visibleCount;

  return (
    <div
      id="chat-message-container"
      className="message-list"
      ref={listRef}
      onScroll={handleScroll}
    >
      {visibleCount < allMessages.length && (
        <div className="scroll-sentinel">
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

          />
        );
      })}
      <div className="scroll-bottom" />
    </div>
  );
}
