import { Employee } from '@prisma/client';

/**
 * Replaces variables in the HTML template with employee data.
 * Supported variables: {{firstName}}, {{lastName}}, {{fullName}}, {{department}}, {{year}}
 */
export function renderTemplate(template: string, employee: Employee, year: number): string {
  let html = template;
  
  const replacements: Record<string, string> = {
    '{{firstName}}': employee.firstName,
    '{{lastName}}': employee.lastName,
    '{{fullName}}': `${employee.firstName} ${employee.lastName}`,
    '{{department}}': employee.department || '',
    '{{year}}': year.toString(),
  };

  for (const [key, value] of Object.entries(replacements)) {
    // Replace all occurrences of the key
    html = html.split(key).join(value);
  }

  return html;
}
