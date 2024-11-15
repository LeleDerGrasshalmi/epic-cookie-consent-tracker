import { COOKIE_LAW_BASE_URL } from "../resources/constants.js";
import { CookieConsentRuleSetData } from "../types/cookie-consent-rule-set";

export default async (ruleSetId: string) => {
  const res = await fetch(
    `${COOKIE_LAW_BASE_URL}/${ruleSetId}/en.json`,
    {
      method: 'GET',
    },
  );

  const contentType = res.headers.get('content-type');

  if (!res.ok || !contentType?.startsWith('application/json')) {
    console.log(`failed fetching rule set '${ruleSetId}' data`, res.status, res.statusText, await res.text());

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
