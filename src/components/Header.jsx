export default function Header({ expanded, onOpenSearch, onCloseSearch, totalMessages }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="avatar-placeholder">MR</div>
        <div>
          <h1 className="header-name">Mst Rupa Mune</h1>
          <div className="header-sub">{totalMessages.toLocaleString()} messages</div>
        </div>
      </div>
      <div className="header-search">
        <button className="search-icon-btn" onClick={expanded ? onCloseSearch : onOpenSearch} aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </div>
    </header>
  );
}
