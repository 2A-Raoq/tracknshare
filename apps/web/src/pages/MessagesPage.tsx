import AppNavigation from '../components/AppNavigation'
import MessagesSidebar from '../components/MessagesSidebar'

export default function MessagesPage() {
  return (
    <div className="page-shell dc-page-shell">
      <AppNavigation />
      <div className="dc-layout">
        <MessagesSidebar />
        <div className="dc-chat dc-chat--empty">
          <p className="dc-chat__empty-label">Sélectionnez une conversation</p>
        </div>
      </div>
    </div>
  )
}
