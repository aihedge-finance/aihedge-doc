import type {ClientModule} from '@docusaurus/types';

const FORMBRICKS_APP_URL = 'https://app.formbricks.com';
const FORMBRICKS_WORKSPACE_ID = 'cmtjn79hnzb5z01xm0jc5s47b';

function initFormbricks(): void {
  if (typeof window === 'undefined') return;

  if ((window as any).formbricks) {
    (window as any).formbricks.setup({
      workspaceId: FORMBRICKS_WORKSPACE_ID,
      appUrl: FORMBRICKS_APP_URL,
    });
    return;
  }

  // Inject Formbricks script tag if not already present
  if (!document.querySelector('script[src*="formbricks"]')) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `${FORMBRICKS_APP_URL}/js/formbricks.umd.cjs`;
    script.onload = () => {
      if ((window as any).formbricks) {
        (window as any).formbricks.setup({
          workspaceId: FORMBRICKS_WORKSPACE_ID,
          appUrl: FORMBRICKS_APP_URL,
        });
      }
    };
    document.head.appendChild(script);
  }
}

if (typeof window !== 'undefined') {
  initFormbricks();
}

const clientModule: ClientModule = {
  onRouteDidUpdate({location, previousLocation}) {
    if (previousLocation && location.pathname !== previousLocation.pathname) {
      if (typeof window !== 'undefined' && (window as any).formbricks?.registerRouteChange) {
        (window as any).formbricks.registerRouteChange();
      }
    }
  },
};

export default clientModule;
