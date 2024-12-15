const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json()); // For parsing JSON request bodies

// Define an API endpoint
app.post('/run-playwright', async (req, res) => {
  
  console.log("Received a request at /run-playwright");
  console.log("Request Body:", req.body);

  const { EventID, CustomerID, FinalNumber } = req.body;

  if (!EventID || !CustomerID || !FinalNumber) {
    console.log("Missing required parameters.");
    return res.status(400).send('Missing required parameters: EventID, CustomerID, FinalNumber');
  }
  
  const { EventID, CustomerID, FinalNumber } = req.body;

  if (!EventID || !CustomerID || !FinalNumber) {
    return res.status(400).send('Missing required parameters: EventID, CustomerID, FinalNumber');
  }

  // Remove all non-numeric characters from CustomerID
  const numericCustomerID = CustomerID.replace(/\D/g, '');

  // Launch Playwright
  const browser = await chromium.launch({ headless: true }); // Change to `false` if you need a visible browser
  const page = await browser.newPage();

  try {
    // Step 1: Navigate to the login page
    await page.goto('https://www.guruwalk.com/login_with_password');

    // Step 2: Fill in the email and password
    await page.getByPlaceholder('Enter your email address').fill('guru@tourmeaway.com');
    await page.getByPlaceholder('Enter your password').fill('tourmeaway77');
    await page.getByPlaceholder('Enter your password').press('Enter');
    console.log('Logged in successfully.');

    // Step 3: Navigate to the specific tour session
    await page.goto(`https://www.guruwalk.com/gurus/tour_sessions/${EventID}`);
    console.log(`Navigated to EventID: ${EventID}`);

    // Step 4: Wait for the booking form to be visible
    const bookingFormSelector = `form[action="/gurus/bookings/${numericCustomerID}"]`;
    await page.waitForSelector(bookingFormSelector);
    console.log('Booking form is visible.');

    // Step 5: Select attendees dropdown and update value
    const bookingForm = await page.locator(bookingFormSelector);
    const attendeesDropdown = await bookingForm.locator('#booking_attendees');
    await attendeesDropdown.selectOption(FinalNumber);
    console.log(`Updated attendees to: ${FinalNumber}`);

    await page.waitForTimeout(2000); // Wait briefly before closing
    res.status(200).send('Playwright task completed successfully!');
  } catch (error) {
    console.error('Error during Playwright execution:', error);
    res.status(500).send('An error occurred during the Playwright task.');
  } finally {
    await browser.close(); // Ensure the browser is closed
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
