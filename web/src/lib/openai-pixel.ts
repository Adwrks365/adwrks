import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_STORAGE_KEY } from "@/lib/cookie-consent";

/** ChatGPT Ads Measurement Pixel. One ID, one loader, site-wide. */
export const OPENAI_PIXEL_ID = "9xW3KpTi3nDBDggmyYxkHw";
export const OPENAI_PIXEL_SDK_URL = "https://bzrcdn.openai.com/sdk/oaiq.min.js";

type OaiqStub = ((...args: unknown[]) => void) & { q: unknown[] };

declare global {
  interface Window {
    oaiq?: OaiqStub;
    /** Set synchronously before the SDK script tag is inserted. */
    __adwrksOaiqSdk?: 1;
    /** Set synchronously before the single init (and consent listener). */
    __adwrksOaiqInit?: 1;
  }
}

function measurementDeclined(): boolean {
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) === "declined";
  } catch {
    return false;
  }
}

/** Queue stub + one async SDK tag. Safe to call from the layout snippet and from a lead. */
function ensureOpenAiPixel(w: Window, d: Document) {
  if (typeof w.oaiq !== "function") {
    const q = function oaiqQueue() {
      q.q.push(arguments);
    } as OaiqStub;
    q.q = [];
    w.oaiq = q;
  }

  if (!w.__adwrksOaiqSdk) {
    w.__adwrksOaiqSdk = 1;
    const script = d.createElement("script");
    script.async = true;
    script.src = OPENAI_PIXEL_SDK_URL;
    script.setAttribute("data-cfasync", "false");
    const first = d.getElementsByTagName("script")[0];
    if (first?.parentNode) first.parentNode.insertBefore(script, first);
    else (d.head || d.documentElement).appendChild(script);
  }

  if (w.__adwrksOaiqInit) return;
  w.__adwrksOaiqInit = 1;

  if (measurementDeclined()) w.oaiq("consent", false);
  w.oaiq("init", { pixelId: OPENAI_PIXEL_ID });
  w.addEventListener(COOKIE_CONSENT_EVENT, (event) => {
    const detail = event instanceof CustomEvent ? event.detail : undefined;
    w.oaiq?.("consent", detail === "accepted");
  });
}

/**
 * Official lead event. Runs only after a successful form submit.
 * Failures stay inside this function so Google tags and the form still complete.
 * A declined cookie choice does not send the event.
 */
export function measureOpenAiLeadCreated() {
  if (typeof window === "undefined" || measurementDeclined()) return;
  try {
    ensureOpenAiPixel(window, document);
    window.oaiq?.("measure", "lead_created", { type: "customer_action" });
  } catch {
    // Measurement must not affect the lead form or other trackers.
  }
}

/**
 * Official async loader. Same flags as `ensureOpenAiPixel`, so a lead that
 * happens first and the layout snippet cannot init or inject the SDK twice.
 * `debug` stays off: it only prints SDK logs and is not required for the event stream.
 */
export function buildOpenAiPixelSnippet(): string {
  const pixelId = JSON.stringify(OPENAI_PIXEL_ID);
  const sdkUrl = JSON.stringify(OPENAI_PIXEL_SDK_URL);
  const storageKey = JSON.stringify(COOKIE_CONSENT_STORAGE_KEY);
  const consentEvent = JSON.stringify(COOKIE_CONSENT_EVENT);

  return `!function(w,d,s,u,id,key,evName){
if(typeof w.oaiq!="function"){
var q=function(){q.q.push(arguments)};
q.q=[];
w.oaiq=q;
}
if(!w.__adwrksOaiqSdk){
w.__adwrksOaiqSdk=1;
var j=d.createElement(s);
j.async=1;
j.src=u;
j.setAttribute("data-cfasync","false");
var f=d.getElementsByTagName(s)[0];
if(f&&f.parentNode)f.parentNode.insertBefore(j,f);
else (d.head||d.documentElement).appendChild(j);
}
if(w.__adwrksOaiqInit)return;
w.__adwrksOaiqInit=1;
try{
if(w.localStorage&&w.localStorage.getItem(key)==="declined")w.oaiq("consent",false);
}catch(e){}
w.oaiq("init",{pixelId:id});
w.addEventListener(evName,function(ev){
w.oaiq("consent",ev.detail==="accepted");
});
}(window,document,"script",${sdkUrl},${pixelId},${storageKey},${consentEvent});`;
}
