import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTestConnection } from './test-connection';
import { registerListSchemaObjects } from './list-schema-objects';
import { registerGetObjectDDL } from './get-object-ddl';
import { registerCompareSchema } from './compare-schema';
import { registerExportSchema } from './export-schema';
import { registerGetDbStatus } from './get-db-status';
import { registerMigrateSchema } from './migrate-schema';
import { registerAnalyzeDDLRisk } from './analyze-ddl-risk';
import { registerSuggestIndexes } from './suggest-indexes';
import { registerDiffSemantic } from './diff-semantic';
import { registerGetSchemaNormalized } from './get-schema-normalized';
import { registerInspectQuery } from './inspect-query';
import { registerDataHealthCheck } from './data-health-check';
import { registerGetWorkspaceSummary } from './get-workspace-summary';

export function registerTools(server: McpServer) {
  registerTestConnection(server);
  registerListSchemaObjects(server);
  registerGetObjectDDL(server);
  registerCompareSchema(server);
  registerExportSchema(server);
  registerGetDbStatus(server);
  registerMigrateSchema(server);
  registerAnalyzeDDLRisk(server);
  registerSuggestIndexes(server);
  registerDiffSemantic(server);
  registerGetSchemaNormalized(server);
  registerInspectQuery(server);
  registerDataHealthCheck(server);
  registerGetWorkspaceSummary(server);
}

// Export all tools for direct AI integration in andb-core
export * from './test-connection';
export * from './list-schema-objects';
export * from './get-object-ddl';
export * from './compare-schema';
export * from './export-schema';
export * from './get-db-status';
export * from './migrate-schema';
export * from './analyze-ddl-risk';
export * from './suggest-indexes';
export * from './diff-semantic';
export * from './get-schema-normalized';
export * from './inspect-query';
export * from './data-health-check';
export * from './get-workspace-summary';
