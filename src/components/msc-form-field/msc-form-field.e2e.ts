import { newE2EPage } from '@stencil/core/testing';

describe('msc-form-field', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-form-field></msc-form-field>');
    const element = await page.find('msc-form-field');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
