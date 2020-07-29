import { newE2EPage } from '@stencil/core/testing';

describe('msc-request-notifier', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-request-notifier></msc-request-notifier>');
    const element = await page.find('msc-request-notifier');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
