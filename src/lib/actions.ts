
'use server';

import { z } from 'zod';

export const NotificationInputSchema = z.object({
  title: z.string().describe("The title of the notification."),
  description: z.string().optional().describe("The main content of the notification message."),
  variant: z.enum(['default', 'destructive']).optional().describe("The visual style of the notification. Use 'destructive' for warnings or errors."),
});
export type NotificationInput = z.infer<typeof NotificationInputSchema>;

/**
 * Server action to send a notification to the user.
 * This should be used by the AI agent to communicate with the user.
 * In a real app, this would use a real-time service like Firestore and WebSockets.
 */
export async function sendNotification(input: NotificationInput) {
    // This is a placeholder for a real implementation.
    // For this demo, we'll just log it to the server console to show the action was called.
    console.log(`SERVER ACTION: Sending notification to user:`, input);
    
    // The AI tool calling this needs a confirmation message.
    return { success: true, message: `Notification titled "${input.title}" has been queued for delivery.` };
}
