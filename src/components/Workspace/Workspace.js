import { useCallback, useEffect } from "react";

function Workspace({workspaceId, subscribeEvents, onEvent}) {

  const elemId = `workspace_${workspaceId}`;
  // const elemId = 'abc'; // static div-id

  const _onEvent = useCallback((e) => {
    const event = {
      origin: workspaceId,
      type: e.event,
      data: e.data,
    };
    onEvent && onEvent(event);

  // eslint-disable-next-line
  }, [workspaceId, onEvent]);

  // it's bad idea to load SDK inside Workspace component.
  // useEffect(() => {
  //     (function(d, s, id){
  //         window.SE_BASE = "containers.sphere-engine.com";
  //         window.SE_HTTPS = true;
  //         window.SE = window.SE || (window.SE = []);
  //         var js, fjs = d.getElementsByTagName(s)[0];
  //         if (d.getElementById(id)) return;
  //         js = d.createElement(s); js.id = id;
  //         js.src = (window.SE_HTTPS ? "https" : "http") + "://" + window.SE_BASE + "/static/sdk/sdk.min.js";
  //         fjs.parentNode.insertBefore(js, fjs);
  //     }(document, "script", "sphere-engine-jssdk"));
  //     window.SE.ready = function(f){if (document.readyState !== "loading" && document.readyState !== "interactive") f();else window.addEventListener("load", f);};        
  // }, []);

  useEffect(() => {
    console.log(`[Workspace.js] Workspace mount (elemId: ${elemId})`);

    // Load the workspace
    window.SE.ready(function() {
      const SEWorkspace = window.SE.workspace(elemId);
      if (!SEWorkspace) {
        console.log(`[Workspace.js] workspace not found`);
      }
    });

    return () => {
      console.log(`[Workspace.js] Workspace unmount`);

      // Destroy the workspace
      window.SE.ready(function() {
        const SEWorkspace = window.SE.workspace(elemId);
        if (!SEWorkspace) {
          console.log(`[Workspace.js] workspace not found`);
          return;
        }
        SEWorkspace.destroy();
      });
    };
  }, [elemId]);

  useEffect(() => {
    console.log('[Workspace.js] subscribeEvents(mount): ', subscribeEvents);
    
    window.SE.ready(function() {
      const SEWorkspace = window.SE.workspace(elemId);
      if (!SEWorkspace) {
        console.log(`[Workspace.js] workspace not found`);
        return;
      }
      subscribeEvents && subscribeEvents.forEach(event => {
        console.log('[Workspace.js] subscribe ' + event);
        SEWorkspace.events.subscribe(event, _onEvent);
      });
    });
    
    return () => {
      console.log('[Workspace.js] subscribeEvents(unmount): ', subscribeEvents);
      window.SE.ready(function() {
        const SEWorkspace = window.SE.workspace(elemId);
        if (!SEWorkspace) {
          console.log(`[Workspace.js] workspace not found`);
          return;
        }

        subscribeEvents && subscribeEvents.forEach(event => {
          console.log('[Workspace.js] unsubscribe ' + event);
          SEWorkspace.events.unsubscribe(event, _onEvent);
        });
      });
    };
  }, [elemId, subscribeEvents, _onEvent]);

  return (
    <div style={{height: '100%', width: '100%'}}>
      <div data-id={elemId} data-workspace={workspaceId}></div>
    </div>
  );
}

export default Workspace;
