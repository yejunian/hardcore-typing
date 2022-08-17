const fs = require('fs/promises')
const path = require('path')

/**
 * @param {string} dir
 * @param {string} refFile
 */
async function buildSentences(dir, refFile) {
  const targetDirectory = path.resolve(dir)

  const references = await getReferences(dir, refFile)

  const srcFiles = await fs.readdir(targetDirectory)
  const data = []

  for (const srcFile of srcFiles) {
    if (srcFile === refFile) {
      continue
    }

    const contents = await fs.readFile(
      `${targetDirectory}/${srcFile}`,
      { encoding: 'utf-8' }
    )

    for (const line of contents.split('\n')) {
      const sentence = line.trim()
      if (!sentence) {
        continue
      }

      data.push({
        sentence,
        reference: references.get(srcFile),
      })
    }
  }

  await fs.writeFile(
    `${targetDirectory}/../sentences.json`,
    JSON.stringify(data)
  )
  console.log(`[build-sentences] ${data.length} sentences have been generated.`)
}

/**
 * @param {string} targetDirectory
 * @param {string} refFile
 * @returns {Promise<Map<string, string>>}
 */
async function getReferences(targetDirectory, refFile) {
  /** @type {{ filename: string, reference: string }[]} */
  const parsed = JSON.parse(await fs.readFile(`${targetDirectory}/${refFile}`))

  const map = new Map()
  for (const entry of parsed) {
    map.set(entry.filename, entry.reference)
  }

  return map
}

buildSentences('src/data/sentences', 'references.json')
