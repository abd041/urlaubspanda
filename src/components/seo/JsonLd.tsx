/**
 * Renders a single Schema.org JSON-LD `<script>` tag. Kept as a tiny
 * server-renderable component so pages/layouts can compose multiple
 * structured-data blocks (Organization, WebSite, ItemList, ...) inline.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
