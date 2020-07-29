import { newE2EPage } from '@stencil/core/testing';

describe('msc-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-input></msc-input>');
    const element = await page.find('msc-input');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
