const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      config.env.API_URL = 'http://localhost:3001';
      return config;
    },
  },
});
