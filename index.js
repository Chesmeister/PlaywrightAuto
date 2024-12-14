const { chromium } = require('playwright');

(async () => {

var EventID = req.param('EventID');
    var CustomerID = req.param('CustomerID');
    var FinalNumber = req.param('FinalNumber');
    
    // Remove all non-numeric characters using regex
    var numericCustomerID = CustomerID.replace(/\D/g, '');

    const browser = await chromium.launch({ headless: false }); // Launch the browser
    const page = await browser.newPage(); // Create a new page

    try {
      // Step 1: Navigate to the login page
      await page.goto('https://www.guruwalk.com/login_with_password');

      // Step 2: Fill in the email and password
      await page.getByPlaceholder('Enter your email address').click();
      await page.getByPlaceholder('Enter your email address').fill('guru@tourmeaway.com');
      await page.getByPlaceholder('Enter your email address').press('Tab');
      await page.getByPlaceholder('Enter your password').fill('tourmeaway77');
      await page.getByPlaceholder('Enter your password').press('Enter');

      // Step 3: Navigate to the specific tour session
      await page.goto('https://www.guruwalk.com/gurus/tour_sessions/'+EventID);

      // Step 4: Wait for the booking form to be visible
      const bookingFormSelector = `form[action="/gurus/bookings/${numericCustomerID}"]`;
      await page.waitForSelector(bookingFormSelector);
      console.log('Booking form is visible.');

      // Step 5: Locate the form and attendees dropdown
      const bookingForm = await page.locator(bookingFormSelector);
      const attendeesDropdown = await bookingForm.locator('#booking_attendees');
      await attendeesDropdown.waitFor();
      console.log('Attendees dropdown is found.');

      // Step 6: Select the option '0'
      await attendeesDropdown.selectOption(FinalNumber);
      console.log('Option '+FinalNumber+' is selected.');

      // Step 7: Wait for 2 seconds before closing
      await page.waitForTimeout(2000); // Wait for 2000 milliseconds (2 seconds)
      console.log('Waiting for 2 seconds before closing the page...');

    } catch (error) {
      console.error('Error during selection:', error);
      return res.serverError(error); // Respond with an error
    } finally {
      await browser.close(); // Ensure the browser is closed
    }

    return res.ok('Successfully marked as no-show'); // Respond with success
    
})();
