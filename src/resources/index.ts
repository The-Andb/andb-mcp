import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CoreBridge } from '@the-andb/core';

export function registerResources(server: McpServer) {
  // Expose current project configuration as a resource
  server.registerResource(
    'project-config',
    'andb://config',
    {
      title: 'Project Configuration',
      description:
        'Current andb.yaml project configuration including environments and connection settings (credentials are masked).',
      mimeType: 'application/json',
    },
    async () => {
      const config = CoreBridge.getConfig();
      const environments = config.getEnvironments();

      // Build a safe view of the config (mask passwords)
      const envDetails: Record<string, any> = {};
      for (const env of environments) {
        const conn = config.getConnection(env);
        if (conn) {
          envDetails[env] = {
            type: conn.type,
            host: conn.config.host,
            port: conn.config.port,
            database: conn.config.database,
            user: conn.config.user,
            password: conn.config.password ? '***' : undefined,
          };
        }
      }

      return {
        contents: [
          {
            uri: 'andb://config',
            text: JSON.stringify(
              {
                environments,
                connections: envDetails,
                autoBackup: config.getAutoBackup(),
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  // Expose high-level schema summary (Wisdom)
  server.registerResource(
    'schema-wisdom',
    'andb://schema/{env}/wisdom',
    {
      title: 'Schema Wisdom',
      description: 'Provides a high-level summary of the database schema for the specified environment.',
      mimeType: 'application/json',
    },
    async (uri: any) => {
      const env = uri.params.env;
      const config = CoreBridge.getConfig();
      const conn = config.getConnection(env);

      if (!conn) {
        throw new Error(`Environment ${env} not found in configuration.`);
      }

      // Fetch summary data
      const tables = await CoreBridge.execute('getSchemaObjects', { connection: conn.config, type: 'tables' });
      const views = await CoreBridge.execute('getSchemaObjects', { connection: conn.config, type: 'views' });
      const procedures = await CoreBridge.execute('getSchemaObjects', { connection: conn.config, type: 'procedures' });

      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({
              environment: env,
              database: conn.config.database,
              stats: {
                tables: tables.length,
                views: views.length,
                procedures: procedures.length,
              },
              tableNames: tables,
              wisdom: "This is a high-level overview. Use 'get_object_ddl' to see details of a specific table. Use 'compare_schema' to see differences between environments."
            }, null, 2),
          },
        ],
      };
    }
  );
}
