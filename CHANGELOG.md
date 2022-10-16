# Changelog

All notable changes to this project will be documented in this file.

# [1.8.0](https://github.com/r-priyam/goblin/compare/v1.7.0...v1.8.0) - (2022-10-16)

## 🏠 Refactor

- Cleanup/enhancement (#76) ([eaed25c](https://github.com/r-priyam/goblin/commit/eaed25ca791b7e2dd36736da35d8429d46ba4954))
- Use post/delete routes for link-api ([ce08f2d](https://github.com/r-priyam/goblin/commit/ce08f2d960dfd3be292429d0a39cdcc38f9be87a))
- Fetch db to initialize cache ([0200c8e](https://github.com/r-priyam/goblin/commit/0200c8e767ba9f3f7162d0216165ae369d2165d5))
- Attempt to fetch tags when no cache ([b9cab1b](https://github.com/r-priyam/goblin/commit/b9cab1b0613f2094ca1a0e601a30ba427b718bae))
- Inject townhall image in troops embed ([c47eac0](https://github.com/r-priyam/goblin/commit/c47eac0bbb3c1a6dfa6adc7800c3bbdd5cd38276))
- Update for townhall 15 ([a9fa54f](https://github.com/r-priyam/goblin/commit/a9fa54f959b32ff730202c5d5f36c5a0dd027064))
- Add detailed menu labels in whois paginator ([7b68b07](https://github.com/r-priyam/goblin/commit/7b68b070d67b0836fe51522a77965eaeb3ab5cc9))
- Inject townhall image in player class [skip cd] ([533f65b](https://github.com/r-priyam/goblin/commit/533f65b94b5a11c87ee326fca1ccea76817bf9b3))
- Upgrade to clashofclans v3 dev ([c9259c6](https://github.com/r-priyam/goblin/commit/c9259c62b38391b3d84724978414a29b799756b4))
- Use undici ([28b9c0b](https://github.com/r-priyam/goblin/commit/28b9c0bb72d81a6b6e570974139c0bbf7da6c89f))
- Move code to client [skip cd] ([54bebfc](https://github.com/r-priyam/goblin/commit/54bebfcb2072a8c582960ebe583b9c76b3876629))
- Use ioredis [skip cd] ([d6ceded](https://github.com/r-priyam/goblin/commit/d6ceded3bd616eb197eff3f4e020ab15ede8c233))
- Remove `result` callbacks ([9995c41](https://github.com/r-priyam/goblin/commit/9995c410ae28fc8a237952685aea5629043eba3c))

## 🐛 Bug Fixes

- **deps:** Update all non-major dependencies (#74) [skip cd] ([d087d69](https://github.com/r-priyam/goblin/commit/d087d699019a0208da2e68d0564c1e86a1288068))
- Sync data correctly ([0aa0aea](https://github.com/r-priyam/goblin/commit/0aa0aea02e4d6880104fd8f5848f90620fbacb40))
- Why this happens with me ([a96dbb7](https://github.com/r-priyam/goblin/commit/a96dbb72ce58d151215725821c6f0570f9078238))
- Cache the correct ID ([7ae253f](https://github.com/r-priyam/goblin/commit/7ae253fb8799a42958c6f92d862812cdf11c0dd8))
- **deps:** Update sapphire dependencies ([ff3218c](https://github.com/r-priyam/goblin/commit/ff3218cf5e32f22457df580e1c9978e6f102ca3b))
- **deps:** Update all non-major dependencies (#70) ([398481a](https://github.com/r-priyam/goblin/commit/398481ae76340936f0593a9c8849a17d50a84495))
- **deps:** Update all non-major dependencies ([aa2a9e2](https://github.com/r-priyam/goblin/commit/aa2a9e233c6e43a6ff416368549cd3ae71f6cb98))
- Remove top `JSON.stringify` ([a0b1738](https://github.com/r-priyam/goblin/commit/a0b1738d7362c15637bc2678ffe503f1c01194cd))
- **deps:** Update dependency bullmq to v2 (#64) ([8960626](https://github.com/r-priyam/goblin/commit/8960626f8eb2fea837236dc81d167a598edbde65))
- Send message to user in command error ([e1496ef](https://github.com/r-priyam/goblin/commit/e1496efb15888c2ef97842a20479a696cc7418c3))

## 🚀 Features

- **commands:** Add `nickname` command ([c52da3c](https://github.com/r-priyam/goblin/commit/c52da3ceda6a6dce28e118822a60c22d513ddd86))
- **events:** Add interview wait handler ([f442adc](https://github.com/r-priyam/goblin/commit/f442adc92b6164e66e28217249af4a3f898f5146))
- Use decorators for command registry (#60) ([70ba6b5](https://github.com/r-priyam/goblin/commit/70ba6b54038dbd7a162784e36de4ae5e99151298))
- **commands:** Add `forcelink` command ([0977ded](https://github.com/r-priyam/goblin/commit/0977dedff7baccf7bf2e233a2b03c59d804ae323))

# [1.7.0](https://github.com/r-priyam/goblin/compare/v1.6.0...v1.7.0) - (2022-09-06)

## 🏠 Refactor

- Remove deprecated `addField` ([90b51e5](https://github.com/r-priyam/goblin/commit/90b51e5a92abc5016156dc0022958fc204f780bc))
- Use type import from djs ([e778931](https://github.com/r-priyam/goblin/commit/e778931fcb040fa56bebb99bcd3787342642e830))
- **commands:** Use decorator for interview check ([c280cb0](https://github.com/r-priyam/goblin/commit/c280cb0a32b3225ecd6a2bd76f3b4018a22c0992))
- ***:** Use `eslint-config-neon` (#56) ([530615a](https://github.com/r-priyam/goblin/commit/530615ac522bb1ce1d01b98b59643a89d90fa84d))

## 🐛 Bug Fixes

- **deps:** Update sapphire dependencies (#59) ([aeebeba](https://github.com/r-priyam/goblin/commit/aeebeba3a1f2538b269d8f2a222d85ec3abd0a6f))
- **deps:** Update dependency clashofclans.js to v2.8.2 ([1b96123](https://github.com/r-priyam/goblin/commit/1b96123bb3cadce42343b83e823d1df3c51d2a6f))
- Env key reference in interview command ([a6ca9e9](https://github.com/r-priyam/goblin/commit/a6ca9e94fe06ce8dea98da64a545c12058fb65e5))

## 🚀 Features

- **listeners:** Add error listener for `SubCommand` ([a94aca9](https://github.com/r-priyam/goblin/commit/a94aca9193f7af03283845138c1f5dee397c71f2))

# [1.6.0](https://github.com/r-priyam/goblin/compare/v1.5.0...v1.6.0) - (2022-09-01)

## 🏠 Refactor

- Remove redundant template literals ([7db7ac1](https://github.com/r-priyam/goblin/commit/7db7ac1caf4386be16b7da587393df5b8798567d))
- Property names ([230a5a0](https://github.com/r-priyam/goblin/commit/230a5a0b3517cb9c921db1ec779c03df2c9ab6aa))
- Change automation commands permission to `Manage Message` ([22263ce](https://github.com/r-priyam/goblin/commit/22263ceff1ebd5115039d174ed632c1c4dc0f5af))

## 🐛 Bug Fixes

- Use `https` ([f87aae2](https://github.com/r-priyam/goblin/commit/f87aae20cdd8c2dc8f664ed63793bb88782e36fb))
- Show error message correctly [slip deploy] ([9c25915](https://github.com/r-priyam/goblin/commit/9c25915d7822627dda77b25355f421292364dce7))
- I don't have yarn installed on VPS ([189152d](https://github.com/r-priyam/goblin/commit/189152da32f540b76238eef72bad3916c6e3ba42))

## 🚀 Features

- Add script to perform bot image refresh ([0e3fbd5](https://github.com/r-priyam/goblin/commit/0e3fbd568dc08b3e5f4176983fc9794518a4c49e))
- Setup continuous deployment ([c4bf43e](https://github.com/r-priyam/goblin/commit/c4bf43e0f5ee304c869e29619ca53fc9a7ac8030))

# [1.5.0](https://github.com/r-priyam/goblin/compare/v1.3.0...v1.5.0) - (2022-08-29)

## 🏠 Refactor

- Keep `printWidth` 120 ([7ebee57](https://github.com/r-priyam/goblin/commit/7ebee57429d16fa802ac59a0f047e80436be8424))
- Improve logging ([dd032e0](https://github.com/r-priyam/goblin/commit/dd032e0493999c674e2f947b81afe5e0dc015f74))
- Rewrite `#lib/coc` ([9569ff6](https://github.com/r-priyam/goblin/commit/9569ff6b6c1f221eff60c5fabb77993ce0f6e647))
- Use env-vars instead of hard-coded string ([390c042](https://github.com/r-priyam/goblin/commit/390c0422d5fcfd011bdb4d43912bc094674827fa))
- Listener (#47) ([c31f347](https://github.com/r-priyam/goblin/commit/c31f347fa0ac8efff47b98c5f877d070c2122b28))
- Make color codes look good ([41ed230](https://github.com/r-priyam/goblin/commit/41ed230f5553a60e1a39392b42aadb940a83542e))
- Better markdown table ([d777321](https://github.com/r-priyam/goblin/commit/d7773211e4096c241bd72a79def31b91ebc6a612))
- Remove custom `embedBuilder` class ([7136b5c](https://github.com/r-priyam/goblin/commit/7136b5c82f8aaf306d2c4d252948434989aef34c))
- Use `@sapphire/plugin-subcommands` ([b530803](https://github.com/r-priyam/goblin/commit/b530803bf96b95a0ebfb47b0e988a34f6ecc3f3a))
- Remove `GoblinCommand` extension ([60a652c](https://github.com/r-priyam/goblin/commit/60a652ce53617dcc3734cc3ac738503938e6ed1f))
- Cache everything possible and remove useless intents ([e045206](https://github.com/r-priyam/goblin/commit/e0452068831f35d4055209352b206d7b85fdaad0))
- Remove `parseArmyLink` as it's now in official lib ([2fddb74](https://github.com/r-priyam/goblin/commit/2fddb74995d38d87a60cd146bd2b57b16119bc95))
- Get redis from container directly ([9d696ee](https://github.com/r-priyam/goblin/commit/9d696eeb0a598cf802815ed37d3e6f85a84b826d))

## 🐛 Bug Fixes

- Remove unused variable ([aba2eb4](https://github.com/r-priyam/goblin/commit/aba2eb4dc092b754ffea60e75d66cb3061f65e0b))
- Broken cron string ([3f99804](https://github.com/r-priyam/goblin/commit/3f99804173efbe2bdaf88a0bd0b46dd11ad80e1e))
- **deps:** Update dependency @sapphire/plugin-subcommands to v3.1.1 ([5c02b36](https://github.com/r-priyam/goblin/commit/5c02b3699247ef5b0113c3d76955b0055e345e09))
- **deps:** Update dependency @sapphire/discord.js-utilities to ^4.12.0 ([4f92b2e](https://github.com/r-priyam/goblin/commit/4f92b2e3947c677193bf4f393cb2304eb0614cb9))
- **deps:** Update all non-major dependencies (#42) ([7ca39cb](https://github.com/r-priyam/goblin/commit/7ca39cbda38cbef417f4cf9c374bda06e2eea0ad))
- **deps:** Update dependency @sapphire/utilities to ^3.9.0 (#43) ([815f81b](https://github.com/r-priyam/goblin/commit/815f81b5317c3763784fed510da5e8a7017c2326))
- **deps:** Update dependency @sapphire/utilities to ^3.8.0 ([45c896b](https://github.com/r-priyam/goblin/commit/45c896bd20383b6436e8a682eb0bf6cc71aca7ea))
- **deps:** Update dependency string-strip-html to v11 (#34) ([71a8f03](https://github.com/r-priyam/goblin/commit/71a8f03c011abf11cd28922e36ad1eda991f5558))
- **deps:** Update sapphire dependencies (#30) ([7c69547](https://github.com/r-priyam/goblin/commit/7c6954701633ffc2cd7a68274ada13106fae1ad5))
- **deps:** Update dependency string-strip-html to v10 (#28) ([8c157ee](https://github.com/r-priyam/goblin/commit/8c157ee1cf88c656f90d65edd009b1dec5aedb9d))
- **deps:** Update sapphire dependencies ([4d9da28](https://github.com/r-priyam/goblin/commit/4d9da28de5b396c7758dd79e65bc6ff5aa133bb9))
- Nullish value in result ([f612da3](https://github.com/r-priyam/goblin/commit/f612da3efa3208a2c5c6a5417760e4f0cfddcc76))
- `Elder` raw position ([037a49a](https://github.com/r-priyam/goblin/commit/037a49a92b48610e07f7f902df0d8b0763bef28b))
- Handle so many roles causing error ([6024491](https://github.com/r-priyam/goblin/commit/6024491d82b747e3e8a4123b76767e1311d010c0))

## 🚀 Features

- **commands:** Add automation commands (#48) ([9d841f8](https://github.com/r-priyam/goblin/commit/9d841f8ef7f525653891a90a822915d550027460))
- **commands:** Add `/hackban` command ([1417fc6](https://github.com/r-priyam/goblin/commit/1417fc6cb8dba86fb36f1611246fc217aa0cdd43))
- **commands:** Use `perms v2` ([97e84ae](https://github.com/r-priyam/goblin/commit/97e84aee3cf7a2a7d19e9445d2a1ad1c7f9011b6))
- **commands:** Add `/about` command ([c847df8](https://github.com/r-priyam/goblin/commit/c847df8ebbcc14161b8ead0dba01d4f70cf4cdfc))
- **commands:** Add `/withrole` command ([f3de481](https://github.com/r-priyam/goblin/commit/f3de481b6a7fb9563a7b4fd54c9e325ddfc69bd9))
- **events:** Add `guildCreate` and `guildDelete` event ([a858bbb](https://github.com/r-priyam/goblin/commit/a858bbbbd2eb2d9d87f09b271c1bf473fd8d9d87))
- **commands:** Add `serverinvite` command ([f98b658](https://github.com/r-priyam/goblin/commit/f98b658f7bdde6a2d9388401234dca2a9871ce6b))
- **commands:** Add `supertroops` command ([029d0d6](https://github.com/r-priyam/goblin/commit/029d0d6943fca50f1a27dc78e4b5077a451832de))
- **commands:** Add `sql` command ([9f1894a](https://github.com/r-priyam/goblin/commit/9f1894aaa1767fb7c0af2b8cc23aa599a3612f01))
- Sync shared db with private db ([1c01f21](https://github.com/r-priyam/goblin/commit/1c01f210c36fc9ff773d68a5990406308cb34ef8))
- **commands:** Complete `whois` command ([48c9443](https://github.com/r-priyam/goblin/commit/48c944377dcae162b88bcdab027866a74a68f93f))
- Integrate link api with custom clash client ([7d4ea56](https://github.com/r-priyam/goblin/commit/7d4ea56b0166c4ea452f71672017a72ab60ff4f3))

# [1.6.0](https://github.com/r-priyam/goblin/compare/v1.5.0...v1.6.0) - (2022-09-01)

## 🏠 Refactor

- Remove redundant template literals ([7db7ac1](https://github.com/r-priyam/goblin/commit/7db7ac1caf4386be16b7da587393df5b8798567d))
- Property names ([230a5a0](https://github.com/r-priyam/goblin/commit/230a5a0b3517cb9c921db1ec779c03df2c9ab6aa))
- Change automation commands permission to `Manage Message` ([22263ce](https://github.com/r-priyam/goblin/commit/22263ceff1ebd5115039d174ed632c1c4dc0f5af))

## 🐛 Bug Fixes

- Use `https` ([f87aae2](https://github.com/r-priyam/goblin/commit/f87aae20cdd8c2dc8f664ed63793bb88782e36fb))
- Show error message correctly [slip deploy] ([9c25915](https://github.com/r-priyam/goblin/commit/9c25915d7822627dda77b25355f421292364dce7))
- I don't have yarn installed on VPS ([189152d](https://github.com/r-priyam/goblin/commit/189152da32f540b76238eef72bad3916c6e3ba42))

## 🚀 Features

- Add script to perform bot image refresh ([0e3fbd5](https://github.com/r-priyam/goblin/commit/0e3fbd568dc08b3e5f4176983fc9794518a4c49e))
- Setup continuous deployment ([c4bf43e](https://github.com/r-priyam/goblin/commit/c4bf43e0f5ee304c869e29619ca53fc9a7ac8030))

# [1.5.0](https://github.com/r-priyam/goblin/compare/v1.3.0...v1.5.0) - (2022-08-29)

## 🏠 Refactor

- Keep `printWidth` 120 ([7ebee57](https://github.com/r-priyam/goblin/commit/7ebee57429d16fa802ac59a0f047e80436be8424))
- Improve logging ([dd032e0](https://github.com/r-priyam/goblin/commit/dd032e0493999c674e2f947b81afe5e0dc015f74))
- Rewrite `#lib/coc` ([9569ff6](https://github.com/r-priyam/goblin/commit/9569ff6b6c1f221eff60c5fabb77993ce0f6e647))
- Use env-vars instead of hard-coded string ([390c042](https://github.com/r-priyam/goblin/commit/390c0422d5fcfd011bdb4d43912bc094674827fa))
- Listener (#47) ([c31f347](https://github.com/r-priyam/goblin/commit/c31f347fa0ac8efff47b98c5f877d070c2122b28))
- Make color codes look good ([41ed230](https://github.com/r-priyam/goblin/commit/41ed230f5553a60e1a39392b42aadb940a83542e))
- Better markdown table ([d777321](https://github.com/r-priyam/goblin/commit/d7773211e4096c241bd72a79def31b91ebc6a612))
- Remove custom `embedBuilder` class ([7136b5c](https://github.com/r-priyam/goblin/commit/7136b5c82f8aaf306d2c4d252948434989aef34c))
- Use `@sapphire/plugin-subcommands` ([b530803](https://github.com/r-priyam/goblin/commit/b530803bf96b95a0ebfb47b0e988a34f6ecc3f3a))
- Remove `GoblinCommand` extension ([60a652c](https://github.com/r-priyam/goblin/commit/60a652ce53617dcc3734cc3ac738503938e6ed1f))
- Cache everything possible and remove useless intents ([e045206](https://github.com/r-priyam/goblin/commit/e0452068831f35d4055209352b206d7b85fdaad0))
- Remove `parseArmyLink` as it's now in official lib ([2fddb74](https://github.com/r-priyam/goblin/commit/2fddb74995d38d87a60cd146bd2b57b16119bc95))
- Get redis from container directly ([9d696ee](https://github.com/r-priyam/goblin/commit/9d696eeb0a598cf802815ed37d3e6f85a84b826d))

## 🐛 Bug Fixes

- Remove unused variable ([aba2eb4](https://github.com/r-priyam/goblin/commit/aba2eb4dc092b754ffea60e75d66cb3061f65e0b))
- Broken cron string ([3f99804](https://github.com/r-priyam/goblin/commit/3f99804173efbe2bdaf88a0bd0b46dd11ad80e1e))
- **deps:** Update dependency @sapphire/plugin-subcommands to v3.1.1 ([5c02b36](https://github.com/r-priyam/goblin/commit/5c02b3699247ef5b0113c3d76955b0055e345e09))
- **deps:** Update dependency @sapphire/discord.js-utilities to ^4.12.0 ([4f92b2e](https://github.com/r-priyam/goblin/commit/4f92b2e3947c677193bf4f393cb2304eb0614cb9))
- **deps:** Update all non-major dependencies (#42) ([7ca39cb](https://github.com/r-priyam/goblin/commit/7ca39cbda38cbef417f4cf9c374bda06e2eea0ad))
- **deps:** Update dependency @sapphire/utilities to ^3.9.0 (#43) ([815f81b](https://github.com/r-priyam/goblin/commit/815f81b5317c3763784fed510da5e8a7017c2326))
- **deps:** Update dependency @sapphire/utilities to ^3.8.0 ([45c896b](https://github.com/r-priyam/goblin/commit/45c896bd20383b6436e8a682eb0bf6cc71aca7ea))
- **deps:** Update dependency string-strip-html to v11 (#34) ([71a8f03](https://github.com/r-priyam/goblin/commit/71a8f03c011abf11cd28922e36ad1eda991f5558))
- **deps:** Update sapphire dependencies (#30) ([7c69547](https://github.com/r-priyam/goblin/commit/7c6954701633ffc2cd7a68274ada13106fae1ad5))
- **deps:** Update dependency string-strip-html to v10 (#28) ([8c157ee](https://github.com/r-priyam/goblin/commit/8c157ee1cf88c656f90d65edd009b1dec5aedb9d))
- **deps:** Update sapphire dependencies ([4d9da28](https://github.com/r-priyam/goblin/commit/4d9da28de5b396c7758dd79e65bc6ff5aa133bb9))
- Nullish value in result ([f612da3](https://github.com/r-priyam/goblin/commit/f612da3efa3208a2c5c6a5417760e4f0cfddcc76))
- `Elder` raw position ([037a49a](https://github.com/r-priyam/goblin/commit/037a49a92b48610e07f7f902df0d8b0763bef28b))
- Handle so many roles causing error ([6024491](https://github.com/r-priyam/goblin/commit/6024491d82b747e3e8a4123b76767e1311d010c0))

## 🚀 Features

- **commands:** Add automation commands (#48) ([9d841f8](https://github.com/r-priyam/goblin/commit/9d841f8ef7f525653891a90a822915d550027460))
- **commands:** Add `/hackban` command ([1417fc6](https://github.com/r-priyam/goblin/commit/1417fc6cb8dba86fb36f1611246fc217aa0cdd43))
- **commands:** Use `perms v2` ([97e84ae](https://github.com/r-priyam/goblin/commit/97e84aee3cf7a2a7d19e9445d2a1ad1c7f9011b6))
- **commands:** Add `/about` command ([c847df8](https://github.com/r-priyam/goblin/commit/c847df8ebbcc14161b8ead0dba01d4f70cf4cdfc))
- **commands:** Add `/withrole` command ([f3de481](https://github.com/r-priyam/goblin/commit/f3de481b6a7fb9563a7b4fd54c9e325ddfc69bd9))
- **events:** Add `guildCreate` and `guildDelete` event ([a858bbb](https://github.com/r-priyam/goblin/commit/a858bbbbd2eb2d9d87f09b271c1bf473fd8d9d87))
- **commands:** Add `serverinvite` command ([f98b658](https://github.com/r-priyam/goblin/commit/f98b658f7bdde6a2d9388401234dca2a9871ce6b))
- **commands:** Add `supertroops` command ([029d0d6](https://github.com/r-priyam/goblin/commit/029d0d6943fca50f1a27dc78e4b5077a451832de))
- **commands:** Add `sql` command ([9f1894a](https://github.com/r-priyam/goblin/commit/9f1894aaa1767fb7c0af2b8cc23aa599a3612f01))
- Sync shared db with private db ([1c01f21](https://github.com/r-priyam/goblin/commit/1c01f210c36fc9ff773d68a5990406308cb34ef8))
- **commands:** Complete `whois` command ([48c9443](https://github.com/r-priyam/goblin/commit/48c944377dcae162b88bcdab027866a74a68f93f))
- Integrate link api with custom clash client ([7d4ea56](https://github.com/r-priyam/goblin/commit/7d4ea56b0166c4ea452f71672017a72ab60ff4f3))

# [1.5.0](https://github.com/r-priyam/goblin/compare/v1.3.0...v1.5.0) - (2022-08-29)

## 🏠 Refactor

- Keep `printWidth` 120 ([7ebee57](https://github.com/r-priyam/goblin/commit/7ebee57429d16fa802ac59a0f047e80436be8424))
- Improve logging ([dd032e0](https://github.com/r-priyam/goblin/commit/dd032e0493999c674e2f947b81afe5e0dc015f74))
- Rewrite `#lib/coc` ([9569ff6](https://github.com/r-priyam/goblin/commit/9569ff6b6c1f221eff60c5fabb77993ce0f6e647))
- Use env-vars instead of hard-coded string ([390c042](https://github.com/r-priyam/goblin/commit/390c0422d5fcfd011bdb4d43912bc094674827fa))
- Listener (#47) ([c31f347](https://github.com/r-priyam/goblin/commit/c31f347fa0ac8efff47b98c5f877d070c2122b28))
- Make color codes look good ([41ed230](https://github.com/r-priyam/goblin/commit/41ed230f5553a60e1a39392b42aadb940a83542e))
- Better markdown table ([d777321](https://github.com/r-priyam/goblin/commit/d7773211e4096c241bd72a79def31b91ebc6a612))
- Remove custom `embedBuilder` class ([7136b5c](https://github.com/r-priyam/goblin/commit/7136b5c82f8aaf306d2c4d252948434989aef34c))
- Use `@sapphire/plugin-subcommands` ([b530803](https://github.com/r-priyam/goblin/commit/b530803bf96b95a0ebfb47b0e988a34f6ecc3f3a))
- Remove `GoblinCommand` extension ([60a652c](https://github.com/r-priyam/goblin/commit/60a652ce53617dcc3734cc3ac738503938e6ed1f))
- Cache everything possible and remove useless intents ([e045206](https://github.com/r-priyam/goblin/commit/e0452068831f35d4055209352b206d7b85fdaad0))
- Remove `parseArmyLink` as it's now in official lib ([2fddb74](https://github.com/r-priyam/goblin/commit/2fddb74995d38d87a60cd146bd2b57b16119bc95))
- Get redis from container directly ([9d696ee](https://github.com/r-priyam/goblin/commit/9d696eeb0a598cf802815ed37d3e6f85a84b826d))

## 🐛 Bug Fixes

- Remove unused variable ([aba2eb4](https://github.com/r-priyam/goblin/commit/aba2eb4dc092b754ffea60e75d66cb3061f65e0b))
- Broken cron string ([3f99804](https://github.com/r-priyam/goblin/commit/3f99804173efbe2bdaf88a0bd0b46dd11ad80e1e))
- **deps:** Update dependency @sapphire/plugin-subcommands to v3.1.1 ([5c02b36](https://github.com/r-priyam/goblin/commit/5c02b3699247ef5b0113c3d76955b0055e345e09))
- **deps:** Update dependency @sapphire/discord.js-utilities to ^4.12.0 ([4f92b2e](https://github.com/r-priyam/goblin/commit/4f92b2e3947c677193bf4f393cb2304eb0614cb9))
- **deps:** Update all non-major dependencies (#42) ([7ca39cb](https://github.com/r-priyam/goblin/commit/7ca39cbda38cbef417f4cf9c374bda06e2eea0ad))
- **deps:** Update dependency @sapphire/utilities to ^3.9.0 (#43) ([815f81b](https://github.com/r-priyam/goblin/commit/815f81b5317c3763784fed510da5e8a7017c2326))
- **deps:** Update dependency @sapphire/utilities to ^3.8.0 ([45c896b](https://github.com/r-priyam/goblin/commit/45c896bd20383b6436e8a682eb0bf6cc71aca7ea))
- **deps:** Update dependency string-strip-html to v11 (#34) ([71a8f03](https://github.com/r-priyam/goblin/commit/71a8f03c011abf11cd28922e36ad1eda991f5558))
- **deps:** Update sapphire dependencies (#30) ([7c69547](https://github.com/r-priyam/goblin/commit/7c6954701633ffc2cd7a68274ada13106fae1ad5))
- **deps:** Update dependency string-strip-html to v10 (#28) ([8c157ee](https://github.com/r-priyam/goblin/commit/8c157ee1cf88c656f90d65edd009b1dec5aedb9d))
- **deps:** Update sapphire dependencies ([4d9da28](https://github.com/r-priyam/goblin/commit/4d9da28de5b396c7758dd79e65bc6ff5aa133bb9))
- Nullish value in result ([f612da3](https://github.com/r-priyam/goblin/commit/f612da3efa3208a2c5c6a5417760e4f0cfddcc76))
- `Elder` raw position ([037a49a](https://github.com/r-priyam/goblin/commit/037a49a92b48610e07f7f902df0d8b0763bef28b))
- Handle so many roles causing error ([6024491](https://github.com/r-priyam/goblin/commit/6024491d82b747e3e8a4123b76767e1311d010c0))

## 🚀 Features

- **commands:** Add automation commands (#48) ([9d841f8](https://github.com/r-priyam/goblin/commit/9d841f8ef7f525653891a90a822915d550027460))
- **commands:** Add `/hackban` command ([1417fc6](https://github.com/r-priyam/goblin/commit/1417fc6cb8dba86fb36f1611246fc217aa0cdd43))
- **commands:** Use `perms v2` ([97e84ae](https://github.com/r-priyam/goblin/commit/97e84aee3cf7a2a7d19e9445d2a1ad1c7f9011b6))
- **commands:** Add `/about` command ([c847df8](https://github.com/r-priyam/goblin/commit/c847df8ebbcc14161b8ead0dba01d4f70cf4cdfc))
- **commands:** Add `/withrole` command ([f3de481](https://github.com/r-priyam/goblin/commit/f3de481b6a7fb9563a7b4fd54c9e325ddfc69bd9))
- **events:** Add `guildCreate` and `guildDelete` event ([a858bbb](https://github.com/r-priyam/goblin/commit/a858bbbbd2eb2d9d87f09b271c1bf473fd8d9d87))
- **commands:** Add `serverinvite` command ([f98b658](https://github.com/r-priyam/goblin/commit/f98b658f7bdde6a2d9388401234dca2a9871ce6b))
- **commands:** Add `supertroops` command ([029d0d6](https://github.com/r-priyam/goblin/commit/029d0d6943fca50f1a27dc78e4b5077a451832de))
- **commands:** Add `sql` command ([9f1894a](https://github.com/r-priyam/goblin/commit/9f1894aaa1767fb7c0af2b8cc23aa599a3612f01))
- Sync shared db with private db ([1c01f21](https://github.com/r-priyam/goblin/commit/1c01f210c36fc9ff773d68a5990406308cb34ef8))
- **commands:** Complete `whois` command ([48c9443](https://github.com/r-priyam/goblin/commit/48c944377dcae162b88bcdab027866a74a68f93f))
- Integrate link api with custom clash client ([7d4ea56](https://github.com/r-priyam/goblin/commit/7d4ea56b0166c4ea452f71672017a72ab60ff4f3))

# [1.4.0](https://github.com/r-priyam/goblin/compare/v1.3.0...v1.4.0) - (2022-07-20)

## 🏠 Refactor

- Cache everything possible and remove useless intents ([e045206](https://github.com/r-priyam/goblin/commit/e0452068831f35d4055209352b206d7b85fdaad0))
- Remove `parseArmyLink` as it's now in official lib ([2fddb74](https://github.com/r-priyam/goblin/commit/2fddb74995d38d87a60cd146bd2b57b16119bc95))
- Get redis from container directly ([9d696ee](https://github.com/r-priyam/goblin/commit/9d696eeb0a598cf802815ed37d3e6f85a84b826d))

## 🐛 Bug Fixes

- **deps:** Update dependency string-strip-html to v11 (#34) ([71a8f03](https://github.com/r-priyam/goblin/commit/71a8f03c011abf11cd28922e36ad1eda991f5558))
- **deps:** Update sapphire dependencies (#30) ([7c69547](https://github.com/r-priyam/goblin/commit/7c6954701633ffc2cd7a68274ada13106fae1ad5))
- **deps:** Update dependency string-strip-html to v10 (#28) ([8c157ee](https://github.com/r-priyam/goblin/commit/8c157ee1cf88c656f90d65edd009b1dec5aedb9d))
- **deps:** Update sapphire dependencies ([4d9da28](https://github.com/r-priyam/goblin/commit/4d9da28de5b396c7758dd79e65bc6ff5aa133bb9))
- Nullish value in result ([f612da3](https://github.com/r-priyam/goblin/commit/f612da3efa3208a2c5c6a5417760e4f0cfddcc76))
- `Elder` raw position ([037a49a](https://github.com/r-priyam/goblin/commit/037a49a92b48610e07f7f902df0d8b0763bef28b))
- Handle so many roles causing error ([6024491](https://github.com/r-priyam/goblin/commit/6024491d82b747e3e8a4123b76767e1311d010c0))

## 🚀 Features

- **commands:** Add `/hackban` command ([1417fc6](https://github.com/r-priyam/goblin/commit/1417fc6cb8dba86fb36f1611246fc217aa0cdd43))
- **commands:** Use `perms v2` ([97e84ae](https://github.com/r-priyam/goblin/commit/97e84aee3cf7a2a7d19e9445d2a1ad1c7f9011b6))
- **commands:** Add `/about` command ([c847df8](https://github.com/r-priyam/goblin/commit/c847df8ebbcc14161b8ead0dba01d4f70cf4cdfc))
- **commands:** Add `/withrole` command ([f3de481](https://github.com/r-priyam/goblin/commit/f3de481b6a7fb9563a7b4fd54c9e325ddfc69bd9))
- **events:** Add `guildCreate` and `guildDelete` event ([a858bbb](https://github.com/r-priyam/goblin/commit/a858bbbbd2eb2d9d87f09b271c1bf473fd8d9d87))
- **commands:** Add `serverinvite` command ([f98b658](https://github.com/r-priyam/goblin/commit/f98b658f7bdde6a2d9388401234dca2a9871ce6b))
- **commands:** Add `supertroops` command ([029d0d6](https://github.com/r-priyam/goblin/commit/029d0d6943fca50f1a27dc78e4b5077a451832de))
- **commands:** Add `sql` command ([9f1894a](https://github.com/r-priyam/goblin/commit/9f1894aaa1767fb7c0af2b8cc23aa599a3612f01))
- Sync shared db with private db ([1c01f21](https://github.com/r-priyam/goblin/commit/1c01f210c36fc9ff773d68a5990406308cb34ef8))
- **commands:** Complete `whois` command ([48c9443](https://github.com/r-priyam/goblin/commit/48c944377dcae162b88bcdab027866a74a68f93f))
- Integrate link api with custom clash client ([7d4ea56](https://github.com/r-priyam/goblin/commit/7d4ea56b0166c4ea452f71672017a72ab60ff4f3))

# [1.3.0](https://github.com/r-priyam/goblin/compare/v1.2.0...v1.3.0) - (2022-06-20)

## 🏠 Refactor

- Support types in redis util ([473aa70](https://github.com/r-priyam/goblin/commit/473aa706ae5d3e76a1fe829b5086899637f74832))

## 🐛 Bug Fixes

- Cliff tag pattern ([77502b5](https://github.com/r-priyam/goblin/commit/77502b512a5b09697abde25bb36fdf67c7b96e11))
- **deps:** Update sapphire dependencies (#20) ([e121c79](https://github.com/r-priyam/goblin/commit/e121c7962f09c0f9616af1b8921db9ff1e321dbf))
- **commands:** Handle no tag arg ([05fded7](https://github.com/r-priyam/goblin/commit/05fded7eaf9a5dfec651e4efb6e6f19557441ddf))
- **commands:** `null` show in clan info and reformat ([68384c4](https://github.com/r-priyam/goblin/commit/68384c40a838d67b129a3a839891aafdf8a60051))
- **deps:** Update sapphire dependencies (#19) ([5036cf0](https://github.com/r-priyam/goblin/commit/5036cf053baaf6e40b64cff9f28b9db0cdee7ce9))
- **deps:** Update sapphire dependencies ([343240c](https://github.com/r-priyam/goblin/commit/343240c4e48cc135fb8c0bfaff576705076b2996))

## 🚀 Features

- **commands:** Add `/userinfo` command ([2064ac6](https://github.com/r-priyam/goblin/commit/2064ac6fd355c345ac1d9e2890db9298a2c0bd95))
- **commands:** Add `/wikipedia` command ([ab1ac36](https://github.com/r-priyam/goblin/commit/ab1ac367123ce61282156528a6f4ba845b9f15e4))
- **commands:** Add `alias list` command ([66b23e7](https://github.com/r-priyam/goblin/commit/66b23e76d21c1a2ae22250284bbc6ca9566c8d8e))
- **commands:** Add `alias` command, and it's listener ([a248737](https://github.com/r-priyam/goblin/commit/a24873700ed9cda16f82192e7b9c89048af6d2dc))

# [1.2.0](https://github.com/r-priyam/goblin/compare/v1.1.0...v1.2.0) - (2022-06-04)

## 🏠 Refactor

- Make docker services dynamic ([7922428](https://github.com/r-priyam/goblin/commit/79224281f020946b72f6434043a0152e18c5b3da))

## 🐛 Bug Fixes

- Run member check task per minute ([daef5ab](https://github.com/r-priyam/goblin/commit/daef5ab84f1dc0747889eeb7e1802b57a1977263))

## 🚀 Features

- Add release workflow ([e98eae9](https://github.com/r-priyam/goblin/commit/e98eae9624e93d8f34ab8b8bc1cb3c8b45ae80c2))

# [1.3.0](https://github.com/r-priyam/goblin/compare/v1.2.0...v1.3.0) - (2022-06-20)

## 🏠 Refactor

- Support types in redis util ([473aa70](https://github.com/r-priyam/goblin/commit/473aa706ae5d3e76a1fe829b5086899637f74832))

## 🐛 Bug Fixes

- Cliff tag pattern ([77502b5](https://github.com/r-priyam/goblin/commit/77502b512a5b09697abde25bb36fdf67c7b96e11))
- **deps:** Update sapphire dependencies (#20) ([e121c79](https://github.com/r-priyam/goblin/commit/e121c7962f09c0f9616af1b8921db9ff1e321dbf))
- **commands:** Handle no tag arg ([05fded7](https://github.com/r-priyam/goblin/commit/05fded7eaf9a5dfec651e4efb6e6f19557441ddf))
- **commands:** `null` show in clan info and reformat ([68384c4](https://github.com/r-priyam/goblin/commit/68384c40a838d67b129a3a839891aafdf8a60051))
- **deps:** Update sapphire dependencies (#19) ([5036cf0](https://github.com/r-priyam/goblin/commit/5036cf053baaf6e40b64cff9f28b9db0cdee7ce9))
- **deps:** Update sapphire dependencies ([343240c](https://github.com/r-priyam/goblin/commit/343240c4e48cc135fb8c0bfaff576705076b2996))

## 🚀 Features

- **commands:** Add `/userinfo` command ([2064ac6](https://github.com/r-priyam/goblin/commit/2064ac6fd355c345ac1d9e2890db9298a2c0bd95))
- **commands:** Add `/wikipedia` command ([ab1ac36](https://github.com/r-priyam/goblin/commit/ab1ac367123ce61282156528a6f4ba845b9f15e4))
- **commands:** Add `alias list` command ([66b23e7](https://github.com/r-priyam/goblin/commit/66b23e76d21c1a2ae22250284bbc6ca9566c8d8e))
- **commands:** Add `alias` command, and it's listener ([a248737](https://github.com/r-priyam/goblin/commit/a24873700ed9cda16f82192e7b9c89048af6d2dc))

# [1.2.0](https://github.com/r-priyam/goblin/compare/v1.1.0...v1.2.0) - (2022-06-04)

## 🏠 Refactor

- Make docker services dynamic ([7922428](https://github.com/r-priyam/goblin/commit/79224281f020946b72f6434043a0152e18c5b3da))

## 🐛 Bug Fixes

- Run member check task per minute ([daef5ab](https://github.com/r-priyam/goblin/commit/daef5ab84f1dc0747889eeb7e1802b57a1977263))

## 🚀 Features

- Add release workflow ([e98eae9](https://github.com/r-priyam/goblin/commit/e98eae9624e93d8f34ab8b8bc1cb3c8b45ae80c2))


# [1.2.0](https://github.com/r-priyam/goblin/tree/v1.2.0) - (2022-06-04)

## 🏠 Refactor

- Make docker services dynamic ([7922428](https://github.com/r-priyam/goblin/commit/79224281f020946b72f6434043a0152e18c5b3da))

## 🐛 Bug Fixes

- Run member check task per minute ([daef5ab](https://github.com/r-priyam/goblin/commit/daef5ab84f1dc0747889eeb7e1802b57a1977263))

## 🚀 Features

- Add release workflow ([e98eae9](https://github.com/r-priyam/goblin/commit/e98eae9624e93d8f34ab8b8bc1cb3c8b45ae80c2))


# [1.1.0](https://github.com/r-priyam/goblin/tree/v1.1.0) - (2022-06-01)

## 🏠 Refactor

- Use handler for player and clan tag suggestions rather than in command scope itself ([221d404](https://github.com/r-priyam/goblin/commit/221d404c8c09d1b8621bf6089c293a3c815393da))
- **core:** Setup manual sweepers in client ([61f43d9](https://github.com/r-priyam/goblin/commit/61f43d91b258c1fa51ace325be9f2fd6704ac239))
- Change exports to `ESM` export and remove experimental flag use ([18d0006](https://github.com/r-priyam/goblin/commit/18d00067145d5208d1053836d35d64f1adc75bfb))
- Make fuzzy searching a separate function and add non-matching search in result ([e1fe7c7](https://github.com/r-priyam/goblin/commit/e1fe7c75e78d5015e7094def500f72fa837c5385))

## 🐛 Bug Fixes

- **tasks:** Member check ([8dbb199](https://github.com/r-priyam/goblin/commit/8dbb1997972b910c52bfb633c95ce0f2d8f11e26))
- Broken tasks ([31ee48d](https://github.com/r-priyam/goblin/commit/31ee48d81ea8cfcf06c234ce4144dd25f11460a6))
- Fix? ([cfab68f](https://github.com/r-priyam/goblin/commit/cfab68fd8d27b66895cef8799456f59c15ae87b0))
- **deps:** Update all non-major dependencies (#10) ([1bc77cf](https://github.com/r-priyam/goblin/commit/1bc77cfef7fcc184057774451868e5a563500160))
- **core:** Inject missing `coc` property in `Piece` ([aa88a94](https://github.com/r-priyam/goblin/commit/aa88a94ecf235d960ca0ac31d0ff94fc92a2877b))
- **commands:** Always return the correct value ([a00f08e](https://github.com/r-priyam/goblin/commit/a00f08e3c9967c02b995a91f0c77b75d775351ed))
- **deps:** Update dependency @sapphire/discord-utilities to ^2.11.0 (#8) ([9793aae](https://github.com/r-priyam/goblin/commit/9793aaec60fac1401744ea1ff76ec1cfb56ff89e))
- **commands:** Send query value in return if cached data is `NULL` ([3d21148](https://github.com/r-priyam/goblin/commit/3d21148e4da0123d4d849752f9563cafcb90cbb1))
- Inject `redis` in `Piece` ([d9a364f](https://github.com/r-priyam/goblin/commit/d9a364f2c8d09ee6242efc69a4ae5f6bdd68dd71))
- **deps:** Update all non-major dependencies (#6) ([4d48356](https://github.com/r-priyam/goblin/commit/4d48356217e2e4867612efc1cbeb3292f6e72223))
- Broken clan or user cache ([6f743b8](https://github.com/r-priyam/goblin/commit/6f743b8cddf70478f6c34c55f4da52278ff86273))
- **deps:** Update sapphire dependencies (#3) ([b85bab7](https://github.com/r-priyam/goblin/commit/b85bab7f6e8f176ae21c7b051e5547f5a1967457))

## 🚀 Features

- Add member check task ([8b5b4a8](https://github.com/r-priyam/goblin/commit/8b5b4a8ea52a6f9cde52dff67a606b634d62f28c))
- **commands:** Add `/interview` command ([5b5cab4](https://github.com/r-priyam/goblin/commit/5b5cab475405a37d2b3a2c344ba92c2225a01ce9))
- **commands:** Add `/eval` command ([7fd9b80](https://github.com/r-priyam/goblin/commit/7fd9b803820fb62fddfcbc33e844967bd1594859))
- **commands:** Add `/player`  command ([ed76178](https://github.com/r-priyam/goblin/commit/ed76178600cd3c4322438bcd7dfc6f39f16af3fb))
- **build:** Add unicorn eslint config ([989e296](https://github.com/r-priyam/goblin/commit/989e29641d3b52b0291ade763be613ea8208c69d))
- **utils:** Add some interaction helpers ([202dec2](https://github.com/r-priyam/goblin/commit/202dec25adcffa72a90469d7e6ac2985d6025406))
- **commands:** Add `/clan` command ([c8c9abe](https://github.com/r-priyam/goblin/commit/c8c9abef14a88b5f88e272bef1f071f853f70dae))
- **core:** Implement redis (#5) ([ea853cb](https://github.com/r-priyam/goblin/commit/ea853cbd499114f05a6493e530c701cc7fb38325))
- **commands:** `/unlink` command ([b245036](https://github.com/r-priyam/goblin/commit/b2450368103ff1004b1dc51d2a8c624b310373ee))
- **commands:** Link command (#4) ([ea5595e](https://github.com/r-priyam/goblin/commit/ea5595e2291f0537a59fe26077f9bfb94ddb9cc9))
- Setup docker ([f9f8d90](https://github.com/r-priyam/goblin/commit/f9f8d9060df916b7abf8ee2539a1ec2ce7fe0217))
- Setup postgres ([b4a70b6](https://github.com/r-priyam/goblin/commit/b4a70b6144ea85c400c1e49e78a6ef57e08244a6))
- Add `Error Handler` ([93b460c](https://github.com/r-priyam/goblin/commit/93b460c8cd117c2ac81b23263efd464c897b90bc))
- Add player and clan helpers classes ([f02fb9d](https://github.com/r-priyam/goblin/commit/f02fb9d74fc04577bf2459779e22b9c459b7750a))
- Setup clashofclans.js ([5be62b8](https://github.com/r-priyam/goblin/commit/5be62b8d1348b4b191fc5450c58ec4fc26bdcbc6))
- Add `whois` command ([5e37ad5](https://github.com/r-priyam/goblin/commit/5e37ad5e00bd947c3903318169b71249a96926f7))
- Initial commit ([e12c54b](https://github.com/r-priyam/goblin/commit/e12c54bffcad447a555a1ae1b36c4084f727058e))

