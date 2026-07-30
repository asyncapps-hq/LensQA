export default function TourPage() {
  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <h1>Product tour</h1>
      <ol className="card" style={{ lineHeight: 1.9 }}>
        <li>Connect a storefront project and generate a CI token</li>
        <li>Runner captures deterministic screenshots + quality checks</li>
        <li>GitHub Check fails on visual/a11y/perf regressions</li>
        <li>Review with swipe/blink diffs, annotations, and keyboard queue</li>
        <li>Approve baselines with governance — confidence score is advisory</li>
      </ol>
    </div>
  )
}
