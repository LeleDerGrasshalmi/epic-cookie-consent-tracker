export interface CookieConsentRuleSetData {
  DomainData: DomainData
}

export interface DomainData {
  Groups: Group[]
}

export interface Group {
  GroupDescription: string
  GroupName: string
  FirstPartyCookies: Cookie[]
  Hosts: Host[]
  Status: string
}

export interface Host {
  HostName: string
  DisplayName: string
  HostId: string
  Description: string
  PrivacyPolicy: string
  Cookies: Cookie[]
}

export interface Cookie {
  thirdPartyDescription?: string
  patternKey?: string
  id: string
  Name: string
  Host: string
  IsSession: boolean
  Length: string
  description: string
  DurationType: number
  category: any
  isThirdParty: boolean
}
