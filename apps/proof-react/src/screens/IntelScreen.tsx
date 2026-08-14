import { NewsArticleDetail } from '@rosettadash/react/visual/news/article-detail';
import { NewsRegionSelect } from '@rosettadash/react/visual/news/region-select';
import { NewsResultsTable } from '@rosettadash/react/visual/news/results-table';
import { NewsSearchBox } from '@rosettadash/react/visual/news/search-box';
import type { AtlasContext } from '../state/useDestinationAtlasState';
import { MOCK_NEWS } from '../lib/atlas-utils';

const REGION_OPTIONS = [
  { value: 'asia-pacific', label: 'Asia Pacific' },
  { value: 'europe', label: 'Europe' },
  { value: 'americas', label: 'Americas' },
  { value: 'africa', label: 'Africa' },
];

type Props = Pick<
  AtlasContext,
  'newsQuery' | 'setNewsQuery' | 'newsRegion' | 'setNewsRegion' | 'selectedArticleId' | 'setSelectedArticleId'
>;

export function IntelScreen({
  newsQuery,
  setNewsQuery,
  newsRegion,
  setNewsRegion,
  selectedArticleId,
  setSelectedArticleId,
}: Props) {
  const filtered = MOCK_NEWS.filter((article) => {
    const matchesQuery =
      !newsQuery ||
      article.headline.toLowerCase().includes(newsQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(newsQuery.toLowerCase());
    const matchesRegion = !newsRegion || article.region === newsRegion;
    return matchesQuery && matchesRegion;
  });

  const selected = filtered.find((article) => article.id === selectedArticleId) ??
    MOCK_NEWS.find((article) => article.id === selectedArticleId);

  return (
    <section className="da-panel">
      <h2>Intel</h2>
      <p>Regional news discovery with search, region filter, results, and article detail.</p>
      <div className="da-stack">
        <NewsSearchBox
          label="Search news"
          placeholder="Search headlines…"
          value={newsQuery}
          onSearch={setNewsQuery}
        />
        <NewsRegionSelect
          label="Region"
          placeholder="All regions"
          options={REGION_OPTIONS}
          value={newsRegion}
          onChange={setNewsRegion}
        />
        <NewsResultsTable title="News results">
          <table className="rd-table">
            <tbody>
              {filtered.map((article) => (
                <tr
                  key={article.id}
                  className="da-news-row"
                  onClick={() => setSelectedArticleId(article.id)}
                >
                  <td>{article.headline}</td>
                  <td>{article.source}</td>
                  <td>{article.region}</td>
                  <td>{article.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </NewsResultsTable>
        <NewsArticleDetail title="Article detail" emptyMessage="">
          {selected ? (
            <div className="da-detail-body">
              <p>
                <strong>{selected.headline}</strong>
              </p>
              <p>
                {selected.source} · {selected.region} · {selected.published}
              </p>
              <p>{selected.summary}</p>
            </div>
          ) : (
            <p className="da-detail-body">Select a headline to read the summary.</p>
          )}
        </NewsArticleDetail>
      </div>
    </section>
  );
}
