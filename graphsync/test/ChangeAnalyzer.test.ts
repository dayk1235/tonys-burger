import { describe, it, expect } from 'vitest';
import { ChangeAnalyzer } from '../src/analyzer/ChangeAnalyzer.js';
import type { FileChangedPayload } from '../src/bus/events.js';

describe('ChangeAnalyzer', () => {
  const analyzer = new ChangeAnalyzer([
    {
      id: 'docs',
      label: 'Documentation',
      paths: ['docs/**', '*.md'],
    },
    {
      id: 'source',
      label: 'Source Code',
      paths: ['src/**'],
    },
  ]);

  function makeChange(path: string, type: FileChangedPayload['type'] = 'change'): FileChangedPayload {
    return { path, type, timestamp: new Date() };
  }

  it('classifies a file matching a knowledge source', () => {
    const result = analyzer.classify(makeChange('docs/guide.md'));
    expect(result).not.toBeNull();
    expect(result!.source).toBe('docs');
  });

  it('classifies a file in src/ as source code', () => {
    const result = analyzer.classify(makeChange('src/app.ts'));
    expect(result).not.toBeNull();
    expect(result!.source).toBe('source');
  });

  it('returns null for files outside all knowledge sources', () => {
    const result = analyzer.classify(makeChange('node_modules/pkg/index.js'));
    expect(result).toBeNull();
  });

  it('classifies a batch of changes grouped by source', () => {
    const changes = [
      makeChange('docs/readme.md'),
      makeChange('src/index.ts'),
      makeChange('src/utils.ts'),
      makeChange('node_modules/pkg/index.js'),
    ];

    const grouped = analyzer.classifyBatch(changes);
    expect(grouped.size).toBe(2);
    expect(grouped.get('docs')).toHaveLength(1);
    expect(grouped.get('source')).toHaveLength(2);
    expect(grouped.has('source')).toBe(true);
  });

  it('returns label for known source', () => {
    expect(analyzer.getSourceLabel('docs')).toBe('Documentation');
    expect(analyzer.getSourceLabel('unknown')).toBe('unknown');
  });
});
