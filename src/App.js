import Demo from './components/Demo';
import { EventLogsProvider } from './components/Context/EventLogsContext';
import { AvailableWorkspacesProvider } from './components/Context/AvailableWorkspacesContext';
import { OpenWorkspacesProvider } from './components/Context/OpenWorkspacesContext';

function App() {

  return (
    <AvailableWorkspacesProvider>
      <OpenWorkspacesProvider>
        <EventLogsProvider>
          <Demo />
        </EventLogsProvider>
      </OpenWorkspacesProvider>
    </AvailableWorkspacesProvider>
  );
}

export default App;
