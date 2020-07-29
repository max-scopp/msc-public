import { newE2EPage } from '@stencil/core/testing';

describe('msc-button-group', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-button-group></msc-button-group>');
    const element = await page.find('msc-button-group');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
