import test from 'node:test';
import assert from 'node:assert/strict';
import { nextSort, sortRows, clampPagination } from '../src/components/data-table/state.ts';
const columns = [{ key: 'name', header: 'Name', accessor: r => r.name, sortable: true }, { key: 'count', header: 'Count', accessor: r => r.count, sortable: true }, { key: 'locked', header: 'Locked', accessor: r => r.name }];
test('sort cycles ascending → descending → original order', () => {
  let sort = nextSort(null, 'name');
  assert.deepEqual(sort, { key: 'name', direction: 'asc' });
  sort = nextSort(sort, 'name');
  assert.deepEqual(sort, { key: 'name', direction: 'desc' });
  assert.equal(nextSort(sort, 'name'), null);
  assert.deepEqual(nextSort(sort, 'count'), { key: 'count', direction: 'asc' });
});
test('sorting is numeric, stable, immutable and ignores invalid/non-sortable keys', () => {
  const rows = [{ name: 'Item 10', count: 2 }, { name: 'Item 2', count: 1 }, { name: 'Item 1', count: 2 }];
  assert.deepEqual(sortRows(rows, columns, { key: 'name', direction: 'asc' }).map(r => r.name), ['Item 1', 'Item 2', 'Item 10']);
  assert.deepEqual(sortRows(rows, columns, { key: 'count', direction: 'asc' }).map(r => r.name), ['Item 2', 'Item 10', 'Item 1']);
  assert.equal(rows[0].name, 'Item 10');
  assert.equal(sortRows(rows, columns, { key: 'missing', direction: 'asc' }), rows);
  assert.equal(sortRows(rows, columns, { key: 'locked', direction: 'asc' }), rows);
  assert.equal(sortRows(rows, columns, null), rows);
});
test('empty and malformed pagination never produce invalid ranges', () => {
  assert.deepEqual(clampPagination({ pageIndex: 20, pageSize: 8 }, 0), { pageIndex: 0, pageSize: 8 });
  assert.deepEqual(clampPagination({ pageIndex: 20, pageSize: 8 }, 12), { pageIndex: 1, pageSize: 8 });
  assert.deepEqual(clampPagination({ pageIndex: -2, pageSize: 0 }, 12), { pageIndex: 0, pageSize: 1 });
  assert.deepEqual(clampPagination({ pageIndex: NaN, pageSize: Infinity }, 12), { pageIndex: 0, pageSize: 10 });
});
test('528 rows sort and paginate without losing or duplicating records', () => {
  const rows = Array.from({ length: 528 }, (_, i) => ({ name: `Class ${528-i}`, count: 528-i }));
  const sorted = sortRows(rows, columns, { key: 'count', direction: 'asc' });
  const seen = [];
  for (let i = 0; i < 66; i++) seen.push(...sorted.slice(i * 8, (i + 1) * 8));
  assert.equal(new Set(seen.map(r => r.count)).size, 528);
  assert.equal(seen[0].count, 1);
  assert.equal(seen.at(-1).count, 528);
});
test('custom comparators and null values are supported', () => {
  const rows = [{ name: 'Zulu', count: null }, { name: 'A', count: 12 }, { name: 'Longer', count: 3 }];
  assert.equal(sortRows(rows, columns, { key: 'count', direction: 'asc' }).at(-1).count, null);
  const custom = [{ ...columns[0], compare: (a,b) => a.name.length-b.name.length }];
  assert.equal(sortRows(rows, custom, { key: 'name', direction: 'desc' })[0].name, 'Longer');
});
