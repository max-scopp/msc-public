import { newE2EPage } from '@stencil/core/testing';

describe('msc-title', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-title></msc-title>');
    const element = await page.find('msc-title');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
