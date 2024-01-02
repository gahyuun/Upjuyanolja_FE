// module.exports = {
//   extends: ['@commitlint/config-conventional'],
//   rules: {
//     'type-enum': [
//       2,
//       'always',
//       [
//         'Feat',
//         'Fix',
//         'Style',
//         'Docs',
//         'Refactor',
//         'Rename',
//         'Delete',
//         'Chore',
//         'Test',
//         'Build',
//         'Setting',
//       ],
//     ],
//   },
// };
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['Setting']],
    'type-case': [2, 'always', 'pascal-case'],
  },
};
