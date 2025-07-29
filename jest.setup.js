import '@testing-library/jest-dom'

// Polyfill for structuredClone (not available in Node.js < 17)
global.structuredClone = global.structuredClone || ((obj) => JSON.parse(JSON.stringify(obj)))

// Mock IndexedDB for testing
const FDBFactory = require('fake-indexeddb/lib/FDBFactory')
const FDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange')

global.indexedDB = new FDBFactory()
global.IDBKeyRange = FDBKeyRange

// Mock File and FileReader for testing
global.File = class File {
  constructor(chunks, filename, options = {}) {
    this.chunks = chunks
    this.name = filename
    this.size = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    this.type = options.type || ''
  }
}

global.FileReader = class FileReader {
  constructor() {
    this.result = null
    this.error = null
    this.readyState = 0
    this.onload = null
    this.onerror = null
  }

  readAsText(file) {
    setTimeout(() => {
      try {
        this.result = file.chunks.join('')
        this.readyState = 2
        if (this.onload) {
          this.onload({ target: { result: this.result } })
        }
      } catch (error) {
        this.error = error
        this.readyState = 2
        if (this.onerror) {
          this.onerror()
        }
      }
    }, 0)
  }
}

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url')
global.URL.revokeObjectURL = jest.fn()

// Mock document.createElement for download functionality
const originalCreateElement = document.createElement
document.createElement = jest.fn((tagName) => {
  if (tagName === 'a') {
    return {
      href: '',
      download: '',
      click: jest.fn(),
      style: {},
    }
  }
  return originalCreateElement.call(document, tagName)
})

// Mock document.body methods
document.body.appendChild = jest.fn()
document.body.removeChild = jest.fn()
