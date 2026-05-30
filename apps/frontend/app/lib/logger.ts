import { createBrowserLogger } from '@ccatto/logger';

// Create the browser logger using the shared factory
const logger = createBrowserLogger();

// Re-export the same `log` API that all frontend files expect
export const log = logger;

export default logger;
