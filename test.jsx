<div
style={{
  position: 'fixed',
  top: isSmallScreen ? '105px' : '110px',
  right: '20px',
  zIndex: 1000,
  maxWidth: '300px',
  width: '100%',
  left: isSmallScreen ? '50%' : 'auto',
  transform: isSmallScreen ? 'translateX(-50%)' : 'none',
}}
>
{notifications.map((notification) => (
  <div 
    key={notification.id}
    className={`apply-job-notification apply-job-notification-${notification.type}`}
  >
    <span>{notification.message}</span>
    <button 
      type="button" 
      className="apply-job-notification-close"
      onClick={() => removeNotification(notification.id)}
      aria-label="Close"
    />
  </div>
))}
</div>