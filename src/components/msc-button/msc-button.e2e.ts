import { newE2EPage } from '@stencil/core/testing';

describe('msc-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-button></msc-button>');
    const element = await page.find('msc-button');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
