import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseDocument } from 'htmlparser2';
import { findAll } from 'domutils';
import { loadModule } from './module-loader.mjs';

const { SITE_ROUTES } = loadModule('src/lib/routes.ts');
const { formKeyForSlug } = loadModule('src/lib/form-keys.ts');
const { LeadForm } = loadModule('src/components/sections/LeadForm.tsx', {process:{env:{}}});
const { EstimateA } = loadModule('src/components/variant-a/EstimateA.tsx', {process:{env:{}}});
const { BathroomContactForm } = loadModule('src/components/sections/BathroomContactForm.tsx', {process:{env:{}}});
const { default: EstimateRequestForm } = loadModule('app/schedule-an-estimate/EstimateRequestForm.tsx', {process:{env:{}}});
const { PROJECT_TYPES } = loadModule('src/lib/content.ts');
const shared = new Set(['about-us', 'careers', 'contact', 'general-contractor', 'custom-home-services']);
const cases = [
  ['homepage_estimate', EstimateA, {}],
  ['estimate_bathroom_remodeling', BathroomContactForm, {pagePath:'/bathroom-remodeling',idPrefix:'bath'}],
  ['schedule_estimate', EstimateRequestForm, {}],
  ...SITE_ROUTES.filter(route => shared.has(route.slug) || route.path.startsWith('/service-area/')).map(route => [formKeyForSlug(route.slug), LeadForm, {formKey:formKeyForSlug(route.slug),pagePath:route.path,options:route.slug === 'careers' ? ['Carpentry'] : PROJECT_TYPES,submitLabel:'Send request',withResume:route.slug === 'careers',idPrefix:route.slug}]),
];
const controls = html => findAll(node => ['input','textarea','select'].includes(node.name), parseDocument(html).children);

function wireFromMarkup(html) {
  const fields = {};
  let form_key;
  for (const node of controls(html)) {
    const {name,type,value} = node.attribs;
    if (name === 'form_key') { form_key = value; continue; }
    if (!('required' in node.attribs) || type === 'file' || name in fields) continue;
    fields[name] = type === 'checkbox' ? true : value || ({name:'Local Test',phone:'2532162633',email:'qa@example.com',resumeFileName:'resume.pdf'}[name] ?? 'Local test details');
  }
  return {form_key,form_data:fields,website:''};
}

test('all 27 actual SSR forms declare exactly their client identity and canonical required fields', async () => {
  assert.equal(cases.length, 27);
  const { payloadErrors } = loadModule('src/lib/lead-server.ts');
  const route = loadModule('app/api/lead/route.ts', {process:{env:{VERCEL_ENV:'production',RECAPTCHA_HOSTNAMES:'www.tubroconstruction.com',NEXT_PUBLIC_RECAPTCHA_SITE_KEY:'isolated-production-site-key'}},fetch:async () => {throw new Error('Tokenless tests must never forward');}});
  for (const [key, Component, props] of cases) {
    const html = renderToStaticMarkup(createElement(Component, props));
    const identity = controls(html).filter(node => node.attribs.name === 'form_key');
    assert.equal(identity.length,1,key);
    assert.equal(identity[0].attribs.type,'hidden',key);
    assert.equal(identity[0].attribs.value,key,key);
    const payload = wireFromMarkup(html);
    assert.ok(!('form_key' in payload.form_data));
    assert.equal(Object.keys(payloadErrors(payload)).length, 0, `${key}: canonical fields remain valid`);
    const response = await route.POST(new Request('https://www.tubroconstruction.com/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}));
    const result = await response.json();
    assert.equal(response.status,403,`${key}: ${JSON.stringify(result)}`);
    assert.equal(result.code,'verification_failed',key);
  }
});

test('SSR identity stays outside form_data; unknown keys and duplicate identity are rejected', async () => {
  const route = loadModule('app/api/lead/route.ts', {process:{env:{VERCEL_ENV:'production',RECAPTCHA_HOSTNAMES:'www.tubroconstruction.com',NEXT_PUBLIC_RECAPTCHA_SITE_KEY:'isolated-production-site-key'}},fetch:async () => {throw new Error('No forwarding expected');}});
  const payload = { ...wireFromMarkup(renderToStaticMarkup(createElement(EstimateRequestForm))), captchaToken: 'invalid-test-token' };
  const invalid = [
    ...['contact-form','defaultkey','unsupported'].map(form_key => ({...payload,form_key})),
    {...payload,form_data:{...payload.form_data,form_key:payload.form_key}},
    {...payload,form_data:{...payload.form_data,consent:'true'}},
    {...payload,context:{url:'https://www.tubroconstruction.com/schedule-an-estimate'}},
  ];
  for (const body of invalid) {
    const response = await route.POST(new Request('https://www.tubroconstruction.com/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}));
    assert.equal(response.status,422);
  }
});

test('actual client field reader ignores hidden routing metadata and retains boolean consent and chosen filename', () => {
  const values = new Map([['name','Local Test'],['email','qa@example.com'],['phone','2532162633'],['projectType','Carpentry'],['projectDetails','Local test details'],['website',''],['form_key','careers_application'],['resumeFileName','stale.pdf'],['unexpected','not sent']]);
  const { readFields } = loadModule('src/lib/estimate-fields.ts', {FormData:class { get(key) {return values.get(key);} }});
  const form = {querySelector:selector => selector === '[name="consent"]' ? {checked:true} : selector === '[name="resume"]' ? {files:[{name:'selected.pdf'}]} : null};
  const fields = readFields(form);
  assert.equal(fields.consent,true);
  assert.equal(fields.resumeFileName,'selected.pdf');
  for (const key of ['form_key','formKey','resume','unexpected']) assert.equal(key in fields,false,key);
  assert.equal(fields.email,'qa@example.com');
});
