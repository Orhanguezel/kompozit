import { test, expect, mock, beforeEach, afterAll } from 'bun:test';
import { ContactCreateSchema } from '../../../packages/shared-backend/modules/contact/validation';
import { buildContactInsert } from '../../../packages/shared-backend/modules/contact/helpers/repository';

const mails: any[] = []; const notifications: any[] = []; const requests: any[] = [];
let created: any;
const cfg: any = { enabled: true, botToken: 'test-token', defaultChatId: 'test-chat', events: {}, templates: {} };
mock.module('../../../packages/shared-backend/modules/_shared', () => ({getAdminNotificationEmails: async () => ['admin@example.invalid'], handleRouteError: () => {throw Error('unexpected route error')}}));
mock.module('../../../packages/shared-backend/modules/mail', () => ({SITE_NAME:'MOE Test', sendMailRaw: async (mail: any) => {mails.push(mail)}}));
mock.module('../../../packages/shared-backend/modules/contact/repository', () => ({repoCreateContact: async (body: any) => (created = {...buildContactInsert(body,'test-id'),created_at:new Date()})}));
mock.module('../../../packages/shared-backend/modules/telegram', () => ({telegramNotify: async (input: any) => {notifications.push(input)}}));
mock.module('../../../packages/shared-backend/modules/telegram/settings', () => ({getTelegramSettings:async()=>cfg}));
mock.module('../../../packages/shared-backend/core/env', () => ({env:{SITE_NAME:'MOE Test'}}));
const {createContactPublic}=await import('../../../packages/shared-backend/modules/contact/controller');
const {telegramNotify}=await import('../../../packages/shared-backend/modules/telegram/helpers/telegram.notifier');
const originalFetch=globalThis.fetch;
const payload={name:'Test Contact',email:'customer@example.invalid',phone:'0000000000',subject:'Test Product',message:'A valid project description',company:'Example Company'};
beforeEach(()=>{mails.length=0;notifications.length=0;requests.length=0;cfg.events={};cfg.templates={};globalThis.fetch=(async (_url:any,options:any)=>{requests.push(JSON.parse(options.body));return new Response(JSON.stringify({ok:true,result:{message_id:42}}),{status:200})}) as any});
afterAll(()=>{globalThis.fetch=originalFetch});
async function submit(locale:string, body:any=payload){let status=200;const reply:any={code(n:number){status=n;return this},send(value:any){return value}};await createContactPublic({body,locale,headers:{},socket:{remoteAddress:'127.0.0.1'}} as any,reply);return status}
test('rejects blank phone / subject and short message',()=>{expect(ContactCreateSchema.safeParse({...payload,phone:'',subject:''}).success).toBe(false);expect(ContactCreateSchema.safeParse({...payload,name:'  ',message:'short'}).success).toBe(false)});
test('persists company and product context; English receipt and Telegram payload',async()=>{expect(await submit('en')).toBe(201);expect(created.message).toContain('Example Company');expect(created.subject).toBe('Test Product');expect(mails.find(m=>m.to===payload.email).subject).toContain('We received your message');expect(mails[0].text).toContain('Example Company');expect(notifications[0].data.company_name).toBe('Example Company')});
test('Turkish receipt and honeypot avoids writes / messages',async()=>{await submit('tr');expect(mails.find(m=>m.to===payload.email).subject).toContain('Mesajınız alındı');mails.length=0;notifications.length=0;expect(await submit('tr',{...payload,website:'bot'})).toBe(200);expect(mails).toHaveLength(0);expect(notifications).toHaveLength(0)});
test('offer event respects disabled flag',async()=>{cfg.events.new_offer_request=false;await telegramNotify({event:'new_offer_request',data:{message:'TEST'}});expect(requests).toHaveLength(0)});
test('offer event renders configured template and escapes user content',async()=>{cfg.templates.new_offer_request='{{site_name}}\\n{{company_name}}\\n{{product_service}}';await telegramNotify({event:'new_offer_request',data:{company_name:'Company_[test]',product_service:'TEST product'}});expect(requests[0].text).toContain('TEST product');expect(requests[0].text).toContain('Company\\_\\[test\\]');expect(requests[0].text).toContain('\n')});
test('long notifications remain within Telegram limit without broken Markdown',async()=>{await telegramNotify({event:'new_contact',data:{message:'x'.repeat(5000)}});expect(requests[0].text.length).toBeLessThan(4096);expect(requests[0].parse_mode).toBeUndefined()});
