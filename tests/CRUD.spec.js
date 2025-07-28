const { test, expect} = require('@playwright/test');
test.use({ headless: false });
test('CRUD', async ({ page }) => {
  const dynamicUsername = `testuser${Date.now()}`;

  const screenSize = await page.evaluate(() => ({
    width: window.screen.width,
    height: window.screen.height,
  }));

  await page.setViewportSize(screenSize);

  await page.goto('http://localhost:3000');
  //Login page UI element check
  // Login Header
  const loginHeading = page.getByRole('heading', { name: 'Login' });
  await expect(loginHeading).toBeVisible();

  // Login Button
  const loginbutton = page.getByRole('button', { name: 'Login' });
  await expect(loginbutton).toBeVisible();

  // Login Page - Username 
  const username = page.getByPlaceholder('Username');
  await expect(username).toBeVisible();

  // Login Page - Password 
  const password = page.getByPlaceholder('Password');
  await expect(password).toBeVisible();

  // Login Page - Register link
  const registerLink = page.locator('.toggle-link', { hasText: 'Register' });
  await expect(registerLink).toBeVisible();

  // Login with empty fields
  await loginbutton.click();
  await expect(page).toHaveURL('http://localhost:3000');
  await expect(username).toHaveValue('');
  await expect(password).toHaveValue('');

  // Invalid username
  await page.waitForTimeout(2000);
  await username.fill('user0');
  await page.waitForTimeout(2000);
  await password.fill('password123');
  await loginbutton.click();
  await page.waitForTimeout(2000);
  const errorMessage = page.locator('text=User not found');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });
  
  await page.waitForTimeout(2000);
  await username.fill('');
  await page.waitForTimeout(2000);
  await password.fill('');

  //Invalid password
  await page.waitForTimeout(2000);
  await username.fill('testuser');
  await page.waitForTimeout(2000);
  await password.fill('password');
  await page.waitForTimeout(2000);
  await loginbutton.click();
  const errorMessage1 = page.locator('text=Invalid password');
  await expect(errorMessage1).toBeVisible({ timeout: 10000 });

  await page.waitForTimeout(2000);
  await username.fill('');
  await page.waitForTimeout(2000);
  await password.fill('');

  //Invalid username and password
  await page.waitForTimeout(2000);
  await username.fill('abcd');
  await page.waitForTimeout(2000);
  await password.fill('password');
  await page.waitForTimeout(2000);
  await loginbutton.click();
  const errorMessage2 = page.locator('text=User not found');
  await expect(errorMessage2).toBeVisible({ timeout: 10000 });
  
  await page.waitForTimeout(2000);
  await username.fill('');
  await page.waitForTimeout(5000);
  await password.fill('');

  //Register new user with Existing creds
  const registerLink1 = page.locator('.toggle-link', { hasText: 'Register' });
  await page.waitForTimeout(2000);
  await registerLink1.click();
  await page.waitForTimeout(2000);
  await page.getByPlaceholder('Username').fill('testuser');
  await page.waitForTimeout(2000);
  await page.getByPlaceholder('Email').fill('test@example.com');
  await page.waitForTimeout(2000);
  await page.getByPlaceholder('Password').first().fill('password123');
  await page.waitForTimeout(2000);
  await page.getByPlaceholder('Confirm Password').fill('password123');
  await page.waitForTimeout(2000);
  const registerbutton = page.getByRole('button', { name: 'Register' });
  await page.waitForTimeout(2000);
  await expect(registerbutton).toBeVisible();
  await registerbutton.click();
  const errorMessage3 = page.locator('text=Username or email already exists');
  await expect(errorMessage3).toBeVisible({ timeout: 10000 });

  //Register new user with new creds with mismatch password
  await page.waitForTimeout(2000);
  await page.getByPlaceholder('Username').fill(dynamicUsername);
  await page.waitForTimeout(2000);
  await page.getByPlaceholder('Email').fill(`${dynamicUsername}@example.com`);
  await page.waitForTimeout(2000);
  await page.getByPlaceholder('Password').first().fill('password1234');
  await page.waitForTimeout(2000);
  await page.getByPlaceholder('Confirm Password').fill('passwrd123');
  await page.waitForTimeout(2000);
  const registerbutton2 = page.getByRole('button', { name: 'Register' });
  await page.waitForTimeout(2000);
  await expect(registerbutton2).toBeVisible();
  await registerbutton2.click();
  await page.waitForTimeout(2000);
  const errorMessage4 = page.locator('text=Passwords do not match');
  await expect(errorMessage4).toBeVisible({ timeout: 10000 });

  //Register new user with new creds
  await page.waitForTimeout(2000);
  await page.getByPlaceholder('Username').fill(dynamicUsername);
  await page.waitForTimeout(2000);
  await page.getByPlaceholder('Email').fill(`${dynamicUsername}@example.com`);
  await page.waitForTimeout(2000);
  await page.getByPlaceholder('Password').first().fill('password1234');
  await page.waitForTimeout(2000);
  await page.getByPlaceholder('Confirm Password').fill('password1234');
  await page.waitForTimeout(2000);
  const registerbutton1 = page.getByRole('button', { name: 'Register' });
  await page.waitForTimeout(2000);
  await expect(registerbutton1).toBeVisible();
  await registerbutton1.click();
  await page.waitForTimeout(2000);
  await expect(page).toHaveURL('http://localhost:3000/');
  await page.waitForTimeout(2000);
  await expect(page.locator('text=User registered successfully!')).toBeVisible();

  // Login using valid creds
  await page.waitForTimeout(2000);
  await username.fill('testuser');
  await page.waitForTimeout(2000);
  await password.fill('password123');
  await loginbutton.click();
  await page.waitForTimeout(2000);
  await expect(page).toHaveURL('http://localhost:3000/waste');

  //Dashboard page UI element check
  //Dashboard heading
  const dashHeading = page.getByRole('heading', { name: 'Waste Collection Management' });
  await expect(dashHeading).toBeVisible();

  // Dashboard Page - Search box text
  const searchboxt = page.getByPlaceholder('Search by location, type or status...');
  await expect(searchboxt).toBeVisible();

  // Dashboard Page - Add Location , Weight , Type and status
  const addloc = page.getByPlaceholder('Location', { exact: true });
  await expect(addloc).toBeVisible();
  const addtype = page.getByPlaceholder('Type', { exact: true });
  await expect(addtype).toBeVisible();
  const addweight = page.getByPlaceholder('Weight (kg)');
  await expect(addweight).toBeVisible();
  const addstatus = page.locator('select[name="collected"]');
  await expect(addstatus).toBeVisible(); 

  //Add new button
  const addnewbutton = page.getByRole('button', { name: 'Add New' });
  await expect(addnewbutton).toBeVisible();

  //Edit button
  const editbutton = page.getByRole('button', { name: 'Edit' }).first();
  await expect(editbutton).toBeVisible();

  //Delete button
  const deletebutton = page.getByRole('button', { name: 'Delete' }).first();
  await expect(deletebutton).toBeVisible();

  //search function existing data
  //Seacrh function with location
    await page.waitForTimeout(2000);
    const searchInput = page.getByPlaceholder('Search by location, type or status...');
    await page.waitForTimeout(2000);
    await searchInput.click();
    await page.waitForTimeout(2000);
    await searchInput.fill('Berlin');
    const table = page.locator('table');
    await page.waitForTimeout(2000);
    await expect(table).toContainText('Berlin');
    await page.waitForTimeout(2000);
  //Seacrh function with type
    const searchInput1 = page.getByPlaceholder('Search by location, type or status...');
    await page.waitForTimeout(2000);
    await searchInput1.click();
    await page.waitForTimeout(2000);
    await searchInput1.fill('Plastic');
    await page.waitForTimeout(2000);
    const table1 = page.locator('table');
    await page.waitForTimeout(6000);
    await expect(table1).toContainText('Berlin');
    await expect(table1).toContainText('Stuttgart');
    await page.waitForTimeout(2000);
  //Seacrh function with collected option
    const searchInput3 = page.getByPlaceholder('Search by location, type or status...');
    await searchInput3.click();
    await page.waitForTimeout(2000);
    await searchInput3.fill('');
    const searchInput4 = page.getByPlaceholder('Search by location, type or status...');
    await page.waitForTimeout(2000);
    await searchInput4.click();
    await page.waitForTimeout(2000);
    await searchInput4.fill('Yes');
    await page.waitForTimeout(2000);
    const table2 = page.locator('table');
    await page.waitForTimeout(6000);
    await expect(table2).toContainText('Berlin');
    await expect(table2).toContainText('Hamburg');
    await expect(table2).toContainText('Frankfurt');
    await expect(table2).toContainText('Stuttgart');

    //Create function
    await page.waitForTimeout(2000);
    await page.getByPlaceholder('Location', { exact: true }).fill('Testnew city');
    await page.waitForTimeout(2000);
    await page.getByPlaceholder('Weight (kg)').fill('20');
    await page.waitForTimeout(2000);
    await page.getByPlaceholder('Type', { exact: true }).fill('Testnew type');
    await page.waitForTimeout(2000);
    await page.locator('select[name="collected"]').selectOption('No');
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Add New' }).click();

    //Seacrh for newly added data
    await page.waitForTimeout(2000);
    const searchInput5 = page.getByPlaceholder('Search by location, type or status...');
    await page.waitForTimeout(2000);
    await searchInput5.click();
    await page.waitForTimeout(2000);
    await searchInput5.fill('new');
    await page.waitForTimeout(2000);
    const table3 = page.locator('table');
    await page.waitForTimeout(2000);
    await expect(table3).toContainText('Testnew');

    //Seacrh funtion for non-existing data
    await page.waitForTimeout(2000);
    const searchInput6 = page.getByPlaceholder('Search by location, type or status...');
    await page.waitForTimeout(2000);
    await searchInput6.click();
    await page.waitForTimeout(2000);
    await searchInput6.fill('none');
    await page.waitForTimeout(2000);
    const empty = page.getByText('No data found');
    await page.waitForTimeout(2000);
    await expect(empty).toBeVisible();

    //Edit data
    await page.waitForTimeout(2000);
    const searchInput8 = page.getByPlaceholder('Search by location, type or status...');
    await page.waitForTimeout(2000);
    await searchInput8.fill('Berlin');
    await page.waitForTimeout(2000);
    const table5 = page.locator('table');
    await page.waitForTimeout(2000);
    await expect(table5).toContainText('Berlin');
    await page.waitForTimeout(2000);
    const editButton = page.getByRole('button', { name: 'Edit' }).first();
    await page.waitForTimeout(2000);
    await editButton.click();
    await page.waitForTimeout(2000);
    const editingRow = page.locator('tbody tr', {
     has: page.getByRole('button', { name: 'Save' }) // More reliable than placeholder
    });
    await page.waitForTimeout(6000);
    const inputLoc = editingRow.locator('input[name="location"]');
    const inputWeight = editingRow.locator('input[name="weight"]');
    const inputType = editingRow.locator('input[name="type"]');
    const selectCollected = editingRow.locator('select[name="collected"]');
    await page.waitForTimeout(6000);
    await inputLoc.fill('Berlin new');
    await inputWeight.fill('30');
    await inputType.fill('Plasticnew');
    await selectCollected.selectOption('No');
    await page.waitForTimeout(2000);
    const saveButton = editingRow.getByRole('button', { name: 'Save' });
    await page.waitForTimeout(2000);
    await saveButton.click();
    await page.waitForTimeout(2000);
    const searchInput7 = page.getByPlaceholder('Search by location, type or status...');
    await page.waitForTimeout(2000);
    await searchInput7.click();
    await page.waitForTimeout(2000);
    await searchInput7.fill('Berlin new');
    await page.waitForTimeout(2000);
    const table4 = page.locator('table');
    await page.waitForTimeout(2000);
    await expect(table4).toContainText('Berlin new')
    await page.waitForTimeout(2000);

    //Delete data
    const searchInput9 = page.getByPlaceholder('Search by location, type or status...');
    await page.waitForTimeout(2000);
    await searchInput9.click();
    await page.waitForTimeout(2000);
    await searchInput9.fill('Bonn');
    await page.waitForTimeout(2000);
    const table6 = page.locator('table');
    await page.waitForTimeout(2000);
    await expect(table6).toContainText('Bonn')
    await page.waitForTimeout(2000);
    const deleteButton = page.getByRole('button', { name: 'Delete' });
    await page.waitForTimeout(2000);
    await expect(deleteButton).toBeVisible();
    await page.waitForTimeout(2000);
    await deleteButton.click();
    await page.waitForTimeout(2000);
    const searchInput10 = page.getByPlaceholder('Search by location, type or status...');
    await page.waitForTimeout(2000);
    await searchInput10.click();
    await page.waitForTimeout(2000);
    await searchInput10.fill('Bonn');
    await page.waitForTimeout(2000);
    const empty1 = page.getByText('No data found');
    await page.waitForTimeout(2000);
    await expect(empty1).toBeVisible();
    await page.waitForTimeout(2000);

    //Log out button
    await page.waitForTimeout(2000);
    const logoutButton = page.getByRole('button', { name: 'Logout' });
    await page.waitForTimeout(2000);
    await logoutButton.click();  
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL('http://localhost:3000/');
});
