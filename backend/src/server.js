import http from "http";
import express from "express";
import { buildRoutes } from "./api/routes.js";
import { CompetencyScoringEngine } from "./services/scoringEngine.js";
import { AIRecommendationService } from "./services/aiRecommendationService.js";
import { ScoringAggregationPipeline } from "./pipelines/scoringPipeline.js";
import { TranscriptService } from "./services/transcriptService.js";
import { ReportService } from "./services/reportService.js";
import { CandidateComparisonService } from "./services/comparisonService.js";
import { attachDashboardSocket } from "./realtime/dashboardSocket.js";

const app = express();
app.use(express.json({ limit: "2mb" }));

const services = {
  pipeline: new ScoringAggregationPipeline({ scoringEngine: new CompetencyScoringEngine(), aiRecommendationService: new AIRecommendationService() }),
  transcriptService: new TranscriptService(),
  reportService: new ReportService(),
  comparisonService: new CandidateComparisonService()
};

const store = { reports: [], latestByInterview: new Map(), onUpdate: null };
app.use("/api", buildRoutes(services, store));

const server = http.createServer(app);
attachDashboardSocket(server, store);

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Recruiter analytics backend running on ${port}`));
