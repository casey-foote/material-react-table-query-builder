/**
 * @OnlyCurrentDoc
 *
 * The above comment directs Apps Script to limit the scope of file
 * access for this add-on. It specifies that this add-on will only
 * attempt to read or modify the files in which the add-on is used,
 * and not all of the user's files. The authorization request message
 * presented to users will reflect this limited scope.
 */

/**
 * Creates a menu entry in the Google Docs/Sheets/Slides UI when the document is opened.
 * This method is called when the add-on is installed.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which add-on caused the event, inspect e.authMode.
 */
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createAddonMenu()
      .addItem('Launch Query Builder', 'showSidebar')
      .addToUi();
}

/**
 * Runs when the add-on is installed.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which add-on caused the event, inspect e.authMode.
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 */
function showSidebar() {
  const ui = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Query Builder')
      .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(ui);
}

/**
 * Gets the URL for the query builder JS bundle.
 *
 * @return {string} The URL for the query builder JS bundle.
 */
function getQueryBuilderUrl() {
  // Use jsdelivr to serve the GitHub-hosted file (allowed in CSP)
  return 'https://casey-foote.github.io/query-builder/assets/query-builder-bundle.js';
}

/**
 * Opens the Query Builder dialog.
 */
function openQueryBuilderDialog() {
  // Generate a nonce for Content Security Policy
  const nonceValue = Utilities.getUuid();
  
  // Get the JS bundle URL to inject into the template
  const queryBuilderJsUrl = getQueryBuilderUrl();
  
  // Create the HTML template with the JS URL and nonce injected
  const template = HtmlService.createTemplateFromFile('QueryBuilderDialog');
  template.queryBuilderJsUrl = queryBuilderJsUrl;
  template.nonceValue = nonceValue;
  
  // Create the HTML output from the template
  const htmlOutput = template.evaluate()
    .setWidth(1000)
    .setHeight(800)
    .setTitle('Query Builder');
  
  // Show the dialog
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Query Builder');
}

/**
 * Refreshes the data source.
 * This is a placeholder for the actual implementation.
 *
 * @return {object} An object indicating success or failure.
 */
function refreshDataSource() {
  try {
    // This is where you would implement the actual data refresh logic
    // For example, fetching data from an external API or database
    
    // Simulate a delay for testing
    Utilities.sleep(2000);
    
    // Return success
    return { success: true };
  } catch (error) {
    console.error('Error refreshing data source:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Exports the last query results.
 * This is a placeholder for the actual implementation.
 *
 * @return {object} An object indicating success or failure.
 */
function exportLastResults() {
  try {
    // This is where you would implement the actual export logic
    // For example, creating a new sheet with the results or generating a CSV
    
    // Get the active spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Create a new sheet for the exported data
    const newSheet = spreadsheet.insertSheet('Exported Results ' + new Date().toLocaleString());
    
    // This is where you would add the actual data
    // For this example, we'll just add some placeholder data
    newSheet.getRange('A1:C1').setValues([['Column A', 'Column B', 'Column C']]);
    newSheet.getRange('A2:C4').setValues([
      [1, 'Data 1', 100],
      [2, 'Data 2', 200],
      [3, 'Data 3', 300]
    ]);
    
    // Format the header row
    newSheet.getRange('A1:C1').setFontWeight('bold');
    
    // Auto-resize columns
    newSheet.autoResizeColumns(1, 3);
    
    // Return success
    return { success: true };
  } catch (error) {
    console.error('Error exporting results:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Saves the current query configuration.
 * This is a placeholder for the actual implementation.
 *
 * @param {string} queryName The name to give the saved query.
 * @return {object} An object indicating success or failure.
 */
function saveCurrentQuery(queryName) {
  try {
    // This is where you would implement the actual query saving logic
    // For example, storing the query configuration in PropertiesService
    
    // For this example, we'll just store the name and date
    const now = new Date();
    const savedQueries = JSON.parse(PropertiesService.getUserProperties().getProperty('savedQueries') || '[]');
    
    // Add the new query
    savedQueries.push({
      id: 'query_' + now.getTime(),
      name: queryName,
      lastRun: now.toLocaleDateString(),
      // In a real implementation, you would store the actual query configuration here
      config: { name: queryName, timestamp: now.getTime() }
    });
    
    // Only keep the 10 most recent queries
    if (savedQueries.length > 10) {
      savedQueries.shift();
    }
    
    // Save back to properties
    PropertiesService.getUserProperties().setProperty('savedQueries', JSON.stringify(savedQueries));
    
    // Return success
    return { success: true };
  } catch (error) {
    console.error('Error saving query:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Gets the list of recent queries.
 * This is a placeholder for the actual implementation.
 *
 * @return {Array} An array of query objects.
 */
function getRecentQueries() {
  try {
    // Retrieve saved queries from properties
    const savedQueriesJson = PropertiesService.getUserProperties().getProperty('savedQueries');
    
    if (!savedQueriesJson) {
      return [];
    }
    
    // Parse and return the queries
    const savedQueries = JSON.parse(savedQueriesJson);
    
    // Sort by timestamp (most recent first)
    savedQueries.sort((a, b) => {
      // Extract timestamp from config or use a default
      const aTime = a.config && a.config.timestamp ? a.config.timestamp : 0;
      const bTime = b.config && b.config.timestamp ? b.config.timestamp : 0;
      return bTime - aTime;
    });
    
    return savedQueries;
  } catch (error) {
    console.error('Error getting recent queries:', error);
    return [];
  }
}

/**
 * Loads a saved query.
 * This is a placeholder for the actual implementation.
 *
 * @param {string} queryId The ID of the query to load.
 * @return {object} An object indicating success or failure.
 */
function loadSavedQuery(queryId) {
  try {
    // Retrieve saved queries from properties
    const savedQueriesJson = PropertiesService.getUserProperties().getProperty('savedQueries');
    
    if (!savedQueriesJson) {
      return { success: false, error: 'No saved queries found' };
    }
    
    // Parse the queries
    const savedQueries = JSON.parse(savedQueriesJson);
    
    // Find the query with the matching ID
    const query = savedQueries.find(q => q.id === queryId);
    
    if (!query) {
      return { success: false, error: 'Query not found' };
    }
    
    // In a real implementation, you would now load the query configuration
    // and send it to the dialog to be loaded
    
    // Open the dialog with the saved query
    openQueryBuilderDialog();
    
    // Return success
    return { success: true };
  } catch (error) {
    console.error('Error loading saved query:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Saves a query configuration.
 * This is called from the dialog.
 *
 * @param {object} config The query configuration to save.
 * @return {object} An object indicating success or failure.
 */
function saveQueryConfiguration(config) {
  try {
    // This is where you would implement the actual configuration saving logic
    // For this example, we'll just log it
    console.log('Saving query configuration:', config);
    
    // Return success
    return { success: true };
  } catch (error) {
    console.error('Error saving query configuration:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Applies query results to the current sheet.
 * This is called from the dialog.
 *
 * @param {object} results The query results to apply.
 * @return {object} An object indicating success or failure.
 */
function applyQueryResults(results) {
  try {
    // Get the active sheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Clear the sheet (or create a new one if preferred)
    sheet.clear();
    
    // Check if we have headers and data
    if (!results || !results.headers || !results.data) {
      return { success: false, error: 'Invalid results format' };
    }
    
    // Set headers
    const headerRange = sheet.getRange(1, 1, 1, results.headers.length);
    headerRange.setValues([results.headers]);
    headerRange.setFontWeight('bold');
    
    // Set data
    if (results.data.length > 0) {
      const dataRange = sheet.getRange(2, 1, results.data.length, results.headers.length);
      dataRange.setValues(results.data);
    }
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, results.headers.length);
    
    // Return success
    return { success: true };
  } catch (error) {
    console.error('Error applying query results:', error);
    return { success: false, error: error.toString() };
  }
}
