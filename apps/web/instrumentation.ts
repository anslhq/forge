import { initializeSentry } from "@platform/observability/instrumentation";

export const register = initializeSentry;
export { onRequestError } from "@platform/observability/instrumentation";
