import { newE2EPage } from '@stencil/core/testing';

describe('msc-toast', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-toast></msc-toast>');
    const element = await page.find('msc-toast');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
