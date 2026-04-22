import { z } from 'zod';

export interface ToolDefinition<T extends z.ZodTypeAny = any> {
  name: string;
  description: string;
  inputSchema: T;
  handler: (input: z.infer<T>) => Promise<any>;
}
