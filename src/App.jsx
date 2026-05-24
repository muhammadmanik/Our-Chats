import { useState, useRef, useMemo, useEffect, useLayoutEffect } from 'react';
import Header from './components/Header';
import MessageList from './components/MessageList';
import rawData from './chatData.json';

const PAGE_SIZE = 200;

export default function App() {
  const allMessages = useRef(rawData);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeSearchIdx, setActiveSearchIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const messageRefs = useRef({});
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const searchRef = useRef(null);

  const visibleMessages = useMemo(
    () => allMessages.current.slice(-visibleCount),
    [visibleCount]
  );

  useLayoutEffect(() => {
    if (visibleMessages && visibleMessages.length > 0) {
      const forceScrollToBottom = () => {
        const container = listRef.current || document.getElementById('chat-message-container');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      };

      forceScrollToBottom();
      const t1 = setTimeout(forceScrollToBottom, 50);
      const t2 = setTimeout(forceScrollToBottom, 150);
      const t3 = setTimeout(forceScrollToBottom, 400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, []);

  useEffect(() => {
    if (expanded && inputRef.current) inputRef.current.focus();
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        closeSearch();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [expanded]);

  const loadMore = () => {
    const container = listRef.current || document.getElementById('chat-message-container');
    const previousScrollHeight = container ? container.scrollHeight : 0;

    setVisibleCount(prev => Math.min(prev + PAGE_SIZE, allMessages.current.length));

    requestAnimationFrame(() => {
      if (container) {
        const heightDifference = container.scrollHeight - previousScrollHeight;
        container.scrollTop = container.scrollTop + heightDifference;
      }
    });
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (!text || !text.trim()) {
      setSearchResults([]);
      return;
    }
    const targetQuery = text.toLowerCase().trim();
    const matches = [];
    for (let i = 0; i < allMessages.current.length; i++) {
      const msg = allMessages.current[i];
      if (!msg) continue;
      const messageText = msg.content || msg.text || msg.message;
      if (typeof messageText !== 'string') continue;
      if (messageText.toLowerCase().includes(targetQuery)) {
        matches.push({ ...msg, globalIndex: i });
        if (matches.length >= 50) break;
      }
    }
    setSearchResults(matches);
    setActiveSearchIdx(0);
  };

  const scrollToMessage = (globalIndex) => {
    const needed = allMessages.current.length - globalIndex;
    if (needed > visibleCount) {
      setVisibleCount(needed + PAGE_SIZE);
    }
    requestAnimationFrame(() => {
      const el = messageRefs.current[globalIndex];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.transition = 'background-color 0.5s ease';
        el.style.backgroundColor = '#FFF9C4';
        setTimeout(() => {
          el.style.backgroundColor = 'transparent';
        }, 1500);
      }
    });
  };

  const registerRef = (idx, el) => {
    if (el) messageRefs.current[idx] = el;
  };

  const handleResultClick = (globalIndex) => {
    closeSearch();
    setTimeout(() => scrollToMessage(globalIndex), 150);
  };

  const closeSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setExpanded(false);
  };

  return (
    <div className="app" style={{ position: 'relative' }}>
      <Header
        expanded={expanded}
        onOpenSearch={() => setExpanded(true)}
        onCloseSearch={closeSearch}
        totalMessages={allMessages.current.length}
      />
      {expanded && (
        <div className="search-wrapper" ref={searchRef}>
          <div className="search-input-wrap">
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search messages..."
              autoFocus
              style={{ width: '100%', border: 'none', outline: 'none', color: '#000000' }}
            />
            <button className="search-close-btn" onClick={closeSearch} aria-label="Close search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map((r, i) => (
                <div
                  key={r.globalIndex}
                  className={`search-result ${i === activeSearchIdx ? 'active' : ''}`}
                  onClick={() => handleResultClick(r.globalIndex)}
                  onMouseEnter={() => setActiveSearchIdx(i)}
                >
                  <span className="search-result-sender">{r.sender}</span>
                  <span className="search-result-preview">
                    {r.content ? r.content.substring(0, 80) + (r.content.length > 80 ? '\u2026' : '') : `[${r.type}]`}
                  </span>
                  <span className="search-result-date">{new Date(r.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
          {searchQuery && searchResults.length === 0 && (
            <div className="search-dropdown">
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px', color: '#8e8e93', fontSize: '14px' }}>
                No messages found for &quot;{searchQuery}&quot;
              </div>
            </div>
          )}
        </div>
      )}
      <MessageList
        messages={visibleMessages}
        allMessages={allMessages.current}
        visibleCount={visibleCount}
        loadMore={loadMore}
        listRef={listRef}
        registerRef={registerRef}
      />
    </div>
  );
}
