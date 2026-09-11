import { describe,expect,test } from 'bun:test';
import { APP_NAME,resolveBrandName } from '../src/lib/brand-name';
import { resolveBrandLogo,resolveBrandIcon } from '../src/lib/brand-assets';
describe('Customer branding across deployments',()=>{
 test('configured customer name overrides deployment fallback',()=>{
  expect(resolveBrandName('',null,'Different Manufacturer')).toBe('Different Manufacturer');
  expect(resolveBrandName()).toBe(APP_NAME);
 });
 test('missing media never selects the previous customer artwork',()=>{
  expect(resolveBrandLogo('','en','light')).toBe('');
  expect(resolveBrandIcon('','favicon')).toBe('/neutral-icon.svg');
 });
 test('custom logo survives legacy asset upgrades',()=>{
  expect(resolveBrandLogo('https://example.invalid/new-logo.svg','tr','dark')).toBe('https://example.invalid/new-logo.svg');
  expect(resolveBrandIcon('https://example.invalid/new-icon.png','apple')).toBe('https://example.invalid/new-icon.png');
 });
});
