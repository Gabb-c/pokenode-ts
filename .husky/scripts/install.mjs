/**
 * This is an async function that handles the installation and initialization of Husky.
 * Husky is a tool that helps to prevent bad git commits, commits with errors, and more.
 *
 * @returns {Promise<void>} - The function does not return any value.
 */
async () => {
  try {
    // Check if the environment is production or CI. If so, skip the installation.
    if (process.env.NODE_ENV === "production" || process.env.CI === "true") {
      console.log("[HUSKY] Skipping install in production or CI environment");
      process.exit(0);
    }

    // Dynamically import Husky and initialize it.
    (await import("husky")).default();
    console.log("[HUSKY] Successfully installed and initialized");
  } catch (error) {
    // Log any errors that occur during the installation process.
    console.error("[HUSKY] Error during installation:", error);
    process.exit(1);
  }
};
