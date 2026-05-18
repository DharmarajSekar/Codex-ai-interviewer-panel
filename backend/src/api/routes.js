import express from "express";

export function buildRoutes(services, store) {
  const router = express.Router();

  router.get("/analytics/dashboard", (req, res) => {
    res.json({
      recruiterMetrics: {
        interviewsAnalyzed: store.reports.length,
        strongHireRate: pct(store.reports, (r) => r.recommendation.decision === "Strong Hire"),
        averageOverallScore: avg(store.reports.map((r) => r.scoring.overall))
      },
      performanceTrend: store.reports.slice(-10).map((r, i) => ({
        sequence: i + 1,
        overall: r.scoring.overall,
        generatedAt: r.generatedAt
      }))
    });
  });

  router.post("/interviews/:interviewId/evaluate", (req, res) => {
    const interview = { ...req.body, id: req.params.interviewId };
    const aggregate = services.pipeline.process(interview);
    const report = services.reportService.buildCandidateEvaluationReport(aggregate);
    store.reports.push(report);
    store.latestByInterview.set(interview.id, report);
    store.onUpdate?.(report);
    res.json(report);
  });

  router.post("/interviews/:interviewId/transcript", (req, res) => res.json(services.transcriptService.upsert(req.params.interviewId, req.body)));
  router.get("/interviews/:interviewId/transcript", (req, res) => res.json(services.transcriptService.get(req.params.interviewId)));
  router.get("/interviews/:interviewId/timeline", (req, res) => res.json(services.transcriptService.timeline(req.params.interviewId)));

  router.get("/candidates/compare", (req, res) => res.json(services.comparisonService.compare(store.reports)));
  router.get("/reports/:interviewId", (req, res) => res.json(store.latestByInterview.get(req.params.interviewId) || null));
  router.get("/reports/:interviewId/pdf", (req, res) => {
    const report = store.latestByInterview.get(req.params.interviewId);
    if (!report) return res.status(404).json({ error: "not_found" });
    res.json(services.reportService.buildPdfPayload(report));
  });

  return router;
}

const avg = (arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);
const pct = (arr, fn) => (arr.length ? Math.round((arr.filter(fn).length / arr.length) * 100) : 0);
