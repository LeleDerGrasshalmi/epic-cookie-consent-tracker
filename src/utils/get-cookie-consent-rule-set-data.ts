import { CookieConsentRuleSetData } from "../types/cookie-consent-rule-set";

export default async (domainId: string, ruleSetId: string) => {
  const res = await fetch(
    `https://cdn.cookielaw.org/consent/${domainId}/${ruleSetId}/en.json`,
    {
      method: 'GET',
    },
  );

  const contentType = res.headers.get('content-type');

  if (!res.ok || !contentType?.startsWith('application/json')) {
    console.log(`failed fetching rule set '${ruleSetId}' data for domain '${domainId}'`, res.status, res.statusText, await res.text());

    return {
      success: false as const,
    };
  }

  const data = <CookieConsentRuleSetData>(await res.json());

  return {
    success: true as const,
    data: data.DomainData.Groups,
  };
}
