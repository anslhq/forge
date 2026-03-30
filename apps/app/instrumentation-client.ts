import { initializeAnalytics } from "@platform/analytics/instrumentation-client";
import { initializeSentry } from "@platform/observability/client";

initializeSentry();
initializeAnalytics();

export { onRouterTransitionStart } from "@platform/observability/client";
