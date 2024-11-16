import { CookieConsentDomainData } from "../types/cookie-consent-domain";

export default async (domainId: string) => {
  const res = await fetch(
    `https://cdn.cookielaw.org/consent/${domainId}/${domainId}.json`,
    {
      method: 'GET',
    },
  );

  const contentType = res.headers.get('content-type');

  if (!res.ok || !contentType?.startsWith('application/json')) {
    console.log(`failed fetching domain data for id '${domainId}'`, res.status, res.statusText, await res.text());

    return {
      success: false as const,
    };
  }

  return {
    success: true as const,
    data: <CookieConsentDomainData>(await res.json()),
  };
}
