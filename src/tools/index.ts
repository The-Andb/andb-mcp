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
}
