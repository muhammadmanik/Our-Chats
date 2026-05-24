import { useState, memo } from 'react';

const MEDIA_BASE = '/';

const Message = memo(function Message({ message, isMe, globalIndex, registerRef, isGap }) {
  const [showTime, setShowTime] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const { type, sender, timestamp, content, mediaUri, duration } = message;

  const toggleTime = () => setShowTime(prev => !prev);
  const openLightbox = (e, src) => { e.stopPropagation(); setLightbox(src); };
  const closeLightbox = () => setLightbox(null);

  const renderByType = () => {
    switch (type) {
      case 'image':
        return (
          <div className={`msg-content msg-image ${isMe ? 'me' : ''}`} onClick={toggleTime}>
            <img
              className="media-img"
              src={MEDIA_BASE + mediaUri}
              alt="Shared image"
              loading="lazy"
              onClick={(e) => openLightbox(e, MEDIA_BASE + mediaUri)}
            />
            {content && <p className="msg-text">{content}</p>}
          </div>
        );
      case 'video':
        return (
          <div className={`msg-content msg-video ${isMe ? 'me' : ''}`} onClick={toggleTime}>
            <video className="media-video" src={MEDIA_BASE + mediaUri} controls preload="metadata" />
            {content && <p className="msg-text">{content}</p>}
          </div>
        );
      case 'audio':
        return (
          <div className={`msg-content msg-audio ${isMe ? 'me' : ''}`} onClick={toggleTime}>
            <div className="audio-bar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
              <audio className="audio-player" src={MEDIA_BASE + mediaUri} controls preload="none" />
            </div>
          </div>
        );
      case 'call':
        return (
          <div className="msg-call" onClick={toggleTime}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span className="call-text">{content}</span>
            {duration && <span className="call-duration"> • {duration}</span>}
          </div>
        );
      case 'unsent':
        const unsentName = isMe ? 'Muhammad Manik' : 'Mst Rupa Mune';
        return (
          <div className="msg-unsent" onClick={toggleTime}>
            <span className="unsent-text">{unsentName} unsent a message</span>
          </div>
        );
      default:
        return (
          <div className="message-bubble" onClick={toggleTime}>
            {content}
          </div>
        );
    }
  };

  let msgClass = 'message';
  if (type === 'call') msgClass += ' message-call';
  else if (isMe) msgClass += ' message-me';
  else msgClass += ' message-other';
  if (isGap) msgClass += ' message-has-gap';

  return (
    <>
      <div className={msgClass} ref={el => registerRef(globalIndex, el)}>
        {renderByType()}
        <div className={`timestamp ${showTime ? 'visible' : ''}`}>
          {new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          })}
        </div>
      </div>
      {lightbox && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <img className="lightbox-img" src={lightbox} alt="Full size" />
        </div>
      )}
    </>
  );
});

export default Message;
