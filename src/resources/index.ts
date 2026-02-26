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
}
