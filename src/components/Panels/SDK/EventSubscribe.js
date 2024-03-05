import { useState } from 'react';
import settings from '../../../settings';
import { useWorkspace, useOpenWorkspacesDispatch } from '../../Context/OpenWorkspacesContext';

function EventSubscribe({ workspaceId }) {

  const [selectedEvent, setSelectedEvent] = useState(settings.SDK_EVENTS[0]);
  const workspace = useWorkspace(workspaceId);
  const openWorkspacesDispatch = useOpenWorkspacesDispatch();

  const onChange = (e) => {
    const val = e.target.value;
    if (!settings.SDK_EVENTS.includes(val)) {
      return;
    }
    setSelectedEvent(val);
  };

  const subscribeAll = () => {
    settings.SDK_EVENTS.forEach((e) => {
        openWorkspacesDispatch({
        type: 'subscribeEvent',
        workspaceId: workspaceId,
        event: e,
      });
    });
  };

  const unsubscribeAll = () => {
    openWorkspacesDispatch({
      type: 'unsubscribeAllEvents',
      workspaceId: workspaceId,
    });
  };

  const subscribeEvent = (e) => {
    openWorkspacesDispatch({
      type: 'subscribeEvent',
      workspaceId: workspaceId,
      event: e,
    });
  };

  const unsubscribeEvent = (e) => {
    openWorkspacesDispatch({
      type: 'unsubscribeEvent',
      workspaceId: workspaceId,
      event: e,
    });
  };

  if (!workspace) {
    return (
        <div>
            No workspace
        </div>
    );
  }

  return (
    <div>
      <div>
        <button onClick={subscribeAll}>Subscribe all</button>
        <button onClick={unsubscribeAll}>Unsubscribe all</button>
      </div>
      <select value={selectedEvent} onChange={onChange} style={{width: "200px"}}>
      {settings.SDK_EVENTS.map((e) => (
        <option key={e} value={e}>{e} {workspace.subscribedEvents.includes(e) && " (subscribed)"}</option>
      ))}
      </select>
      <button onClick={() => {subscribeEvent(selectedEvent)}}>Subscribe</button>
      <button onClick={() => {unsubscribeEvent(selectedEvent)}}>Unsubscribe</button>
    </div>
  );
}

export default EventSubscribe;
