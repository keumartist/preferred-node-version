import { join } from 'path'

import test from 'ava'
import isPlainObj from 'is-plain-obj'
import preferredNodeVersion from 'preferred-node-version'

import {
  runFixture,
  FIXTURES_DIR,
  setEmptyHomeDir,
  unsetHomeDir,
} from './helpers/main.js'
import {
  ALIAS_VERSION,
  VERSION_RANGE,
  RESOLVED_VERSION_RANGE,
} from './helpers/versions.js'

test('Resolves aliases', async (t) => {
  const { version } = await runFixture('alias')
  t.is(version, ALIAS_VERSION)
})

test('Resolves version ranges', async (t) => {
  const { version } = await runFixture('version_range')
  t.is(version, RESOLVED_VERSION_RANGE)
})

test('Returns information about the resolution', async (t) => {
  const { filePath, envVariable, rawVersion, version } = await runFixture(
    'version_range',
  )
  t.is(filePath, join(FIXTURES_DIR, 'version_range', '.nvmrc'))
  t.true(envVariable === undefined)
  t.is(rawVersion, VERSION_RANGE)
  t.is(version, RESOLVED_VERSION_RANGE)
})

test.serial('Returns an empty object if nothing was found', async (t) => {
  setEmptyHomeDir()

  try {
    const result = await preferredNodeVersion({ cwd: '/' })
    t.true(isPlainObj(result))
    t.is(Object.keys(result).length, 0)
  } finally {
    unsetHomeDir()
  }
})
