import { COOKIE_LAW_BASE_URL, EPIC_TRACKING_COOKIE_DOMAIN_ID } from "../resources/constants.js";
import { CookieConsentDomainData } from "../types/cookie-consent-domain";

export default async () => {
  const res = await fetch(
    `${COOKIE_LAW_BASE_URL}/${EPIC_TRACKING_COOKIE_DOMAIN_ID}.json`,
    {
      method: 'GET',
    },
  );

  const contentType = res.headers.get('content-type');

  if (!res.ok || !contentType?.startsWith('application/json')) {
    console.log('failed fetching domain data', res.status, res.statusText, await res.text());

    return {
      success: false as const,
    };
  }

  return {
    success: true as const,
    data: <CookieConsentDomainData>(await res.json()),
  };
}
