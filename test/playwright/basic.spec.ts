import basicSetup from '../wallet-setup/basic.setup';
import { testWithSynpress } from '@synthetixio/synpress'
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright'

// Create a test instance with Synpress and MetaMask fixtures
const test = testWithSynpress(metaMaskFixtures(basicSetup))

// Extract expect function from test
const { expect } = test

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("TSender");
});

test("should show the airdropForm when connected, otherwise, not", async ({
  context,
  page,
  metamaskPage,
  extensionId,
}) => { 
  
  test.setTimeout(120000);

  // Create a new metamask instance
  const metamask = new MetaMask(
    context,
    metamaskPage,
    basicSetup.walletPassword,
    extensionId
  )

  // Go to the page first
  await page.goto('/');
  // Check if we see "please connect wallet"
  await expect(page.getByText("Connect your wallet to use TSender")).toBeVisible();

  // Run: pnpm exec playwright test --ui
  // and we get this error: Error: Cache for 08a20e3c7fc77e6ae298 does not exist. Create it first!

  // To solve it, we run: pnpm synpress, in order to build a cache, it actually will pop up metamask and create a wallet based on the basic setup for us
  // Copy the cache no. from the error jn and use it to rename the cache folder in `.cache-synpress` folder

  const customNetwork = {
    name: 'Anvil',
    rpcUrl: 'http://127.0.0.1:8545',
    chainId: 31337,
    symbol: 'ETH'
  }
  await metamask.addNetwork(customNetwork)

  // u will see this data-testid="rk-connect-button" for the connect button in the dev tools element tab
  await page.getByTestId('rk-connect-button').click() 

  // u will find this data-testid="rk-wallet-option-metaMask" after u click the connect button, this is the test id for the metamask option button
  await page.getByTestId('rk-wallet-option-io.metamask').waitFor({ // we wait for the option to show up cuz it takes seconds to pop up
    timeout: 60000, // and we wait for it to be visible
  })

  await page.getByTestId('rk-wallet-option-io.metamask').click(); // after it appear we click the metamask option

  // this is a key functionality that synpress gives us out of the box
  await metamask.connectToDapp(); // It will spin up a metamask for us based on our basic setup and it will connect

  await expect(page.getByText("Token Address")).toBeVisible()

})

