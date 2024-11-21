import { Department } from '@/types/department';

export function parseDepartments(data: string): Department[] {
  const lines = data.split('\n').filter(line => line.trim());
  const departmentMap = new Map<string, Department>();
  const candiceEmail = 'CRAIGCA@coned.com';
  let statenIslandInfo = '';
  
  let currentDepartment: Partial<Department> = {};
  
  // Add department 655 with its specific information
  departmentMap.set('655', {
    id: '655',
    info: '⚠️ Important Notice:\nDo not send no signature emails for this department.',
    emails: [],
    hasEndTime: false,
    isStatenIsland: false
  });
  
  for (const line of lines) {
    // Check for Staten Island section
    if (line.includes('Staten Island')) {
      statenIslandInfo = 'Staten Island Notice: ';
      continue;
    }

    const deptMatch = line.match(/^(\d+)\s*-/);
    
    if (deptMatch) {
      const deptId = deptMatch[1];
      const info = line.substring(line.indexOf('-') + 1).trim();
      
      if (departmentMap.has(deptId)) {
        const existingDept = departmentMap.get(deptId)!;
        currentDepartment = existingDept;
        if (!existingDept.info.includes(info)) {
          existingDept.info += '\n\n' + info;
        }
      } else {
        currentDepartment = {
          id: deptId,
          info: info,
          emails: [],
          isStatenIsland: deptId === '332',
          hasEndTime: deptId === '653'
        };

        // Add end time information for department 653
        if (deptId === '653') {
          currentDepartment.info += '\n\n⏰ Important End Time Notice:\nFor end time jobs with this department, the job will always end at the scheduled end time. You must call and inform the spotter 10 minutes prior to end time.';
        }

        departmentMap.set(deptId, currentDepartment as Department);
      }
      
      if (line.toLowerCase().includes('candice craig') && !currentDepartment.emails?.includes(candiceEmail)) {
        currentDepartment.emails = [...(currentDepartment.emails || []), candiceEmail];
      }
    } else if (line.includes('@')) {
      const emailMatches = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
      if (emailMatches && currentDepartment.emails) {
        currentDepartment.emails.push(...emailMatches);
      }
    } else if (statenIslandInfo && !line.includes('Staten Island') && line.trim()) {
      statenIslandInfo += line.trim() + ' ';
    } else if (currentDepartment.id && currentDepartment.info) {
      const trimmedLine = line.trim();
      if (!currentDepartment.info.includes(trimmedLine)) {
        if (
          (trimmedLine.includes('ft') && !currentDepartment.info.includes('ft')) ||
          (trimmedLine.toLowerCase().includes('email') && !currentDepartment.info.toLowerCase().includes('email')) ||
          (trimmedLine.includes('Please') && !currentDepartment.info.includes('Please'))
        ) {
          currentDepartment.info += '\n\n' + trimmedLine;
        } else {
          currentDepartment.info += ' ' + trimmedLine;
        }
      }
      
      if (line.toLowerCase().includes('candice craig') && !currentDepartment.emails?.includes(candiceEmail)) {
        currentDepartment.emails = [...(currentDepartment.emails || []), candiceEmail];
      }
    }
  }

  // Add Staten Island info to department 332
  if (statenIslandInfo && departmentMap.has('332')) {
    const dept332 = departmentMap.get('332')!;
    dept332.info = `${dept332.info}\n\n${statenIslandInfo}`;
  }

  return Array.from(departmentMap.values()).map(dept => ({
    ...dept,
    info: formatDepartmentInfo(dept.info),
    emails: [...new Set(dept.emails)].sort()
  }));
}

function formatDepartmentInfo(info: string): string {
  const sections = info
    .split('\n\n')
    .map(section => section.trim())
    .filter((section, index, self) => 
      self.indexOf(section) === index &&
      section.length > 0
    )
    .reduce((acc: string[], section) => {
      const lastSection = acc[acc.length - 1];
      
      if (
        lastSection?.match(/\d+\s*(?:ft|feet|')/) &&
        section.match(/\d+\s*(?:ft|feet|')/)
      ) {
        acc[acc.length - 1] = `${lastSection}\n${section}`;
      }
      else if (
        lastSection?.toLowerCase().includes('email') &&
        section.toLowerCase().includes('email')
      ) {
        acc[acc.length - 1] = `${lastSection}\n${section}`;
      }
      else {
        acc.push(section);
      }
      
      return acc;
    }, []);

  return sections
    .map(section => 
      section.split('\n')
        .map(line => line.trim())
        .join('\n')
    )
    .join('\n\n');
}

