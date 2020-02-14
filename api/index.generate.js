/**
 * index.js and index.d.ts are very similar, and also both very boring files, just
 * based on the files that are in this api/ directory, so we can generate them!
 *
 * Run it with:
 *
 *     node api/index.generate.js
 *
 *  It looks at all the files with the pattern "*API.js" (excluding BaseAPI.js).
 *  It will generate and write two files:
 *
 *     api/index.js
 *     api/index.d.ts
 */

const { readdirSync, writeFileSync } = require('fs')
const { basename, join } = require('path')
const prettier = require('prettier')
const prettierConfig = prettier.resolveConfig.sync(
  prettier.resolveConfigFile.sync()
)

const INDEX_FILENAME = join(__dirname, 'index.js')
const TYPING_FILENAME = join(__dirname, 'index.d.ts')

const DO_NOT_EDIT_WARNING = `
/*    --- DO NOT EDIT ---
 *
 * This file was generating using api/${basename(__filename)}
 * You can regenerate it by running:
 *
 *     node api/${basename(__filename)}
 *
 *    --- DO NOT EDIT ---
 */
`

const source = []

const filenames = readdirSync(__dirname)

function format(input) {
  return prettier.format(input, {
    parser: 'babylon',
    ...prettierConfig
  })
}

const entries = filenames
  .filter(filename => /API.js$/.test(filename))
  .filter(filename => filename !== 'BaseAPI.js')
  .map(filename => {
    const className = filename.replace(/\.js/, '')
    const name = filename.replace(/API\.js$/, '').toLowerCase()
    return { name, filename, className }
  })

function generateImports(entries) {
  return entries
    .map(
      ({ className, filename }) => `import ${className} from './${filename}'`
    )
    .join('\n')
}

function generateIndex(entries) {
  source.push(
    DO_NOT_EDIT_WARNING,
    '',
    generateImports(entries),
    '',
    'export default ({ $axios, store }) => {',
    'const options = { $axios, store }',
    'return {'
  )

  source.push(
    entries
      .map(({ name, className }) => `${name}: new ${className}(options)`)
      .join(',')
  )

  source.push('}}')

  return format(source.join('\n'))
}

function generateTyping(entries) {
  const source = []
  source.push(
    DO_NOT_EDIT_WARNING,
    '',
    generateImports(entries),
    '',
    'interface API {'
  )
  for (const { name, className } of entries) {
    source.push(`  ${name}: ${className};`)
  }
  source.push(
    '}',
    '',
    "declare module 'vue/types/vue' {",
    '  interface Vue {',
    '    $api: API;',
    '  }',
    '}'
  )

  return source.join('\n')
}

writeFileSync(INDEX_FILENAME, generateIndex(entries))
writeFileSync(TYPING_FILENAME, generateTyping(entries))
