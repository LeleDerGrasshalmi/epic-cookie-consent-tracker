export interface CookieConsentDomainData {
  ScriptType: string
  Version: string
  RuleSet: RuleSet[]
  Domain: string
  TenantGuid: string
  EnvId: string
  GeoRuleGroupName: string
}

export interface RuleSet {
  Id: string
  Name: string
  Countries: string[]
  Default: boolean
  Global: boolean
  Type: string
  TemplateName: string
}
