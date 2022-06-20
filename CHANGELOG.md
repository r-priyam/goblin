# Changelog

All notable changes to this project will be documented in this file.

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

