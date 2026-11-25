import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  user: { id: 'owner' },
  create: vi.fn(), update: vi.fn(), analyze: vi.fn(), upsert: vi.fn(), deleteMany: vi.fn(),
}));
vi.mock('@/utils/auth', () => ({ getUserByClerkID: async () => mocks.user }));
vi.mock('@/utils/db', () => ({ prisma: {
  journalEntry: { create: mocks.create, update: mocks.update },
  analysis: { upsert: mocks.upsert, deleteMany: mocks.deleteMany },
} }));
vi.mock('@/utils/ai', () => ({ analyze: mocks.analyze }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
import { POST } from '../app/api/journal/route';
import { PATCH } from '../app/api/journal/[id]/route';
beforeEach(() => vi.resetAllMocks());
describe('journal restoration', () => {
  it('creates an entry even when the AI provider is unavailable', async () => {
    mocks.create.mockResolvedValue({ id: 'entry', userId: 'owner', content: 'Write about your day!' });
    const res = await POST();
    expect(res.status).toBe(200);
    expect((await res.json()).data.id).toBe('entry');
    expect(mocks.analyze).not.toHaveBeenCalled();
  });
  it('returns saved content with a warning, and clears stale analysis after AI failure', async () => {
    mocks.update.mockResolvedValue({ id: 'entry', userId: 'owner', content: 'New text' });
    mocks.analyze.mockRejectedValue(new Error('model unavailable'));
    const res = await PATCH(new Request('https://example.test', { method: 'PATCH', body: JSON.stringify({ content: 'New text' }) }), { params: { id: 'entry' } });
    expect(mocks.update.mock.calls[0][0].where).toEqual({ userId_id: { userId: 'owner', id: 'entry' } });
    expect(mocks.deleteMany).toHaveBeenCalledWith({ where: { entryId: 'entry', userId: 'owner' } });
    const { data } = await res.json();
    expect(data.content).toBe('New text');
    expect(data.analysis).toBeNull();
    expect(data.warning).toContain('Entry saved');
  });
  it('stores and returns analysis on a successful save', async () => {
    mocks.update.mockResolvedValue({ id: 'entry', content: 'New text' });
    mocks.analyze.mockResolvedValue({ mood: 'happy' });
    mocks.upsert.mockResolvedValue({ mood: 'happy' });
    const res = await PATCH(new Request('https://example.test', { method: 'PATCH', body: JSON.stringify({ content: 'New text' }) }), { params: { id: 'entry' } });
    expect((await res.json()).data.analysis.mood).toBe('happy');
    expect(mocks.deleteMany).not.toHaveBeenCalled();
  });
});
