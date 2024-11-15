import { execSync } from 'child_process';
import fs from 'fs';
import fsp from 'fs/promises';

import env from './utils/env.js';
import getCookieConsentDomainData from './utils/get-cookie-consent-domain-data.js';
import getCookieConsentRuleSetData from './utils/get-cookie-consent-rule-set-data.js';
import { Cookie } from './types/cookie-consent-rule-set.js';

const outputFolder = 'output';

const main = async () => {
  if (!fs.existsSync(outputFolder)) {
    await fsp.mkdir(outputFolder, { recursive: true });
  }

  const changes: string[] = [];
  const domain = await getCookieConsentDomainData();

  if (!domain.success) {
    return;
  }

  const ruleSets = domain.data.RuleSet.sort((a, b) => a.Name.localeCompare(b.Name));

  for (let i = 0; i < ruleSets.length; i += 1) {
    const domainRuleSet = ruleSets[i];
    const ruleSetGroupsRes = await getCookieConsentRuleSetData(domainRuleSet.Id);

    if (!ruleSetGroupsRes.success) {
      continue;
    }

    const ruleSetGroups = ruleSetGroupsRes.data
      .sort((a, b) => a.GroupName.localeCompare(b.GroupName));

    let md = `# ${domainRuleSet.Name} (${domainRuleSet.TemplateName})\n`;
    md += '\n';

    for (let j = 0; j < ruleSetGroups.length; j += 1) {
      const ruleSetGroup = ruleSetGroups[j];

      const uniqueCookies: Cookie[] = [];

      ruleSetGroup.FirstPartyCookies.forEach((cookie) => {
        if (!uniqueCookies.find((x) => x.id === cookie.id)) {
          uniqueCookies.push(cookie);
        }
      });

      ruleSetGroup.Hosts.forEach((host) => {
        host.Cookies.forEach((cookie) => {
          if (!uniqueCookies.find((x) => x.id === cookie.id)) {
            uniqueCookies.push(cookie);
          }
        });
      });

      uniqueCookies.sort((a, b) => {
        if (a.Host !== b.Host) {
          return a.Host.localeCompare(b.Host);
        }

        return a.Name.localeCompare(b.Name);
      });


      if (!uniqueCookies.length) {
        continue;
      }

      md += `## ${ruleSetGroup.GroupName} (${uniqueCookies.length})\n\n`;
      md += `> ${ruleSetGroup.GroupDescription}\n\n`;
      md += `| Host | Cookie | Description |\n`;
      md += `| ---- | ------ | ----------- |\n`;

      for (let k = 0; k < uniqueCookies.length; k += 1) {
        const cookie = uniqueCookies[k];

        md += `| ${cookie.Host} | ${cookie.Name} | ${cookie.description.replace(/\n/g, '<br/>')} |\n`;
      }

      md += `\n`;
    }

    const filePath = `${outputFolder}/ruleset_${domainRuleSet.Name.toLowerCase().trim().replace(/ /g, '_')}.md`;

    await fsp.writeFile(filePath, md);

    const gitStatus = execSync(`git status ${filePath}`)?.toString('utf-8') || '';

    if (gitStatus.includes(filePath)) {
      changes.push(domainRuleSet.Name);
    }
  }

  if (!changes.length) {
    return;
  }

  const commitMessage = `Modified ${changes.join(', ')}`;

  console.log(commitMessage);

  if (env.GIT_DO_NOT_COMMIT?.toLowerCase() === 'true') {
    return;
  }

  execSync('git add output');
  execSync('git config user.email "41898282+github-actions[bot]@users.noreply.github.com"');
  execSync('git config user.name "github-actions[bot]"');
  execSync('git config commit.gpgsign false');
  execSync(`git commit -m "${commitMessage}"`);

  if (env.GIT_DO_NOT_PUSH?.toLowerCase() === 'true') {
    return;
  }

  execSync('git push');
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
